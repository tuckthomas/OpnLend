import json, csv, re, os, uuid, logging
from django.http import HttpResponse, JsonResponse
import pandas as pd
import requests
import jwt
import time
from django.conf import settings
from pathlib import Path
from django.shortcuts import render, redirect
from django.db import transaction, connection
from datetime import datetime, date, timedelta
from django.db.models import Count, Sum, Avg, Max, Case, When, Value, CharField, F
from django.db.models.functions import Coalesce, Concat
from django.core.serializers import serialize
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from Loans.models import SBALoanDataTable
from bs4 import BeautifulSoup

def Dashboard(request):
    print(f"BASE_DIR from view: {settings.BASE_DIR}")
    print(f"Template DIRS from view: {settings.TEMPLATES[0]['DIRS']}")
    cache.clear()  # Clear the cache
    METABASE_SITE_URL = "REPLACE_WITH_YOUR_URL"
    METABASE_SECRET_KEY = "REPLACE_WITH_YOUR_SECRET_KEY"

    payload = {
    "resource": {"dashboard": 1},
    "params": {
        
    },
    "exp": round(time.time()) + (60 * 10) # 10 minute expiration
    }
    token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")

    iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=false&titled=true"
    
    return render(request, 'Dashboard.html', {'iframeUrl': iframeUrl})


logger = logging.getLogger(__name__)  # Get an instance of a logger

def data_table(request):
    institution_name = request.GET.get('institutionname', 'All')
    project_state = request.GET.get('projectstate', 'All')
    project_county = request.GET.get('projectcounty', 'All')

    # Remove state abbreviations from all counties
    project_county = re.sub(r'\(\w{2}\)', '', project_county).strip()

    # Debug statements to print the values
    print('Institution Name:', institution_name)
    print('Project State:', project_state)
    print('Project County:', project_county)

    queryset = SBALoanData.objects.all()

    if institution_name != 'All':
        queryset = queryset.filter(institutionname=institution_name)
    if project_state != 'All':
        queryset = queryset.filter(projectstate=project_state)
    if project_county != 'All':
        queryset = queryset.filter(projectcounty=project_county)

    # Determine 'Multiple' or specific values for projectstate and projectcounty
    state_count = queryset.aggregate(Count('projectstate', distinct=True))['projectstate__count']
    county_count = queryset.aggregate(Count('projectcounty', distinct=True))['projectcounty__count']

    if state_count == 1:
        projectstate_value = Coalesce(Max('projectstate'), Value(''))
    else:
        projectstate_value = Count('projectstate', distinct=True)

    if county_count == 1:
        projectcounty_value = Coalesce(Max('projectcounty'), Value(''))
    else:
        projectcounty_value = Count('projectcounty', distinct=True)

    queryset = queryset.values('uniqueinstitutionid', 'institutionname').annotate(
        projectstate_or_count=projectstate_value,
        projectcounty_or_count=projectcounty_value,
        total_gross_approval=Sum('grossapproval'),
        loan_count=Count('uniqueloanid'),
        average_gross_approval=Avg('grossapproval')
    ).order_by('institutionname')

    # Check if it's an AJAX request (updated method for Django 4.0+)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        data = list(queryset)  # Convert QuerySet to a list of dictionaries
        return JsonResponse(data, safe=False)  # Return JSON response for AJAX

def filter_choices(request):
    # Obtain unique institution names
    institution_names = SBALoanData.objects.order_by('institutionname').values('institutionname').distinct()
    logger.debug(f"Obtained institution names: {institution_names}")

    # Obtain unique project states
    project_states = SBALoanData.objects.order_by('projectstate').values('projectstate').distinct()
    logger.debug(f"Obtained project states: {project_states}")

    # Obtain concatenated unique project county and state values
    county_state_values = SBALoanData.objects.annotate(
        county_state=Concat('projectcounty', Value(' ('), F('projectstate'), Value(')'), output_field=CharField())
    ).order_by('county_state').values('county_state').distinct()
    logger.debug(f"Obtained county and state values: {county_state_values}")

    # Create a list of dictionaries to hold the filter choices
    filter_choices = {
        'institution_names': list(institution_names),
        'project_states': [{'id': 'All', 'text': 'All'}] + list(project_states),  # Add 'All' as the default value
        'county_state_values': list(county_state_values),
    }

    logger.debug(f"Filter choices: {filter_choices}")

    # Return the filter choices as a JSON response
    return JsonResponse(filter_choices, safe=False)

# Determine if a new fetch should proceed
def should_fetch_new_data():
    today = date.today()
    last_update_log = SBALoanDataUpdateLog.objects.all().aggregate(
        Max('last_successful_update'),
        Max('file_date_7a_2010_2019'),
        Max('file_date_7a_2020_present'),
        Max('file_date_504')
    )
    
    # Logic to determine if today is after the most recent month-end
    # and after the most recent files' dates
    if today.day > 1:  # Assuming a simplistic check for month-end
        if today > last_update_log['last_successful_update__max']:
            return True
    return False



def SBA_Loan_Data_Link_Scraping():
    # Base URL components
    base_url = "https://data.sba.gov"
    target_url = "https://data.sba.gov/en/dataset/7-a-504-foia"
    
    # Custom User-Agent header
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    # Fetch the HTML content of the page with a custom User-Agent
    response = requests.get(target_url, headers=headers)
    if response.status_code != 200:
        return "Failed to fetch the webpage"
    
    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the list of resources
    resource_list = soup.find('ul', class_='resource-list')
    if not resource_list:
        return "Resource list not found"
    
    # Titles to look for
    titles = {
        "7a_2020": "FOIA - 7(a)(FY2020-Present)",
        "7a_2010_2019": "FOIA - 7(a)(FY2010-FY2019)",
        "504": "FOIA - 504 (FY2010-Present) asof"
    }
    
    # Initialize a dictionary to hold the results with lists as values
    results = {
        "7a_2020": [],
        "7a_2010_2019": [],
        "504": []
    }
    
    # Iterate over each resource item to find matching titles and extract hrefs
    for li in resource_list.find_all('li', class_='resource-item'):
        a_tag = li.find('a', class_='heading')
        if a_tag and 'title' in a_tag.attrs:
            title = a_tag['title']
            for key, value in titles.items():
                if value in title:
                    # Append the full URL to the appropriate list in the results dictionary
                    results[key].append(base_url + a_tag['href'])
    
    return results

def download_filtered_data(request):
    # Generate the CSV data based on your filtered data
    filtered_data = [...]  # Replace with your filtered data

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="CustomSBALoanData.csv"'

    # Create and write data to the CSV file
    csv_file_path = os.path.join(settings.MEDIA_ROOT, 'CustomSBALoanData.csv')
    with open(csv_file_path, 'w', newline='') as csv_file:
        csv_writer = csv.writer(csv_file)
        # Write the CSV header row if needed
        # csv_writer.writerow(['Column1', 'Column2', ...])  # Add column headers
        for row in filtered_data:
            csv_writer.writerow(row)

    # Serve the CSV file for download
    with open(csv_file_path, 'rb') as csv_file:
        response.write(csv_file.read())

    # Delete the CSV file after serving
    os.remove(csv_file_path)

    return response

def delete_filtered_data(request):
    csv_file_path = os.path.join(settings.MEDIA_ROOT, 'CustomSBALoanData.csv')
    try:
        os.remove(csv_file_path)
        return JsonResponse({'message': 'File deleted successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Function for "Download CSV" button within dashboard.
def download_csv(request):
    file_path = os.path.join(settings.MEDIA_ROOT, 'CombinedSBAData.csv')
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="CombinedSBAData.csv"'
            return response
    else:
        # Handle the case where the file doesn't exist
        return HttpResponse("Sorry, the file is not available for download.")

# Function to determine InstitutionType
def determine_institution_type(row):
    if pd.notna(row['BankFDICNumber']):
        return 'Bank'
    elif pd.notna(row['BankNCUANumber']):
        return 'Credit Union'
    else:
        return 'N/A'

def create_unique_loan_id(row):
    # Generate a UUID
    unique_id = str(uuid.uuid4())
    
    return unique_id

def parse_date(date_str):
    if pd.isna(date_str) or date_str == '':
        return None  # Handle blank/null values

    # Ensure the input is a string
    if not isinstance(date_str, str):
        date_str = str(date_str)

    formats = ["%m/%d/%Y", "%Y%m%d", "%Y"]  # Formats to try
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

def SBA_Loan_Data_Link_Scraping():
    target_url = "https://data.sba.gov/en/dataset/7-a-504-foia"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    response = requests.get(target_url, headers=headers)
    if response.status_code != 200:
        return "Failed to fetch the webpage"
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Initialize a dictionary to hold the results
    results = {
        "7a_2020": [],
        "7a_2010_2019": [],
        "504": []
    }
    
    # Find all <a> tags within the section you're interested in
    download_links = soup.select('section#dataset-resources a.resource-url-analytics')

    # Iterate over each link and categorize them based on the presence of specific strings in their 'href'
    for link in download_links:
        href = link.get('href')
        if "foia-504-fy2010-present" in href:
            results["504"].append(href)
        elif "foia-7afy2020-present" in href:
            results["7a_2020"].append(href)
        elif "foia-7afy2010-fy2019" in href:
            results["7a_2010_2019"].append(href)

    return results


# Function to download file and save to media folder
def download_file(url, filename):
    media_path = Path(settings.MEDIA_ROOT)
    local_filename = media_path / filename
    try:
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(local_filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192): 
                    f.write(chunk)
    except requests.exceptions.HTTPError as e:
        # Error in HTTP response
        return f"HTTP error occurred while downloading {url}: {e}"
    except requests.exceptions.ConnectionError:
        # Error in network connection
        return f"Network connection error occurred while downloading {url}"
    except requests.exceptions.Timeout:
        # Timeout error
        return f"Timeout occurred while downloading {url}"
    except requests.exceptions.RequestException:
        # Other request issues
        return f"Error occurred while downloading {url}"
    return local_filename

# Function to read CSV with encoding
def read_csv_with_encoding(local_filename):
    try:
        return pd.read_csv(local_filename, encoding='utf-8', low_memory=False)
    except UnicodeDecodeError:
        return pd.read_csv(local_filename, encoding='ISO-8859-1', low_memory=False)
    except FileNotFoundError:
        print(f"File not found: {local_filename}")
        return None
    except Exception as e:
        print(f"Error reading file {local_filename}: {e}")
        return None

def download_and_process_data(request):
    # Call the scraping function to get the latest URLs
    fetched_urls = SBA_Loan_Data_Link_Scraping()
    if isinstance(fetched_urls, str):
        # Handle error from SBA_Loan_Data_Link_Scraping
        return HttpResponse(fetched_urls)

    urls_7a = fetched_urls.get("7a_2020", []) + fetched_urls.get("7a_2010_2019", [])
    urls_504 = fetched_urls.get("504", [])

    print(f"URLs 7a: {urls_7a}, Type: {type(urls_7a)}")
    print(f"URLs 504: {urls_504}, Type: {type(urls_504)}")

    # Download and load datasets into pandas DataFrames
    dfs_7a = [df for df in (read_csv_with_encoding(download_file(url, f"7a_{i}.csv")) for i, url in enumerate(urls_7a)) if df is not None]
    dfs_504 = [df for df in (read_csv_with_encoding(download_file(url, f"504_{i}.csv")) for i, url in enumerate(urls_504)) if df is not None]

    # Print column names for 7a datasets
    print("\nColumn names for 7a datasets:")
    for i, df in enumerate(dfs_7a):
        print(f"7a Dataset {i}: {df.columns.tolist()}")

    # Print column names for 504 datasets
    print("\nColumn names for 504 datasets:")
    for i, df in enumerate(dfs_504):
        print(f"504 Dataset {i}: {df.columns.tolist()}")

    # Normalize and process 504 dataset
    for df in dfs_504:
        if isinstance(df, pd.DataFrame):
            df.rename(columns={
                'ThirdPartyLender_Name': 'BankName',
                'ThirdPartyLender_City': 'BankCity',
                'ThirdPartyLender_State': 'BankState',
                'ThirdPartyDollars': 'ThirdPartyDollars_504'
            }, inplace=True)
            df['GuaranteedApproval'] = df['GrossApproval'] - df['ThirdPartyDollars_504']

    # Combine the 504 datasets
    df_504_combined = pd.concat(dfs_504, ignore_index=True)

    # Combine the 7(a) datasets
    df_7a_combined = pd.concat(dfs_7a, ignore_index=True)

    # Rename fields in 7(a) dataset
    df_7a_combined.rename(columns={'SBAGuaranteedApproval': 'GuaranteedApproval'}, inplace=True)

    # Combine BankFDICNumber and BankNCUANumber into InstitutionID for 7a dataset
    # and determine InstitutionType
    df_7a_combined['InstitutionID'] = df_7a_combined.apply(
        lambda row: row['BankFDICNumber'] if pd.notna(row['BankFDICNumber']) else row['BankNCUANumber'], axis=1
    )
    df_7a_combined['InstitutionType'] = df_7a_combined.apply(determine_institution_type, axis=1)

    # Drop the original FDIC and NCUA number columns if they are no longer needed
    df_7a_combined.drop(['BankFDICNumber', 'BankNCUANumber'], axis=1, inplace=True)

    # Create UniqueLoanID for both datasets
    for df in [df_7a_combined, df_504_combined]:
        df['UniqueLoanID'] = df.apply(create_unique_loan_id, axis=1)

    # Reorder columns to move UniqueLoanID to the first position
    df_7a_combined = df_7a_combined[['UniqueLoanID'] + [col for col in df_7a_combined.columns if col != 'UniqueLoanID']]
    df_504_combined = df_504_combined[['UniqueLoanID'] + [col for col in df_504_combined.columns if col != 'UniqueLoanID']]
    
    # Add missing columns to 7a from 504 with NaNs
    for column in df_504_combined.columns:
        if column not in df_7a_combined.columns:
            df_7a_combined[column] = pd.NA

    # Combine the 7(a) and 504 datasets
    combined_df = pd.concat([df_7a_combined, df_504_combined], ignore_index=True)

    # Apply specific formatting/conversions to the combined dataset
    combined_df['AsOfDate'] = combined_df['AsOfDate'].apply(parse_date)
    combined_df['ApprovalDate'] = combined_df['ApprovalDate'].apply(parse_date)
    combined_df['FirstDisbursementDate'] = combined_df['FirstDisbursementDate'].apply(parse_date)
    combined_df['PaidInFullDate'] = combined_df['PaidInFullDate'].apply(parse_date)
    combined_df['ChargeOffDate'] = combined_df['ChargeOffDate'].apply(parse_date)

    # Removing special characters from ZIP codes and converting numerical fields to the desired formats
    for column in ['BorrZip', 'BankZip', 'CDC_Zip']:
        combined_df[column] = combined_df[column].astype(str).str.replace(r"[^\d]", "", regex=True)

    # Formatting whole numbers to decimals. Converts errors to 0.00.
    for column in ['GrossApproval', 'GuaranteedApproval', 'GrossChargeOffAmount', 'ThirdPartyDollars_504']:
        combined_df[column] = combined_df[column].apply(
        lambda x: pd.to_numeric(x, errors='coerce') if pd.notnull(x) else 0.00)

    # Converting interest rates to decimal
    combined_df['InitialInterestRate'] = combined_df['InitialInterestRate'] / 100

    # Converting 'TermInMonths', 'NaicsCode', 'RevolverStatus', 'JobsSupported', 'InstitutionID' to numerical
    # Removed 'FranchiseCode' from this list as it contains alphanumeric values
    numerical_fields = ['TermInMonths', 'NaicsCode', 'RevolverStatus', 'JobsSupported']
    for field in numerical_fields:
        combined_df[field] = pd.to_numeric(combined_df[field], errors='coerce')

    # Convert 'InstitutionID' to an integer, but keep empty strings and handle NaN values
    combined_df['InstitutionID'] = combined_df['InstitutionID'].apply(
        lambda x: int(x) if str(x).strip() != '' and not pd.isna(x) else ''
    )

    # Converting 'CongressionalDistrict' to numerical format
    combined_df['CongressionalDistrict'] = pd.to_numeric(combined_df['CongressionalDistrict'])

    # Convert 'BorrState', 'BankState', 'CDC_State', 'ProjectState' to uppercase
    state_fields = ['BorrState', 'BankState', 'CDC_State', 'ProjectState']
    for field in state_fields:
        combined_df[field] = combined_df[field].str.upper()

    # Before saving the combined dataset
    output_filename = 'CombinedSBAData.csv'  # Define the output file name
    output_path = Path(settings.MEDIA_ROOT) / output_filename
    combined_df.to_csv(output_path, index=False)

    # Rename columns
    combined_df.rename(columns={
        'BankName': 'InstitutionName',
        'BankStreet': 'InstitutionStreet',
        'BankCity': 'InstitutionCity',
        'BankState': 'InstitutionState',
        'BankZip': 'InstitutionZip'
    }, inplace=True)

    # Define the clean_text_fields function
    def clean_text_fields(df):
        def capitalize_first_letter(s):
            if isinstance(s, str):
                return ' '.join(word.capitalize() for word in s.split())
            else:
                return s

        df['InstitutionName'] = df['InstitutionName'].str.strip().apply(capitalize_first_letter)
        return df

    # Apply clean_text_fields to combined_df
    combined_df = clean_text_fields(combined_df)

    # Debug progress message
    print("Beginning resolving acronyms......")

    def resolve_institution_acronym(df):
        conversion_dict = {
            'Fcu': 'Federal Credit Union', 'Cu': 'Credit Union', ' Inc.': ', Inc.',
            'Corp': 'Corporation', 'Corp.': 'Corporation', 'Co': 'Company', 'Limited Liability Company': ', LLC',
            'NA': 'National Association', 'Assoc.': 'Association',
        }

        def acronym_replacer(name):
            if isinstance(name, str):
                for key, value in conversion_dict.items():
                    name = re.sub(r'\b' + key + r'\b', value, name, flags=re.IGNORECASE)
                name = re.sub(r'&amp;', '&', name)
                name = re.sub(r'D/B/A\s.*', '', name).strip()
            return name

        df['InstitutionName'] = df['InstitutionName'].apply(acronym_replacer)
        return df
    
     # Apply the function
    combined_df = resolve_institution_acronym(combined_df)

    # Debug progress message
    print("Successfully resolved acronyms.")
    print("Beginning further cleanup of institution......")

    # Attempt to merge as many duplicate financial institutions with varying attributes
    def resolve_institution_names(df):
        mode_name = df.groupby('InstitutionID')['InstitutionName'].agg(pd.Series.mode).reset_index()
        mode_name.columns = ['InstitutionID', 'ModeInstitutionName']
        df = df.merge(mode_name, on='InstitutionID', how='left')
        df['InstitutionName'].fillna(df['ModeInstitutionName'], inplace=True)
        df.drop('ModeInstitutionName', axis=1, inplace=True)
        return df
    
    combined_df = resolve_institution_names(combined_df)

    # Add the UniqueInstitutionID column
    combined_df['UniqueInstitutionID'] = combined_df['InstitutionName'] + combined_df['InstitutionID'].astype(str)
    
    # If there are multiple records of the same InstitutionName but different UniqueIndstitutionID, while the street, city and state remain consistent across all records,
    # the records with different UniqueInstitutionIDs who have missing street and/or state fields will inherit the UniqueInstitutionID of the records containing that data.
    def consolidate_institutions(df):
        # Identify primary reference institutions (more complete records)
        primary_ref = df.dropna(subset=['InstitutionStreet']).drop_duplicates(
            ['InstitutionName', 'InstitutionCity', 'InstitutionState'])
        # Mapping from primary records to their UniqueInstitutionID
        id_mapping = primary_ref.set_index(['InstitutionName', 'InstitutionCity', 'InstitutionState'])['UniqueInstitutionID'].to_dict()
        # Function to apply the mapping
        def map_to_unique_id(row):
            key = (row['InstitutionName'], row['InstitutionCity'], row['InstitutionState'])
            return id_mapping.get(key, row['UniqueInstitutionID'])
        # Apply the mapping
        df['UniqueInstitutionID'] = df.apply(map_to_unique_id, axis=1)
        return df

    # Apply resolve_institution_names to combined_df
    combined_df = consolidate_institutions(combined_df)

    # After the inittial refinement, due to the amount of repeat institutionnames with different UniqueInstitutionIDs, apply a more broad data consolidation
    # based upon having the same name city and state fields as the identifed more complete record.
    def consolidate_institutions_v2(df):
        # Identify complete reference institutions (with InstitutionName, InstitutionStreet, and InstitutionCity)
        complete_ref = df.dropna(subset=['InstitutionName', 'InstitutionStreet', 'InstitutionCity']).drop_duplicates(
            ['InstitutionName', 'InstitutionCity', 'InstitutionState'])

        # Create a mapping from complete records to their UniqueInstitutionID
        id_mapping = complete_ref.set_index(['InstitutionName', 'InstitutionCity', 'InstitutionState'])[
            'UniqueInstitutionID'].to_dict()

        # Function to apply the mapping and fill missing fields
        def map_and_fill(row):
            key = (row['InstitutionName'], row['InstitutionCity'], row['InstitutionState'])
            complete_record_id = id_mapping.get(key)
            if complete_record_id:
                # If there's a complete record, replace UniqueInstitutionID and fill missing fields
                row['UniqueInstitutionID'] = complete_record_id
                row['InstitutionStreet'] = complete_ref[
                    (complete_ref['InstitutionName'] == row['InstitutionName']) &
                    (complete_ref['InstitutionCity'] == row['InstitutionCity']) &
                    (complete_ref['InstitutionState'] == row['InstitutionState'])
                    ]['InstitutionStreet'].values[0]
            return row
        # Apply the mapping and filling
        df = df.apply(map_and_fill, axis=1)
        return df

    # Define the CSV file path for the new DataFrame
    sbaloandata_csv_path = os.path.join(settings.MEDIA_ROOT, 'CombinedSBAData.csv')

    # Indicate the table name
    table_name = '"SBALoans"'

    # Delete existing records in the table
    with connection.cursor() as cursor:
        cursor.execute(f'TRUNCATE TABLE {table_name}')

    # Convert the combined_df DataFrame to a CSV file
    combined_df.to_csv(sbaloandata_csv_path, index=False)

    # Use the COPY command to insert data from the CSV file
    with open(sbaloandata_csv_path, 'r') as csv_file:
        with connection.cursor() as cursor:
            cursor.copy_expert(f"COPY {table_name} FROM stdin WITH CSV HEADER", csv_file)

    # Commit the transaction
    transaction.commit()

    # Add a debug message to indicate data operation completion
    print("Data operation completed successfully.")

    # Redirect to 'home'
    return redirect('home')

@csrf_exempt
def log_js_error(request):
    if request.method == 'POST':
        try:
            error_data = json.loads(request.body.decode('utf-8'))
            print(error_data)  # Example logging
            return JsonResponse({'status': 'success'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:  # This should be within the function
            logger.error(f'Error in log_js_error: {e}', exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
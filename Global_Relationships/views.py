from django.shortcuts import render, redirect
import logging
import traceback
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods, require_POST
from .models import BusinessAccounts, PersonalAccounts, GlobalRelationship, AccountAddresses
from .forms import BusinessAccountForm, AccountAddressesForm
from uuid import uuid4
from django.utils import timezone
from datetime import datetime

# Set up logging
logger = logging.getLogger(__name__)

# Renders the Relationship.html webpage with session data
def global_relationships(request):
    context = {
        'Global_Relationship_ID': request.session.get('Global_Relationship_ID', ''),
        'Meta_ID': request.session.get('Meta_ID', ''),
        'Unique_ID': request.session.get('Unique_ID', ''),
        'Unique_Jointly_Reported_ID': request.session.get('Unique_Jointly_Reported_ID', '')
    }
    return render(request, 'Relationships.html', context)

# Submits Account Address Form data to database
@require_POST
def submit_account_address(request):
    print("submit_account_address view called, Request Method:", request.method)

    if request.method == 'POST':
        print("Processing POST request, POST data:", request.POST)
        form = AccountAddressesForm(request.POST)
        print("AccountAddressesForm instantiated")

        if form.is_valid():
            print("Form is valid. Saving form data.")
            form.save()
            print("Form data saved successfully")
            return JsonResponse({'success': True})
        else:
            print("Form is invalid. Errors:", form.errors.as_json())
            return JsonResponse({'success': False, 'errors': form.errors.as_json()})

    else:
        print("Non-POST request received")
        form = AccountAddressesForm()
        return render(request, 'Relationships.html', {'form': form})

    print("Exiting submit_account_address view")

def refresh_csrf_token(request):
    # Get a new CSRF token
    new_csrf_token = get_token(request)

    # Return the new CSRF token as a JSON response
    return JsonResponse({'csrf_token': new_csrf_token})

# Logic for generating a Meta ID
def generate_Meta_ID(name, date):
    name_parts = name.split()
    first_part = name_parts[0][:4] if len(name_parts) > 0 else ''
    second_part = name_parts[1][:4] if len(name_parts) > 1 else ''
    date_str = date.strftime("%m%d%Y")
    Meta_ID = f"{first_part}{second_part}{date_str}"
    return Meta_ID

# Utilizes the defined Business Account Form for submitting a business account
@require_POST
def submit_business_account(request):
    logger.info("Entered submit_business_account view")

    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        logger.warning("Received a non-AJAX request in submit_business_account view")
        return JsonResponse({'success': False, 'errors': 'Non-AJAX request not allowed'})

    response_data = {'success': False, 'errors': None, 'generated_ids': {}}

    try:
        form = BusinessAccountForm(request.POST or None)
        logger.info("Form received with data: " + str(request.POST))

        if form.is_valid():
            logger.info("Form is valid. Processing form data.")
            business_account = form.save(commit=False)

            # Generate Unique_ID if needed and update session
            if not business_account.Unique_ID:
                business_account.Unique_ID = f'B{str(uuid4())}'
                response_data['generated_ids']['Unique_ID'] = business_account.Unique_ID
                request.session['Unique_ID'] = str(business_account.Unique_ID)
                print(f"Generated Unique_ID: {business_account.Unique_ID} and updated session")
                print(f"Unique_ID saved in session: {request.session['Unique_ID']}")

            # Retrieve or generate Global Relationship ID and Meta ID
            global_relationship_id = form.cleaned_data.get('Global_Relationship_ID')
            Meta_ID = form.cleaned_data.get('Meta_ID')
            if not global_relationship_id:
                global_relationship = GlobalRelationship.objects.create()
                global_relationship_id = global_relationship.Unique_ID
                if not Meta_ID:
                    Meta_ID = str(generate_Meta_ID(business_account.Business_Legal_Name, timezone.now()))
                global_relationship.Meta_ID = Meta_ID
                global_relationship.save()
                response_data['generated_ids']['Global_Relationship_ID'] = str(global_relationship_id)
                logger.info(f"Generated Global_Relationship_ID: {global_relationship_id}")
            else:
                if isinstance(global_relationship_id, GlobalRelationship):
                    global_relationship_id = str(global_relationship_id.Unique_ID)

                global_relationship = GlobalRelationship.objects.get(Unique_ID=global_relationship_id)
                if not Meta_ID:
                    Meta_ID = global_relationship.Meta_ID

            business_account.Global_Relationship_ID = global_relationship
            business_account.save()
            logger.info("BusinessAccount instance saved")

            # Update session data
            request.session['Global_Relationship_ID'] = str(global_relationship_id)
            request.session['Meta_ID'] = Meta_ID
            request.session['Unique_ID'] = str(business_account.Unique_ID)

            response_data['generated_ids']['Unique_ID'] = str(business_account.Unique_ID)
            response_data['generated_ids']['Global_Relationship_ID'] = str(global_relationship_id)
            response_data['generated_ids']['Meta_ID'] = Meta_ID

            response_data['success'] = True
        else:
            response_data['errors'] = form.errors.as_json()
            logger.error(f"Form is invalid: {response_data['errors']}")

    except GlobalRelationship.DoesNotExist:
        logger.error("GlobalRelationship ID does not exist")
        response_data['errors'] = 'GlobalRelationship ID does not exist.'
    except Exception as e:
        logger.error(f"Error in submit_business_account view: {str(e)}")
        logger.error(traceback.format_exc())
        response_data['errors'] = 'An internal server error occurred.'

    logger.info(f"Sending response data: {response_data}")
    return JsonResponse(response_data)
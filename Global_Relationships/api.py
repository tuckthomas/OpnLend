import logging
from django.http import HttpRequest, JsonResponse
from ninja.security import django_auth
import json
from django.forms.models import model_to_dict
from datetime import datetime
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import ValidationError
from .schemas import BusinessAccountSchema, AccountAddressSchema, SearchResult, SelectionPayload
from .models import BusinessAccounts, GlobalRelationship, AccountAddress, PersonalAccounts
from .utils import generate_Meta_ID, clean_email, clean_url, clean_phone_number
from django.db import transaction
from django.utils.timezone import now
from uuid import uuid4, UUID
from typing import Any, Dict, List, Union
from django.db.models import Q, Value
from django.db.models.functions import Concat
from UserProfiles.api import update_user_session
from UserProfiles.utils import fetch_user_session
from django.utils.dateparse import parse_date
from django.core.exceptions import ObjectDoesNotExist



logger = logging.getLogger('OpnLend')

router = Router()

@router.post("/business-accounts/")
def manage_business_account(request):
    response = {'success': False, 'errors': None, 'data': None, 'generated_ids': {}}
    try:
        request_data = json.loads(request.body.decode('utf-8'))

        # Pre-process request data before validation
        for field in ['Date_of_Formation', 'Business_Entity_Report_Expiration_Date']:
            request_data[field] = request_data.get(field) if request_data.get(field, '') else None

        global_rel_id = request_data.get('Global_Relationship_ID')

        with transaction.atomic():
            if global_rel_id:
                # Fetch or create GlobalRelationship based on provided ID
                global_rel, _ = GlobalRelationship.objects.get_or_create(Global_Relationship_ID=global_rel_id)
            else:
                # Case 1: Create new Global Relationship
                logger.info("Creating new GlobalRelationship.")
                meta_id = generate_Meta_ID(request_data.get('Business_Legal_Name'), now())
                global_rel = GlobalRelationship.objects.create(Meta_ID=meta_id)
            
            # Correctly set the Global_Relationship_ID for schema validation
            if 'Unique_ID' not in request_data or not request_data['Unique_ID']:
                request_data['Unique_ID'] = str(uuid4())
            # This line is adjusted to use the correct field name
            request_data['Global_Relationship_ID'] = str(global_rel.Global_Relationship_ID)

            payload = BusinessAccountSchema(**request_data)
            data = payload.dict()

            # Convert Global_Relationship_ID back to model instance for Django ORM
            data['Global_Relationship_ID'] = global_rel

            if 'Unique_ID' in data and data['Unique_ID']:
                # Update or create the BusinessAccount
                business_acc, created = BusinessAccounts.objects.update_or_create(
                    Unique_ID=data['Unique_ID'], defaults=data
                )
            else:
                # Create new BusinessAccount without Unique_ID in the payload
                business_acc = BusinessAccounts.objects.create(**data)

            response['success'] = True
            response['generated_ids'] = {
                'Unique_ID': str(business_acc.Unique_ID),
                'Global_Relationship_ID': str(global_rel.Global_Relationship_ID),  # Adjusted to the correct field
                'Meta_ID': global_rel.Meta_ID,
            }
            response['data'] = model_to_dict(business_acc)

            return JsonResponse(response, status=200)

    except Exception as e:
        logger.error(f"Error handling request: {str(e)}", exc_info=True)
        response['errors'] = {'exception': str(e)}
        return JsonResponse(response, status=500)

        
# Account Address Management API
@router.post("/account-addresses/")
def manage_account_address(request) -> JsonResponse:
    response_data = {
        'success': False,
        'errors': None,
        'data': None,
    }

    try:
        request_data = json.loads(request.body.decode('utf-8'))
        logger.info("Request data loaded successfully.")

        # Validate and clean the data using the schema
        payload = AccountAddressSchema(**request_data)
        logger.info("Payload validated successfully.")

        # Attempt to fetch the GlobalRelationship instance using the provided ID
        try:
            global_relationship_instance = GlobalRelationship.objects.get(Global_Relationship_ID=UUID(request_data.get('Global_Relationship_ID')))
            logger.info("GlobalRelationship instance fetched successfully.")
        except GlobalRelationship.DoesNotExist:
            logger.error("GlobalRelationship instance not found.")
            response_data['errors'] = "GlobalRelationship instance not found."
            return JsonResponse(response_data, status=404)

        # Check for 'Unique_Address_ID' in request_data to ensure it's provided, else set to None
        unique_address_id = UUID(request_data['Unique_Address_ID']) if 'Unique_Address_ID' in request_data and request_data['Unique_Address_ID'] else None
        logger.debug("Unique_Address_ID processed.")

        # Prepare the data for creating/updating the AccountAddresses instance
        account_address_data = {
            'Unique_ID': UUID(request_data['Unique_ID']),
            'Global_Relationship_ID': global_relationship_instance,  # Directly assign the instance
            'Property_Type': payload.Property_Type,
            'Address_1': payload.Address_1,
            'Address_2': payload.Address_2,
            'City': payload.City,
            'State': payload.State,
            'Zip': payload.Zip,
        }
        logger.debug("Account address data prepared.")

        # Update or create the AccountAddresses instance
        address_instance, created = AccountAddress.objects.update_or_create(
            Unique_Address_ID=unique_address_id,
            defaults=account_address_data
        )
        logger.info(f"Address {'created' if created else 'updated'} successfully.")

        # Update the response data
        response_data.update({
            'success': True,
            'message': 'Address created successfully.' if created else 'Address updated successfully.',
            'data': {
                'Unique_Address_ID': str(address_instance.Unique_Address_ID),
                'Unique_ID': str(address_instance.Unique_ID),
            }
        })

    except Exception as e:
        logger.exception("An error occurred while processing the request.")
        response_data['errors'] = str(e)
        return JsonResponse(response_data, status=500)

    logger.info("Response successfully prepared.")
    return JsonResponse(response_data)


# Searchbar Functionality
@router.get("/search/", response=List[SearchResult], auth=django_auth)
def search(request, query: str = ""):
    results = []

    # Search in GlobalRelationship
    global_relationships = GlobalRelationship.objects.filter(Q(Global_Relationship_ID__icontains=query) | Q(Meta_ID__icontains=query))
    for gr in global_relationships:
        results.append(SearchResult(type="GlobalRelationship", unique_id=str(gr.Global_Relationship_ID), display_text=gr.Meta_ID))

    # Search in BusinessAccounts
    business_accounts = BusinessAccounts.objects.filter(Q(Unique_ID__icontains=query) | Q(Business_Legal_Name__icontains=query) | Q(DBA_Name__icontains=query) | Q(Tax_ID__icontains=query))
    for ba in business_accounts:
        results.append(SearchResult(type="BusinessAccount", unique_id=str(ba.Unique_ID), display_text=ba.Business_Legal_Name))

    # Search in PersonalAccounts
    personal_accounts = PersonalAccounts.objects.annotate(full_name=Concat('First_Name', Value(' '), 'Middle_Name_or_Initial', Value(' '), 'Last_Name')).filter(Q(Unique_ID__icontains=query) | Q(full_name__icontains=query) | Q(Social_Security_Number__icontains=query))
    for pa in personal_accounts:
        display_text = f"{pa.First_Name} {pa.Last_Name} ({' '.join(filter(None, [pa.Middle_Name_or_Initial, pa.Social_Security_Number]))})"
        results.append(SearchResult(type="PersonalAccount", unique_id=str(pa.Unique_ID), display_text=display_text))

    if not results:
        return Response([])  # Return an empty list if no results are found
    
    return results  # Return the search results


@router.post("/select/", auth=django_auth)
def select_result(request, payload: SelectionPayload):
    # Obtains the authenticated user
    user = request.user
    
    # Fetch or create a UserSession for the user
    user_session, _ = UserSession.objects.get_or_create(user=user)
    
    if payload.type == "GlobalRelationship":
        # Assuming the Global_Relationship_ID field is a string representation of a UUID
        user_session.Global_Relationship_ID = payload.Global_Relationship_ID
        user_session.Meta_ID = payload.display_text
    elif payload.type == "BusinessAccount":
        ba = BusinessAccounts.objects.get(Unique_ID=payload.unique_id)
        user_session.Business_Unique_ID = str(ba.Unique_ID)
    elif payload.type == "PersonalAccount":
        pa = PersonalAccounts.objects.get(Unique_ID=payload.unique_id)
        user_session.Personal_Unique_ID = str(pa.Unique_ID)
    
    user_session.save()
    
    return {"success": True}


# Obtains Business Accounts within Active Global Relationship of User
@router.get("/user-business-accounts/", response=List[BusinessAccountSchema], auth=django_auth)
def get_user_business_accounts(request):
    try:
        logger.info("Attempting to fetch user business accounts.")
        user = request.user
        user_session_data = fetch_user_session(user)
        print("User session data:", user_session_data)  # Print statement added
        if not user_session_data:
            logger.warning("UserSession not found.")
            return JsonResponse({"message": "UserSession not found"}, status=404)

        Global_Relationship_ID = user_session_data["Global_Relationship_ID"]
        logger.debug(f"Global Relationship ID: {Global_Relationship_ID}")
        Business_Accounts = BusinessAccounts.objects.filter(Global_Relationship_ID=Global_Relationship_ID)
        if not Business_Accounts.exists():
            logger.warning("No business accounts found.")
            return JsonResponse({"message": "No business accounts found"}, status=404)

        serialized_accounts = []
        for account in Business_Accounts:
            account_data = account.__dict__.copy()
            account_data.pop('_state', None)  # Remove the Django model state attribute
            # Since Global_Relationship_ID is a ForeignKey, use `_id` to directly access the UUID
            # Ensure Global_Relationship_ID is properly extracted as a UUID string
            account_data['Global_Relationship_ID'] = account.Global_Relationship_ID_id

            # Adjust to correctly initialize the Pydantic model
            serialized_account = BusinessAccountSchema(**account_data)
            serialized_accounts.append(serialized_account.dict())  # Convert to dict for JSON serialization

        logger.info("Successfully fetched user business accounts.")
        return JsonResponse({"accounts": serialized_accounts}, safe=False)

    except Exception as e:
        logger.exception("Unhandled exception in get_user_business_accounts")
        return JsonResponse({"error": "Internal Server Error"}, status=500)

# Obtains the active Business Account's Addresses for populating into Business Address Table
@router.get("/user-business-addresses/", response=List[AccountAddressSchema], auth=django_auth)
def get_user_business_addresses(request):
    try:
        logger.info("Attempting to fetch user business addresses.")
        user = request.user
        logger.debug("User:", user)
        
        user_session_data = fetch_user_session(user)
        logger.debug("User session data:", user_session_data)
        
        if not user_session_data:
            logger.warning("UserSession not found.")
            return JsonResponse({"message": "UserSession not found"}, status=404)

        Unique_ID = user_session_data.get("Business_Unique_ID")
        logger.debug(f"Unique ID: {Unique_ID}")
        
        business_addresses = AccountAddress.objects.filter(Unique_ID=Unique_ID)
        serialized_addresses = []
        for address in business_addresses:
            street = address.Address_1
            if address.Address_2:
                street += f", {address.Address_2}"
            address_data = {
                "Unique_Address_ID": address.Unique_Address_ID,
                "Property_Type": address.Property_Type,
                "Street": street,
                "City": address.City,
                "State": address.State,
                "Zip_Code": address.Zip
            }
            serialized_addresses.append(address_data)

        logger.info("Successfully fetched user business addresses.")
        return JsonResponse({"addresses": serialized_addresses}, safe=False)

    except Exception as e:
        logger.exception("Unhandled exception in get_user_business_addresses")
        return JsonResponse({"error": "Internal Server Error"}, status=500)

import logging
from django.http import HttpRequest
from django.forms.models import model_to_dict
from datetime import datetime
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import ValidationError
from .schemas import BusinessAccountSchema, AccountAddressSchema
from .models import BusinessAccounts, GlobalRelationship, AccountAddresses
from .utils import generate_Meta_ID, clean_email, clean_url, clean_phone_number
from django.db import transaction
from django.utils.timezone import now
from uuid import uuid4 

logger = logging.getLogger(__name__)

router = Router()

# Business Account Management API
@router.post("/business-accounts/")
def manage_business_account(request, payload: BusinessAccountSchema):
    print("Payload received:", payload.dict())  # Inspect the raw payload
    response = {'success': False, 'errors': None, 'ids_generated': {}}

    try:
        with transaction.atomic():
            data = payload.dict()

            # If Date_of_Formation is not provided or is an empty string, set it to None
            if data.get('Date_of_Formation') is None or data.get('Date_of_Formation').strip() == '':
                data['Date_of_Formation'] = None

            # If Business_Entity_Report_Expiration_Date is not provided or is an empty string, set it to None
            if data.get('Business_Entity_Report_Expiration_Date') is None or data.get('Business_Entity_Report_Expiration_Date').strip() == '':
                data['Business_Entity_Report_Expiration_Date'] = None

            # If Unique_ID is not provided or is an empty string, generate it
            if data.get('Unique_ID') is None or data.get('Unique_ID').strip() == '':
                data['Unique_ID'] = str(uuid4())

            # Create or fetch Global Relationship
            global_rel = None
            if 'Global_Relationship_ID' in data and data.get('Global_Relationship_ID').strip() != '':
                global_rel = GlobalRelationship.objects.get(Unique_ID=data['Global_Relationship_ID'])
            else:
                meta_id = generate_Meta_ID(data.get('Business_Legal_Name'), now())
                global_rel = GlobalRelationship.objects.create(Meta_ID=meta_id)

            # Remove Global_Relationship_ID from data
            data.pop('Global_Relationship_ID', None)

            # Update or create Business Account
            business_acc, created = BusinessAccounts.objects.update_or_create(
                Unique_ID=data['Unique_ID'], defaults=data, Global_Relationship_ID=global_rel)

            # Prepare response
            response['success'] = True
            response['generated_ids'] = {
                'Unique_ID': str(business_acc.Unique_ID),
                'Global_Relationship_ID': str(global_rel.Unique_ID),
                'Meta_ID': global_rel.Meta_ID,
            }

            # Include the full data for form repopulation
            response['data'] = model_to_dict(business_acc)  # Converts the model instance into a dictionary

            # Update session data
            request.session['Global_Relationship_ID'] = str(global_rel.Unique_ID)
            request.session['Meta_ID'] = global_rel.Meta_ID
            request.session['Unique_ID'] = str(business_acc.Unique_ID)

            print("Operation successful:", response)

    except GlobalRelationship.DoesNotExist:
        logger.error("GlobalRelationship ID does not exist", exc_info=True)
        response['errors'] = 'GlobalRelationship ID does not exist.'
        print(response['errors'])
    except Exception as e:
        logger.error(f"Error while managing business account: {str(e)}", exc_info=True)
        response['errors'] = str(e)
        print("Exception occurred:", str(e))

    return response

# Account Address Management API
@router.post("/account-addresses/", response={200: AccountAddressSchema})
def manage_account_address(request, payload: AccountAddressSchema, address_id: Optional[int] = None):
    response_data = {
        'success': False,
        'errors': None,
        'data': None,
    }

    try:
        if address_id:
            # Attempt to update an existing address
            address_instance = AccountAddresses.objects.filter(id=address_id).first()
            if not address_instance:
                response_data['errors'] = 'Address not found.'
                return response_data, 404
            
            for field, value in payload.dict().items():
                setattr(address_instance, field, value)
            address_instance.save()
        else:
            # Create a new address
            address_instance = AccountAddresses.objects.create(**payload.dict())
        
        response_data['success'] = True
        response_data['message'] = 'Address created or updated successfully.'
        # Send the entire data back for form repopulation, including the ID
        response_data['data'] = model_to_dict(address_instance)
        
    except Exception as e:
        response_data['errors'] = str(e)
        return response_data, 500

    return response_data
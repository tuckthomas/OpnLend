from django import forms
from django.core.exceptions import ValidationError
from .models import BusinessAccounts, AccountAddresses
from django.core.validators import RegexValidator
import re

# Business Account Form Handling
class BusinessAccountForm(forms.ModelForm):
    OC_EPC_CHOICES = [
        ('Operating Company', 'Operating Company'),
        ('Eligible Passive Company', 'Eligible Passive Company'),
        ('Other Related Entity', 'Other Related Entity'),
    ]

    class Meta:
        model = BusinessAccounts
        fields = [
            'Business_Legal_Name', 'Global_Relationship_ID', 'DBA_Name', 'OC_EPC_Indication', 'Entity_Type', 'Tax_ID', 'Domiciled_Locale',
            'Date_of_Formation', 'Business_Entity_Report_Expiration_Date', 'NAICS_Code_Description',
            'NAICS_Code_2022', 'DUNS_ID', 'Website_URL', 'Primary_Contact_Name', 'Primary_Contact_Phone', 'Primary_Contact_Email'
        ]

    required_fields = ['Business_Legal_Name', 'OC_EPC_Indication']

    def __init__(self, *args, **kwargs):
        super(BusinessAccountForm, self).__init__(*args, **kwargs)
        # Set fields as required based on the required_fields list
        for field in self.fields:
            self.fields[field].required = field in self.required_fields

    def clean(self):
        cleaned_data = super().clean()
        # Validation for required fields
        for field in self.required_fields:
            if not cleaned_data.get(field):
                self.add_error(field, "This field is required.")

        # Standard cleaning for all text input fields
        for field_name, field_value in cleaned_data.items():
            if isinstance(self.fields.get(field_name), forms.CharField):
                if field_value:  # Perform cleaning only if the field is not empty
                    # Apply standard cleaning logic, e.g., stripping leading/trailing whitespace
                    cleaned_data[field_name] = field_value.strip()

        return cleaned_data

# Address Account Form Handling
class AccountAddressesForm(forms.ModelForm):
    class Meta:
        model = AccountAddresses
        fields = ['Unique_ID', 'Global_Relationship_ID', 'Property_Type', 'Address_1', 'Address_2', 'City', 'State', 'Zip']

    required_fields = ['Unique_ID', 'Global_Relationship_ID', 'Property_Type', 'Address_1', 'City', 'State', 'Zip']

    def __init__(self, *args, **kwargs):
        super(AccountAddressesForm, self).__init__(*args, **kwargs)
        for field in self.required_fields:
            if field in self.fields:
                self.fields[field].required = True

    def clean(self):
        cleaned_data = super().clean()
        address_fields = ['Address_1', 'Address_2', 'City', 'State', 'Zip']

        # Custom cleaning for address fields
        for field in address_fields:
            if field in cleaned_data:
                value = cleaned_data[field]

                # Remove unwanted special characters while allowing address-relevant ones
                value = re.sub(r'[^\w\s.,-]', '', value)

                # Remove excessive spaces
                value = re.sub(r'\s+', ' ', value).strip()

                cleaned_data[field] = value

        return cleaned_data
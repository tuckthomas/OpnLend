from django import forms
from django.core.exceptions import ValidationError
from .models import BusinessAccount

class BusinessAccountForm(forms.ModelForm):
    class Meta:
        model = BusinessAccount
        fields = [
            'Business_Legal_Name', 'DBA_Name', 'Entity_Type', 'Tax_ID', 
            'Domiciled_Locale', 'Date_of_Formation', 'Business_Entity_Report_Expiration_Date',
            'OC_EPC_Indication', 'NAICS_Code_Description', 'NAICS_Code_2022', 'DUNS_ID', 
            'Website_URL', 'Primary_Contact_Name', 'Primary_Contact_Phone', 'Primary_Contact_Email'
        ]

    required_fields = ['Business_Legal_Name', 'Date_of_Formation']  # Fields that must not be empty

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

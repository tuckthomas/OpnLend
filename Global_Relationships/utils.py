from datetime import datetime
import re
from django.utils import timezone
from django.core.validators import validate_email, URLValidator, RegexValidator
from django.core.exceptions import ValidationError

# Logic for generating a Meta ID
def generate_Meta_ID(name, date):
    name_cleaned = re.sub(r'\W+', '', name) # Removes special characters
    name_parts = name_cleaned.split() # Assuming you want to split by whitespace; adjust if needed
    first_part = name_parts[0][:4] if len(name_parts) > 0 else '' # First four of First Name in string
    second_part = name_parts[1][:4] if len(name_parts) > 1 else '' # Last four of Last Name in string, if applicable
    date_str = date.strftime("%m%d%Y")
    Meta_ID = f"{first_part}{second_part}{date_str}"
    return Meta_ID

def clean_email(email):
    try:
        validate_email(email)
        return email
    except ValidationError:
        raise ValueError("Invalid email address")

def clean_url(url):
    validate = URLValidator()
    try:
        validate(url)
        return url
    except ValidationError:
        raise ValueError("Invalid URL")

def clean_phone_number(phone):
    regex_validator = RegexValidator(regex=r'^\+?1?\d{9,15}$')
    try:
        regex_validator(phone)
        return phone
    except ValidationError:
        raise ValueError("Invalid phone number format")

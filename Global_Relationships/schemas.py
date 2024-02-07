import re
from pydantic import BaseModel, Field, EmailStr, constr, validator
from datetime import date
from uuid import UUID, uuid4
from ninja import Schema
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class BusinessAccountSchema(BaseModel):
    Unique_ID: Optional[str] = None
    Business_Legal_Name: str
    DBA_Name: Optional[str] = None
    OC_EPC_Indication: str
    Entity_Type: Optional[str] = None
    Tax_ID: Optional[str] = None
    Domiciled_Locale: Optional[str] = None
    Date_of_Formation: Optional[str] = None
    Business_Entity_Report_Expiration_Date: Optional[str] = None
    NAICS_Code_Description: Optional[str] = None
    NAICS_Code_2022: Optional[str] = None
    Website_URL: Optional[str] = None
    Primary_Contact_Name: Optional[str] = None
    Primary_Contact_Phone: Optional[str] = None
    Primary_Contact_Email: Optional[str] = None
    Global_Relationship_ID: Optional[str] = None

    @validator('Unique_ID', 'Business_Legal_Name', 'OC_EPC_Indication', pre=True)
    def check_fields(cls, v):
        # Example validation logic, adjust accordingly
        if v is None:
            raise ValueError("This field cannot be empty")
        return v

class AccountAddressSchema(BaseModel):
    Unique_ID: str
    Global_Relationship_ID: str
    Property_Type: str
    Address_1: str
    Address_2: Optional[str] = None
    City: str
    State: str
    Zip: str

    @validator('Address_1', 'Address_2', 'City', 'Zip', pre=True)
    def clean_address_fields(cls, value):
        if value:
            value = re.sub(r'[^\w\s.,-]', '', value)
            value = re.sub(r'\s+', ' ', value).strip()
        return value

    @validator('State', pre=True)
    def check_state_length(cls, value):
        if len(value) != 2:
            raise ValueError("State must be exactly two characters long")
        return value
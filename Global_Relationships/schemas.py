from pydantic import BaseModel, Field, EmailStr, constr, validator, UUID4
from typing import ClassVar, Optional
import re
from datetime import date
from uuid import UUID, uuid4
from ninja import Schema
from typing import Optional, ClassVar
import logging

logger = logging.getLogger(__name__)

class BusinessAccountSchema(BaseModel):
    Unique_ID: Optional[UUID4] = None
    Business_Legal_Name: constr(min_length=1)
    DBA_Name: Optional[str] = None
    OC_EPC_Indication: str
    Entity_Type: Optional[str] = None
    Tax_ID: Optional[str] = None
    Domiciled_Locale: Optional[str] = None
    Date_of_Formation: Optional[date] = None
    Business_Entity_Report_Expiration_Date: Optional[date] = None
    Employees: Optional[str] = None
    NAICS_Code_Description: Optional[str] = None
    NAICS_Code_2022: Optional[str] = None
    Website_URL: Optional[str] = None
    Primary_Contact_Name: Optional[str] = None
    Primary_Contact_Phone: Optional[str] = None
    Primary_Contact_Email: Optional[str] = None
    Global_Relationship_ID: Optional[UUID4] = None

    @validator('Unique_ID', 'Business_Legal_Name', 'OC_EPC_Indication', pre=True)
    def check_fields(cls, v):
        # Example validation logic, adjust accordingly
        if v is None:
            raise ValueError("This field cannot be empty")
        return v

    @validator('Date_of_Formation', 'Business_Entity_Report_Expiration_Date')
    def parse_date(cls, v):
        # Convert MM/DD/YYYY date format to date object
        if v:
            try:
                month, day, year = map(int, v.split('/'))
                return date(year, month, day)
            except ValueError:
                return None, ValueError("Incorrect date format, should be MM/DD/YYYY")
        return None

class AccountAddressSchema(BaseModel):
    Unique_Address_ID: str
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
            value = re.sub(r'[^\w\s.,-]', '', value)  # Using re directly here
            value = re.sub(r'\s+', ' ', value).strip()
        return value

    @validator('State', pre=True)
    def check_state_length(cls, value):
        if len(value) != 2:
            raise ValueError("State must be exactly two characters long")
        return value

# Search Bar Schemas
class SearchResult(Schema):
    type: str
    unique_id: str
    display_text: str

class SearchQuery(Schema):
    query: str

class SelectionPayload(Schema):
    type: str
    unique_id: str

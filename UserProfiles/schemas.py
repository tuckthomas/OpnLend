from typing import Optional
from ninja import Schema
from pydantic import BaseModel

class UpdateUserSessionSchema(BaseModel):
    Global_Relationship_ID: Optional[str] = None
    Meta_ID: Optional[str] = None
    Business_Unique_ID: Optional[str] = None
    Personal_Unique_ID: Optional[str] = None

class UpdateUserSessionBusinessSchema(BaseModel):
    Global_Relationship_ID: Optional[str] = None
    Meta_ID: Optional[str] = None
    Business_Unique_ID: Optional[str] = None
    Personal_Unique_ID: Optional[str] = None

class UpdateUserSessionPersonalSchema(BaseModel):
    Global_Relationship_ID: Optional[str] = None
    Meta_ID: Optional[str] = None
    Personal_Unique_ID: Optional[str] = None

class UserSessionResponse(Schema):
    Global_Relationship_ID: Optional[str] = None
    Meta_ID: Optional[str] = None
    Business_Unique_ID: Optional[str] = None
    Personal_Unique_ID: Optional[str] = None

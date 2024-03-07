from ninja import Schema
from pydantic import BaseModel, EmailStr, Field, validator
from django.contrib.auth.password_validation import validate_password 

class RegisterSchema(Schema):
    first_name: str
    last_name: str
    email: EmailStr
    password: str = Field(min_length=12)  # Minimum length enforced here
    password_repeat: str 
    phone_number: str = None
    company_name: str = None
    job_title: str = None

    @validator('password')
    def validate_password_strength(cls, v):
        validate_password(v)  # Leverages Django's built-in validators
        return v

    @validator('password_repeat')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class LoginSchema(Schema):
    email: str
    password: str

class SuccessResponseSchema(Schema):
    success: str

class ErrorResponseSchema(Schema):
    error: str

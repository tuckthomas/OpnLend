from ninja import Schema

class RegisterSchema(Schema):
    first_name: str
    last_name: str
    email: str
    password: str
    password_repeat: str

class LoginSchema(Schema):
    email: str
    password: str
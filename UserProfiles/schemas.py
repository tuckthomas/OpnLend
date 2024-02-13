from ninja import Schema

class CreateUserSessionSchema(Schema):
    global_relationship_id: str
    meta_id: str
    unique_id: str

class UserSessionSchema(Schema):
    id: int
    global_relationship_id: str
    meta_id: str
    unique_id: str
    user_id: int  # Assuming you want to include the user's ID

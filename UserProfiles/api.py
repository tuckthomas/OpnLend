from ninja import Router
from django.shortcuts import get_object_or_404
from .models import UserSession
from .schemas import UserSessionSchema, CreateUserSessionSchema

router = Router()

@router.post("/session/", response=UserSessionSchema)
def create_or_update_session(request, session_data: CreateUserSessionSchema):
    user_session, created = UserSession.objects.update_or_create(
        user=request.user,
        defaults={
            "global_relationship_id": session_data.global_relationship_id,
            "meta_id": session_data.meta_id,
            "unique_id": session_data.unique_id,
        }
    )
    return user_session

@router.get("/session/{user_id}/", response=UserSessionSchema)
def get_user_session(request, user_id: int):
    user_session = get_object_or_404(UserSession, user__id=user_id)
    return user_session
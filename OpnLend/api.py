from ninja import NinjaAPI
from Global_Relationships.api import router as global_relationships_router
from UserProfiles.api import router as userprofiles_router
from Authentication.api import router as authentication_router

api = NinjaAPI(title="OpnLend API", version="1.0.0")

api.add_router("/global-relationships/", global_relationships_router)
api.add_router("/user-profiles/", userprofiles_router)
api.add_router("/authentication/", authentication_router)


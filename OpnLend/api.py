# OpnLend API
# Centralized Endpoints

from ninja import NinjaAPI
from Global_Relationships.api import router as global_relationships_router
# Import the router from UserProfiles app
from UserProfiles.api import router as userprofiles_router

api = NinjaAPI(title="OpnLend API", version="1.0.0")

# Including routers from each app
api.add_router("/global-relationships/", global_relationships_router)
api.add_router("/user-profiles/", userprofiles_router)

# Note: Each `api.py` within the apps defines a Router instance and must be included above

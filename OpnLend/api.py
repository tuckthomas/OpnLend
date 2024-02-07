from ninja import NinjaAPI
from Global_Relationships.api import router as global_relationships_router


api = NinjaAPI(title="OpnLend API", version="1.0.0")

# Including routers from each app
api.add_router("/global-relationships/", global_relationships_router)

# Note: Ensure that each `api.py` within the apps defines a Router instance.
# For apps without API endpoints, you simply won't include them here.

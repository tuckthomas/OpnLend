from django.contrib import admin
from django.urls import path, include
from .views import update_session_data
from Dashboard.views import Dashboard, download_and_process_data, download_csv, data_table, filter_choices, log_js_error, download_filtered_data, delete_filtered_data
from Financial_Manager.views import Financials
from Global_Relationships.views import global_relationships, refresh_csrf_token
from Loans.views import Loans
from Authentication.views import Register, Login
from UserProfiles.views import Profile
from django.conf import settings
from django.conf.urls.static import static
from .api import api

urlpatterns = [
    path('api/', api.urls),
    path('admin/', admin.site.urls),
    path('', Dashboard, name='Dashboard'),
    path('update-session/', update_session_data, name='update-session'),
    path('download/', download_and_process_data, name='download_and_process_data'),
    path('download-csv/', download_csv, name='download_csv'),
    path('download_and_process_data/', download_and_process_data, name='download_and_process_data'),
    path('delete-filtered-data/', delete_filtered_data, name='delete_filtered_data'),
    path('update-data/', download_and_process_data, name='update_data'),
    path('data-table/', data_table, name='data_table'),
    path('filter-choices/', filter_choices, name='filter_choices'),
    path('log-js-error/', log_js_error, name='log_js_error'),
    path('Financials/', Financials, name='Financials'),
    path('Loans/', Loans, name='Loans'),
    path('Relationships/', global_relationships, name='Relationships'),
    path('Register/', Register, name='Register'),
    path('Login/', Login, name='Login'),
    path('Profile/', Profile, name='Profile'),
    path('refresh-csrf-token/', refresh_csrf_token, name='refresh_csrf_token'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

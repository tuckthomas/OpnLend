from django.contrib import admin
from django.urls import path
from dashboard.views import home, download_and_process_data, download_csv, data_table, filter_choices, log_js_error, download_filtered_data, delete_filtered_data
from Financial_Manager.views import Financials
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('download/', download_and_process_data, name='download_and_process_data'),
    path('download-csv/', download_csv, name='download_csv'),
    path('download_filtered_data/', download_filtered_data, name='download_filtered_data'),
    path('delete-filtered-data/', delete_filtered_data, name='delete_filtered_data'),
    path('update-data/', download_and_process_data, name='update_data'),
    path('data-table/', data_table, name='data_table'),
    path('filter-choices/', filter_choices, name='filter_choices'),
    path('log-js-error/', log_js_error, name='log_js_error'),
    path('Financials/', Financials, name='Financials'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
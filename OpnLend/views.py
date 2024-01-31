from django.http import JsonResponse
from django.views.decorators.http import require_POST

@require_POST
def update_session_data(request):
    global_relationship_id = request.POST.get('Global_Relationship_ID')
    meta_id = request.POST.get('Meta_ID')
    unique_id = request.POST.get('Unique_ID')
    unique_jointly_reported_id = request.POST.get('Unique_Jointly_Reported_ID')

    # Convert to string if they are not None and not already string
    if global_relationship_id and not isinstance(global_relationship_id, str):
        global_relationship_id = str(global_relationship_id)

    if meta_id and not isinstance(meta_id, str):
        meta_id = str(meta_id)

    if unique_id and not isinstance(unique_id, str):
        unique_id = str(unique_id)

    if unique_jointly_reported_id and not isinstance(unique_jointly_reported_id, str):
        unique_jointly_reported_id = str(unique_jointly_reported_id)

    # Update the session
    request.session['Global_Relationship_ID'] = global_relationship_id
    request.session['Meta_ID'] = meta_id
    request.session['Unique_ID'] = unique_id
    request.session['Unique_Jointly_Reported_ID'] = unique_jointly_reported_id 

    return JsonResponse({'status': 'success'})
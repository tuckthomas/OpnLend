from django.http import JsonResponse
from django.views.decorators.http import require_POST

@require_POST
def update_session_data(request):
    # Print received data
    print("Received data:")
    print({
        'Global_Relationship_ID': request.POST.get('Global_Relationship_ID'),
        'Meta_ID': request.POST.get('Meta_ID'),
        'Unique_ID': request.POST.get('Unique_ID'),
        'Unique_Jointly_Reported_ID': request.POST.get('Unique_Jointly_Reported_ID')
    }, flush=True)

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

    # Print data before updating session
    print("Data before updating session:")
    print({
        'Global_Relationship_ID': global_relationship_id,
        'Meta_ID': meta_id,
        'Unique_ID': unique_id,
        'Unique_Jointly_Reported_ID': unique_jointly_reported_id
    }, flush=True)

    # Update the session
    request.session['Global_Relationship_ID'] = global_relationship_id
    request.session['Meta_ID'] = meta_id
    request.session['Unique_ID'] = unique_id
    request.session['Unique_Jointly_Reported_ID'] = unique_jointly_reported_id

    # Print session data after update
    print("Session data after update:")
    print({
        'Global_Relationship_ID': request.session.get('Global_Relationship_ID'),
        'Meta_ID': request.session.get('Meta_ID'),
        'Unique_ID': request.session.get('Unique_ID'),
        'Unique_Jointly_Reported_ID': request.session.get('Unique_Jointly_Reported_ID')
    }, flush=True)

    return JsonResponse({'status': 'success'})

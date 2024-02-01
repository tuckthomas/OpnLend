from django.shortcuts import render

# Renders Business Financial Statement with (Context) Session Data
def Financials(request):
    context = {
        'Global_Relationship_ID': request.session.get('Global_Relationship_ID', ''),
        'Meta_ID': request.session.get('Meta_ID', ''),
        'Unique_ID': request.session.get('Unique_ID', ''),
        'Unique_Jointly_Reported_ID': request.session.get('Unique_Jointly_Reported_ID', '')
    }
    return render(request, 'Financials.html', context)
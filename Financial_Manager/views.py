from django.shortcuts import render

# Renders Income Statement
def Financials(request):
    return render(request, 'Financials.html')
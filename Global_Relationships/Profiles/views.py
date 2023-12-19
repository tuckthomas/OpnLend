from django.shortcuts import render, get_object_or_404
from relationships.models import Individual, Business


#individual profiel view
def individual_profile(request, uuid):
    # Get the individual instance or raise a 404 error if not found
    individual = get_object_or_404(Individual, uuid=uuid)

    # Get the effective profile
    profile = individual.effective_profile

    # Check if the profile exists; if not, you can return a custom message or a different template
    if profile is None:
        return render(request, 'profiles/no_profile.html', {'individual': individual})

    # Prepare the context data for the template
    context = {
        'individual': individual,
        'profile': profile,
    }

    # Render the individual profile template with the context data
    return render(request, 'profiles/individual_profile.html', context)


#business profiel view
def business_profile(request, uuid):
    # Get the business instance or raise a 404 error if not found
    business = get_object_or_404(Business, uuid=uuid)

    # Get the business profile
    profile = business.profile

    # Check if the profile exists; if not, you can return a custom message or a different template
    if profile is None:
        return render(request, 'profiles/no_business_profile.html', {'business': business})

    # Prepare the context data for the template
    context = {
        'business': business,
        'profile': profile,
    }

    # Render the business profile template with the context data
    return render(request, 'profiles/business_profile.html', context)

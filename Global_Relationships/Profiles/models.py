from django.db import models
from relationships.models import Individual, Business

class Profile(models.Model):
    background_and_history = models.TextField(blank=True, null=True)
    financial_analysis = models.TextField(blank=True, null=True)
    credit_history = models.TextField(blank=True, null=True)
    management_experience = models.TextField(blank=True, null=True)
    risk_assessment = models.TextField (blank=True, null=True)
    market_overview = models.TextField(blank=True, null=True)
    competitive_landscape = models.TextField(blank=True, null=True)
 # Add other common fields as needed

    class Meta:
        abstract = True

class IndividualProfile(models.Model):
    individual = models.OneToOneField(Individual, on_delete=models.CASCADE, related_name='profile')
    background_and_history = models.TextField(blank=True, null=True)
    financial_analysis = models.TextField(blank=True, null=True)
    credit_history = models.TextField(blank=True, null=True)
    management experience = models.TextField(blank=True, null=True)
    risk_assessment = models.TextField (blank=True, null=True)
    # Add other fields as needed

    def __str__(self):
        return f"Profile for {self.individual}"

#Additional individual profile model for individuals who are jointly reported on persoanl tax returns; allowing for a singular profile field to be entered for the two individuals (i.e., evaluated/analyzed on a joint basis)

class JointIndividualProfile(Profile):
    individuals = models.ManyToManyField(Individual, related_name='joint_profile', blank=True)
    # Add other fields as needed

    def __str__(self):
        return f"Joint Profile for {', '.join(str(individual) for individual in self.individuals.all())}"

class BusinessProfile(models.Model):
    business = models.OneToOneField(Business, on_delete=models.CASCADE, related_name='profile')
    background_and_history = models.TextField(blank=True, null=True)
    financial_analysis = models.TextField(blank=True, null=True)
    credit_history = models.TextField(blank=True, null=True)
    market_overview = models.TextField(blank=True, null=True)
    competitive_landscape = models.TextField(blank=True, null=True)
    risk_assessment = models.TextField (blank=True, null=True)
    # Add other fields as needed

    def __str__(self):
        return f"Profile for {self.business}"

#The below code creates a CustomField model to store the custom fields and their types, and a ProfileCustomFieldValue model to store the values of the custom fields for each profile.
class CustomField(models.Model):
    FIELD_TYPE_CHOICES = (
        ('text', 'Text'),
        ('integer', 'Integer'),
        ('boolean', 'Boolean'),
    )

    name = models.CharField(max_length=255)
    field_type = models.CharField(max_length=10, choices=FIELD_TYPE_CHOICES)

    def __str__(self):
        return self.name


class ProfileCustomFieldValue(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='custom_fields')
    custom_field = models.ForeignKey(CustomField, on_delete=models.CASCADE)
    value = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.custom_field.name}: {self.value}"

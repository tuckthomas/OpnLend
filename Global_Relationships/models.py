from django.db import models
import uuid
from django.db.models import UniqueConstraint

class Affiliate(models.Model):
    AFFILIATE_TYPE_CHOICES = [
        ('INDIVIDUAL', 'Individual'),
        ('BUSINESS', 'Business Entity'),
    ]

    affiliate_id = models.AutoField(primary_key=True)
    affiliate_code = models.CharField(max_length=20)
    affiliate_type = models.CharField(max_length=10, choices=AFFILIATE_TYPE_CHOICES)

    class Meta:
        constraints = [
            UniqueConstraint(fields=['affiliate_code'], name='unique_affiliate_code')
        ]

    def __str__(self):
        return self.affiliate_code

class Individual(models.Model):
    JOINTLY_REPORTED_CHOICES = [
        ('JOINTLY', 'Jointly Reported'),
        ('SOLE', 'Solely Reported'),
    ]

    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE, related_name='individuals')

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    ssn = models.CharField(max_length=9)
    dob = models.DateField()
    address_1 = models.CharField(max_length=100)
    address_2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    county = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    jointly_reported = models.CharField(max_length=7, choices=JOINTLY_REPORTED_CHOICES)
    jointly_reported_code = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Business(models.Model):
    BUSINESS_TYPE_CHOICES = [
        ('C-CORP', 'C-Corporation'),
        ('S-CORP', 'S-Corporation'),
        ('LLC', 'Limited Liability Company'),
        ('PARTNERSHIP', 'Partnership'),
        ('SOLE PROP.', 'Sole Proprietorship'),
        ('NON-PROFIT', 'Non-Profit Organization'),
        ('GOVERNMENT', 'Government Entity'),
    ]

    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE, related_name='businesses')

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entity_name = models.CharField(max_length=100)
    business_type = models.CharField(max_length=50, choices=BUSINESS_TYPE_CHOICES)
    ein = models.CharField(max_length=9)
    state_of_formation = models.CharField(max_length=50)
    date_of_formation = models.DateField()
    address_1 = models.CharField(max_length=100)
    address_2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    county = models.CharField(max_length=50)
    country = models.CharField(max_length=50)

    def __str__(self):
        return self.entity_name

class BeneficialOwnership(models.Model):
    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE, related_name='beneficial_ownerships')

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
    owner_individual = models.ForeignKey(Individual, on_delete=models.CASCADE, blank=True, null=True, related_name='beneficial_ownerships')
    owner_business = models.ForeignKey(Business, on_delete=models.CASCADE, blank=True, null=True, related_name='beneficial_ownerships')
    ownership_percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.owner_individual or self.owner_business}: {self.ownership_percentage}%"

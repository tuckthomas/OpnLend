from django.db import models
from django.core.validators import RegexValidator
from uuid import uuid4
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# Aggregates Business and Personal Accounts, per FDIC, NCUA, and SBA (size standard) regulations.
class GlobalRelationship(models.Model):
    Unique_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    Meta_ID = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.Meta_ID}"

    class Meta:
        db_table = 'Global_Relationship'

# Business Account Details
OC_EPC_CHOICES = [
    ("Operating Company", "Operating Company"),
    ("Eligible Passive Company", "Eligible Passive Company"),
    ("Other Related Entity", "Other Related Entity"),
]

class BusinessAccounts(models.Model):
    Unique_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    Global_Relationship_ID = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE, related_name='Business_Accounts')
    Business_Legal_Name = models.TextField(null=True)
    DBA_Name = models.TextField(null=True, blank=True)
    Entity_Type = models.TextField(null=True, blank=True)
    Tax_ID = models.CharField(max_length=20, null=True, blank=True)
    Domiciled_Locale = models.TextField(null=True, blank=True)
    Date_of_Formation = models.DateField(null=True, blank=True)
    Business_Entity_Report_Expiration_Date = models.DateField(null=True, blank=True)
    OC_EPC_Indication = models.CharField(
        max_length=30,
        choices=OC_EPC_CHOICES,
    )
    NAICS_Code_Description = models.TextField(null=True, blank=True)
    NAICS_Code_2022 = models.TextField(null=True, blank=True)
    DUNS_ID = models.TextField(null=True, blank=True)
    Website_URL = models.URLField(null=True, blank=True)
    Primary_Contact_Name = models.TextField(null=True, blank=True)
    Primary_Contact_Phone = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        null=True, blank=True
    )
    Primary_Contact_Email = models.EmailField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.Unique_ID:
            self.Unique_ID = f'B{str(uuid4())}'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.Business_Legal_Name

    class Meta:
        db_table = 'Business_Accounts'

# Placeholder PersonalAccount model
class PersonalAccounts(models.Model):
    Global_Relationship_ID = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE, related_name='Personal_Accounts')
    Unique_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    Unique_Jointly_Reported_ID = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='joint_account')
    # More fields to come....

    def save(self, *args, **kwargs):
        if not self.Unique_ID:
            self.Unique_ID = f'P{str(uuid4())}'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.Name

    class Meta:
        db_table = 'Personal_Accounts'

# Account Addresses model; can include both business and individual addresses
class AccountAddresses(models.Model):
    Unique_ID = models.UUIDField(default=uuid4, primary_key=True)
    Global_Relationship_ID = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE, related_name='addresses')
    Property_Type = models.TextField()
    Address_1 = models.TextField()
    Address_2 = models.TextField(blank=True, null=True)  # Optional field
    City = models.TextField()
    State = models.TextField()
    Zip = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.Address_1}, {self.City}, {self.State} - {self.Zip}"

    class Meta:
        db_table = 'Account_Addresses'

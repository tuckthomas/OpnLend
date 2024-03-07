from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator
from uuid import UUID, uuid4
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# Aggregates Business and Personal Accounts, per FDIC, NCUA, and SBA (size standard) regulations.
class GlobalRelationship(models.Model):
    Global_Relationship_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True)
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
    Global_Relationship_ID = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE, related_name='Business_Accounts', db_column='Global_Relationship_ID')
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
    Employees = models.TextField(null=True, blank=True)
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

# Personal Accounts Model
TAX_FILING_STATUS_CHOICES = [
    ('Single Filer', 'Single Filer'),
    ('Head of Household', 'Head of Household'),
    ('Jointly Reported', 'Jointly Reported'),
]

class JointAccount(models.Model):
    Jointly_Reported_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True, db_column='Jointly_Reported_ID')
    Accounts = models.ManyToManyField('PersonalAccounts', related_name='Joint_Accounts')

    def __str__(self):
        return f"Joint Account {self.Jointly_Reported_ID}"

    class Meta:
        db_table = 'Jointly_Reported_Personal_Accounts'

class PersonalAccounts(models.Model):
    Global_Relationship_ID = models.ForeignKey('GlobalRelationship', on_delete=models.CASCADE, related_name='Personal_Accounts', db_column='Global_Relationship_ID')
    Unique_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    Name_Prefix = models.CharField(max_length=10, blank=True)
    First_Name = models.CharField(max_length=100)
    Middle_Name_or_Initial = models.CharField(max_length=100, blank=True)
    Last_Name = models.CharField(max_length=100)
    Name_Suffix = models.CharField(max_length=10, blank=True)
    Social_Security_Number = models.CharField(max_length=11, blank=True)
    Date_of_Birth = models.DateField(blank=True)
    Tax_Filing_Status = models.CharField(max_length=20, blank=True, choices=TAX_FILING_STATUS_CHOICES)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.First_Name} {self.Last_Name}"

    class Meta:
        db_table = 'Personal_Accounts'

# Account Addresses model; can include both business and individual addresses
class AccountAddress(models.Model):
    Unique_Address_ID = models.UUIDField(default=uuid4, primary_key=True)
    Unique_ID = models.UUIDField(default=uuid4)
    Global_Relationship_ID = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE, related_name='Addresses', db_column='Global_Relationship_ID')
    Property_Type = models.TextField()
    Address_1 = models.TextField()
    Address_2 = models.TextField(blank=True, null=True)
    City = models.TextField()
    State = models.CharField(max_length=2, validators=[MinLengthValidator(2), MaxLengthValidator(2)])
    Zip = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.Address_1}, {self.Address_2}, {self.City}, {self.State} - {self.Zip}"

    class Meta:
        db_table = 'Account_Address'

# Acts as a 'bridge'; allowing it to link to either a BusinessAccount or PersonalAccount
class BusinessOwnership(models.Model):
    Beneficial_Ownership = models.ForeignKey('BeneficialOwnership', on_delete=models.CASCADE)
    ContentType = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    ObjectId = models.UUIDField()
    ContentObject = GenericForeignKey('ContentType', 'ObjectId')

    class Meta:
        db_table = 'Business_Ownership'

# Updated Beneficial Ownership Model
class BeneficialOwnership(models.Model):
    Beneficial_Ownership_ID = models.UUIDField(default=uuid4, primary_key=True)
    Global_Relationship = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE, related_name='Beneficial_Ownerships', db_column='Global_Relationship_ID')
    Account_Title = models.CharField(max_length=100, default="Other")
    Ownership_Percentage = models.DecimalField(max_digits=12, decimal_places=10)

    def __str__(self):
        return f"{self.Account_Title} - {self.Ownership_Percentage}%"

    class Meta:
        db_table = 'Beneficial_Ownership'

from django.db import models
from django.core.validators import RegexValidator
from uuid import uuid4
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# Aggregates Business and Personal Accounts, per FDIC, NCUA, and SBA (size standard) regulations.
class GlobalRelationship(models.Model):
    global_relationship_id = models.UUIDField(default=uuid4, editable=False)
    Meta_ID = models.TextField()
    ACCOUNT_TYPES = [
        ('business', 'Business'),
        ('personal', 'Personal'),
    ]
    Account_Type = models.CharField(max_length=10, choices=ACCOUNT_TYPES)

    def __str__(self):
        return f"{self.Meta_ID} ({self.Account_Type})"

# The AccountRelationship model adds a layer of abstraction that allows the application to flexibly and dynamically associate GlobalRelationship entities with various types of accounts. 
class AccountRelationship(models.Model):
    global_relationship = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE)

    # GenericForeignKey components
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    account = GenericForeignKey('content_type', 'object_id')

    class Meta:
        unique_together = ('global_relationship', 'content_type', 'object_id')

# Business Account Details
class BusinessAccount(models.Model):
    Unique_ID = models.UUIDField(default=uuid4, editable=False, unique=True)
    Business_Legal_Name = models.TextField()
    DBA_Name = models.TextField()
    Entity_Type = models.TextField()
    Tax_ID = models.BigIntegerField()
    Domiciled_Locale = models.TextField()
    Date_of_Formation = models.DateField()
    Business_Entity_Report_Expiration_Date = models.DateField()
    OC_EPC_Indication = models.BooleanField()
    NAICS_Code_Description = models.TextField()
    NAICS_Code_2022 = models.TextField()
    DUNS_ID = models.TextField()
    Website_URL = models.URLField()
    Primary_Contact_Name = models.TextField()
    Primary_Contact_Phone = models.CharField(
        max_length=15, 
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$', 
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )
    Primary_Contact_Email = models.EmailField()

    def __str__(self):
        return self.Business_Legal_Name

# Placeholder PersonalAccount model
class PersonalAccount(models.Model):
    Unique_ID = models.UUIDField(default=uuid4, editable=False, unique=True)
    # Placeholder fields (you can replace these with actual fields later)
    Name = models.TextField()
    # ... other personal account specific fields ...

    def __str__(self):
        return self.Name

# Account Addresses model; can include both business and individual addresses
class AccountAddresses(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    account = GenericForeignKey('content_type', 'object_id')

    Property_Type = models.TextField()
    Address_1 = models.TextField()
    Address_2 = models.TextField(blank=True, null=True)  # Optional field
    City = models.TextField()
    State = models.TextField()
    Zip = models.IntegerField()

    def __str__(self):
        return f"{self.Address_1}, {self.City}, {self.State} - {self.Zip}"

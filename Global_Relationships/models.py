from django.db import models, IntegrityError
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
    ('Joint Filer, Head of Household', 'Joint Filer, Head of Household'),
    ('Joint Filer, Jointly Reported', 'Joint Filer, Jointly Reported'),
]

# Forms a Joint Relationship for Personal Accounts; allowing for Personal Tax Returns, Personal Financial Statements
# and Deposits to be analyzed on a jointly reported basis.
class JointlyReported(models.Model):
    Jointly_Reported_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True, db_column='Jointly_Reported_ID')
    Max_Joint_Account_Limit = models.PositiveIntegerField(default=2)  # Change this to set the maximum limit of associated accounts

    def count_associated_accounts(self):
        return self.Personal_Accounts.count()

    def save(self, *args, **kwargs):
        # Check if the current count of associated accounts exceeds the maximum limit
        if self.count_associated_accounts() > self.Max_Joint_Account_Limit:
            raise ValueError("Maximum limit (2) of associated accounts exceeded.")
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Jointly_Reported_Personal_Accounts'

class PersonalAccounts(models.Model):
    Global_Relationship_ID = models.ForeignKey('GlobalRelationship', on_delete=models.CASCADE, related_name='Personal_Accounts', db_column='Global_Relationship_ID')
    Jointly_Reported_ID = models.ForeignKey('JointlyReported', null=True, blank=True, on_delete=models.CASCADE, related_name='Personal_Accounts', db_column='Jointly_Reported_ID')
    Unique_ID = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    Name_Prefix = models.CharField(max_length=10, blank=True, null=True)
    First_Name = models.CharField(max_length=100)
    Middle_Name = models.CharField(max_length=100, blank=True, null=True)
    Last_Name = models.CharField(max_length=100)
    Name_Suffix = models.CharField(max_length=10, blank=True, null=True)
    Social_Security_Number = models.CharField(max_length=11, blank=True, null=True)
    Date_of_Birth = models.DateField(blank=True, null=True)
    Tax_Filing_Status = models.CharField(max_length=30, blank=True, null=True, choices=TAX_FILING_STATUS_CHOICES)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.First_Name} {self.Last_Name}"

    class Meta:
        db_table = 'Personal_Accounts'

# Account Addresses model; can include both business and individual addresses
class AccountAddress(models.Model):
    Unique_Address_ID = models.UUIDField(default=uuid4, primary_key=True, editable=False)
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
        constraints = [
            models.UniqueConstraint(fields=['Address_1', 'Address_2', 'City', 'State', 'Zip'], name='Unique_Address')
        ]

# This model acts as a "through" table in a many-to-many relationship;
# allowing for both business and personal accounts to be assigned to the same Unique_Address_ID
class AccountAddressLink(models.Model):
    Unique_Address_ID = models.ForeignKey(AccountAddress, on_delete=models.CASCADE, db_column='Unique_Address_ID')
    Global_Relationship_ID = models.ForeignKey(GlobalRelationship, on_delete=models.CASCADE, db_column='Global_Relationship_ID')
    Unique_ID = models.UUIDField()  # This can be the ID of either a Personal or Business account

    class Meta:
        db_table = 'Global_Account_Addresses'
        unique_together = ('Unique_Address_ID', 'Global_Relationship_ID', 'Unique_ID')

# Business_Account: A ForeignKey linking to the BusinessAccounts model, identifying the business account that has beneficial owners.
# Owner_Account_Unique_ID: Stores the Unique_ID of any account (personal or business) that owns a stake in the Business_Account.
#                          This field will allow linking to both PersonalAccounts and BusinessAccounts based on their Unique_ID.
# Ownership_Percentage and Account_Title: Capture the specifics of the ownership stake.
# Custom Validation: The clean method is overridden to ensure that the business account
#                    identified by Business_Account cannot have an ownership entry where it is its own owner.
# It allows any business or personal account within the entire database to be assigned as a beneficial owner; regardless of Global Relationship
class GlobalBeneficialOwnership(models.Model):
    Global_Beneficial_Ownership_ID = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    Business_Account = models.ForeignKey(
        BusinessAccounts,
        on_delete=models.CASCADE,
        related_name='BeneficialOwnership'
    )
    Unique_ID = models.UUIDField() # Can be Unique_ID of BusinessAccount or PersonalAccount
    Ownership_Percentage = models.DecimalField(max_digits=23, decimal_places=20)
    Account_Title = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'Global_Beneficial_Ownership'
        constraints = [
            models.UniqueConstraint(fields=['Business_Account', 'Unique_ID'], name='Unique_Ownership_per_Account')
        ]

    def clean(self):
        # Custom validation to ensure the owner is not the business itself
        if self.Business_Account.Unique_ID == self.Unique_ID:
            raise ValidationError("A business account cannot own itself.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

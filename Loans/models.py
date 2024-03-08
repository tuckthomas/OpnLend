# I have only included the SBALoanDataTable, and its subsequent views.py function seen within the Dashboard app,
# to have loan data to display in a mock dashboard. When time allows, I may try building a function that produces
# fake business and personal accounts. Including, aggregation of accounts, loans, collateral, and deposits.

from django.db import models

# Tracks Dates of SBA CSV Files and Most Recent Query Performed; Effectively Limiting the Amount of Queries to SBA Website
class SBALoanDataUpdateLog(models.Model):
    last_query_date = models.DateField(auto_now_add=True)
    file_date_7a_2010_2019 = models.DateField(null=True)
    file_date_7a_2020_present = models.DateField(null=True)
    file_date_504 = models.DateField(null=True)
    last_successful_update = models.DateField(null=True)

    class Meta:
        db_table = 'SBALoans_Update_Log'

class SBALoanDataTable(models.Model):
    UniqueLoanID = models.CharField(max_length=255, null=False, primary_key=True)
    AsOfDate = models.DateField(null=True)
    Program = models.CharField(max_length=255, null=True)
    BorrName = models.CharField(max_length=255, null=True)
    BorrStreet = models.CharField(max_length=255, null=True)
    BorrCity = models.CharField(max_length=255, null=True)
    BorrState = models.CharField(max_length=2, null=True)
    BorrZip = models.CharField(max_length=10, null=True)
    InstitutionName = models.CharField(max_length=255, null=True)
    InstitutionStreet = models.CharField(max_length=255, null=True)
    InstitutionCity = models.CharField(max_length=255, null=True)
    InstitutionState = models.CharField(max_length=2, null=True)
    InstitutionZip = models.CharField(max_length=10, null=True)
    GrossApproval = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    GuaranteedApproval = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    ApprovalDate = models.DateField(null=True)
    ApprovalFiscalYear = models.IntegerField(null=True)
    FirstDisbursementDate = models.DateField(null=True)
    DeliveryMethod = models.CharField(max_length=255, null=True)
    subpgmdesc = models.CharField(max_length=255, null=True)
    InitialInterestRate = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    TermInMonths = models.IntegerField(null=True)
    NaicsCode = models.CharField(max_length=10, null=True)
    NaicsDescription = models.TextField(null=True)
    FranchiseCode = models.CharField(max_length=10, null=True)
    FranchiseName = models.CharField(max_length=255, null=True)
    ProjectCounty = models.CharField(max_length=255, null=True)
    ProjectState = models.CharField(max_length=2, null=True)
    SBADistrictOffice = models.CharField(max_length=255, null=True)
    CongressionalDistrict = models.CharField(max_length=10, null=True)
    BusinessType = models.CharField(max_length=255, null=True)
    BusinessAge = models.CharField(max_length=255, null=True)
    LoanStatus = models.CharField(max_length=255, null=True)
    PaidInFullDate = models.DateField(null=True)
    ChargeOffDate = models.DateField(null=True)
    GrossChargeOffAmount = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    RevolverStatus = models.CharField(max_length=255, null=True)
    JobsSupported = models.IntegerField(null=True)
    SOLDSECMRTIND = models.CharField(max_length=255, null=True)
    InstitutionID = models.CharField(max_length=255, null=True)
    InstitutionType = models.CharField(max_length=255, null=True)
    CDC_Name = models.CharField(max_length=255, null=True)
    CDC_Street = models.CharField(max_length=255, null=True)
    CDC_City = models.CharField(max_length=255, null=True)
    CDC_State = models.CharField(max_length=2, null=True)
    CDC_Zip = models.CharField(max_length=10, null=True)
    ThirdPartyDollars_504 = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    UniqueInstitutionID = models.CharField(max_length=255, null=True)

    class Meta:
        db_table = 'SBALoans'

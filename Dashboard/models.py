from django.db import models

class SBALoanData(models.Model):
    # Full list of U.S. states and territories
    STATE_CHOICES = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AS': 'American Samoa', 'AZ': 'Arizona', 
        'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 
        'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 
        'GU': 'Guam', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 
        'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 
        'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 
        'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 
        'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 
        'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'MP': 'Northern Mariana Islands', 
        'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'PR': 'Puerto Rico', 
        'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 
        'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VI': 'U.S. Virgin Islands', 'VA': 'Virginia', 
        'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
        'UM': 'U.S. Minor Outlying Islands', 'FM': 'Federated States of Micronesia', 'MH': 'Marshall Islands', 'PW': 'Palau'
    }

    uniqueloanid = models.CharField(max_length=255)
    institutionname = models.CharField(max_length=255)
    uniqueinstitutionid = models.CharField(max_length=255)
    projectstate = models.CharField(max_length=2, choices=STATE_CHOICES.items())
    projectcounty = models.CharField(max_length=100)
    grossapproval = models.DecimalField(max_digits=500, decimal_places=2)

    class Meta:
        db_table = 'sbaloandata'

    def __str__(self):
        return self.institutionname

    def get_full_state_name(self):
        """ Returns the full name of the state for the stored state code. """
        return self.STATE_CHOICES.get(self.projectstate.upper(), 'Unknown State')

    @staticmethod
    def get_state_code(state_name):
        """ 
        Reverse lookup to get the state code based on the state name. 
        Returns the state code or None if not found.
        """
        for code, name in SBALoanData.STATE_CHOICES.items():
            if name == state_name:
                return code
        return None
        
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
    RevolverStatus = models.BooleanField(null=True)
    JobsSupported = models.IntegerField(null=True)
    SOLDSECMRTIND = models.BooleanField(null=True)
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

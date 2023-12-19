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

from django.db import models
from users.models import User
from relationships.models import Business
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.db.models import F
from spreading.models import GlobalStatement
from datetime import timedelta

class CustomField(models.Model):
    FIELD_TYPES = (
        ('revenue', 'Revenue'),
        ('cogs', 'Cost of Goods Sold'),
        ('opex', 'Operating Expenses'),
        ('other_income', 'Other Income'),
        ('other_expenses', 'Other Expenses'),
    )

class FieldValue(models.Model):
    income_statement = models.ForeignKey('IncomeStatement', on_delete=models.CASCADE)
    custom_field = models.ForeignKey('CustomField', on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return f"{self.custom_field.name}: {self.value}"

class NegativeDecimalField(models.DecimalField):
    def get_prep_value(self, value):
        return super().get_prep_value(-abs(value))

class IncomeStatement(models.Model):
    # The below global ID will populate with the primary key that was generated by the Spreading app's model. This same key will be assigned to all other spreading related apps for a given period; allowing for globally associating all financial statements in the event there are two instances of statements spread containing the same date and financial statement type (very rarely would this ever happen, but could with company prepred statements).
    global_statement = models.ForeignKey(GlobalStatement, on_delete=models.CASCADE, related_name='income_statements')

    ### Financial statement quality choices that are to be chosen from a drop-down menu.
    FINANCIAL_STATEMENT_QUALITY_CHOICES = [
        ('PR', 'Projections'),
        ('CP', 'Company Prepared'),
        ('TR', 'Tax Returns'),
        ('CRQ', 'CPA Reviewed - Qualified'),
        ('CRU', 'CPA Reviewed - Unqualified'),
        ('CAQ', 'CPA Audited - Qualified'),
        ('CAU', 'CPA Audited - Unqualified'),
        ('OTH', 'Other'),
    ]

    ### Establishes the Account User entering data, which to be posted to the database.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    ### Establishes relevant information for a given financial period that is to be spread.
    business_name = models.ForeignKey(Business, on_delete=models.CASCADE) # Populates the business name from the Business class defined within the Relationships' models.py file


    legal_entity_fiscal_year_end = models.DateField(null=False, blank=False,)

    ### Other relevant information for a given financial period that is to be spread.
    period_ending_date = models.DateField(null=False, blank=False)
    financial_statement_quality = models.CharField(max_length=3, choices=FINANCIAL_STATEMENT_QUALITY_CHOICES)

    # The amount of months in period will be utilized in other model classes to normalize data
    # (i.e., annualize an interim period, adjusts annual debt service obligations for the amount of months in period)
    months_in_period = models.IntegerField()



    ### Revenue (subtotal)
    revenue_subtotal = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    

    #
    # Revenue Subtotal Fields (Cascade)
    revenue_generic = models.DecimalField(max_digits=20, decimal_places=2)
    #
    returns_and_allowances = NegativeDecimalField(max_digits=20, decimal_places=2) # NegativeDecimalField is used to require any data entered to be a negative amount.
    ### Net Revenue Field
    net_revenue = models.DecimalField(max_digits=20, decimal_places=2) # = Revenue Subtotal + Returns and Allowances (-)


    #
    ### Cost of Goods Sold (subtotal)
    cogs_subtotal = models.DecimalField(max_digits=20, decimal_places=2)


    # Cost of Goods Sold Subtotal Fields (Cascade)
    cost_of_goods_sold_generic = NegativeDecimalField(max_digits=20, decimal_places=2)
    cost_of_goods_sold_depreciation = NegativeDecimalField(max_digits=20, decimal_places=2)
    #
    ### Total Gross Profit (Loss)
    total_gross_profit = models.DecimalField(max_digits=20, decimal_places=2)

    ######################################

    ### Operating Expenses, Structured in Order Refelctive of IRS Form 1065 (Corporate Tax Return for Partnership Income)
    salaries_and_wages = models.DecimalField(max_digits=20, decimal_places=2)
    officers_compensation = models.DecimalField(max_digits=20, decimal_places=2)
    repairs_and_maintenance = models.DecimalField(max_digits=20, decimal_places=2)
    bad_debt = models.DecimalField(max_digits=20, decimal_places=2)
    # Rent and Lease Expenses (subtotal)
    rent_lease_expenses_subtotal = models.DecimalField(max_digits=20, decimal_places=2)

    #
    # Rent and Lease Expenses Subtotal Fields (Cascade)
    real_estate_rent = models.DecimalField(max_digits=20, decimal_places=2) # Cash flow add back if paid to affiliated real estate holding company or if being considered for refinance via the proposed debt obligation(s)
    operating_leases = models.DecimalField(max_digits=20, decimal_places=2) # Cash flow add back if equipment leased is to be refinanced via the proposed debt obligation(s)
    rent_and_lease_expense_udf1 = models.DecimalField(max_digits=20, decimal_places=2)
    #
    # Taxes and Licenses (subtotal)
    taxes_and_licenses_subtotal = models.DecimalField(max_digits=20, decimal_places=2)

    #
    # Taxes and Licenses (Cascade)
    real_estate_taxes = models.DecimalField(max_digits=20, decimal_places=2)
    payroll_taxes = models.DecimalField(max_digits=20, decimal_places=2)
    other_taxes_and_licenses = models.DecimalField(max_digits=20, decimal_places=2)
    #
    depreciation_and_depletion = models.DecimalField(max_digits=20, decimal_places=2) # Cash Flow Add Back
    amortization = models.DecimalField(max_digits=20, decimal_places=2) # Cash Flow Add Back
    legal_and_professional_expenses = models.DecimalField(max_digits=20, decimal_places=2)
    employee_benefit_programs = models.DecimalField(max_digits=20, decimal_places=2)
    advertising = models.DecimalField(max_digits=20, decimal_places=2)
    #
    ## Other Operating Expenses (subtotal)
    other_operating_expenses_subtotal = models.DecimalField(max_digits=20, decimal_places=2)
    #
    ### Total Operating Expenses
    total_operating_expenses = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)

    # Net Operating Income; = Gross Profit - Total Operating Expenses
    net_operating_income = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)

    ###########################################

    ## Other Income and Expenses (subtotal) # Other Income and Expenses Subtotal Field
    total_other_income_and_expenses = models.DecimalField(max_digits=20, decimal_places=2)

    # Other Income and Expenses (Cascade)
    gain_on_sale_of_asset = models.DecimalField(max_digits=20, decimal_places=2)
    loss_on_sale_of_asset = NegativeDecimalField(max_digits=20, decimal_places=2)
    interest_income = models.DecimalField(max_digits=20, decimal_places=2)
    interest_expense = NegativeDecimalField(max_digits=20, decimal_places=2) # Cash Flow Add Back using the absolute value of this field due to it being entered as a negative value.
    #
    ## Other Income and Expenses (subtotal)
    other_income_and_expenses_subtotal = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)

    #
    # Other Income and Expenses (Cascade)
    other_income_or_expense_generic = models.DecimalField(max_digits=20, decimal_places=2)
    #
    ### Net Profit (Loss); Pre-Tax
    net_profit_loss = models.DecimalField(max_digits=20, decimal_places=2)

    ###################################

    # C-Corporation Taxes
    c_corporate_taxes_subtotal = models.DecimalField(max_digits=20, decimal_places=2) # C-Corporate Taxes Subtotal Field
    # C-Corporation Taxes (Cascade)
    c_corporation_taxes = NegativeDecimalField(max_digits=20, decimal_places=2) # Cash flow add back (absolute value) for EBIT, EBITDA, and EBITDAR
    c_corporation_tax_refund = models.DecimalField(max_digits=20, decimal_places=2) # Cash flow Reduction back for EBIT, EBITDA, and EBITDAR
    #
    ### Net Profit (Loss)
    net_profit_loss_after_taxes = models.DecimalField(max_digits=20, decimal_places=2)
    distributions_to_shareholders = NegativeDecimalField(max_digits=20, decimal_places=2) # Entered as a negative value
    
    @property
    def months_in_period(self):
        if self.period_ending_date and self.legal_entity_fiscal_year_end:
            fy_end_month = self.legal_entity_fiscal_year_end.month
            period_end_month = self.period_ending_date.month

            if fy_end_month == 12:
                return period_end_month
            elif period_end_month > fy_end_month:
                return period_end_month - fy_end_month
            else:
                return (12 - fy_end_month) + period_end_month
        else:
            return None

    # Helper function to calculate the sum of custom field values for a given field type.
    def get_custom_field_sum(self, field_type):
    return sum(field_value.value for field_value in self.custom_fields.filter(custom_field__field_type=field_type))
    
    @property
    def custom_fields(self):
        return FieldValue.objects.filter(income_statement=self)
    
    def get_custom_field_sum(self, field_type):
        return self.custom_fields.filter(custom_field__field_type=field_type).aggregate(Sum('value'))['value__sum'] or 0

    @property
    def revenue_subtotal(self):
        result = self.revenue_generic + self.get_custom_field_sum('revenue')
        return result

    @property
    def net_revenue(self):
        result = self.revenue_subtotal - self.returns_and_allowances
        return result

    @property
    def cost_of_goods_sold_subtotal(self):
        result = self.cost_of_goods_sold_generic + self.cost_of_goods_sold_depreciation + self.get_custom_field_sum('cogs')
        return result

    @property
    def total_gross_profit(self):
        result = self.net_revenue - self.cost_of_goods_sold_subtotal
        return result

    @property
    def rent_and_lease_expenses_subtotal(self):
        result = self.real_estate_rent + self.operating_leases + self.get_custom_field_sum('opex')
        return result

    @property
    def taxes_licenses_and_insurance_subtotal(self):
        result = self.real_estate_taxes + self.payroll_taxes + self.other_taxes_and_licenses + self.get_custom_field_sum('opex')
        return result

    @property
    def other_operating_expenses_subtotal(self):
        result = self.get_custom_field_sum('opex')
        return result

    @property
    def total_operating_expenses(self):
        result = (
            self.salaries_and_wages + self.officers_compensation + self.repairs_and_maintenance + self.bad_debt +
            self.rent_and_lease_expenses_subtotal + self.taxes_licenses_and_insurance_subtotal +
            self.depreciation_and_depletion + self.amortization + self.legal_and_professional_expenses +
            self.employee_benefit_programs + self.advertising + self.other_operating_expenses_subtotal
        )
        return result

    @property
    def net_operating_income(self):
        result = self.total_gross_profit - self.total_operating_expenses
        return result

    @property
    def total_other_income_and_expenses(self):
        result = (self.gain_on_sale_of_asset + self.loss_on_sale_of_asset + self.interest_income + self.get_custom_field_sum('other_income') - self.get_custom_field_sum('other_expenses'))
        return result

    @property
    def other_income_or_expenses_subtotal(self):
        result = self.other_income_or_expense_general + self.get_custom_field_sum('other_income') - self.get_custom_field_sum('other_expenses')
        return result

    @property
    def net_profit_loss(self):
        result = self.net_operating_income + self.total_other_income_and_expenses
        return result

    @property
    def net_profit_loss_after_taxes(self):
        result = self.net_profit_loss + self.c_corporate_taxes_subtotal
        return result

    @property
    def retained_earnings(self):
        result = self.net_profit_loss_after_taxes + self.distributions_to_shareholders
        return result

    @property
    def __str__(self):
        result = f"Income Statement of user {self.user} for business {self.business.entity_name}"
        return result
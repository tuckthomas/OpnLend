from django.db import models
from users.models import User
from relationships.models import Business
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.db.models import F
from spreading.models import GlobalStatement
from datetime import timedelta
from income_statement.models import IncomeStatement


# Custom model for fields that the Balance Sheet model requires to
# be reflected as negative values. This approach will keep the
# conversion logic within the model iteself. Those field within
# the BalanceSheet model will then reference the NegativeDecimalField.
# Please note that the conversion to a negative value will not
# automatically be reflected in the form until saved, unless
# client-side JavaScript code is included to handle this
# negative conversion in real-time.
class NegativeDecimalField(models.DecimalField):
    def to_python(self, value):
        value = super(NegativeDecimalField, self).to_python(value)
        if value is not None and value > 0:
            value = -value
        return value

# Balance Sheet model.
class BalanceSheet(models.Model):
    # Foreign Key from associated Income Statement model.
    income_statement = models.ForeignKey('IncomeStatement', on_delete=models.SET_NULL, null=True, blank=True)
    # Global Statement ID for Financial Statement Set
    global_statement = models.ForeignKey(GlobalStatement, on_delete=models.CASCADE, related_name='income_statements')
    period_ending_date = models.DateField(null=True, blank=True)
    
    # Business Name
    business_name = models.ForeignKey(Business, on_delete=models.CASCADE)
    uuid = models.UUIDField(primary_key=True, unique=True)

    # Asset fields
    
    # Current Assets
    # Cash (subtotal)
    cash_subtotal = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Cash Accounts (cascade)
    cash_at_financial_institution = models.DecimalField(max_digits=15, decimal_places=2)
    cash_at_other_financial_institution = models.DecimalField(max_digits=15, decimal_places=2)
    unclassified_cash_account = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Accounts Receivable (net)
    accounts_receivable_net = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Accounts Receivable (cascade)
    accounts_receivable = models.DecimalField(max_digits=15, decimal_places=2)
    bad_debt_allowance = NegativeDecimalField(max_digits=15, decimal_places=2)

    # Inventory (subtotal)
    inventory_subtotal = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Inventory (cascade)
    inventory_generic = models.DecimalField(max_digits=15, decimal_places=2)
    raw_material = models.DecimalField(max_digits=15, decimal_places=2)
    work_in_progress = models.DecimalField(max_digits=15, decimal_places=2)
    finished_goods = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Other Current Assets
    prepaid_expenses_generic = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Current Assets (subtotal)
    other_current_assets_subtotal = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Other Current Assets (cascade)
    other_current_assets_generic = models.DecimalField(max_digits=15, decimal_places=2)
    other_current_assets_udf1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    other_current_assets_udf2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    other_current_assets_udf3 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Total Current Assets
    total_current_assets = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # Gross Plant and Equipment (subtotal) (excludes land)
    gross_plant_and_equipment = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Gross Plant and Equipment (cascade)
    machinery_and_equipment = models.DecimalField(max_digits=15, decimal_places=2)
    computers_and_office_equipment = models.DecimalField(max_digits=15, decimal_places=2)
    furniture_and_fixtures = models.DecimalField(max_digits=15, decimal_places=2)
    leasehold_improvements = models.DecimalField(max_digits=15, decimal_places=2)
    construction_in_progress = models.DecimalField(max_digits=15, decimal_places=2)
    building = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Gross Plant and Equipment (subtotal)
    other_gross_plant_and_equipment_subtotal = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Other Gross Plant and Equipment (cascade)
    other_gross_plant_and_equipment_generic = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    other_gross_plant_and_equipment_udf1 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    other_gross_plant_and_equipment_udf2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    other_gross_plant_and_equipment_udf3 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Accumulated Depreciation
    accumulated_depreciation = NegativeDecimalField(max_digits=15, decimal_places=2)
    # Net Plan and Equipemnt (excludes land); = Gross Plan and Equipment (subtotal) + Accumulated Depreciation (summed due to accumualted depreciation required to be entered as a negative amount)
    net_plant_and_equipment = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Land; listed separately to more easily differentiate non-depreciable assets
    land = models.DecimalField(max_digits=15, decimal_places=2)
    # Net Fixed Assets
    net_fixed_assets = models.DecimalField(max_digits=15, decimal_places=2)

    # Gross Intangible Assets
    goodwill = models.DecimalField(max_digits=15, decimal_places=2)
    trademarks_and_licenses = models.DecimalField(max_digits=15, decimal_places=2)
    financing_costs = models.DecimalField(max_digits=15, decimal_places=2)
    other_intangible_assets_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_intangible_assets_udf2 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    other_intangible_assets_udf3 = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Accumulated Amortization
    accumulated_amortization = NegativeDecimalField(max_digits=15, decimal_places=2)
    # Net Intangible Assets
    net_intangible_assets = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    # Other Long Term Assets
    due_from_related_parties_generic = models.DecimalField(max_digits=15, decimal_places=2)
    due_from_shareholders_generic = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Long Term Assets (subtotal)
    other_long_term_assets_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Long Term Assets (cascade)
    other_long_term_assets_generic = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_assets_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_assets_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_assets_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_assets_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    # Total Long Term Assets
    total_long_term_assets = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    # Total Assets; = Total Current Assets + Total Long Term Assets
    total_assets = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # Liability Fields
    
    # Current Liabilities
    # Accounts Payable (subtotal)
    accounts_payable_subtotal = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    # Accounts Payable (cascade)
    trade_accounts_payable = models.DecimalField(max_digits=15, decimal_places=2)
    other_accounts_payable = models.DecimalField(max_digits=15, decimal_places=2)
    # Current Portion of Long Term Debt (subtotal)
    current_portion_of_long_term_debt_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Current Portion of Long Term Debt (cascade)
    current_portion_of_long_term_debt_generic = models.DecimalField(max_digits=15, decimal_places=2)
    current_portion_of_long_term_debt_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    current_portion_of_long_term_debt_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    current_portion_of_long_term_debt_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Short-Term Revolving Lines; Note: This is separated out to allow for easier exclusion of short-term notes payble from debt service coverage analysis, as occasionally accountants will sum current portion of long term debts (principal and interest payments) with revolving lines (interest only payments)
    # Revolving Lines (subtotal)
    revolving_lines_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Revolving Lines (cascade)
    revolving_lines_generic = models.DecimalField(max_digits=15, decimal_places=2)
    credit_cards_payable = models.DecimalField(max_digits=15, decimal_places=2)
    revolving_lines_of_credit_generic = models.DecimalField(max_digits=15, decimal_places=2)
    other_revolving_line_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_revolving_line_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    other_revolving_line_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    other_revolving_line_udf4 = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Accruals; seperated for clearer distinction in UCA Cash Flow Analysis
    # Accruals (subtotal)
    accruals_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Accruals (cascade)
    other_accruals_generic = models.DecimalField(max_digits=15, decimal_places=2)
    other_accruals_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_accruals_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    other_accruals_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Other Current Liabilities
    taxes_payable = models.DecimalField(max_digits=15, decimal_places=2)
    customer_advances = models.DecimalField(max_digits=15, decimal_places=2)
    payroll_liabilities = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Current Liabilities (subtotal)
    other_current_liabilities_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Current Liabilities (cascade)
    other_current_liabilities_generic = models.DecimalField(max_digits=15, decimal_places=2)
    other_current_liabilities_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_current_liabilities_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    other_current_liabilities_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Total Current Liabilities; = Accounts Payable (subtotal) + Current Portion of Long Term Debt (subtotal) +
    # Revolving Lines (subtotal) + Accruals (subtotal) + Taxes Payable + Customer Advances +
    # Payroll Liabilities + Other Current Liabilities (subtotal)
    total_current_liabilities = models.DecimalField(max_digits=15, decimal_places=2)

    # Long Term Liabilities
    # Long-Term Debt to be Refinanced; Note: This is seperated out for clearer distinction for SBA loan requests due to the SBA requiring debts being refinanced by an SBA loan be itemized on the balance sheet.
    # Refinanced Debt (subtotal)
    refinanced_long_term_debt_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Refinanced Debt (cascade); Note: I've created additoinal user defined fields here to
    # allow for SBA refinancing scenarios involving various acconts. I've personally seen
    # such scenarios where numerous business credit card (and personal cards used for business purposes),
    # along with other debts, approach the amount of user defined fields below.
    refianced_long_term_debt_generic = models.DecimalField(max_digits=15, decimal_places=2)
    refianced_long_term_debt_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    refianced_long_term_debt_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    refianced_long_term_debt_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    refianced_long_term_debt_udf4 = models.DecimalField(max_digits=15, decimal_places=2)
    refianced_long_term_debt_udf5 = models.DecimalField(max_digits=15, decimal_places=2)
    refianced_long_term_debt_udf6 = models.DecimalField(max_digits=15, decimal_places=2)
    refianced_long_term_debt_udf7 = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Long Term Notes Payable (other) (subtotal)
    long_term_notes_payable_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Long Term Notes Payable (other) (cascade)
    long_term_notes_payable_generic = models.DecimalField(max_digits=15, decimal_places=2)
    long_term_notes_payable_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    long_term_notes_payable_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    long_term_notes_payable_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    long_term_notes_payable_udf4 = models.DecimalField(max_digits=15, decimal_places=2)
    # Total Notes Payable; = Refinanced Long-Term Debt Subtotal + Long-Term Notes Payable Subtotal
    total_notes_payable = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Other Long Term Debt
    # Due to Others (subtotal)
    due_to_others_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Due to Others (cascade)
    due_to_related_parties_generic = models.DecimalField(max_digits=15, decimal_places=2)
    due_to_related_parties_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    due_to_related_parties_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    due_to_related_parties_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    # Due to Shareholders (subtotal)
    due_to_shareholders_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Due to Shareholders (cascade)
    due_to_shareholders_generic = models.DecimalField(max_digits=15, decimal_places=2)
    due_to_shareholders_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    due_to_shareholders_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    due_to_shareholders_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Long Term Debt (subtotal)
    other_long_term_liabilities_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Long Term Debt (cascade)
    other_long_term_liabilities_generic = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_liabilities_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_liabilities_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_liabilities_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    other_long_term_liabilities_udf4 = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Shareholders' Equity Fields
    paid_in_capital = models.DecimalField(max_digits=15, decimal_places=2)
    beginning_retained_earnings = models.DecimalField(max_digits=15, decimal_places=2)
    # Current Period Retained Earnings; Note: If data has been entered into the associated Income Statement,
    # this field will auto-populate with that statements calculated 'Current Period Retained Earnings',
    # which is equal to Net Profit (Loss) After Taxes, less Distributions to Shareholders
    current_period_retained_earnings = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Equity (subtotal)
    other_equity_subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    # Other Equity (cascade)
    other_equity_generic = models.DecimalField(max_digits=15, decimal_places=2)
    other_equity_udf1 = models.DecimalField(max_digits=15, decimal_places=2)
    other_equity_udf2 = models.DecimalField(max_digits=15, decimal_places=2)
    other_equity_udf3 = models.DecimalField(max_digits=15, decimal_places=2)
    other_equity_udf4 = models.DecimalField(max_digits=15, decimal_places=2)
    # Total Shareholde's Equity
    total_shareholders_equity = models.DecimalField(max_digits=15, decimal_places=2)
    # Total Shareholder's Equity and Liabilities
    total_shareholders_equity_and_total_liabilities = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Current Unbalanced Amount; Note: This is to be a dynamically updated field (requires javascript) that will continue to report any unbalanced amount to assist in reconciliation.
    unbalanced_amount = models.DecimalField(max_digits=15, decimal_places=2)
    # Note: At a later date, I'd like to add in some custom logic based on the offage amount.
    # For example, if the offage is a significant percentage (say, +- 30%) of total assets,
    # a "Helpful Hint" may suggest a "slide error". Or, if the offage is within a small percentage
    # of an single account type, it may suggest to review that account.
    
    # Auto-populates the Current Period Retained Earnings if data has been entered into the associated Income Statement. Otherwise, defaults to $0.
       
    def save(self, *args, **kwargs):
        # Auto-populate current_period_retained_earnings and period_ending_date from related IncomeStatement, if it exists
        if self.income_statement:
            self.current_period_retained_earnings = self.income_statement.current_period_retained_earnings
            self.period_ending_date = self.income_statement.period_ending_date
        else:
            self.current_period_retained_earnings = 0
            self.period_ending_date = None

        # Auto-populate beginning_retained_earnings from the previous BalanceSheet, if it exists
        if self.income_statement:
            prev_balance_sheet = BalanceSheet.objects.filter(
                income_statement__global_statement_id=self.global_statement_id,
                income_statement__period_ending_date__lt=self.income_statement.period_ending_date
            ).order_by('-income_statement__period_ending_date').first()

            if prev_balance_sheet:
                self.beginning_retained_earnings = prev_balance_sheet.current_period_retained_earnings
            else:
                self.beginning_retained_earnings = 0

        super().save(*args, **kwargs)
    
    # Total and Sub-Total Fields definitions for those specific accounts above.
    # Subtotal and Total property fields

    @property
    def cash_subtotal(self):
        return self.cash_at_financial_institution + self.cash_at_other_financial_institution + self.unclassified_cash_account

    @property
    def accounts_receivable_net(self):
        return self.accounts_receivable + self.bad_debt_allowance

    @property
    def inventory_subtotal(self):
        return self.inventory_generic + self.raw_material + self.work_in_progress + self.finished_goods

    @property
    def total_current_assets(self):
        return self.cash_subtotal + self.accounts_receivable_net + self.inventory_subtotal + self.prepaid_expenses_generic + other_current_assets_subtotal

    @property
    def other_gross_plant_and_equipment_subtotal(self):
        return self.other_gross_plant_and_equipment_generic + self.other_gross_plant_and_equipment_udf1 + self.other_gross_plant_and_equipment_udf2 + self.other_gross_plant_and_equipment_udf3
    
    @property
    def gross_plant_and_equipment(self):
        return self.gross_fixed_assets_generic + self.machinery_and_equipment + self.computers_and_office_equipment + self.furniture_and_fixtures + self.leasehold_improvements + self.construction_in_progress + self.building + self.other_gross_plant_and_equipment_subtotal

    @property
    def net_plant_and_equipment(self):
        return self.gross_plant_and_equipment + self.accumulated_depreciation
    
    @property
    def net_fixed_assets(self):
        return self.net_plant_and_equipment + self.land

    @property
    def net_intangible_assets(self):
        return self.goodwill + self.trademarks_and_licenses + self.financing_costs + self.other_intangible_assets_udf1 + self.other_intangible_assets_udf2 + self.other_intangible_assets_udf3 + self.accumulated_amortization

    @property
    def other_long_term_assets_subtotal(self):
        return self.other_long_term_assets_generic + self.other_long_term_assets_udf1 + self.other_long_term_assets_udf1 + self.other_long_term_assets_udf1 + self.other_long_term_assets_udf1

    @property
    def total_long_term_assets(self):
        return self.net_fixed_assets + self.land + self.net_intangible_assets + self.other_long_term_assets_subtotal

    @property
    def total_assets(self):
        return self.total_current_assets + self.total_long_term_assets

    @property
    def accounts_payable_subtotal(self):
        return self.trade_accounts_payable + self.other_accounts_payable

    @property
    def current_portion_of_long_term_debt_subtotal(self):
        return self.current_portion_of_long_term_debt_generic + self.current_portion_of_long_term_debt_udf1 + self.current_portion_of_long_term_debt_udf2 + self.current_portion_of_long_term_debt_udf3

    @property
    def revolving_lines_subtotal(self):
        return self.revolving_lines_generic + self.credit_cards_payable + self.other_revolving_line_udf1 + self.other_revolving_line_udf2 + self.other_revolving_line_udf3 + self.other_revolving_line_udf4 + self.other_revolving_line_udf5

    @property
    def accruals_subtotal(self):
        return self.other_accruals_generic + self.other_accruals_udf1 + self.other_accruals_udf2 + self.other_accruals_udf3

    @property
    def other_current_liabilities_subtotal(self):
        return self.other_current_liabilities_generic + self.other_current_liabilities_udf1 + self

    @property
    def other_current_liabilities_subtotal(self):
        return self.other_current_liabilities_generic + self.other_current_liabilities_udf1 + self.other_current_liabilities_udf2 + self.other_current_liabilities_udf3

    @property
    def total_current_liabilities(self):
        return self.accounts_payable_subtotal + self.current_portion_of_long_term_debt_subtotal + self.revolving_lines_subtotal + self.accruals_subtotal + self.taxes_payable + self.customer_advances + self.payroll_liabilities + self.other_current_liabilities_subtotal

    @property
    def refinanced_long_term_debt_subtotal(self):
        return self.refianced_long_term_debt_generic + self.refianced_long_term_debt_udf1 + self.refianced_long_term_debt_udf2 + self.refianced_long_term_debt_udf3 + self.refianced_long_term_debt_udf4 + self.refianced_long_term_debt_udf5 + self.refianced_long_term_debt_udf6 + self.refianced_long_term_debt_udf7

    @property
    def long_term_notes_payable_subtotal(self):
        return self.long_term_notes_payable_generic + self.long_term_notes_payable_udf1 + self.long_term_notes_payable_udf2 + self.long_term_notes_payable_udf3 + self.long_term_notes_payable_udf4

    @property
    def total_notes_payable(self):
        return self.refinanced_long_term_debt_subtotal + self.long_term_notes_payable_subtotal

    @property
    def due_to_others_subtotal(self):
        return self.due_to_related_parties_generic + self.due_to_related_parties_udf1 + self.due_to_related_parties_udf2 + self.due_to_related_parties_udf3

    @property
    def due_to_shareholders_subtotal(self):
        return self.due_to_shareholders_generic + self.due_to_shareholders_udf1 + self.due_to_shareholders_udf2 + self.due_to_shareholders_udf3

    @property
    def other_long_term_liabilities_subtotal(self):
        return self.other_long_term_liabilities_generic + self.other_long_term_liabilities_udf1 + self.other_long_term_liabilities_udf2 + self.other_long_term_liabilities_udf3 + self.other_long_term_liabilities_udf4
    
    @property
    def total_long_term_liabilities(self):
        return self.total_notes_payable + self.due_to_shareholders_subtotal + self.due_to_shareholders_subtotal + self.other_long_term_liabilities_subtotal
    
    @property
    def total_liabilities(self):
        return self.total_current_liabilities + self.total_long_term_liabilities

    @property
    def other_equity_subtotal(self):
        return self.other_equity_generic + self.other_equity_udf1 + self.other_equity_udf2 + self.other_equity_udf3 + self.other_equity_udf4

    @property
    def total_shareholders_equity(self):
        return self.paid_in_capital + self.beginning_retained_earnings + self.current_period_retained_earnings + self.other_equity_subtotal

    @property
    def total_liabilities_and_shareholders_equity(self):
        return self.total_shareholders_equity + self.total_liabilities

    @property
    def unbalanced_amount(self):
        return self.total_assets - self.total_liabilities
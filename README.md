# OpnLend: An Open Source Loan Origination System
![opnlend-logo](Media/OpnLend-Logo.png)

# Global Relationships
The Global Relationships app serves two primary purposes:
1. The CRUD-based UI serves as a "mini-CRM" for Business and Personal Account Information.
2. The Global Relationship ID is a Unique ID that can be shared among one or more Business or Personal Accounts. Per FDIC, NCUA, and SBA (Size Standard) requirements, it aggregates related accounts.

# Financials
The Financials app is the financial spreading and modeling software for spreading business financials, personal tax returns, personal financial statements, and debt schedules for business and personal accounts.
**Purpose**
- Build a financial spreading app within my OpnLend web (Django) application, with a focus on credit analysis.
- Provide generic spreading statements that allow for core functionality, while allowing users to build their own custom sub-statements that are either separate from the “core” generic models or derivatives of those models.
- The generic model will be primarily based upon the United States IRS Form 1120 and 1065. This will allow for consistency when, at a later date, implementing automated spreading functionality.

**Database Design**
- A given set (Income Statement and Balance Sheet) of financial statements are grouped together by the “parent” Financial Manager Primary Key.
- In addition to the key fields to form relationships between the Financial Manager and the “child” Income Statement and Balance Sheet tables, the Financial Manager is to store the Business Entity’s Unique Identifier, Statement Date, Period Length, Statement Type (CPA Reviewed, Tax Return, Company Prepared, etc.), Accounting Method, among potential other fields.
- Additional Financial Statements Offered: Additional database tables where a given record’s dated statement can reconcile to the other “child statements” of the Financial Manager’s primary key record. Examples include the following: Accounts Receivable Aging Summary, Accounts Payable Aging Summary, Inventory Summary Report, Invoices, etc.

**Database Fields: Subtotal, Generic, and Custom (JSON)**
- Each parent account has an initially hidden “_generic” child account, that any value entered into the parent account is stored in; allowing the parent account to continue to aggregate its children account(s).
- The generic account is only revealed if the user opts to spread child accounts; opting by selecting a “+” sign or some other form of indication to add child accounts.
- Infinite addition of entity-specific child accounts allowed via JavaScript, with aggregation to the "parent" subtotal account.
- The subtotal accounts are solely front-end visual representations allowing for easier data entry. Their values are not to be stored within the database; reducing redundancy.

# Loans
***Primary Design***
1. New Loan Requests, which exist for the purpose of underwriting new money requests. If integration of existing loans exists, allows for the ability for the auto-merging of approved, funded loans from the New Loan Requests table to the Existing Loans table.
2. Existing Loans, allowing for portfolio management, loan renewals, loan reviews, modifications, change of terms, etc.

**Primary Loan (Structure) Details**
1. Stores the (temporary) New Loan Request Account Number or the existing Account Number if within the Existing Loans table.
2. Additional Primary Structure fields include, but are not limited to: Loan Amount, Loan Product, Loan Term, Loan Amortization (if applicable depending on chosen Loan Product), and various Pricing Terms.

**Loan >>> Loan Roles Foreign Key Relationship**
1. Loan Roles: Defines Borrower, Co-Borrower(s), and Guarantors.
2. Additional fields include Guaranty Indebtedness (i.e., unlimited vs limited; if limited, dollar amount or percentage of commitment) and Guaranty Security (collateral pledged).

**Loan >>> Loan Collateral Schedule Foreign Key Relationship**
1. Allows for the assignment of Collateral from the available 'Collateral Pool'.

**Loan >>> Loan Ticklers**
1. Document reporting requirements assigned at the loan level.

**Loan >>> Loan Fees / Vendor Management**
1. Assigns individual loan fees, including the ability to import directly from Vendor Management (i.e., ordering appraisals, environmental due diligence, etc.)

# Additional General Design Definitions to be Added Later

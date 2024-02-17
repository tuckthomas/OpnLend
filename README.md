# OpnLend: An Open Source Loan Origination System
![opnlend-logo](Media/OpnLend-Logo.png)

## Global Relationships
The Global Relationships module functions as a mini-CRM for managing both Business and Personal Account Information and features a unique Global Relationship ID. This ID links related business or personal accounts to comply with FDIC, NCUA, and SBA requirements by aggregating related account data.

## Financials
The Financials module is designed for financial analysis, including the spreading of business financials, personal tax returns, personal financial statements, and debt schedules. Its primary goals are:

- To integrate a financial spreading tool within the OpnLend Django application, focusing on credit analysis.
- To offer generic financial statement templates based on US IRS Forms 1120 and 1065, while allowing customization through user-defined sub-statements.

### Database Design
- Financial statements are organized by a parent Financial Manager, which links to child Income Statement and Balance Sheet tables and stores key information like Business Entity's Unique Identifier and accounting details.
- It supports additional financial statements (e.g., Accounts Receivable Aging Summary, Inventory Summary Report) for comprehensive financial analysis.

### Database Fields
- Supports a "_generic" child account for initial value storage, with the option to reveal and aggregate additional child accounts as needed.
- Allows the dynamic addition of entity-specific child accounts through JavaScript, focusing on front-end usability without database redundancy.

## Loans
The Loans module supports the entire loan lifecycle from new loan requests to managing existing loans, including renewals, reviews, and modifications.

### New Loan Requests
- Manages underwriting for new loan applications, with features to integrate and auto-merge approved loans into the existing loan portfolio.

### Existing Loans
- Facilitates portfolio management, including renewals, reviews, modifications, and term changes.

### Primary Loan Details
- Records essential loan information such as account numbers, loan amounts, products, terms, and pricing.

### Relationships and Collateral
- Defines roles (Borrower, Co-Borrower(s), Guarantors) and collateral assignments from a Collateral Pool.
- Manages document reporting requirements and loan fees, including integration with Vendor Management for services like appraisals.

## Additional Notes
Further design details and module descriptions will be added in subsequent updates.

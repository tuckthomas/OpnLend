<p align="center">
  <img src="Media/OpnLend-Logo.png" alt="opnlend-logo">
</p>

<h1 align="center">Loan Origination System</h1>
<p align="center"><em>OpnLend software is a product of OpnLend, Inc., an Indiana registered S-Corporation.</em></p>

**Inquiry Contact:** All initial inquiries regarding the OpnLend proprietary edition may be directed to OpnLend Inc.'s sole beneficial owner, Tucker Thomas Olson: tucker@opnlend.com or tuckerolson13@gmail.com

**Update 04/10/2024:** While most of my time outside of work hours is dedicated to this application's ongoing development, those updates being viewable at https://opnlend.com, I am no longer providing updates to this repository. Much of this projects creation was done in hopes of it helping me find work in my field during a bout of unemployment. After many months of trying, I was unable to find employment in my field. However, I am extremely fortunate to have found work in an other area of passion that I have historically volunteered for; the ALS community.

I plan to continue to develop this project in my spare time, with the hopes of either a) it turning into a passive income source, b) selling a portion of my solely-owned equity to a private equity firm interested in funding its ongoing development in exchagne for equity, or c) selling the application in its entirety.

## Global Relationships
The Global Relationships app serves two primary purposes:
- The CRUD-based UI serves as a "mini-CRM" for Business and Personal Account Information.
- The Global Relationship ID is a Unique ID that can be shared among one or more Business or Personal Accounts. Per FDIC, NCUA, and SBA (Size Standard) requirements, it aggregates related accounts.

## OpnLend Community Edition Dashboard: Embedded Business Intelligence Solution
Each institution can embedd whichever Business Intelligence product it chooses. Metabase's Business Intelligence solution will be an installation option for those who may not have an existing Business Intelligence solution or may be exploring alternative open-source solutions.

Please note that this dashboard solution is only offered within the open-source Community Edition; adhering to the GNU GPL v3 license. **The proprietary edition, which allows for source code modifications without the GNU GPL v3's requirement of republishing the modified source code, will not include an option to integerate Metabase as the Business Intellignece solution.**

**What is Metabase?** [Metabase](https://github.com/metabase/metabase) is open-source business intelligence tool that enables users to explore, visualize, and share data insights without the need for extensive technical knowledge. It allows for easy querying through a user-friendly interface, making it accessible for users to generate reports and dashboards from their data sources. Here is an early example of a dashboard using Metabase:

![Early-Metabase-SBA-Dashboard-Example](Media/Early-Metabase-SBA-Dashboard-Example.jpg)

To use Metabase as the dashboard front-end, [Docker](https://github.com/docker) is required for installation. In my home development environment, I am running Debian 11 within a Proxmox LXC. If using a similar setup or Debian-based system, here's how to install Metabase using Docker:

- Ensure Docker is installed on your system. For Debian-based systems:
  ```sh
  apt-get update
  apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update
  apt-get install docker-ce docker-ce-cli containerd.io

- Pull latest Metabase image from Docker and run Metabase:
  ```sh
  docker pull metabase/metabase:latest
  docker run -d -p 3000:3000 --name metabase metabase/metabase # Replace Port '3000' with Different Port if Desired
  
- Install PyJWT for Embedding Metabase Dashboard into Webpage:
  ```sh
  pip install PyJWT

- Please reference the views.py file and the Dashboard.html file within the Dashboard app for an example of how to complete the embedding process. 

## Financials
The Financials app is the financial spreading and modeling software for spreading business financials, personal tax returns, personal financial statements, and debt schedules for business and personal accounts.
### Purpose
- Build a financial spreading app within my OpnLend web (Django) application, with a focus on credit analysis.
- Provide generic spreading statements that allow for core functionality, while allowing users to build their own custom sub-statements that are either separate from the “core” generic models or derivatives of those models.
- The generic model will be primarily based upon the United States IRS Form 1120 and 1065. This will allow for consistency when, at a later date, implementing automated spreading functionality.

### Database Design
- A given set (Income Statement and Balance Sheet) of financial statements are grouped together by the “parent” Financial Manager Primary Key.
- In addition to the key fields to form relationships between the Financial Manager and the “child” Income Statement and Balance Sheet tables, the Financial Manager is to store the Business Entity’s Unique Identifier, Statement Date, Period Length, Statement Type (CPA Reviewed, Tax Return, Company Prepared, etc.), Accounting Method, among potential other fields.
- Additional Financial Statements Offered: Additional database tables where a given record’s dated statement can reconcile to the other “child statements” of the Financial Manager’s primary key record. Examples include the following: Accounts Receivable Aging Summary, Accounts Payable Aging Summary, Inventory Summary Report, Invoices, etc.

### Database Fields: Subtotal, Generic, and Custom (JSON)
- Each parent account has an initially hidden “_generic” child account, that any value entered into the parent account is stored in; allowing the parent account to continue to aggregate its children account(s).
- The generic account is only revealed if the user opts to spread child accounts; opting by selecting a “+” sign or some other form of indication to add child accounts.
- Infinite addition of entity-specific child accounts allowed via JavaScript, with aggregation to the "parent" subtotal account.
- The subtotal accounts are solely front-end visual representations allowing for easier data entry. Their values are not to be stored within the database; reducing redundancy.

## Loans
### Primary Design
- New Loan Requests, which exist for the purpose of underwriting new money requests. If integration of existing loans exists, allows for the ability for the auto-merging of approved, funded loans from the New Loan Requests table to the Existing Loans table.
- Existing Loans, allowing for portfolio management, loan renewals, loan reviews, modifications, change of terms, etc.

### Primary Loan (Structure) Details
- Stores the (temporary) New Loan Request Account Number or the existing Account Number if within the Existing Loans table.
- Additional Primary Structure fields include, but are not limited to: Loan Amount, Loan Product, Loan Term, Loan Amortization (if applicable depending on chosen Loan Product), and various Pricing Terms.

### Loan Roles Foreign Key Relationship
- Loan Roles: Defines Borrower, Co-Borrower(s), and Guarantors.
- Additional fields include Guaranty Indebtedness (i.e., unlimited vs limited; if limited, dollar amount or percentage of commitment) and Guaranty Security (collateral pledged).

### Loan Collateral Schedule Foreign Key Relationship
- Allows for the assignment of Collateral from the available 'Collateral Pool'.

### Loan Ticklers
- Document reporting requirements assigned at the loan level.

### Loan Fees / Vendor Management
- Assigns individual loan fees, including the ability to import directly from Vendor Management (i.e., ordering appraisals, environmental due diligence, etc.)

### Loan's Sources of Repayment
- Detailed description to be added at a later date....

### Loan Risk Rating
- Detailed description to be added at a later date....

## Deposits
Detailed description to be added at a later date....

## Loan Applications
Initial design is to include:
- Build-an-Application Module: Will allow for an institution to quickly build an online loan application that will automatically sync to a 'New Money Request' within the 'Loan' app.
- SBA 7a Application Web Forms: Will include API configuration per the publicly available API documents from the SBA.
- SBA 504 Web Forms: Will include API configuration per the publicly available API documents from the SBA.
- USDA FSA Web Forms: I need to reserach whether an API is available.

## Portfolio Management
Detailed description to be added at a later date....

## Document Portal
I may integrate an existing open source document management solution as an optional download, as financial institutions may prefer to have their documents stored on their existing primary source of retention.


## Additional General Design Definitions to be Added Later

# URLA Form 1003 Analysis

## Reference Documents
- Demo Form: https://www.loansystems.com/urlademo
- Fannie Mae Guide: https://singlefamily.fanniemae.com/media/17391/display

## Current Implementation Status

### ✅ Currently Implemented (Basic)
- Step 1: Basic Borrower Info (name, address, DOB, email, phone)
- Step 2: Basic Financial Info (income, down payment, loan amount)
- Step 3: Basic Property Info
- Step 4: Basic Declarations (2 questions)
- Step 5: Review & Submit

### ❌ Missing Sections (Required for Complete URLA 1003)

#### Section 1: Borrower Information
**1a. Personal Information:**
- [ ] Social Security Number (SSN) or ITIN
- [ ] Alternate Names
- [ ] Citizenship Status (U.S. Citizen, Permanent Resident, Non-Permanent Resident)
- [ ] Type of Credit (Individual vs Joint)
- [ ] Total Number of Borrowers
- [ ] Other Borrower Names
- [ ] Marital Status
- [ ] Dependents (Number and Ages)

**1b. Current Employment/Self-Employment:**
- [ ] Employer/Business Name
- [ ] Employer Address (Street, Unit, City, State, Zip, Country)
- [ ] Phone Number
- [ ] Position/Title
- [ ] Start Date
- [ ] Years/Months in Line of Work
- [ ] Family Member Employment Checkbox
- [ ] Business Owner/Self-Employed Status
- [ ] Ownership Share Percentage
- [ ] Monthly Income Breakdown:
  - Base Income
  - Overtime
  - Bonus
  - Commission
  - Military Entitlements
  - Other Income

**1c. Additional Employment:**
- [ ] Second Employer Information (same fields as 1b)

**1d. Previous Employment:**
- [ ] Previous Employer Information
- [ ] Start/End Dates
- [ ] Previous Gross Monthly Income

**1e. Income from Other Sources:**
- [ ] Alimony
- [ ] Automobile Allowance
- [ ] Boarder Income
- [ ] Capital Gains
- [ ] Interest and Dividends
- [ ] Notes Receivable
- [ ] Child Support
- [ ] Disability
- [ ] Foster Care
- [ ] Housing or Parsonage
- [ ] Mortgage Credit Certificate
- [ ] Mortgage Differential Payments
- [ ] Public Assistance
- [ ] Retirement
- [ ] Royalty Payments
- [ ] Separate Maintenance
- [ ] Social Security
- [ ] Trust
- [ ] Unemployment Benefits
- [ ] VA Compensation
- [ ] Other

#### Section 2: Assets and Liabilities
**2a. Assets - Bank Accounts, Retirement, Other:**
- [ ] Account Type (Checking, Savings, Money Market, CD, Stocks, Bonds, Retirement, etc.)
- [ ] Financial Institution
- [ ] Account Number
- [ ] Cash or Market Value

**2b. Other Assets and Credits:**
- [ ] Proceeds from Real Estate Sale
- [ ] Proceeds from Non-Real Estate Sale
- [ ] Unsecured/Secured Borrowed Funds
- [ ] Earnest Money
- [ ] Relocation Funds
- [ ] Sweat Equity
- [ ] Employer Assistance
- [ ] Rent Credit
- [ ] Trade Equity
- [ ] Lot Equity
- [ ] Other

#### Section 3: Liabilities
**3a. Real Estate Liabilities:**
- [ ] Property Address
- [ ] Property Type
- [ ] Account Number
- [ ] Monthly Payment
- [ ] Unpaid Balance
- [ ] Type (FHA, VA, Conventional, USDA-RD, Other)
- [ ] Credit Limit

**3b. Other Liabilities:**
- [ ] Creditor Name
- [ ] Account Number
- [ ] Monthly Payment
- [ ] Unpaid Balance
- [ ] Type
- [ ] Credit Limit

#### Section 4: Loan Details
**4a. Loan and Property Information:**
- [ ] Loan Amount
- [ ] Loan Purpose (Purchase, Refinance, Other)
- [ ] Property Address (Street, Unit, City, State, Zip, Country)
- [ ] Number of Units
- [ ] Property Value
- [ ] Occupancy (Primary Residence, Second Home, Investment Property)
- [ ] FHA Secondary Residence
- [ ] Mixed-Use Property Question
- [ ] Manufactured Home Question

**4b. Other New Mortgage Loans:**
- [ ] Creditor Name
- [ ] Lien Type
- [ ] Monthly Payment
- [ ] Loan Amount/Amount to be Drawn
- [ ] Credit Limit

**4c. Rental Income (Purchase Only):**
- [ ] Expected Monthly Rental Income
- [ ] Expected Net Monthly Rental Income (Lender calculated)

**4d. Gifts or Grants:**
- [ ] Asset Type (Cash Gift, Gift of Equity, Grant)
- [ ] Deposited/Not Deposited Status
- [ ] Source (Community Nonprofit, Federal Agency, Relative, State Agency, Lender, Employer, Local Agency, Religious Nonprofit, Unmarried Partner, Other)
- [ ] Cash or Market Value

#### Section 5: Declarations and Military Service
**5a. About Property and Money:**
- [ ] Will occupy as primary residence?
- [ ] Ownership interest in another property in last 3 years?
- [ ] Type of previous property (PR, SR, SH, IP)
- [ ] How title was held (S, SP, O)
- [ ] Family relationship or business affiliation with seller?
- [ ] Borrowing money for transaction not disclosed?
- [ ] Amount of undisclosed money?
- [ ] Applying for mortgage on another property?
- [ ] Applying for new credit before closing?
- [ ] Property subject to priority lien (PACE program)?

**5b. About Finances:**
- [ ] Co-signer or guarantor on undisclosed debt?
- [ ] Outstanding judgments?
- [ ] Currently delinquent on Federal debt?
- [ ] Party to lawsuit with financial liability?
- [ ] Conveyed title in lieu of foreclosure (past 7 years)?
- [ ] Pre-foreclosure sale or short sale (past 7 years)?
- [ ] Property foreclosed (past 7 years)?
- [ ] Declared bankruptcy (past 7 years)?
- [ ] Bankruptcy type (Chapter 7, 11, 12, 13)

**Military Service:**
- [ ] Served in US Armed Forces?
- [ ] Currently serving on active duty?
- [ ] Currently retired/discharged/separated?
- [ ] Only period as non-activated Reserve/National Guard?
- [ ] Surviving spouse?

#### Section 6: Demographic Information
- [ ] Ethnicity (Hispanic/Latino, Not Hispanic/Latino, Decline to answer)
- [ ] Race (Multiple options, Decline to answer)
- [ ] Collection method (Face-to-face, Telephone, Fax/Mail, Email/Internet)

#### Section 7: Loan Originator Information
- [ ] Loan Originator Organization Name
- [ ] Organization Address
- [ ] Organization NMLSR ID#
- [ ] State License ID#
- [ ] Loan Originator Name
- [ ] Loan Originator NMLSR ID#
- [ ] State License ID#
- [ ] Email
- [ ] Phone
- [ ] Signature
- [ ] Date

## Validation Requirements

### Required Fields (marked with * in reference form):
1. Name (First, Middle, Last, Suffix)
2. Social Security Number
3. Date of Birth
4. Citizenship
5. Marital Status
6. Home Phone
7. Work Phone
8. Email
9. Current Address (Street, City, State, Zip)
10. How Long at Current Address
11. Housing (Own/Rent)
12. Employment Information (if applicable)
13. Loan Amount
14. Property Address (Street, City, State, Zip)
15. Number of Units
16. Occupancy

### Conditional Logic Required:
- If at current address < 2 years: Show former address section
- If employed: Show employment section
- If self-employed: Show ownership share questions
- If purchase transaction: Show rental income section
- If refinance: Show different property value field
- If bankruptcy: Show bankruptcy type selection
- If military service: Show service details
- If joint credit: Show other borrower information

## Recommendations

1. **Expand FormData Type**: Add all missing fields to types.ts
2. **Create Sub-sections**: Break Step 1 into multiple sub-steps (1a, 1b, 1c, 1d, 1e)
3. **Add Conditional Rendering**: Show/hide sections based on user responses
4. **Implement Validation**: Add proper validation for required fields
5. **Add Data Persistence**: Save form state to prevent data loss
6. **Improve UX**: Add progress indicators for sub-sections
7. **Add Help Text**: Include tooltips/help text for complex fields


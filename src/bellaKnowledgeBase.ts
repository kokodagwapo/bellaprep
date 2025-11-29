export const knowledgeBase = {
  "version": "bella-knowledge-base-v2.0",
  "description": "Unified RAG knowledge base for Bella covering avatar behavior, tone, loan types, deep dives, personas, flow rules, emotional support, Mortgage Planner, Prep4Loan, URLA 1003 logic, silent underwriter expertise, loan officer knowledge, and all 50 states compliance and regulations.",
  "chunks": [
    {
      "id": "avatar-click-1",
      "tags": ["avatar_click", "greeting", "tone", "start"],
      "content": "Hi! I’m Bella. Thanks for clicking on me! Don’t worry, this isn’t the serious part yet—let’s just talk. How can I help you today? Are you checking affordability, getting ready for a loan, or do you have questions before we start?"
    },
    {
      "id": "avatar-click-2",
      "tags": ["avatar_click", "casual", "friendly"],
      "content": "Hey there! I’m Bella. I’m here to make this whole mortgage thing feel way less stressful. Before we jump into any forms, do you want to ask me anything first? Also—do you have your basic requirements ready, like income docs, ID, or pay stubs? Totally fine if not!"
    },
    {
      "id": "avatar-click-3",
      "tags": ["avatar_click", "light_humor"],
      "content": "Hello hello! It’s Bella. I’m basically your chill mortgage guide—no stress, no pressure. Want to look at numbers? Ask something? Or just figure out where to start? Before anything official, let’s make sure you’re comfy and have what you need."
    },
    {
      "id": "avatar-click-readiness-1",
      "tags": ["avatar_click", "requirements_check"],
      "content": "Quick thing before we begin: do you already have the basic requirements like your income info, job details, and maybe a pay stub? If yes, awesome. If no, no worries—I’ll walk you through everything slowly and make it easy."
    },
    {
      "id": "knowledge-bank-1",
      "tags": ["global", "expertise"],
      "content": "I understand all major loan types—Conventional, FHA, VA, USDA, Jumbo, Refinance, Cash-out—and their rules, eligibility, credit ranges, documentation, property standards, underwriting logic, and timelines."
    },
    {
      "id": "knowledge-bank-2",
      "tags": ["global", "forms", "logic"],
      "content": "I know every section of Mortgage Planner, Prep4Loan, and the full URLA 1003 form. I pre-fill information across all stages, avoid repeating questions, and simplify lender terminology into conversational steps."
    },
    {
      "id": "mission-1",
      "tags": ["global", "mission"],
      "content": "My mission: Help borrowers get the best deal, the best interest rate, and the quickest approval by preparing clean, accurate data and guiding them step-by-step without stress."
    },
    {
      "id": "p4l-docs-1",
      "tags": ["prep4loan", "documents"],
      "content": "You can upload photos or PDFs of W-2s, pay stubs, bank statements, or IDs. I’ll extract the details and auto-fill matching fields to save you time."
    },
    {
      "id": "urla-overview-1",
      "tags": ["urla_1003", "overview"],
      "content": "The URLA 1003 is the national loan application form. I’ll guide you section by section, pre-filling everything we already collected so you only review and confirm."
    },
    {
      "id": "loan-conventional-1",
      "tags": ["loan_type", "conventional"],
      "content": "Conventional loans work best for steady income + good credit. Flexible and often the best rate if your credit score is solid."
    },
    {
      "id": "loan-fha-1",
      "tags": ["loan_type", "fha"],
      "content": "FHA helps if your credit is rebuilding or your down payment is small. Friendly and forgiving—especially for first-time buyers."
    },
    {
      "id": "loan-va-1",
      "tags": ["loan_type", "va"],
      "content": "VA is for Veterans and active-duty members. No down payment, no mortgage insurance, and typically the best benefits available."
    },
    {
      "id": "support-firsttime-1",
      "tags": ["emotional_support", "first_time"],
      "content": "If this is your first time buying, you’re doing great—better than you think. I’ll explain everything calmly and simply."
    },
    {
      "id": "support-confidence-1",
      "tags": ["emotional_support", "confidence"],
      "content": "You’ve got this! Most buyers think the process is harder than it really is. Let’s take it one relaxed step at a time."
    },
    {
      "id": "support-encouragement-1",
      "tags": ["emotional_support"],
      "content": "If anything feels confusing, just tell me. I’ll simplify it or slow it down. You’re not alone—I’m here the whole way."
    },
    {
      "id": "flow-confusion-detect-1",
      "tags": ["flow_rules", "confusion"],
      "content": "Confusion detection: Bella pauses if answers repeat, borrower hesitates, or says 'I'm lost.' She re-explains simply and checks understanding."
    },
    {
      "id": "role-silent-underwriter-1",
      "tags": ["role", "underwriter", "expertise"],
      "content": "I operate as a silent underwriter, working behind the scenes to ensure your loan application is complete, accurate, and ready for approval. I review all documentation, verify income calculations, check credit requirements, validate property information, and identify potential issues before they become problems. My goal is to catch errors early and ensure your application meets all lender guidelines so you get approved faster."
    },
    {
      "id": "role-loan-officer-1",
      "tags": ["role", "loan_officer", "guidance"],
      "content": "I function as your personal loan officer, guiding you through every step of the mortgage process. I explain complex terms in simple language, help you understand your options, recommend the best loan products for your situation, answer all your questions, and advocate for you throughout the process. I'm here to make sure you get the best rate and terms possible."
    },
    {
      "id": "role-dual-expertise-1",
      "tags": ["role", "underwriter", "loan_officer", "expertise"],
      "content": "I combine the expertise of both a silent underwriter and a loan officer. Like an underwriter, I ensure your application is perfect before submission. Like a loan officer, I guide and educate you throughout. This dual role means I catch issues early, explain everything clearly, and help you get approved faster with better rates."
    },
    {
      "id": "compliance-all-states-1",
      "tags": ["compliance", "regulations", "all_states", "expertise"],
      "content": "I have comprehensive knowledge of mortgage compliance and regulations for all 50 states. I understand state-specific disclosure requirements, licensing rules, interest rate caps, prepayment penalties, foreclosure procedures, property tax exemptions, homestead protections, and all state-specific lending laws. I ensure your application complies with both federal and state requirements."
    },
    {
      "id": "compliance-state-specific-1",
      "tags": ["compliance", "state_specific", "regulations"],
      "content": "Each state has unique mortgage regulations. California requires specific addendums and fair lending notices. Texas has 12-day cash-out notice requirements. Florida has anti-coercion insurance disclosures. New York requires mortgage banker/broker disclosures. I know all state-specific requirements and will guide you through what's needed for your state."
    },
    {
      "id": "save-time-strategy-1",
      "tags": ["save_time", "efficiency", "strategy"],
      "content": "I save you time by auto-filling forms from documents you upload, avoiding duplicate questions, pre-validating information before submission, organizing all required documents upfront, and guiding you through the fastest approval path. Instead of weeks, we can get you pre-approved in days."
    },
    {
      "id": "save-time-documents-1",
      "tags": ["save_time", "documents", "efficiency"],
      "content": "Upload your documents once—I extract everything automatically. W-2s, pay stubs, bank statements, IDs—I read them all and fill in your forms instantly. No more typing the same information multiple times. This saves hours of manual data entry."
    },
    {
      "id": "save-time-preparation-1",
      "tags": ["save_time", "preparation", "efficiency"],
      "content": "I help you prepare everything correctly the first time. By ensuring your application is complete and accurate upfront, we avoid back-and-forth requests for missing information. This prevents delays and gets you approved faster."
    },
    {
      "id": "save-money-rate-1",
      "tags": ["save_money", "interest_rate", "strategy"],
      "content": "I help you get the best interest rate by ensuring your credit profile is optimized, recommending loan products that fit your situation, identifying rate reduction opportunities, and helping you understand how different factors affect your rate. Even a 0.25% rate reduction can save thousands over the life of your loan."
    },
    {
      "id": "save-money-fees-1",
      "tags": ["save_money", "fees", "costs", "strategy"],
      "content": "I help you save money on fees by identifying unnecessary charges, negotiating lender fees, bundling services for discounts, choosing loan products with lower fees, and ensuring you're not paying for things you don't need. I review all costs and help you understand what's required vs. optional."
    },
    {
      "id": "save-money-down-payment-1",
      "tags": ["save_money", "down_payment", "strategy"],
      "content": "I help you minimize your down payment while maintaining the best terms. For qualified buyers, I can identify programs that allow lower down payments, down payment assistance programs, and loan products that don't require private mortgage insurance. This frees up cash for other expenses."
    },
    {
      "id": "save-money-closing-costs-1",
      "tags": ["save_money", "closing_costs", "strategy"],
      "content": "I help reduce closing costs by identifying which fees can be negotiated, finding lender credits, recommending when to pay points vs. not, and ensuring you're not overpaying for services. I also help you understand which costs are tax-deductible."
    },
    {
      "id": "save-money-refinance-1",
      "tags": ["save_money", "refinance", "strategy"],
      "content": "If you're refinancing, I analyze whether it makes financial sense, calculate break-even points, identify the best time to refinance, and help you avoid unnecessary refinancing fees. I ensure you're actually saving money, not just lowering your payment."
    },
    {
      "id": "compliance-ca-1",
      "tags": ["compliance", "california", "state_regulations"],
      "content": "California requires: California Addendum to Loan Estimate (signed), Mortgage Loan Disclosure Statement, California Fair Lending Notice, and Hazard Insurance Disclosure for purchases. All mortgage transactions must include state-specific disclosures."
    },
    {
      "id": "compliance-tx-1",
      "tags": ["compliance", "texas", "state_regulations"],
      "content": "Texas requires: Texas Mortgage Company Disclosure (all loans), 12-Day Notice for cash-out refinances (must be provided no later than 12 days before closing), and Non-Borrower Spouse Disclosure for cash-out when spouse is not a borrower."
    },
    {
      "id": "compliance-fl-1",
      "tags": ["compliance", "florida", "state_regulations"],
      "content": "Florida requires: Anti-Coercion Notice (borrower's right to choose insurance provider) for all loans, and Notice to Purchaser for purchase transactions only. Florida has specific homestead protection laws that affect mortgage terms."
    },
    {
      "id": "compliance-ny-1",
      "tags": ["compliance", "new_york", "state_regulations"],
      "content": "New York requires: NY Mortgage Banker/Broker Disclosure with license and regulatory information. New York has strict usury laws and specific requirements for mortgage brokers and bankers."
    },
    {
      "id": "compliance-il-1",
      "tags": ["compliance", "illinois", "state_regulations"],
      "content": "Illinois requires: Residential Mortgage Licensee Disclosure, High-Risk Home Loan Disclosure (if applicable), and specific disclosures for high-cost loans. Illinois has consumer protection laws for mortgage transactions."
    },
    {
      "id": "compliance-pa-1",
      "tags": ["compliance", "pennsylvania", "state_regulations"],
      "content": "Pennsylvania requires: Mortgage Loan Disclosure Statement and specific licensing disclosures. Pennsylvania has regulations regarding prepayment penalties and foreclosure procedures."
    },
    {
      "id": "compliance-oh-1",
      "tags": ["compliance", "ohio", "state_regulations"],
      "content": "Ohio requires: Ohio Mortgage Broker Act disclosures and specific consumer protection notices. Ohio has regulations regarding mortgage broker licensing and consumer rights."
    },
    {
      "id": "compliance-ga-1",
      "tags": ["compliance", "georgia", "state_regulations"],
      "content": "Georgia requires: Georgia Residential Mortgage Act disclosures and specific licensing information. Georgia has regulations regarding mortgage lending practices and consumer protections."
    },
    {
      "id": "compliance-nc-1",
      "tags": ["compliance", "north_carolina", "state_regulations"],
      "content": "North Carolina requires: North Carolina Mortgage Lending Act disclosures and specific consumer protection notices. North Carolina has strict regulations regarding high-cost loans and prepayment penalties."
    },
    {
      "id": "compliance-mi-1",
      "tags": ["compliance", "michigan", "state_regulations"],
      "content": "Michigan requires: Michigan Mortgage Brokers, Lenders, and Servicers Licensing Act disclosures. Michigan has specific regulations regarding mortgage licensing and consumer protections."
    },
    {
      "id": "compliance-nj-1",
      "tags": ["compliance", "new_jersey", "state_regulations"],
      "content": "New Jersey requires: New Jersey Licensed Lenders Act disclosures and specific consumer protection notices. New Jersey has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-va-1",
      "tags": ["compliance", "virginia", "state_regulations"],
      "content": "Virginia requires: Virginia Mortgage Lender and Broker Act disclosures and specific licensing information. Virginia has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-wa-1",
      "tags": ["compliance", "washington", "state_regulations"],
      "content": "Washington requires: Washington Consumer Loan Act disclosures and specific mortgage broker licensing information. Washington has consumer protection laws for mortgage transactions."
    },
    {
      "id": "compliance-az-1",
      "tags": ["compliance", "arizona", "state_regulations"],
      "content": "Arizona requires: Arizona Residential Mortgage Licensee disclosures and specific consumer protection notices. Arizona has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-ma-1",
      "tags": ["compliance", "massachusetts", "state_regulations"],
      "content": "Massachusetts requires: Massachusetts Division of Banks disclosures and specific consumer protection notices. Massachusetts has strict regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-tn-1",
      "tags": ["compliance", "tennessee", "state_regulations"],
      "content": "Tennessee requires: Tennessee Residential Lending, Brokerage and Servicing Act disclosures. Tennessee has specific regulations regarding mortgage licensing and consumer protections."
    },
    {
      "id": "compliance-in-1",
      "tags": ["compliance", "indiana", "state_regulations"],
      "content": "Indiana requires: Indiana Department of Financial Institutions disclosures and specific mortgage licensing information. Indiana has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-mo-1",
      "tags": ["compliance", "missouri", "state_regulations"],
      "content": "Missouri requires: Missouri Division of Finance disclosures and specific consumer protection notices. Missouri has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-md-1",
      "tags": ["compliance", "maryland", "state_regulations"],
      "content": "Maryland requires: Maryland Mortgage Lender Law disclosures and specific licensing information. Maryland has consumer protection laws for mortgage transactions."
    },
    {
      "id": "compliance-wi-1",
      "tags": ["compliance", "wisconsin", "state_regulations"],
      "content": "Wisconsin requires: Wisconsin Department of Financial Institutions disclosures and specific mortgage licensing information. Wisconsin has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-co-1",
      "tags": ["compliance", "colorado", "state_regulations"],
      "content": "Colorado requires: Colorado Division of Real Estate disclosures and specific mortgage broker licensing information. Colorado has consumer protection laws for mortgage transactions."
    },
    {
      "id": "compliance-mn-1",
      "tags": ["compliance", "minnesota", "state_regulations"],
      "content": "Minnesota requires: Minnesota Department of Commerce disclosures and specific consumer protection notices. Minnesota has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-sc-1",
      "tags": ["compliance", "south_carolina", "state_regulations"],
      "content": "South Carolina requires: South Carolina Department of Consumer Affairs disclosures and specific mortgage licensing information. South Carolina has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-al-1",
      "tags": ["compliance", "alabama", "state_regulations"],
      "content": "Alabama requires: Alabama State Banking Department disclosures and specific mortgage licensing information. Alabama has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-la-1",
      "tags": ["compliance", "louisiana", "state_regulations"],
      "content": "Louisiana requires: Louisiana Office of Financial Institutions disclosures and specific consumer protection notices. Louisiana has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-ky-1",
      "tags": ["compliance", "kentucky", "state_regulations"],
      "content": "Kentucky requires: Kentucky Department of Financial Institutions disclosures and specific mortgage licensing information. Kentucky has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-or-1",
      "tags": ["compliance", "oregon", "state_regulations"],
      "content": "Oregon requires: Oregon Division of Financial Regulation disclosures and specific consumer protection notices. Oregon has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-ok-1",
      "tags": ["compliance", "oklahoma", "state_regulations"],
      "content": "Oklahoma requires: Oklahoma Department of Consumer Credit disclosures and specific mortgage licensing information. Oklahoma has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-ct-1",
      "tags": ["compliance", "connecticut", "state_regulations"],
      "content": "Connecticut requires: Connecticut Department of Banking disclosures and specific consumer protection notices. Connecticut has strict regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-ia-1",
      "tags": ["compliance", "iowa", "state_regulations"],
      "content": "Iowa requires: Iowa Division of Banking disclosures and specific mortgage licensing information. Iowa has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-ut-1",
      "tags": ["compliance", "utah", "state_regulations"],
      "content": "Utah requires: Utah Department of Financial Institutions disclosures and specific consumer protection notices. Utah has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-nv-1",
      "tags": ["compliance", "nevada", "state_regulations"],
      "content": "Nevada requires: Nevada Division of Mortgage Lending disclosures and specific licensing information. Nevada has consumer protection laws for mortgage transactions."
    },
    {
      "id": "compliance-ar-1",
      "tags": ["compliance", "arkansas", "state_regulations"],
      "content": "Arkansas requires: Arkansas Securities Department disclosures and specific mortgage licensing information. Arkansas has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-ms-1",
      "tags": ["compliance", "mississippi", "state_regulations"],
      "content": "Mississippi requires: Mississippi Department of Banking and Consumer Finance disclosures and specific consumer protection notices. Mississippi has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-ks-1",
      "tags": ["compliance", "kansas", "state_regulations"],
      "content": "Kansas requires: Kansas Office of the State Bank Commissioner disclosures and specific mortgage licensing information. Kansas has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-nm-1",
      "tags": ["compliance", "new_mexico", "state_regulations"],
      "content": "New Mexico requires: New Mexico Regulation and Licensing Department disclosures and specific consumer protection notices. New Mexico has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-ne-1",
      "tags": ["compliance", "nebraska", "state_regulations"],
      "content": "Nebraska requires: Nebraska Department of Banking and Finance disclosures and specific mortgage licensing information. Nebraska has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-wv-1",
      "tags": ["compliance", "west_virginia", "state_regulations"],
      "content": "West Virginia requires: West Virginia Division of Financial Institutions disclosures and specific consumer protection notices. West Virginia has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-id-1",
      "tags": ["compliance", "idaho", "state_regulations"],
      "content": "Idaho requires: Idaho Department of Finance disclosures and specific mortgage licensing information. Idaho has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-hi-1",
      "tags": ["compliance", "hawaii", "state_regulations"],
      "content": "Hawaii requires: Hawaii Division of Financial Institutions disclosures and specific consumer protection notices. Hawaii has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-nh-1",
      "tags": ["compliance", "new_hampshire", "state_regulations"],
      "content": "New Hampshire requires: New Hampshire Banking Department disclosures and specific mortgage licensing information. New Hampshire has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-me-1",
      "tags": ["compliance", "maine", "state_regulations"],
      "content": "Maine requires: Maine Bureau of Consumer Credit Protection disclosures and specific consumer protection notices. Maine has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-ri-1",
      "tags": ["compliance", "rhode_island", "state_regulations"],
      "content": "Rhode Island requires: Rhode Island Department of Business Regulation disclosures and specific mortgage licensing information. Rhode Island has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-mt-1",
      "tags": ["compliance", "montana", "state_regulations"],
      "content": "Montana requires: Montana Division of Banking and Financial Institutions disclosures and specific consumer protection notices. Montana has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-de-1",
      "tags": ["compliance", "delaware", "state_regulations"],
      "content": "Delaware requires: Delaware Office of the State Bank Commissioner disclosures and specific mortgage licensing information. Delaware has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-sd-1",
      "tags": ["compliance", "south_dakota", "state_regulations"],
      "content": "South Dakota requires: South Dakota Division of Banking disclosures and specific consumer protection notices. South Dakota has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-nd-1",
      "tags": ["compliance", "north_dakota", "state_regulations"],
      "content": "North Dakota requires: North Dakota Department of Financial Institutions disclosures and specific mortgage licensing information. North Dakota has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-ak-1",
      "tags": ["compliance", "alaska", "state_regulations"],
      "content": "Alaska requires: Alaska Division of Banking and Securities disclosures and specific consumer protection notices. Alaska has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "compliance-vt-1",
      "tags": ["compliance", "vermont", "state_regulations"],
      "content": "Vermont requires: Vermont Department of Financial Regulation disclosures and specific mortgage licensing information. Vermont has regulations regarding mortgage lending practices."
    },
    {
      "id": "compliance-wy-1",
      "tags": ["compliance", "wyoming", "state_regulations"],
      "content": "Wyoming requires: Wyoming Division of Banking disclosures and specific consumer protection notices. Wyoming has regulations regarding mortgage lending and licensing."
    },
    {
      "id": "compliance-dc-1",
      "tags": ["compliance", "district_of_columbia", "state_regulations"],
      "content": "District of Columbia requires: DC Department of Insurance, Securities and Banking disclosures and specific consumer protection notices. DC has regulations regarding mortgage lending and foreclosure procedures."
    },
    {
      "id": "underwriter-quality-check-1",
      "tags": ["underwriter", "quality", "accuracy"],
      "content": "As a silent underwriter, I verify income calculations are correct, check debt-to-income ratios, validate credit scores, ensure property appraisals meet requirements, confirm all documentation is complete, and identify any red flags before submission. This prevents delays and denials."
    },
    {
      "id": "underwriter-early-detection-1",
      "tags": ["underwriter", "early_detection", "prevention"],
      "content": "I catch issues early—missing documents, incorrect calculations, credit problems, employment gaps, or property issues—before they become major problems. By fixing these upfront, we avoid last-minute surprises and ensure smooth approval."
    },
    {
      "id": "loan-officer-education-1",
      "tags": ["loan_officer", "education", "guidance"],
      "content": "As your loan officer, I explain everything in plain language—what PMI is, how interest rates work, what closing costs include, why certain documents are needed, and how different loan types compare. You'll understand every step of the process."
    },
    {
      "id": "loan-officer-advocacy-1",
      "tags": ["loan_officer", "advocacy", "support"],
      "content": "I advocate for you throughout the process. I help you get the best rate, negotiate fees, explain your options clearly, answer all your questions, and ensure you're treated fairly. I'm on your side, working to get you the best deal possible."
    },
    {
      "id": "time-money-combined-1",
      "tags": ["save_time", "save_money", "strategy"],
      "content": "I save you both time and money. By getting everything right the first time, we avoid delays that cost money. By finding the best rates and fees, we save thousands. By automating document processing, we save hours. It's all connected—efficiency equals savings."
    }
  ]
};

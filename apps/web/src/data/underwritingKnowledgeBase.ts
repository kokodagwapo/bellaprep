/**
 * Underwriting Knowledge Base for Bella
 * 
 * This knowledge base contains advanced mortgage underwriting rules and guidelines
 * organized into chunks of 500-900 tokens for optimal RAG retrieval.
 * 
 * Metadata tags:
 * - loan_type: conventional / fha / va / usda / all
 * - category: income / assets / reserves / self_employed / occupancy / property / appraisal / multi_unit / rental
 * - audience: lender_facing
 * - complexity: simplified_english
 * - purpose: bella_underwriter_reasoning
 */

export interface UnderwritingChunk {
  id: string;
  tags: string[];
  content: string;
  metadata: {
    loan_type: 'conventional' | 'fha' | 'va' | 'usda' | 'all';
    category: 'income' | 'assets' | 'reserves' | 'self_employed' | 'occupancy' | 'property' | 'appraisal' | 'multi_unit' | 'rental';
    audience: 'lender_facing';
    complexity: 'simplified_english';
    purpose: 'bella_underwriter_reasoning';
  };
}

export const underwritingKnowledgeBase: { version: string; description: string; chunks: UnderwritingChunk[] } = {
  version: "underwriting-knowledge-base-v1.0",
  description: "Advanced mortgage underwriting rules and guidelines for Bella's silent underwriter reasoning. Chunked for optimal RAG retrieval.",
  chunks: [
    // ============================================
    // CONVENTIONAL LOAN CHUNKS
    // ============================================
    {
      id: "conv-aus-decision-1",
      tags: ["conventional", "aus", "decision", "du", "lpa"],
      content: `Conventional loans use AUS (Automated Underwriting System) - either DU (Desktop Underwriter) or LPA (Loan Product Advisor). The AUS decides almost everything about your loan approval. It looks at your credit score (typically starts around 620), your debt-to-income ratio (DTI), and other risk factors. If the AUS says approve, you're usually good to go. If it says refer, a human underwriter will review your file manually.`,
      metadata: {
        loan_type: "conventional",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "conv-risk-factors-1",
      tags: ["conventional", "risk", "ltv", "dti", "credit", "reserves"],
      content: `For Conventional loans, underwriters check ALL risk factors: LTV (loan-to-value ratio - how much you're borrowing vs home value), DTI (debt-to-income - your monthly debts vs income), credit depth (how long you've had credit), reserves (how much cash you have left after closing), property type, and occupancy (will you live there). High-risk combinations might need extra reserves, lower max LTV, a full appraisal (no property inspection waivers), or stronger income documentation.`,
      metadata: {
        loan_type: "conventional",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "conv-high-balance-1",
      tags: ["conventional", "high_balance", "fico", "pricing"],
      content: `High-Balance Conventional loans (over conforming limits) have stricter pricing with LLPAs (Loan Level Price Adjustments). These loans typically need a 700+ FICO score to get the best rates. The loan amount is higher, so lenders want to see stronger credit profiles. If your credit is below 700, you might still qualify but pay higher fees or get a higher interest rate.`,
      metadata: {
        loan_type: "conventional",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "conv-multiple-properties-1",
      tags: ["conventional", "multiple_properties", "reserves", "investment"],
      content: `If you're financing multiple properties with Conventional loans, reserve requirements get stricter. For 5-6 properties, you need 6 months of reserves for EACH property (principal, interest, taxes, insurance - PITI). For 7-10 properties, you need 12 months of reserves for EACH property. This is because having multiple mortgages increases risk - if one property has issues, you need enough cash to cover all your payments.`,
      metadata: {
        loan_type: "conventional",
        category: "reserves",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "conv-second-home-1",
      tags: ["conventional", "second_home", "ltv", "reserves"],
      content: `For Conventional second homes (vacation homes, not investment properties), the max LTV is 90% - meaning you need at least 10% down. You also need reserves (usually 2-6 months) and full documentation of your income. Second homes are riskier than primary residences because if money gets tight, you're more likely to stop paying the second home mortgage first.`,
      metadata: {
        loan_type: "conventional",
        category: "reserves",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "conv-investment-1",
      tags: ["conventional", "investment", "ltv", "rental_income", "vacancy"],
      content: `Conventional investment properties have stricter rules: max 85% LTV for purchases, 75% for refinances. You must verify rental income using Form 1007 or 72 (appraiser's rent schedule), a lease agreement, or Schedule E from tax returns. Lenders apply a 25% vacancy factor - meaning they only count 75% of the rent you're getting, assuming 25% of the time the property might be empty. This protects against rental gaps.`,
      metadata: {
        loan_type: "conventional",
        category: "rental",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "conv-pmi-1",
      tags: ["conventional", "pmi", "mortgage_insurance", "ltv"],
      content: `PMI (Private Mortgage Insurance) is required for Conventional loans when your LTV is over 80% - meaning you put less than 20% down. PMI protects the lender if you default. The good news: PMI can be removed once you have enough equity (usually when LTV drops to 78% or you pay down to 80% and request removal). You'll need an appraisal to prove the value.`,
      metadata: {
        loan_type: "conventional",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "conv-dti-1",
      tags: ["conventional", "dti", "debt_to_income", "aus"],
      content: `Conventional loans typically allow max DTI around 50% with strong AUS findings. DTI is your total monthly debts (including the new mortgage payment) divided by your gross monthly income. If your DTI is higher, the AUS might still approve if you have compensating factors like high credit scores, lots of reserves, or low LTV. Higher DTI means less room for unexpected expenses, so lenders want to see other strengths.`,
      metadata: {
        loan_type: "conventional",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // FHA LOAN CHUNKS
    // ============================================
    {
      id: "fha-credit-down-1",
      tags: ["fha", "credit", "down_payment", "minimum"],
      content: `FHA loans are more forgiving with credit scores. If your credit is 580 or higher, you only need 3.5% down. If your credit is between 500-579, you need 10% down. FHA allows manual underwriting even if automated systems don't approve, which is helpful if you have compensating factors like extra reserves, strong residual income, or minimal payment shock (your new payment isn't much higher than your current rent).`,
      metadata: {
        loan_type: "fha",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "fha-dti-compensating-1",
      tags: ["fha", "dti", "compensating_factors", "ratios"],
      content: `FHA has standard DTI ratios of 31/43 (housing payment 31% of income, total debts 43% of income). But you can go up to 40/50 with strong compensating factors. Compensating factors include: extra reserves (more than minimum required), strong residual income (money left after all bills), minimal payment shock (new payment close to current rent), stable employment history, or excellent credit. The underwriter looks at the whole picture, not just the numbers.`,
      metadata: {
        loan_type: "fha",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "fha-multi-unit-1",
      tags: ["fha", "multi_unit", "occupancy", "rental_income"],
      content: `FHA allows 2-4 unit properties, but you must occupy one unit as your primary residence. You can use 75% of the rental income from the other units to help qualify. So if you're buying a duplex and renting one unit for $1,000/month, you can count $750/month toward your income. This helps borrowers who want to house hack - live in one unit and rent the others to help pay the mortgage.`,
      metadata: {
        loan_type: "fha",
        category: "multi_unit",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "fha-cashout-1",
      tags: ["fha", "cash_out", "ltv", "seasoning"],
      content: `FHA cash-out refinances have specific rules: max 80% LTV (you can only cash out up to 80% of the home's value). You must own the property for at least 12 months AND have made at least 6 payments before you can do a cash-out refi. This prevents people from buying a house and immediately cashing out equity, which increases default risk.`,
      metadata: {
        loan_type: "fha",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "fha-mip-1",
      tags: ["fha", "mip", "mortgage_insurance", "upfront", "annual"],
      content: `FHA has MIP (Mortgage Insurance Premium) instead of PMI. There's an upfront MIP of 1.75% of the loan amount (usually rolled into the loan). Then there's an annual MIP that you pay monthly. If your LTV is over 90% when you get the loan, MIP lasts for the life of the loan. If your LTV is 90% or less, MIP stops after 11 years. Unlike Conventional PMI, you can't remove FHA MIP early by getting an appraisal - it's based on when you got the loan and your original LTV.`,
      metadata: {
        loan_type: "fha",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // VA LOAN CHUNKS
    // ============================================
    {
      id: "va-residual-income-1",
      tags: ["va", "residual_income", "approval", "dti"],
      content: `VA loans are unique - approval is based on RESIDUAL INCOME, not just DTI. Residual income is the money you have left after paying all your bills (mortgage, debts, taxes, utilities, etc.). VA sets minimum residual income amounts based on your region, family size, and loan amount. If you meet the residual income requirement, you can have a DTI over 55% and still get approved. This is why VA is so flexible - they care more about whether you have money left over than your debt ratios.`,
      metadata: {
        loan_type: "va",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "va-dti-guideline-1",
      tags: ["va", "dti", "residual_income", "flexibility"],
      content: `VA has a DTI guideline of 41%, but you can go up to 55% or higher if your residual income is strong. Residual income depends on your region (cost of living varies), family size (more people = higher minimum), and loan amount. VA publishes tables showing the minimum residual income needed. If you have enough left over after all bills, you're good - even with high DTI. This makes VA very borrower-friendly.`,
      metadata: {
        loan_type: "va",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "va-funding-fee-1",
      tags: ["va", "funding_fee", "veteran", "disabled"],
      content: `VA loans have a funding fee instead of mortgage insurance. For first-time use, it's 2.15% of the loan amount. For subsequent use (you've used your VA benefit before), it's 3.3%. Disabled veterans are exempt from the funding fee. The fee can be paid upfront or rolled into the loan. Unlike mortgage insurance, the funding fee is a one-time cost, not monthly.`,
      metadata: {
        loan_type: "va",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "va-multi-unit-1",
      tags: ["va", "multi_unit", "occupancy", "rental_income"],
      content: `VA allows up to 4 units, and you must occupy one as your primary residence. You can use 75% of the rental income from other units to help qualify. This is great for veterans who want to house hack. The rental income helps offset the mortgage payment, making it easier to qualify and potentially allowing you to buy a more expensive property.`,
      metadata: {
        loan_type: "va",
        category: "multi_unit",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "va-irrrl-1",
      tags: ["va", "irrrl", "streamline", "refinance"],
      content: `IRRRL (Interest Rate Reduction Refinance Loan) is a VA streamline refinance. It's super simple: no appraisal needed, no income documentation, no residual income requirement. You just need to show you're reducing your rate or payment, and you've made on-time payments. It's the easiest refi out there - perfect if rates drop and you want to lower your payment without all the paperwork.`,
      metadata: {
        loan_type: "va",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "va-cashout-1",
      tags: ["va", "cash_out", "ltv", "equity"],
      content: `VA cash-out refinances allow up to 100% LTV - you can cash out all your equity. This is unique - no other loan program allows this. You still need to qualify based on residual income and DTI, but you're not limited by LTV like Conventional or FHA. This makes VA great for veterans who want to access their home equity for other purposes.`,
      metadata: {
        loan_type: "va",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // USDA LOAN CHUNKS
    // ============================================
    {
      id: "usda-income-limits-1",
      tags: ["usda", "income_limits", "household", "verification"],
      content: `USDA loans have household income limits - everyone 18 and older in the household must have their income verified, and the total household income must be below the area median income limit for that location. This includes income from all adults, not just the borrowers. USDA publishes income limits by county - they vary based on cost of living. If your household makes too much, you don't qualify, even if you could afford the payment.`,
      metadata: {
        loan_type: "usda",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "usda-rural-area-1",
      tags: ["usda", "rural", "property_location", "eligibility"],
      content: `USDA loans require the property to be in a USDA-eligible rural area. USDA defines rural as areas with populations under 35,000, though some suburban areas near cities also qualify. You can check if a property is eligible on the USDA website. The property must be your primary residence - no second homes or investment properties. USDA wants to help people buy homes in rural communities.`,
      metadata: {
        loan_type: "usda",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "usda-ltv-closing-costs-1",
      tags: ["usda", "ltv", "closing_costs", "appraisal"],
      content: `USDA allows 100% LTV - no down payment required. You can even roll closing costs into the loan if the appraisal supports it (the home value is high enough). This makes USDA one of the most affordable loan programs - you can buy a home with zero money down and finance your closing costs. The trade-off is you need to be in a rural area and meet income limits.`,
      metadata: {
        loan_type: "usda",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "usda-underwriting-1",
      tags: ["usda", "gus", "automated", "manual", "compensating"],
      content: `USDA uses GUS (Guaranteed Underwriting System) for automated underwriting. If GUS approves, you're good. If GUS refers or rejects, you can still do manual underwriting with compensating factors. Compensating factors might include extra reserves, stable employment, low debt, or strong credit. Manual underwriting takes longer but gives you a chance if automated systems say no.`,
      metadata: {
        loan_type: "usda",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "usda-ratios-credit-1",
      tags: ["usda", "dti", "ratios", "credit", "gus"],
      content: `USDA has standard ratios of 29/41 (housing payment 29% of income, total debts 41%). But you can go higher with a strong file. Credit score of 640+ usually gets GUS Accept. Below 640, you'll need manual underwriting. USDA is flexible - they understand that rural borrowers might have different credit profiles, so they allow manual review even with lower scores if you have compensating factors.`,
      metadata: {
        loan_type: "usda",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "usda-guarantee-fees-1",
      tags: ["usda", "guarantee_fees", "upfront", "annual"],
      content: `USDA has guarantee fees similar to FHA MIP. There's an upfront fee (around 1% of the loan amount) and an annual fee (around 0.35% paid monthly). The upfront fee can be rolled into the loan. The annual fee is like mortgage insurance - it protects USDA if you default. Unlike FHA, USDA fees are typically lower, making it more affordable over time.`,
      metadata: {
        loan_type: "usda",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // INCOME REVIEW CHUNKS (ALL LOAN TYPES)
    // ============================================
    {
      id: "income-wage-1",
      tags: ["income", "wage", "ytd", "verification", "all"],
      content: `For wage income (regular paychecks), underwriters compare your year-to-date (YTD) earnings to last year's total. If there's a big difference, you need to explain why. Maybe you got a raise, changed jobs, or worked more hours. Large increases are usually fine if you can document them (pay stubs, offer letter). Large decreases are a red flag - the underwriter might use the lower amount or ask for more explanation.`,
      metadata: {
        loan_type: "all",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "income-variable-1",
      tags: ["income", "variable", "bonus", "overtime", "commission", "all"],
      content: `Variable income (bonus, overtime, commission) usually needs 24 months of history to count. The lender averages the last 2 years. Sometimes 12 months is okay if the AUS approves it, but 24 months is standard. If your variable income is trending down, they might use the lower year or average. If it's trending up, they might be conservative and use the average. The key is showing it's stable and likely to continue.`,
      metadata: {
        loan_type: "all",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "income-rental-1",
      tags: ["income", "rental", "lease", "schedule_e", "all"],
      content: `Rental income rules depend on whether it's a new rental or existing. For new rentals (you just bought it or haven't rented it before), use the LOWER of the lease amount or market rent (from an appraiser). For existing rentals, average the last 2 years of Schedule E from your tax returns. If you're showing a loss on Schedule E, that's a red flag - you might not be able to count the rental income, or it might actually hurt your application.`,
      metadata: {
        loan_type: "all",
        category: "rental",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "income-non-taxable-1",
      tags: ["income", "non_taxable", "gross_up", "all"],
      content: `Non-taxable income (like disability, child support, certain retirement) can be "grossed up" - meaning you can count more than the actual amount because you don't pay taxes on it. Conventional and FHA allow up to 125% gross-up (multiply by 1.25). VA allows full gross-up (multiply by the tax bracket equivalent, usually around 1.15-1.25). This helps borrowers who receive non-taxable income qualify for larger loans.`,
      metadata: {
        loan_type: "all",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "income-pension-retirement-1",
      tags: ["income", "pension", "retirement", "continuance", "all"],
      content: `Pension and retirement income must show 3-year continuance - meaning you need documentation proving it will continue for at least 3 years. This could be a pension statement, retirement account terms, or annuity contract. If you're 62 or older, the 3-year rule might be waived since you're likely retired. The key is showing the income is stable and won't stop soon.`,
      metadata: {
        loan_type: "all",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "income-trust-annuity-1",
      tags: ["income", "trust", "annuity", "continuance", "all"],
      content: `Trust and annuity income needs the trust papers or annuity contract showing terms. You must prove 3-year continuance - the income will keep coming for at least 3 years. Underwriters look at the contract to see when payments stop, what conditions might end them, and whether they're guaranteed. If the trust or annuity could end soon, it might not count as qualifying income.`,
      metadata: {
        loan_type: "all",
        category: "income",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // SELF-EMPLOYED CHUNKS
    // ============================================
    {
      id: "self-employed-fha-va-usda-1",
      tags: ["self_employed", "tax_returns", "fha", "va", "usda", "two_years"],
      content: `For FHA, VA, and USDA loans, self-employed borrowers ALWAYS need 2 years of tax returns. No exceptions. The lender will look at your Schedule C (sole proprietorship), Schedule E (rental/partnership), or K-1 (partnership/S-corp) income. They'll average the last 2 years, or use the lower year if income is declining. Self-employment is riskier because income can fluctuate, so lenders want to see a longer history.`,
      metadata: {
        loan_type: "all",
        category: "self_employed",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "self-employed-conventional-1",
      tags: ["self_employed", "conventional", "one_year", "business_age", "aus"],
      content: `Conventional loans might allow 1 year of tax returns for self-employed borrowers if: your business is 5+ years old (shows stability), and the AUS approves it. But 2 years is still preferred. If you only have 1 year, you need a strong file otherwise - good credit, low DTI, lots of reserves. The AUS will decide if 1 year is enough based on your overall risk profile.`,
      metadata: {
        loan_type: "conventional",
        category: "self_employed",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "self-employed-business-analysis-1",
      tags: ["self_employed", "business", "bank_statements", "revenue", "liquidity", "all"],
      content: `Underwriters analyze your business by looking at bank statements (12-24 months), revenue trends (is business growing or shrinking?), and liquidity & solvency (working capital - can you pay bills?). They want to see the business is healthy, not just that you made money on paper. If your business is losing money or barely breaking even, that's a red flag even if your tax returns show income.`,
      metadata: {
        loan_type: "all",
        category: "self_employed",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "self-employed-cash-flow-1",
      tags: ["self_employed", "cash_flow", "adjustments", "depreciation", "all"],
      content: `For self-employed income, underwriters make cash-flow adjustments to your tax return income. They ADD BACK: depreciation, depletion, and amortization (these are paper expenses, not real cash). They SUBTRACT: business loan payments (debt service), 50% of meals/entertainment (only half is deductible), and one-time losses (non-recurring expenses). This gives a truer picture of your actual cash flow - money you can actually use to pay a mortgage.`,
      metadata: {
        loan_type: "all",
        category: "self_employed",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "self-employed-declining-income-1",
      tags: ["self_employed", "declining_income", "explanation", "all"],
      content: `If your self-employed income dropped more than 20% from one year to the next, you must explain the drop. The underwriter needs to understand why - was it a one-time issue, or is the business struggling? If the drop seems unstable or likely to continue, they'll use the lower year for qualifying. If you can show it was temporary (like a big one-time expense) and business is recovering, they might average or use the higher year.`,
      metadata: {
        loan_type: "all",
        category: "self_employed",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "self-employed-k1-1",
      tags: ["self_employed", "k1", "partnership", "ordinary_income", "all"],
      content: `For K-1 income (partnerships, S-corps), underwriters need to see ordinary income plus guaranteed payments. They'll verify your salary/draws are sustainable - meaning the business can afford to pay you that much. If you're taking large draws but the business isn't profitable, that's a problem. The K-1 shows your share of business income, but the underwriter also looks at whether the business itself is healthy enough to support those payments.`,
      metadata: {
        loan_type: "all",
        category: "self_employed",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // ASSETS, DOWN PAYMENT & RESERVES CHUNKS
    // ============================================
    {
      id: "assets-acceptable-funds-1",
      tags: ["assets", "down_payment", "funds", "all"],
      content: `Acceptable funds for down payment and reserves include: checking accounts, savings accounts, brokerage accounts (stocks, bonds), and retirement accounts (401k, IRA - though you might need to show you can withdraw without penalty). Gifts are okay too, but the donor must show ability to give (their bank statements) and the transfer must be documented (gift letter, wire transfer receipt). Cash is usually not acceptable - lenders want to see it in an account for at least 2 months (seasoning).`,
      metadata: {
        loan_type: "all",
        category: "assets",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "assets-gift-funds-1",
      tags: ["assets", "gift", "donor", "transfer", "all"],
      content: `Gift funds are allowed for down payments, but there are rules. The donor (person giving the gift) must show ability to give - meaning they have enough money in their accounts. They need to provide bank statements. The transfer must be documented with a gift letter (saying it's a gift, not a loan) and proof of transfer (wire receipt, check copy). The money must be in your account before closing. Gifts from family are most common, but friends can give gifts too.`,
      metadata: {
        loan_type: "all",
        category: "assets",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "assets-minimum-borrower-funds-1",
      tags: ["assets", "down_payment", "conventional", "multi_unit", "investment"],
      content: `For Conventional multi-unit properties, you need 3-5% of your own funds (can't all be gift). For investment properties, you need 100% borrower funds - no gifts allowed. This is because investment properties are riskier, and lenders want to see you have skin in the game with your own money. Primary residences are more flexible - you can use all gift funds if needed.`,
      metadata: {
        loan_type: "conventional",
        category: "assets",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "reserves-primary-home-1",
      tags: ["reserves", "primary_home", "months", "all"],
      content: `Reserve requirements vary by property type. For primary homes, you typically need 0-2 months of reserves (principal, interest, taxes, insurance - PITI). Some programs don't require reserves at all for primary homes if your credit and DTI are strong. Reserves are like an emergency fund - money left after closing to cover payments if something unexpected happens.`,
      metadata: {
        loan_type: "all",
        category: "reserves",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "reserves-second-home-1",
      tags: ["reserves", "second_home", "months", "all"],
      content: `For second homes (vacation homes), you typically need 2-6 months of reserves. This is because second homes are riskier - if money gets tight, you're more likely to stop paying the second home mortgage first. Lenders want to see you have enough cash to cover both mortgages for a while if needed. The exact amount depends on your credit, DTI, and the specific loan program.`,
      metadata: {
        loan_type: "all",
        category: "reserves",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "reserves-investment-1",
      tags: ["reserves", "investment", "months", "all"],
      content: `Investment properties need the most reserves - typically 6-12+ months. This is because investment properties are the riskiest. If you lose your job or the rental market crashes, you might struggle to pay the mortgage. Lenders want to see you can cover the payment for a long time even if the property isn't generating income. Some programs require even more for multiple investment properties.`,
      metadata: {
        loan_type: "all",
        category: "reserves",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "reserves-fha-multi-unit-1",
      tags: ["reserves", "fha", "multi_unit", "months"],
      content: `FHA multi-unit properties (2-4 units) require 3 months of reserves. This is in addition to your down payment. So if you're buying a duplex with FHA, you need 3.5% down plus 3 months of PITI in reserves. The reserves help protect against rental income gaps - if a unit is empty for a while, you can still make the payment.`,
      metadata: {
        loan_type: "fha",
        category: "reserves",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "reserves-va-usda-1",
      tags: ["reserves", "va", "usda", "multi_unit"],
      content: `VA requires reserves only for multi-unit properties (not single-family). USDA doesn't require reserves, but they help - having reserves can be a compensating factor if your file is borderline. Reserves show you're financially stable and can handle unexpected expenses. Even if not required, having reserves makes your application stronger.`,
      metadata: {
        loan_type: "all",
        category: "reserves",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "assets-large-deposit-1",
      tags: ["assets", "large_deposit", "documentation", "all"],
      content: `Large Deposit Rule (plain English): If you get a big deposit that isn't your regular paycheck and it's more than half of your monthly income, the lender must document exactly where it came from. This prevents money laundering and ensures you're not borrowing the down payment (which would be fraud). You'll need to provide a letter of explanation and proof of source (sale of asset, gift letter, inheritance documentation, etc.).`,
      metadata: {
        loan_type: "all",
        category: "assets",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // PROPERTY, OCCUPANCY & APPRAISAL CHUNKS
    // ============================================
    {
      id: "occupancy-requirements-1",
      tags: ["occupancy", "primary_residence", "timeline", "fraud", "all"],
      content: `Most loan programs require you to move into the property within about 60 days of closing and live there as your primary residence for about 1 year. Moving out early without lender approval may be occupancy fraud - a serious offense. If you need to move before a year (job transfer, family emergency), contact your lender first. They might allow it, but you need permission. Investment properties and second homes have different rules - you don't have to live there.`,
      metadata: {
        loan_type: "all",
        category: "occupancy",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "appraisal-uad-cu-1",
      tags: ["appraisal", "uad", "condition", "quality", "cu", "all"],
      content: `Appraisals use UAD (Uniform Appraisal Dataset) with condition and quality ratings. The appraiser rates the property's condition (C1-C6, where C1 is new and C6 is major repairs needed) and quality (Q1-Q6, where Q1 is highest quality construction). CU (Collateral Underwriter) is Fannie Mae's risk scoring system - if the CU risk score is high, you might need a second appraisal or additional documentation. Low CU scores are good - they mean the property value is solid.`,
      metadata: {
        loan_type: "all",
        category: "appraisal",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "property-condos-1",
      tags: ["property", "condos", "reserves", "litigation", "all"],
      content: `Condos have special requirements. The HOA (Homeowners Association) must have at least 10% of the annual budget going to reserves (savings for future repairs). The condo project can't have significant litigation - if there's a major lawsuit against the HOA, that's a red flag. The lender will review the condo questionnaire and financials to make sure the HOA is healthy. If reserves are too low or litigation is ongoing, the loan might not be approved.`,
      metadata: {
        loan_type: "all",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "property-manufactured-1",
      tags: ["property", "manufactured", "foundation", "title", "all"],
      content: `Manufactured homes must be built after June 1976 (when HUD standards started). They need a permanent foundation (not just blocks or piers) and must be titled as real property (not personal property like a car or RV). The foundation requirement is important for safety and value. If the home is on a temporary foundation or still titled as personal property, it won't qualify for most mortgage programs.`,
      metadata: {
        loan_type: "all",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "property-multi-unit-1",
      tags: ["property", "multi_unit", "rental_grid", "self_sufficiency", "all"],
      content: `Multi-unit properties (2-4 units) require a rental grid showing current or projected rents for each unit, and a market rent schedule from the appraiser. Some programs require a self-sufficiency test - meaning the property must generate enough rental income to cover the mortgage payment even if you're not living there. This protects the lender - if you move out, the property can still pay for itself through rent.`,
      metadata: {
        loan_type: "all",
        category: "multi_unit",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },

    // ============================================
    // FINAL DECISION CHUNKS
    // ============================================
    {
      id: "decision-aus-approve-1",
      tags: ["decision", "aus", "approve", "accept", "all"],
      content: `If the AUS (Automated Underwriting System) says Approve or Accept, you're ready to close! The AUS has reviewed your file and determined you meet all the requirements. You'll still need to provide final documentation (like updated pay stubs, bank statements), but the underwriting decision is made. This is the best outcome - smooth sailing to closing.`,
      metadata: {
        loan_type: "all",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "decision-aus-refer-1",
      tags: ["decision", "aus", "refer", "manual", "all"],
      content: `If the AUS says Refer, a human underwriter will manually review your file. This isn't necessarily bad - it just means the automated system couldn't make a clear decision. The underwriter will look at compensating factors (extra reserves, strong credit, stable employment) and make a judgment call. You might need to provide additional documentation or explanations. Many Refer files still get approved after manual review.`,
      metadata: {
        loan_type: "all",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    },
    {
      id: "decision-ineligible-1",
      tags: ["decision", "ineligible", "fix_issues", "all"],
      content: `If the AUS says Ineligible, you don't meet the requirements for that loan program. This could be due to credit score, DTI, property issues, or other factors. You have options: fix the issues (improve credit, pay down debt, save more reserves) and reapply, or choose another loan program (like FHA if Conventional didn't work, or VA if you're a veteran). Sometimes a different program has different requirements that fit your situation better.`,
      metadata: {
        loan_type: "all",
        category: "property",
        audience: "lender_facing",
        complexity: "simplified_english",
        purpose: "bella_underwriter_reasoning"
      }
    }
  ]
};

/**
 * Helper function to get chunks by loan type
 */
export const getChunksByLoanType = (loanType: 'conventional' | 'fha' | 'va' | 'usda' | 'all'): UnderwritingChunk[] => {
  if (loanType === 'all') {
    return underwritingKnowledgeBase.chunks;
  }
  return underwritingKnowledgeBase.chunks.filter(chunk => 
    chunk.metadata.loan_type === loanType || chunk.metadata.loan_type === 'all'
  );
};

/**
 * Helper function to get chunks by category
 */
export const getChunksByCategory = (category: UnderwritingChunk['metadata']['category']): UnderwritingChunk[] => {
  return underwritingKnowledgeBase.chunks.filter(chunk => chunk.metadata.category === category);
};

/**
 * Helper function to search chunks by keyword
 */
export const searchChunks = (query: string): UnderwritingChunk[] => {
  const lowerQuery = query.toLowerCase();
  return underwritingKnowledgeBase.chunks.filter(chunk => 
    chunk.content.toLowerCase().includes(lowerQuery) ||
    chunk.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};


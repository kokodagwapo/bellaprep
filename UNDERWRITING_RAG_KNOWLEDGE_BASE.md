# Underwriting RAG Knowledge Base Documentation

## Overview

This document describes the Underwriting RAG Knowledge Base system for Bella, which provides advanced mortgage underwriting rules and guidelines in a format optimized for retrieval-augmented generation (RAG).

## Purpose

Bella uses this knowledge base silently during conversations to provide accurate, plain-English explanations of:
- What borrowers qualify for
- Loan differences (Conventional, FHA, VA, USDA)
- Underwriting rules and requirements
- Document requirements
- Reserve requirements
- Income types and verification
- Occupancy requirements
- Underwriting decisions

## Structure

### Knowledge Base File
- **Location**: `data/underwritingKnowledgeBase.ts`
- **Format**: TypeScript module with structured chunks
- **Chunking**: 500-900 tokens per chunk for optimal retrieval

### Metadata Tags

Each chunk includes the following metadata:

- **loan_type**: `conventional` | `fha` | `va` | `usda` | `all`
- **category**: `income` | `assets` | `reserves` | `self_employed` | `occupancy` | `property` | `appraisal` | `multi_unit` | `rental`
- **audience**: `lender_facing`
- **complexity**: `simplified_english`
- **purpose**: `bella_underwriter_reasoning`

### Content Categories

The knowledge base covers:

1. **Conventional Loans** (8 chunks)
   - AUS decision process
   - Risk factors (LTV, DTI, credit, reserves)
   - High-balance loans
   - Multiple properties
   - Second homes
   - Investment properties
   - PMI rules

2. **FHA Loans** (5 chunks)
   - Credit and down payment requirements
   - DTI and compensating factors
   - Multi-unit properties
   - Cash-out refinances
   - MIP (Mortgage Insurance Premium)

3. **VA Loans** (6 chunks)
   - Residual income program
   - DTI guidelines
   - Funding fees
   - Multi-unit properties
   - IRRRL streamline
   - Cash-out refinances

4. **USDA Loans** (6 chunks)
   - Income limits
   - Rural area requirements
   - LTV and closing costs
   - Underwriting (GUS)
   - Ratios and credit
   - Guarantee fees

5. **Income Review** (6 chunks) - All loan types
   - Wage income
   - Variable income (bonus, overtime, commission)
   - Rental income
   - Non-taxable income
   - Pension/retirement
   - Trust/annuity

6. **Self-Employed** (6 chunks) - All loan types
   - FHA/VA/USDA requirements (2 years)
   - Conventional requirements (1 year possible)
   - Business analysis
   - Cash-flow adjustments
   - Declining income
   - K-1 review

7. **Assets, Down Payment & Reserves** (9 chunks) - All loan types
   - Acceptable funds
   - Gift funds
   - Minimum borrower funds
   - Reserve requirements by property type
   - Large deposit rule

8. **Property, Occupancy & Appraisal** (5 chunks) - All loan types
   - Occupancy requirements
   - Appraisal (UAD, CU)
   - Condos
   - Manufactured homes
   - Multi-unit properties

9. **Final Decision** (3 chunks) - All loan types
   - AUS Approve/Accept
   - AUS Refer (manual underwriting)
   - Ineligible

**Total**: 54 knowledge chunks covering all major underwriting topics

## RAG Service

### Service File
- **Location**: `services/underwritingRAGService.ts`

### Key Functions

1. **`retrieveUnderwritingKnowledge(params)`**
   - Retrieves chunks based on query, loan type, and category
   - Returns filtered and ranked results

2. **`getAllUnderwritingChunksForContext()`**
   - Returns all chunks formatted for inclusion in system instructions
   - Used by both Gemini and OpenAI chat services

3. **`getRelevantChunksForQuestion(question, loanType?)`**
   - Intelligent keyword matching to find relevant chunks
   - Detects category and loan type from question text
   - Returns top 5 most relevant chunks

4. **`formatChunksForContext(chunks)`**
   - Formats chunks for display in chat context
   - Adds chunk IDs for traceability

## Integration

### Gemini Service
- **File**: `services/geminiService.ts`
- The underwriting knowledge base is included in the system instruction
- Bella uses this knowledge silently during conversations

### OpenAI Service
- **File**: `services/openaiChatService.ts`
- The underwriting knowledge base is included in the default system instruction
- Ensures consistent knowledge across both AI providers

## Usage

Bella automatically uses this knowledge when borrowers ask about:
- "What do I qualify for?"
- "What's the difference between FHA and Conventional?"
- "What are the rules for..."
- "What documents do I need?"
- "How much reserves do I need?"
- "What income types count?"
- "What are the occupancy requirements?"
- "Why was my loan denied?"

## Example Chunk

```typescript
{
  id: "conv-aus-decision-1",
  tags: ["conventional", "aus", "decision", "du", "lpa"],
  content: `Conventional loans use AUS (Automated Underwriting System) - either DU (Desktop Underwriter) or LPA (Loan Product Advisor). The AUS decides almost everything about your loan approval...`,
  metadata: {
    loan_type: "conventional",
    category: "property",
    audience: "lender_facing",
    complexity: "simplified_english",
    purpose: "bella_underwriter_reasoning"
  }
}
```

## Adding New Knowledge

To add new underwriting knowledge:

1. Create a new chunk in `data/underwritingKnowledgeBase.ts`
2. Ensure chunk size is 500-900 tokens
3. Add appropriate tags and metadata
4. Follow the existing content style (plain English, borrower-friendly)
5. Test that it retrieves correctly for relevant questions

## Best Practices

1. **Chunking**: Keep chunks between 500-900 tokens for optimal retrieval
2. **Plain English**: Write in simple, conversational language
3. **Completeness**: Cover all aspects of a topic in a single chunk when possible
4. **Tagging**: Use consistent tags for easy filtering
5. **Metadata**: Always include all required metadata fields
6. **Borrower-Focused**: Write from the borrower's perspective, not lender jargon

## Testing

The knowledge base is automatically included in Bella's system instructions, so it's tested during normal chat interactions. To verify specific knowledge retrieval:

1. Ask Bella a question about underwriting rules
2. Check that the response uses accurate knowledge from the base
3. Verify the response is in plain English and borrower-friendly

## Maintenance

- Review and update chunks when underwriting guidelines change
- Add new chunks for emerging loan programs or rules
- Ensure chunks remain 500-900 tokens (split if they grow)
- Keep metadata tags consistent across similar topics


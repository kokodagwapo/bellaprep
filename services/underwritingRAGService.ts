/**
 * Underwriting RAG Service
 * 
 * This service provides retrieval of underwriting knowledge chunks
 * for Bella's silent underwriter reasoning during conversations.
 */

import { underwritingKnowledgeBase, UnderwritingChunk, getChunksByLoanType, getChunksByCategory, searchChunks } from '../data/underwritingKnowledgeBase';

export interface RAGQuery {
  query?: string;
  loanType?: 'conventional' | 'fha' | 'va' | 'usda' | 'all';
  category?: 'income' | 'assets' | 'reserves' | 'self_employed' | 'occupancy' | 'property' | 'appraisal' | 'multi_unit' | 'rental';
  maxResults?: number;
}

/**
 * Retrieve relevant underwriting knowledge chunks based on query parameters
 */
export const retrieveUnderwritingKnowledge = (params: RAGQuery): UnderwritingChunk[] => {
  let chunks: UnderwritingChunk[] = underwritingKnowledgeBase.chunks;

  // Filter by loan type
  if (params.loanType && params.loanType !== 'all') {
    chunks = chunks.filter(chunk => 
      chunk.metadata.loan_type === params.loanType || chunk.metadata.loan_type === 'all'
    );
  }

  // Filter by category
  if (params.category) {
    chunks = chunks.filter(chunk => chunk.metadata.category === params.category);
  }

  // Search by query text
  if (params.query) {
    const lowerQuery = params.query.toLowerCase();
    chunks = chunks.filter(chunk => 
      chunk.content.toLowerCase().includes(lowerQuery) ||
      chunk.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      chunk.id.toLowerCase().includes(lowerQuery)
    );
  }

  // Limit results
  const maxResults = params.maxResults || 10;
  return chunks.slice(0, maxResults);
};

/**
 * Get all chunks formatted for inclusion in system instruction
 */
export const getAllUnderwritingChunksForContext = (): string => {
  return JSON.stringify(underwritingKnowledgeBase, null, 2);
};

/**
 * Get relevant chunks for a specific borrower question
 * Uses keyword matching to find the most relevant chunks
 */
export const getRelevantChunksForQuestion = (question: string, loanType?: 'conventional' | 'fha' | 'va' | 'usda'): UnderwritingChunk[] => {
  const lowerQuestion = question.toLowerCase();
  
  // Keywords that map to categories
  const categoryKeywords: Record<string, UnderwritingChunk['metadata']['category']> = {
    'income': 'income',
    'salary': 'income',
    'wage': 'income',
    'bonus': 'income',
    'commission': 'income',
    'self-employed': 'self_employed',
    'self employed': 'self_employed',
    'business': 'self_employed',
    'assets': 'assets',
    'down payment': 'assets',
    'gift': 'assets',
    'reserves': 'reserves',
    'savings': 'reserves',
    'occupancy': 'occupancy',
    'live': 'occupancy',
    'primary residence': 'occupancy',
    'appraisal': 'appraisal',
    'property': 'property',
    'condo': 'property',
    'multi-unit': 'multi_unit',
    'duplex': 'multi_unit',
    'rental': 'rental',
    'rent': 'rental'
  };

  // Detect category from question
  let detectedCategory: UnderwritingChunk['metadata']['category'] | undefined;
  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (lowerQuestion.includes(keyword)) {
      detectedCategory = category;
      break;
    }
  }

  // Detect loan type from question
  let detectedLoanType: 'conventional' | 'fha' | 'va' | 'usda' | 'all' = 'all';
  if (lowerQuestion.includes('conventional') || lowerQuestion.includes('fannie') || lowerQuestion.includes('freddie')) {
    detectedLoanType = 'conventional';
  } else if (lowerQuestion.includes('fha')) {
    detectedLoanType = 'fha';
  } else if (lowerQuestion.includes('va') || lowerQuestion.includes('veteran') || lowerQuestion.includes('military')) {
    detectedLoanType = 'va';
  } else if (lowerQuestion.includes('usda') || lowerQuestion.includes('rural')) {
    detectedLoanType = 'usda';
  }

  // Retrieve chunks
  const chunks = retrieveUnderwritingKnowledge({
    query: question,
    loanType: loanType || detectedLoanType,
    category: detectedCategory,
    maxResults: 5
  });

  return chunks;
};

/**
 * Format chunks for inclusion in chat context
 */
export const formatChunksForContext = (chunks: UnderwritingChunk[]): string => {
  if (chunks.length === 0) {
    return '';
  }

  return chunks.map(chunk => 
    `[${chunk.id}] ${chunk.content}`
  ).join('\n\n');
};


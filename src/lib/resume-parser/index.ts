/**
 * index.ts — Public API for the resume-parser module
 * Import parseResume from here in actions.ts.
 */

export { parseResume } from './pipeline';
export type { ParsedResumeResult, ParserDebugInfo, ConfidenceScores } from './types';

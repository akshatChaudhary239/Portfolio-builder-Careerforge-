/**
 * model-config.ts
 * Centralized AI model configuration for GetProspectra.
 * All OpenRouter model references must use this file — never hardcode model IDs.
 */

export const MODEL_CONFIG = {
  /** Primary free-tier model: Gemini Flash */
  PRIMARY_FREE_MODEL: 'google/gemini-2.5-flash',

  /** Backup free-tier model: Llama 3 */
  BACKUP_FREE_MODEL: 'meta-llama/llama-3.1-8b-instruct',

  /** Temperature for resume parsing / enhancement — lower = more factual */
  TEMPERATURE: 0.3,

  /** Maximum tokens for AI responses */
  MAX_TOKENS: 4096,

  /** OpenRouter base URL */
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',

  /** HTTP headers for OpenRouter */
  HTTP_REFERER: 'https://getprospectra.site',
  APP_TITLE: 'GetProspectra Application',
} as const;

/**
 * Structured error categories for GetProspectra's AI & parsing pipeline.
 * Use these to classify and log errors consistently.
 */
export type CareerForgeErrorCategory =
  | 'EXTRACTION_ERROR'
  | 'PARSER_ERROR'
  | 'MODEL_ERROR'
  | 'JSON_PARSE_ERROR'
  | 'NETWORK_ERROR';

export class CareerForgeError extends Error {
  public readonly category: CareerForgeErrorCategory;
  public readonly originalError?: unknown;

  constructor(category: CareerForgeErrorCategory, message: string, originalError?: unknown) {
    super(message);
    this.name = 'CareerForgeError';
    this.category = category;
    this.originalError = originalError;
  }
}

/**
 * Development-mode diagnostic logger.
 * Only outputs in NODE_ENV=development to avoid log noise in production.
 */
export function devLog(label: string, data?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[GetProspectra:DEV] ${label}`, data !== undefined ? data : '');
  }
}

/**
 * Builds the standard OpenRouter request options.
 */
export function buildOpenRouterRequest(
  model: string,
  systemPrompt: string,
  userContent: string,
  apiKey: string
): RequestInit {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': MODEL_CONFIG.HTTP_REFERER,
      'X-Title': MODEL_CONFIG.APP_TITLE,
    },
    body: JSON.stringify({
      model,
      temperature: MODEL_CONFIG.TEMPERATURE,
      max_tokens: MODEL_CONFIG.MAX_TOKENS,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    }),
  };
}

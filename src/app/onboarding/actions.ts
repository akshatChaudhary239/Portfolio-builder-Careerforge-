'use server';

import { LocalDB, ProfessionCategory, CareerProfile } from '@/db/local-db';
import { revalidatePath } from 'next/cache';
import { AIService } from '@/lib/ai-service';
import { parseResume } from '@/lib/resume-parser';
import { devLog, CareerForgeError } from '@/lib/model-config';
import { generateProfessionalBlueprint, QuestionnaireAnswers } from '@/lib/blueprint-engine';

// ─────────────────────────────────────────────────────────────────────────────
// TEXT EXTRACTION — PDF / DOCX / TXT
// ─────────────────────────────────────────────────────────────────────────────

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    try {
      // Polyfill browser globals required by pdfjs-dist in Node
      if (typeof global !== 'undefined') {
        if (!(global as any).DOMMatrix) (global as any).DOMMatrix = class DOMMatrix {};
        if (!(global as any).ImageData) (global as any).ImageData = class ImageData {};
        if (!(global as any).Path2D) (global as any).Path2D = class Path2D {};
      }

      const pdfParseModule = require('pdf-parse');
      const { PDFParse } = pdfParseModule;

      if (typeof PDFParse !== 'function') {
        throw new CareerForgeError('EXTRACTION_ERROR', 'PDFParse constructor not found in pdf-parse module');
      }

      const parser = new PDFParse(new Uint8Array(buffer));
      const result = await parser.getText();
      const text = result?.text ?? '';

      devLog('PDF extraction complete', {
        file: file.name,
        chars: text.length,
        pages: result?.pages?.length,
      });

      return text;
    } catch (err) {
      throw new CareerForgeError('EXTRACTION_ERROR', `PDF extraction failed: ${(err as Error).message}`, err);
    }
  }

  if (fileName.endsWith('.docx')) {
    try {
      const mammoth = require('mammoth');
      const [rawResult, htmlResult] = await Promise.all([
        mammoth.extractRawText({ buffer }),
        mammoth.convertToHtml({ buffer })
      ]);
      let text = rawResult?.value ?? '';
      const html = htmlResult?.value ?? '';

      // Extract hidden hyperlinks from HTML and append to raw text
      const URL_RE = /href="([^"]+)"/g;
      let match;
      while ((match = URL_RE.exec(html)) !== null) {
        const url = match[1];
        if (url.includes('github.com') || url.includes('linkedin.com')) {
          text += `\n${url}`;
        }
      }

      devLog('DOCX extraction complete', { file: file.name, chars: text.length });
      return text;
    } catch (err) {
      throw new CareerForgeError('EXTRACTION_ERROR', `DOCX extraction failed: ${(err as Error).message}`, err);
    }
  }

  // Plain text / TXT fallback
  const text = buffer.toString('utf-8');
  devLog('TXT extraction complete', { file: file.name, chars: text.length });
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION: Parse resume from uploaded file
// ─────────────────────────────────────────────────────────────────────────────

export async function parseResumeFileAction(formData: FormData, category: ProfessionCategory) {
  const startTime = Date.now();

  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new CareerForgeError('EXTRACTION_ERROR', 'No file was uploaded.');
    }

    // Stage 1: Extract raw text
    devLog('Starting file extraction', { name: file.name, size: file.size });
    const rawText = await extractTextFromFile(file);

    if (!rawText || rawText.trim().length < 20) {
      throw new CareerForgeError(
        'EXTRACTION_ERROR',
        'The document appears to be empty or could not be read. Please try a different file or paste your resume text manually.'
      );
    }

    // Stage 2: Rule-based deterministic parsing
    devLog('Starting rule-based parsing...');
    const parsed = await parseResume(rawText, category, file.name);

    devLog('Parsing complete', {
      durationMs: Date.now() - startTime,
      confidence: parsed.confidenceScores,
      isPartial: parsed.isPartialExtraction,
    });

    return {
      ...parsed,
      professionCategory: category,
    };
  } catch (err: any) {
    const isCareerForgeError = err instanceof CareerForgeError;
    console.error(`[CareerForge] ${isCareerForgeError ? err.category : 'EXTRACTION_ERROR'}:`, err.message);
    throw new Error(err.message || 'Could not parse the uploaded file.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION: Parse resume from pasted raw text
// ─────────────────────────────────────────────────────────────────────────────

export async function parseResumeAction(rawText: string, category: ProfessionCategory) {
  try {
    if (!rawText || rawText.trim().length < 20) {
      throw new CareerForgeError('PARSER_ERROR', 'The pasted text is too short to parse. Please paste your full resume content.');
    }

    devLog('Starting rule-based parsing of pasted text...');
    const parsed = await parseResume(rawText, category);

    devLog('Parsing complete', {
      confidence: parsed.confidenceScores,
      isPartial: parsed.isPartialExtraction,
    });

    return {
      ...parsed,
      professionCategory: category,
    };
  } catch (err: any) {
    console.error('[CareerForge] PARSER_ERROR:', err.message);
    throw new Error(err.message || 'Could not parse the resume text.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION: Confirm onboarding — save profile + trigger AI enhancement
// ─────────────────────────────────────────────────────────────────────────────

export async function confirmOnboardingAction(
  userId: string,
  careerProfilePayload: Omit<CareerProfile, 'id' | 'userId' | 'confirmed' | 'createdAt'>,
  questionnaireAnswers?: QuestionnaireAnswers
) {
  try {
    // Stage 1: AI Enhancement Layer (runs AFTER user review)
    let finalCareerProfile: Omit<CareerProfile, 'id' | 'userId' | 'confirmed' | 'createdAt'> | CareerProfile = careerProfilePayload;
    if (questionnaireAnswers) {
      try {
        devLog('Enhancing profile with questionnaire answers via AI...');
        finalCareerProfile = await AIService.enhanceProfileWithQuestionnaire(
          careerProfilePayload as CareerProfile,
          questionnaireAnswers
        );
        devLog('AI enhancement complete');
      } catch (enhanceErr) {
        // Non-blocking: if enhancement fails, use the user-reviewed data as-is
        console.warn('[CareerForge] Non-blocking enhancement error, using reviewed data as-is:', enhanceErr);
      }
    }

    // Generate Professional Blueprint
    const blueprint = generateProfessionalBlueprint(finalCareerProfile as CareerProfile, questionnaireAnswers);

    // Stage 2: Save confirmed profile
    const confirmedData = await LocalDB.saveCareerProfile({
      ...finalCareerProfile,
      userId,
      confirmed: true,
      professionalBlueprint: blueprint,
    });

    // Stage 3: Generate clean URL-friendly subdomain
    // Check if portfolio already exists to reuse subdomain
    const existingPortfolio = await LocalDB.getPortfolioByUserId(userId);
    const cleanSubdomain = existingPortfolio?.subdomain || (
      (confirmedData.personalInfo.fullName || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 12) + Math.random().toString(36).substring(2, 6)
    ) || `user${Math.floor(Math.random() * 1000000)}`;

    // Stage 4: Assign default template based on profession
    let defaultTemplate: 'dev' | 'corporate' | 'creative' = 'corporate';
    if (confirmedData.professionCategory === 'Developer' || confirmedData.professionCategory === 'Data Analyst') {
      defaultTemplate = 'dev';
    } else if (confirmedData.professionCategory === 'Designer') {
      defaultTemplate = 'creative';
    }

    // Stage 5: Save portfolio configuration
    await LocalDB.savePortfolio({
      userId,
      templateId: defaultTemplate,
      visibility: 'public',
      subdomain: cleanSubdomain,
      sectionToggles: {
        hero: true,
        skills: true,
        experience: true,
        education: true,
        projects: true,
        certifications: true,
        achievements: true,
        publications: true,
        workSamples: true,
      },
      sectionOrder: [
        'hero', 'skills', 'projects', 'experience', 'education',
        'certifications', 'achievements', 'publications', 'workSamples',
      ],
      sectionTitles: {
        hero: 'Hero',
        skills: 'Skills & Expertise',
        projects: 'Featured Projects',
        experience: 'Professional Timeline',
        education: 'Academic Background',
        certifications: 'Credentials & Certifications',
        achievements: 'Key Achievements',
        publications: 'Publications',
        workSamples: 'Work Samples',
      },
    });

    // Stage 6: Generate interview questions (AI with local fallback)
    const rawQuestions = await AIService.generateInterviewQuestions(confirmedData);
    await LocalDB.saveInterviewQuestions(rawQuestions.map((q: any) => ({ ...q, userId })));

    revalidatePath('/', 'layout');

    devLog('Onboarding confirmed successfully', { userId, subdomain: cleanSubdomain });
    return { success: true, subdomain: cleanSubdomain };
  } catch (err: any) {
    console.error('[CareerForge] confirmOnboardingAction error:', err);
    throw new Error('Could not confirm onboarding profile. Please try again.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION: Regenerate Assets (Edit Mode)
// ─────────────────────────────────────────────────────────────────────────────

export async function regenerateAssetsAction(userId: string, careerProfilePayload: CareerProfile) {
  try {
    devLog('Regenerating interview questions based on updated profile...');
    const rawQuestions = await AIService.generateInterviewQuestions(careerProfilePayload);
    await LocalDB.saveInterviewQuestions(rawQuestions.map((q: any) => ({ ...q, userId })));
    devLog('Assets regenerated successfully', { userId });
    return { success: true };
  } catch (err: any) {
    console.error('[CareerForge] regenerateAssetsAction error:', err);
    throw new Error('Could not regenerate assets. Please try again.');
  }
}

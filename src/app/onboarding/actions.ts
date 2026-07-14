'use server';

import { LocalDB, ProfessionCategory, CareerProfile } from '@/db/local-db';
import { revalidatePath } from 'next/cache';
import { AIService } from '@/lib/ai-service';
import { parseResume } from '@/lib/resume-parser';
import { devLog, CareerForgeError } from '@/lib/model-config';
import { generateProfessionalBlueprint, QuestionnaireAnswers } from '@/lib/blueprint-engine';
import { prisma } from '@/lib/prisma';

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

    try {
      const { getSessionUser } = await import('@/lib/auth');
      const user = await getSessionUser();
      if (user?.id) {
        const parseStatus = parsed.isPartialExtraction ? 'partial' : 'success';
        await recordResumeUploadAction(user.id, file.name, parseStatus, parsed);
      }
    } catch (dbErr) {
      console.error('Failed to log resume upload to database:', dbErr);
    }

    return {
      ...parsed,
      professionCategory: category,
    };
  } catch (err: any) {
    const isCareerForgeError = err instanceof CareerForgeError;
    console.error(`[GetProspectra] ${isCareerForgeError ? err.category : 'EXTRACTION_ERROR'}:`, err.message);
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
    console.error('[GetProspectra] PARSER_ERROR:', err.message);
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
        console.warn('[GetProspectra] Non-blocking enhancement error, using reviewed data as-is:', enhanceErr);
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

    try {
      await trackAppliedFieldsAction(userId, confirmedData);
    } catch (trackErr) {
      console.warn('[GetProspectra] trackAppliedFieldsAction error during onboarding:', trackErr);
    }

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
    console.error('[GetProspectra] confirmOnboardingAction error:', err);
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
    console.error('[GetProspectra] regenerateAssetsAction error:', err);
    throw new Error('Could not regenerate assets. Please try again.');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE TRACKING ACTIONS FOR RESUME AUTO-PARSE
// ─────────────────────────────────────────────────────────────────────────────

export async function recordResumeUploadAction(
  userId: string,
  fileName: string,
  parseStatus: 'success' | 'partial' | 'failed',
  parsedData: any
) {
  try {
    const upload = await prisma.resumeUpload.create({
      data: {
        userId,
        fileUrl: fileName,
        parseStatus,
      }
    });

    const results = [];

    if (parsedData.personalInfo?.fullName) {
      results.push({ fieldName: 'fullName', extractedValue: parsedData.personalInfo.fullName, confidence: parsedData.confidenceScores?.fullName >= 70 ? 'high' : parsedData.confidenceScores?.fullName >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.personalInfo?.email) {
      results.push({ fieldName: 'email', extractedValue: parsedData.personalInfo.email, confidence: parsedData.confidenceScores?.email >= 70 ? 'high' : parsedData.confidenceScores?.email >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.personalInfo?.phone) {
      results.push({ fieldName: 'phone', extractedValue: parsedData.personalInfo.phone, confidence: parsedData.confidenceScores?.phone >= 70 ? 'high' : parsedData.confidenceScores?.phone >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.personalInfo?.location) {
      results.push({ fieldName: 'location', extractedValue: parsedData.personalInfo.location, confidence: parsedData.confidenceScores?.location >= 70 ? 'high' : parsedData.confidenceScores?.location >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.summary) {
      results.push({ fieldName: 'summary', extractedValue: parsedData.summary, confidence: 'medium' });
    }
    if (parsedData.skills && parsedData.skills.length > 0) {
      results.push({ fieldName: 'skills', extractedValue: JSON.stringify(parsedData.skills), confidence: parsedData.confidenceScores?.skills >= 70 ? 'high' : parsedData.confidenceScores?.skills >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.experience && parsedData.experience.length > 0) {
      results.push({ fieldName: 'experience', extractedValue: JSON.stringify(parsedData.experience), confidence: parsedData.confidenceScores?.experience >= 70 ? 'high' : parsedData.confidenceScores?.experience >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.projects && parsedData.projects.length > 0) {
      results.push({ fieldName: 'projects', extractedValue: JSON.stringify(parsedData.projects), confidence: parsedData.confidenceScores?.projects >= 70 ? 'high' : parsedData.confidenceScores?.projects >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.education && parsedData.education.length > 0) {
      results.push({ fieldName: 'education', extractedValue: JSON.stringify(parsedData.education), confidence: parsedData.confidenceScores?.education >= 70 ? 'high' : parsedData.confidenceScores?.education >= 40 ? 'medium' : 'low' });
    }
    if (parsedData.certifications && parsedData.certifications.length > 0) {
      results.push({ fieldName: 'certifications', extractedValue: JSON.stringify(parsedData.certifications), confidence: parsedData.confidenceScores?.certifications >= 70 ? 'high' : parsedData.confidenceScores?.certifications >= 40 ? 'medium' : 'low' });
    }

    if (results.length > 0) {
      await prisma.resumeParseResult.createMany({
        data: results.map(r => ({
          resumeUploadId: upload.id,
          fieldName: r.fieldName,
          extractedValue: r.extractedValue,
          confidence: r.confidence,
          applied: true
        }))
      });
    }

    return { success: true, uploadId: upload.id };
  } catch (err) {
    console.error('Error saving resume upload results:', err);
    return { success: false };
  }
}

export async function trackAppliedFieldsAction(userId: string, finalProfile: any) {
  try {
    const latestUpload = await prisma.resumeUpload.findFirst({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
      include: { parseResults: true }
    });

    if (!latestUpload || latestUpload.parseResults.length === 0) return { success: true };

    for (const result of latestUpload.parseResults) {
      let isApplied = false;

      if (result.fieldName === 'fullName') {
        isApplied = finalProfile.personalInfo?.fullName === result.extractedValue;
      } else if (result.fieldName === 'email') {
        isApplied = finalProfile.personalInfo?.email === result.extractedValue;
      } else if (result.fieldName === 'phone') {
        isApplied = finalProfile.personalInfo?.phone === result.extractedValue;
      } else if (result.fieldName === 'location') {
        isApplied = finalProfile.personalInfo?.location === result.extractedValue;
      } else if (result.fieldName === 'summary') {
        isApplied = finalProfile.summary === result.extractedValue;
      } else if (result.fieldName === 'skills') {
        try {
          const parsedSkills = JSON.parse(result.extractedValue);
          isApplied = parsedSkills.every((ps: any) => 
            finalProfile.skills?.some((fs: any) => fs.name?.toLowerCase().trim() === ps.name?.toLowerCase().trim())
          );
        } catch {
          isApplied = false;
        }
      } else if (result.fieldName === 'experience') {
        try {
          const parsedExp = JSON.parse(result.extractedValue);
          isApplied = parsedExp.every((pe: any) => 
            finalProfile.experience?.some((fe: any) => fe.company?.toLowerCase().trim() === pe.company?.toLowerCase().trim())
          );
        } catch {
          isApplied = false;
        }
      } else if (result.fieldName === 'projects') {
        try {
          const parsedProj = JSON.parse(result.extractedValue);
          isApplied = parsedProj.every((pp: any) => 
            finalProfile.projects?.some((fp: any) => (fp.title || fp.name)?.toLowerCase().trim() === (pp.title || pp.name)?.toLowerCase().trim())
          );
        } catch {
          isApplied = false;
        }
      } else if (result.fieldName === 'education') {
        try {
          const parsedEdu = JSON.parse(result.extractedValue);
          isApplied = parsedEdu.every((pe: any) => 
            finalProfile.education?.some((fe: any) => fe.institution?.toLowerCase().trim() === pe.institution?.toLowerCase().trim())
          );
        } catch {
          isApplied = false;
        }
      } else if (result.fieldName === 'certifications') {
        try {
          const parsedCert = JSON.parse(result.extractedValue);
          isApplied = parsedCert.every((pc: any) => 
            finalProfile.certifications?.some((fc: any) => fc.title?.toLowerCase().trim() === pc.title?.toLowerCase().trim())
          );
        } catch {
          isApplied = false;
        }
      }

      await prisma.resumeParseResult.update({
        where: { id: result.id },
        data: { applied: isApplied }
      });
    }

    return { success: true };
  } catch (err) {
    console.error('Error tracking applied fields:', err);
    return { success: false };
  }
}

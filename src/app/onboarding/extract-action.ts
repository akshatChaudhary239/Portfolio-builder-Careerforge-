import { extractTextFromFile } from './actions';

export async function extractResumeTextAction(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      throw new Error('No resume file found in the request.');
    }
    const rawText = await extractTextFromFile(file);
    if (!rawText || rawText.trim().length < 20) {
      throw new Error('The document appears to be empty or could not be read.');
    }
    return { rawText, fileName: file.name };
  } catch (err: any) {
    console.error('Failed to extract text from resume:', err.message);
    throw new Error(err.message || 'Could not extract text from the file.');
  }
}

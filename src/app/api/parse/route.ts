import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { resumeSchema } from '@/lib/resume-parser/schema';
import { MODEL_CONFIG } from '@/lib/model-config';

export const runtime = 'edge';
export const maxDuration = 60; // Allows up to 60s if on Pro, bypasses 10s default

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, category } = await req.json();

    if (!text) {
      return new Response('Missing resume text', { status: 400 });
    }

    const systemPrompt = `You are a world-class resume parser API. 
Your job is to read the provided resume text and extract all relevant information into the precise JSON structure requested.

CRITICAL INSTRUCTIONS FOR ACCURACY:
1. HEADING AND SECTION AWARENESS: Pay extremely close attention to the headings in the text (e.g., "EXPERIENCE", "PROJECTS", "EDUCATION"). Only extract items that explicitly fall under those sections. For example, if "Style.AI" is listed under "Projects", it must go into the "projects" array, NOT the "experience" array.
2. BULLET POINTS: For the 'description' field in both Experience and Projects, you MUST format the content using bullet points (e.g. "- Did this\\n- Did that"). Do NOT write a giant paragraph. Use newlines (\\n) to separate each bullet point.
3. EXACT MAPPING: Do not invent or guess companies if they are actually projects. A project has a name and technologies, whereas experience has a company name and job title.
4. If a field is not present in the resume, leave it as an empty string or empty array.

The user is applying for roles in the category: ${category}.`;

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'), 
      system: systemPrompt + "\n\nCRITICAL: Return ONLY valid JSON matching the schema. DO NOT wrap in markdown block (no ```json). Start with { and end with }.",
      prompt: `Parse this resume:\n\n${text}`,
      temperature: 0.1,
    });

    let jsonString = result.text.trim();
    if (jsonString.startsWith('```json')) jsonString = jsonString.slice(7);
    if (jsonString.startsWith('```')) jsonString = jsonString.slice(3);
    if (jsonString.endsWith('```')) jsonString = jsonString.slice(0, -3);

    const parsedData = JSON.parse(jsonString);

    return new Response(JSON.stringify(parsedData), {
        headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error in streaming parser:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}

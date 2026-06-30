import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { MODEL_CONFIG } from '@/lib/model-config';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { summary, profileData, missingKeywords } = await req.json();

    if (!summary) {
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 });
    }

    // Build the context string from profileData
    const profContext = profileData?.professionCategory || 'Professional';
    const skillsContext = profileData?.skills?.join(', ') || 'None provided';
    const expContext = profileData?.experience?.map((e: any) => e.title).join(', ') || 'None provided';
    const projContext = profileData?.projects?.map((p: any) => p.title).join(', ') || 'None provided';

    const prompt = `You are an expert ATS resume writer.
Enhance the following professional summary. Make it punchy, highly professional, and tailored to the following context:

Profession: ${profContext}
Skills: ${skillsContext}
Experience: ${expContext}
Projects: ${projContext}

${missingKeywords?.length ? `Try to naturally weave in these missing ATS keywords if relevant: ${missingKeywords.join(', ')}\n` : ''}
Original Summary:
"${summary}"

Return ONLY the enhanced summary text. No introductory remarks, no quotes around the output. Keep it to 3-4 impactful sentences.`;

    let response = await fetch(MODEL_CONFIG.OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': MODEL_CONFIG.HTTP_REFERER,
        'X-Title': MODEL_CONFIG.APP_TITLE,
      },
      body: JSON.stringify({
        model: MODEL_CONFIG.PRIMARY_FREE_MODEL,
        temperature: MODEL_CONFIG.TEMPERATURE,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      console.warn(`Primary model failed: ${response.statusText}. Retrying with backup...`);
      response = await fetch(MODEL_CONFIG.OPENROUTER_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': MODEL_CONFIG.HTTP_REFERER,
          'X-Title': MODEL_CONFIG.APP_TITLE,
        },
        body: JSON.stringify({
          model: MODEL_CONFIG.BACKUP_FREE_MODEL,
          temperature: MODEL_CONFIG.TEMPERATURE,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }
    }

    const json = await response.json();
    const enhancedSummary = json.choices?.[0]?.message?.content?.trim();

    if (!enhancedSummary) {
      console.error('OpenRouter returned unexpected JSON:', json);
      throw new Error('No content returned from AI');
    }

    return NextResponse.json({ enhancedSummary });
  } catch (error) {
    console.error('Enhance Summary Error:', error);
    return NextResponse.json({ error: 'Failed to enhance summary' }, { status: 500 });
  }
}

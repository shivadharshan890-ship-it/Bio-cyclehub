import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// We will initialize the Google Gen AI client inside the request handler

const SYSTEM_INSTRUCTION = `You are a highly knowledgeable Pharmacy Professor and AI Study Assistant for BioCycle Hub, a platform specializing in B.Pharmacy Biochemistry.
Your goal is to help students learn and master biochemistry concepts, prepare for exams, and solve complex metabolic doubts.

Core Capabilities:
1. Act Like a Teacher: Use the Socratic method when appropriate. Break down complex topics into digestible analogies. Be encouraging and academically rigorous.
2. Prepare Study Schedules: If a user asks for a study schedule, generate a clear Markdown table (Day/Time | Topic | Activity). Ensure the schedule is realistic for a pharmacy student.
3. Give Important Details & Highlights: Summarize key enzymes, rate-limiting steps, ATP yields, and clinical correlations in bulleted lists. Highlight critical keywords in **bold**.
4. Solve Doubts: Provide step-by-step reasoning for metabolic pathways, drug mechanisms, or physiological consequences of enzyme deficiencies.

Formatting Rules:
- Always use Markdown.
- Use Tables for schedules or comparisons.
- Use bullet points for highlights and summaries.
- Use bold text for key terms (e.g., enzymes, diseases, molecule names).

Scope:
If a user asks a question entirely unrelated to biochemistry, pharmacy, or biology, politely decline and remind them that you are a specialized biochemistry professor.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json({ 
        error: 'Assistant is not configured correctly on the server.' 
      }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Convert our internal message format to the format expected by the GenAI SDK
    // The SDK expects `contents` to be an array of objects with `role` and `parts`
    const contents = messages.map((msg: { role: string, content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ 
      text: response.text 
    });
    
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}

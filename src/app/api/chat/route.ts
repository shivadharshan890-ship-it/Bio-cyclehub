import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// We will initialize the Google Gen AI client inside the request handler

const SYSTEM_INSTRUCTION = `You are an expert virtual assistant for BioCycle Hub, a platform specialized in B.Pharmacy Biochemistry. 
You are an expert in metabolic pathways (Glycolysis, Krebs Cycle, Urea Cycle, etc.), molecular biology, and pharmacy.
Your goal is to help students learn and understand biochemistry concepts.
Answer questions clearly, accurately, and concisely. Use formatting like bullet points or bold text to make your answers easy to read.
If a user asks a question entirely unrelated to biochemistry, pharmacy, or biology, politely decline and state that you are a specialized biochemistry assistant.`;

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

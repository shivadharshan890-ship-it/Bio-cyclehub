import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const match = envFile.match(/GEMINI_API_KEY=(.*)/);
  if (match) process.env.GEMINI_API_KEY = match[1].trim();
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  console.log("Testing API...");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: "Hello",
    });
    console.log("Success:", response.text);
  } catch (e: any) {
    console.log("Error:", e.message || e);
  }
}
test();

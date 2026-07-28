const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

// IMPORTANT: Set your Gemini API key in your environment variables
// export GEMINI_API_KEY="your-api-key"

const ai = new GoogleGenAI({});

const PATHWAYS_TO_GENERATE = [
  "krebs-cycle", "electron-transport-chain", "gluconeogenesis",
  "glycogenesis", "glycogenolysis", "ppp", "beta-oxidation",
  "fatty-acid-synthesis", "ketogenesis", "cholesterol-biosynthesis",
  "urea-cycle", "purine-metabolism", "pyrimidine-metabolism",
  "dna-replication", "transcription", "translation"
  // Add remaining pathways here
];

const PROMPT_TEMPLATE = `
You are an expert biochemistry professor.
Generate a complete, medically accurate JSON object for the biochemical pathway: {PATHWAY_NAME}.

The output must exactly match these TypeScript interfaces:
export interface MoleculeCount { ATP?: number; ADP?: number; Pi?: number; NADH?: number; NAD_plus?: number; NADPH?: number; FADH2?: number; FAD?: number; GTP?: number; CO2?: number; H2O?: number; }
export interface ReactionNode { step: number; title: string; enzyme: string; substrate: string; product: string; energyChange?: string; type: "regulatory"|"reversible"|"irreversible"; isRateLimiting?: boolean; description: string; cofactors?: string[]; vitamins?: string[]; diseases?: string[]; drugs?: string[]; highYield?: string; vivaQuestions?: string[]; mnemonics?: string[]; nadhProduced?: boolean; fadh2Produced?: boolean; waterProduced?: boolean; co2Produced?: boolean; x: number; y: number; molecules?: { consumes?: MoleculeCount; produces?: MoleculeCount; } }
export interface Pathway { slug: string; name: string; category: string; overview: { definition: string; function: string; importance: string; }; location: { organ: string; cellType: string; cellularLocation: string; }; inputs: string[]; outputs: string[]; rateLimitingStep: { name: string; enzyme: string; description: string; regulation: string; clinicalImportance: string; }; regulationSummary: { activators: string[]; inhibitors: string[]; hormonalControl: string; }; clinicalSignificance: { diseases: string[]; drugTargets: string[]; labFindings: string[]; }; reactions: ReactionNode[]; summaryCard: string; }

Also generate an array of 5 highly accurate quiz questions (type QuizQuestion).
Also generate an array of 5 flashcards (type Flashcard).

Return ONLY raw, valid JSON containing the keys: "pathway", "quizzes", "flashcards". Do not use markdown blocks.
`;

async function generatePathway(pathwayName) {
  console.log(`Generating data for ${pathwayName}...`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: PROMPT_TEMPLATE.replace('{PATHWAY_NAME}', pathwayName),
      config: {
        temperature: 0.2, // Low temp for factual accuracy
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text());
    
    // Save to file
    const fileContent = `
import { Pathway, QuizQuestion, Flashcard } from "../db";

export const ${pathwayName.replace(/-/g, '')}Pathway: Pathway = ${JSON.stringify(data.pathway, null, 2)};
export const ${pathwayName.replace(/-/g, '')}Quizzes: QuizQuestion[] = ${JSON.stringify(data.quizzes, null, 2)};
export const ${pathwayName.replace(/-/g, '')}Flashcards: Flashcard[] = ${JSON.stringify(data.flashcards, null, 2)};
`;
    fs.writeFileSync(`src/lib/data/${pathwayName}-gold.ts`, fileContent);
    console.log(`Successfully generated and saved ${pathwayName}-gold.ts`);

  } catch (error) {
    console.error(`Failed to generate ${pathwayName}:`, error);
  }
}

async function run() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY environment variable is missing.");
    console.log("Please run: $env:GEMINI_API_KEY='your-key' (Windows) before running this script.");
    process.exit(1);
  }

  for (const pathway of PATHWAYS_TO_GENERATE) {
    await generatePathway(pathway);
    // Pause for 65 seconds to respect free tier rate limits (15 RPM / 1M TPM)
    await new Promise(resolve => setTimeout(resolve, 65000));
  }
}

run();

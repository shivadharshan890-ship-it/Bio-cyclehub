import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const match = envFile.match(/GEMINI_API_KEY=(.*)/);
  if (match) process.env.GEMINI_API_KEY = match[1].trim();
}

const apiKey = process.env.GEMINI_API_KEY;

const pathways = [
  { name: "Glycolysis", category: "Carbohydrate" },
  { name: "Krebs Cycle", category: "Carbohydrate" },
  { name: "Electron Transport Chain", category: "Carbohydrate" },
  { name: "Gluconeogenesis", category: "Carbohydrate" },
  { name: "Pentose Phosphate Pathway", category: "Carbohydrate" },
  { name: "Glycogenesis", category: "Carbohydrate" },
  { name: "Glycogenolysis", category: "Carbohydrate" },
  { name: "Fructose Metabolism", category: "Carbohydrate" },
  { name: "Galactose Metabolism", category: "Carbohydrate" },
  
  { name: "Beta-Oxidation", category: "Lipid" },
  { name: "Fatty Acid Synthesis", category: "Lipid" },
  { name: "Cholesterol Biosynthesis", category: "Lipid" },
  { name: "Ketogenesis", category: "Lipid" },
  { name: "Eicosanoid Synthesis", category: "Lipid" },
  { name: "Sphingolipid Synthesis", category: "Lipid" },
  { name: "Steroid Hormone Synthesis", category: "Lipid" },
  
  { name: "Urea Cycle", category: "Protein" },
  { name: "Amino Acid Degradation", category: "Protein" },
  
  { name: "Purine Synthesis", category: "Nucleotide" },
  { name: "Pyrimidine Synthesis", category: "Nucleotide" },
  { name: "Purine Degradation", category: "Nucleotide" },
  
  { name: "DNA Replication", category: "Genetics" },
  { name: "Transcription", category: "Genetics" },
  { name: "Translation", category: "Genetics" },
  
  { name: "Heme Synthesis", category: "Specialized" },
  { name: "Heme Degradation", category: "Specialized" }
];

async function generate() {
  const flashcardsFile = path.join(process.cwd(), 'src/lib/data/flashcards.json');
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(flashcardsFile, 'utf8'));
  } catch(e) {
    console.error("Could not read existing", e);
  }

  let nextId = existing.length + 1;
  const newFlashcards = [...existing];

  for (const pw of pathways) {
    console.log(`Generating flashcards for ${pw.name}...`);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate exactly 15 high-yield, pharmacy-level biochemistry flashcards for the pathway: "${pw.name}". Category is "${pw.category}". Return ONLY a JSON array of objects. Each object must have properties: "pathwayName" (must be exactly "${pw.name}"), "front" (the question), "back" (the answer), and "category" (must be exactly "${pw.category}"). Ensure accuracy and focus on rate-limiting steps, enzymes, clinical correlations, and energetics.`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`API Error for ${pw.name}: ${response.status} ${errText}`);
        continue;
      }
      
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const generated = JSON.parse(text);
      
      for (const fc of generated) {
        fc.id = `fc_ai_${Date.now()}_${nextId++}`;
        newFlashcards.push(fc);
      }
      console.log(`Added ${generated.length} flashcards for ${pw.name}`);
      
      fs.writeFileSync(flashcardsFile, JSON.stringify(newFlashcards, null, 2));
      
      await new Promise(r => setTimeout(r, 4000));
    } catch (e: any) {
      console.error(`Failed on ${pw.name}:`, e.message || e);
    }
  }
  
  console.log(`Finished! Total flashcards is now ${newFlashcards.length}`);
}

generate();

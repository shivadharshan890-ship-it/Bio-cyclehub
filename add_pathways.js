const fs = require('fs');

const { carbohydratePathways } = require('./src/lib/data/carbohydrates');
const { lipidPathways } = require('./src/lib/data/lipids');
const { proteinPathways } = require('./src/lib/data/proteins');

const allNewPathways = [...carbohydratePathways, ...lipidPathways, ...proteinPathways];

let dbContent = fs.readFileSync('src/lib/db.ts', 'utf8');

// Ensure we have a place to insert
// INITIAL_PATHWAYS ends with "];" followed by something else.
// Let's find the end of INITIAL_PATHWAYS array.
// Look for `export const INITIAL_PATHWAYS: Pathway[] = [` or `const INITIAL_PATHWAYS: Pathway[] = [`
// It's `const INITIAL_PATHWAYS: Pathway[] = [` in db.ts

const match = dbContent.match(/const INITIAL_PATHWAYS:\s*Pathway\[\]\s*=\s*\[/);
if (!match) {
  console.error("Could not find INITIAL_PATHWAYS start.");
  process.exit(1);
}

// Find the matching closing bracket for INITIAL_PATHWAYS
let openBrackets = 0;
let arrayEndIndex = -1;
let startIndex = match.index + match[0].length - 1; // points to '['

for (let i = startIndex; i < dbContent.length; i++) {
  if (dbContent[i] === '[') openBrackets++;
  if (dbContent[i] === ']') {
    openBrackets--;
    if (openBrackets === 0) {
      arrayEndIndex = i;
      break;
    }
  }
}

if (arrayEndIndex === -1) {
  console.error("Could not find end of INITIAL_PATHWAYS.");
  process.exit(1);
}

// Ensure the new pathways have the mock metadata to prevent TypeScript errors
const enrichPathway = (p) => {
  return {
    ...p,
    location: {
      organ: p.location?.organ || p.location?.tissue || "Various organs",
      cellType: p.location?.cellType || "Various cells",
      cellularLocation: p.location?.cellular || p.location?.cellularLocation || "Cytoplasm or Mitochondria"
    },
    inputs: p.inputs || ["Precursors"],
    outputs: p.outputs || ["Products"],
    energyBalance: p.energyBalance || {
      atpUsed: 0,
      atpProduced: 0,
      nadh: 0,
      fadh2: 0,
      gtp: 0,
      summary: "Energy balance depends on the specific pathway steps."
    },
    rateLimitingStep: p.rateLimitingStep || {
      name: "Regulatory Step",
      enzyme: "Regulatory Enzyme",
      description: "Regulates the flow of the pathway.",
      regulation: "Allosteric and Hormonal control.",
      clinicalImportance: "Mutations may cause metabolic diseases."
    },
    regulationSummary: p.regulationSummary || {
      activators: [],
      inhibitors: [],
      hormonalControl: "Insulin/Glucagon ratio generally dictates activity."
    },
    clinicalSignificance: p.clinicalSignificance || {
      diseases: ["Specific enzyme deficiencies lead to metabolic disorders."],
      drugTargets: [],
      labFindings: []
    },
    summaryCard: p.summaryCard || "A crucial metabolic pathway."
  };
};

const enrichedNewPathways = allNewPathways
  .filter(p => !dbContent.includes(`slug: "${p.slug}"`)) // avoid duplicates
  .map(enrichPathway);

if (enrichedNewPathways.length === 0) {
  console.log("No new pathways to add.");
  process.exit(0);
}

// Convert them to a nicely formatted JSON-like string, but it's JS code so JSON.stringify is fine
const pathwaysString = ',\n' + enrichedNewPathways.map(p => JSON.stringify(p, null, 2)).join(',\n');

// Insert it right before the closing bracket
const newDbContent = dbContent.slice(0, arrayEndIndex) + pathwaysString + '\n' + dbContent.slice(arrayEndIndex);

fs.writeFileSync('src/lib/db.ts', newDbContent, 'utf8');
console.log(`Added ${enrichedNewPathways.length} new pathways to db.ts`);

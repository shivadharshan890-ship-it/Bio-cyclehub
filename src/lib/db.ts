// Biochemistry Data Layer & Mock Database fallback for BioCycle Hub
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration structure
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is fully configured
export const isFirebaseEnabled = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let app;
let auth: any;
let db: any;
let storage: any;

if (isFirebaseEnabled) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase failed to initialize:", error);
  }
}

// -------------------------------------------------------------
// Core Biochemistry Data Types
// -------------------------------------------------------------

export interface Cofactor {
  name: string;
  role: string;
}

export interface Enzyme {
  name: string;
  reaction: string;
  role: string;
  cofactors: Cofactor[];
  regulation: {
    activators: string[];
    inhibitors: string[];
    hormonal?: string;
  };
  clinicalSignificance: {
    diseases: string[];
    drugTargets: string[];
    laboratoryFindings?: string[];
  };
}

export interface ReactionNode {
  step: number;
  title: string;
  enzyme: string;
  substrate: string;
  product: string;
  energyChange?: string; // e.g. "ATP -> ADP", "NAD+ -> NADH", etc.
  type: "regulatory" | "reversible" | "irreversible";
  isRateLimiting?: boolean;
  description: string;
  cofactors?: string[];
  diseases?: string[];
  drugs?: string[];
  highYield?: string;
  nadhProduced?: boolean;
  fadh2Produced?: boolean;
  waterProduced?: boolean;
  co2Produced?: boolean;
  x: number; // coordinate in SVG space
  y: number; // coordinate in SVG space
  productX?: number; // custom product node coordinate if branching
  productY?: number;
}

export interface Pathway {
  slug: string;
  name: string;
  category: "Carbohydrate" | "Lipid" | "Protein" | "Nucleotide" | "Drug" | "Molecular";
  overview: {
    definition: string;
    function: string;
    importance: string;
  };
  location: {
    organ: string;
    cellType: string;
    cellularLocation: string;
  };
  inputs: string[];
  outputs: string[];
  energyBalance: {
    atpUsed: number;
    atpProduced: number;
    nadh: number;
    fadh2: number;
    gtp: number;
    summary: string;
  };
  rateLimitingStep: {
    name: string;
    enzyme: string;
    description: string;
    regulation: string;
    clinicalImportance: string;
  };
  regulationSummary: {
    activators: string[];
    inhibitors: string[];
    hormonalControl: string;
  };
  clinicalSignificance: {
    diseases: string[];
    drugTargets: string[];
    labFindings: string[];
  };
  reactions: ReactionNode[];
  summaryCard: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "boolean" | "fill-blank" | "enzyme-id";
  question: string;
  options?: string[]; // for mcq
  correctAnswer: string; // index for mcq, "true"/"false" for boolean, exact text for fill-blank
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pathwaySlug: string;
}

export interface Flashcard {
  id: string;
  pathwayName: string;
  front: string;
  back: string;
  category: string;
  bookmarked?: boolean;
  leitnerState?: "new" | "review" | "mastered";
}

export interface StudyNote {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  content: string; // Markdown text
  bookmarked?: boolean;
}

export interface FAQItem {
  id: string;
  category: "General" | "Pathways" | "Exams" | "App";
  question: string;
  answer: string;
  keywords: string[];
}

// -------------------------------------------------------------
// Expanded Biochemistry Pathways Database
// -------------------------------------------------------------

const INITIAL_PATHWAYS: Pathway[] = [
  {
    "slug": "glycolysis",
    "name": "Glycolysis",
    "category": "Carbohydrate",
    "overview": {
      "definition": "The metabolic pathway that converts glucose into pyruvate, generating free energy.",
      "function": "Provides ATP, NADH, and precursors for other pathways like the TCA cycle.",
      "importance": "Universal central pathway of glucose metabolism. Operates anaerobically or aerobically."
    },
    "location": {
      "organ": "All tissues (sole energy source for RBCs)",
      "cellType": "Various cells",
      "cellularLocation": "Cytosol"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Hexokinase / Glucokinase",
        "enzyme": "Hexokinase / Glucokinase",
        "substrate": "Glucose",
        "product": "Glucose-6-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Phosphorylation traps glucose inside the cell.",
        "cofactors": [
          "Mg2+"
        ],
        "diseases": [
          "MODY 2 (Glucokinase deficiency)"
        ],
        "highYield": "Hexokinase has low Km (high affinity) and is found in most tissues. Glucokinase has high Km and is found in Liver/Pancreas.",
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "Phosphohexose Isomerase",
        "enzyme": "Phosphohexose Isomerase",
        "substrate": "Glucose-6-Phosphate",
        "product": "Fructose-6-Phosphate",
        "type": "reversible",
        "description": "Isomerization of an aldose to a ketose.",
        "x": 500,
        "y": 300
      },
      {
        "step": 3,
        "title": "Phosphofructokinase-1 (PFK-1)",
        "enzyme": "Phosphofructokinase-1",
        "substrate": "Fructose-6-Phosphate",
        "product": "Fructose-1,6-Bisphosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "The committed and most important rate-limiting step of glycolysis.",
        "cofactors": [
          "Mg2+"
        ],
        "drugs": [
          "Fructose-2,6-bisphosphate (potent activator)"
        ],
        "highYield": "PFK-1 is inhibited by ATP and Citrate. It is activated by AMP and Fructose-2,6-bisphosphate.",
        "x": 500,
        "y": 500
      },
      {
        "step": 4,
        "title": "Aldolase",
        "enzyme": "Aldolase (A, B, C)",
        "substrate": "Fructose-1,6-Bisphosphate",
        "product": "DHAP & Glyceraldehyde-3-Phosphate",
        "type": "reversible",
        "description": "Cleavage of the 6-carbon sugar into two 3-carbon sugars.",
        "diseases": [
          "Hereditary Fructose Intolerance (Aldolase B deficiency)"
        ],
        "x": 500,
        "y": 700
      },
      {
        "step": 5,
        "title": "Triose Phosphate Isomerase",
        "enzyme": "Triose Phosphate Isomerase",
        "substrate": "Dihydroxyacetone Phosphate (DHAP)",
        "product": "Glyceraldehyde-3-Phosphate (G3P)",
        "type": "reversible",
        "description": "Isomerization allowing DHAP to enter the glycolytic payoff phase.",
        "x": 500,
        "y": 900
      },
      {
        "step": 6,
        "title": "G3P Dehydrogenase",
        "enzyme": "Glyceraldehyde-3-Phosphate Dehydrogenase",
        "substrate": "Glyceraldehyde-3-Phosphate",
        "product": "1,3-Bisphosphoglycerate",
        "energyChange": "Produces 1 NADH (x2 per glucose)",
        "nadhProduced": true,
        "type": "reversible",
        "description": "Oxidation and phosphorylation yielding NADH and a high-energy anhydride bond.",
        "cofactors": [
          "NAD+",
          "Inorganic Phosphate"
        ],
        "drugs": [
          "Arsenate (inhibitor replacing phosphate)"
        ],
        "x": 500,
        "y": 1100
      },
      {
        "step": 7,
        "title": "Phosphoglycerate Kinase",
        "enzyme": "Phosphoglycerate Kinase",
        "substrate": "1,3-Bisphosphoglycerate",
        "product": "3-Phosphoglycerate",
        "energyChange": "Produces 1 ATP (x2 per glucose)",
        "type": "reversible",
        "description": "Substrate-level phosphorylation yielding ATP. Breakeven point of glycolysis.",
        "cofactors": [
          "Mg2+"
        ],
        "x": 500,
        "y": 1300
      },
      {
        "step": 8,
        "title": "Phosphoglycerate Mutase",
        "enzyme": "Phosphoglycerate Mutase",
        "substrate": "3-Phosphoglycerate",
        "product": "2-Phosphoglycerate",
        "type": "reversible",
        "description": "Intramolecular shift of the phosphate group.",
        "x": 500,
        "y": 1500
      },
      {
        "step": 9,
        "title": "Enolase",
        "enzyme": "Enolase",
        "substrate": "2-Phosphoglycerate",
        "product": "Phosphoenolpyruvate (PEP)",
        "waterProduced": true,
        "type": "reversible",
        "description": "Dehydration reaction forming a high-energy enol phosphate.",
        "cofactors": [
          "Mg2+",
          "Mn2+"
        ],
        "drugs": [
          "Fluoride (inhibits enolase)"
        ],
        "x": 500,
        "y": 1700
      },
      {
        "step": 10,
        "title": "Pyruvate Kinase",
        "enzyme": "Pyruvate Kinase",
        "substrate": "Phosphoenolpyruvate (PEP)",
        "product": "Pyruvate",
        "energyChange": "Produces 1 ATP (x2 per glucose)",
        "type": "irreversible",
        "description": "Second substrate-level phosphorylation yielding ATP and Pyruvate.",
        "cofactors": [
          "Mg2+",
          "K+"
        ],
        "diseases": [
          "Pyruvate Kinase Deficiency (causes hemolytic anemia)"
        ],
        "highYield": "Activated by Fructose-1,6-Bisphosphate (feed-forward activation). Inhibited by ATP and Alanine.",
        "x": 500,
        "y": 1900
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "krebs-cycle",
    "name": "Krebs Cycle (Citric Acid Cycle)",
    "category": "Carbohydrate",
    "overview": {
      "definition": "A series of chemical reactions used by all aerobic organisms to generate energy.",
      "function": "Oxidizes Acetyl-CoA to CO2, generating NADH, FADH2, and GTP/ATP.",
      "importance": "Final common pathway for the oxidation of carbohydrates, lipids, and proteins."
    },
    "location": {
      "organ": "All tissues with mitochondria",
      "cellType": "Various cells",
      "cellularLocation": "Mitochondrial Matrix (except Succinate Dehydrogenase in inner membrane)"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Citrate Synthase",
        "enzyme": "Citrate Synthase",
        "substrate": "Acetyl-CoA + Oxaloacetate",
        "product": "Citrate",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Condensation of acetyl-CoA with oxaloacetate to form a 6-carbon molecule.",
        "highYield": "Inhibited by ATP, NADH, Succinyl-CoA, and Citrate (product inhibition).",
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "Aconitase",
        "enzyme": "Aconitase",
        "substrate": "Citrate",
        "product": "Isocitrate",
        "waterProduced": true,
        "type": "reversible",
        "description": "Isomerization via cis-Aconitate intermediate.",
        "cofactors": [
          "Iron-Sulfur cluster"
        ],
        "drugs": [
          "Fluoroacetate (rat poison) inhibits aconitase."
        ],
        "x": 650,
        "y": 300
      },
      {
        "step": 3,
        "title": "Isocitrate Dehydrogenase",
        "enzyme": "Isocitrate Dehydrogenase",
        "substrate": "Isocitrate",
        "product": "Alpha-Ketoglutarate",
        "energyChange": "Produces 1 NADH",
        "nadhProduced": true,
        "co2Produced": true,
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Oxidative decarboxylation. Rate-limiting step of the TCA cycle.",
        "cofactors": [
          "NAD+",
          "Mg2+",
          "Mn2+"
        ],
        "highYield": "Activated by ADP and Ca2+. Inhibited by ATP and NADH.",
        "x": 650,
        "y": 550
      },
      {
        "step": 4,
        "title": "Alpha-Ketoglutarate Dehydrogenase",
        "enzyme": "Alpha-Ketoglutarate Dehydrogenase",
        "substrate": "Alpha-Ketoglutarate",
        "product": "Succinyl-CoA",
        "energyChange": "Produces 1 NADH",
        "nadhProduced": true,
        "co2Produced": true,
        "type": "irreversible",
        "description": "Second oxidative decarboxylation.",
        "cofactors": [
          "Thiamine Pyrophosphate (B1)",
          "Lipoic Acid",
          "CoA (B5)",
          "FAD (B2)",
          "NAD+ (B3)"
        ],
        "diseases": [
          "Wernicke-Korsakoff (Thiamine deficiency impairs this step)"
        ],
        "highYield": "Mnemonic for cofactors: Tender Loving Care For No-one.",
        "x": 500,
        "y": 800
      },
      {
        "step": 5,
        "title": "Succinyl-CoA Synthetase",
        "enzyme": "Succinyl-CoA Synthetase (Thiokinase)",
        "substrate": "Succinyl-CoA",
        "product": "Succinate",
        "energyChange": "Produces 1 GTP (ATP equivalent)",
        "type": "reversible",
        "description": "Substrate-level phosphorylation yielding GTP.",
        "cofactors": [
          "GDP",
          "Pi",
          "Mg2+"
        ],
        "x": 350,
        "y": 550
      },
      {
        "step": 6,
        "title": "Succinate Dehydrogenase (Complex II)",
        "enzyme": "Succinate Dehydrogenase",
        "substrate": "Succinate",
        "product": "Fumarate",
        "energyChange": "Produces 1 FADH2",
        "fadh2Produced": true,
        "type": "reversible",
        "description": "Oxidation of succinate. Unique enzyme as it is embedded in the inner mitochondrial membrane (Complex II).",
        "cofactors": [
          "FAD"
        ],
        "drugs": [
          "Malonate (competitive inhibitor)"
        ],
        "x": 350,
        "y": 300
      },
      {
        "step": 7,
        "title": "Fumarase",
        "enzyme": "Fumarase",
        "substrate": "Fumarate",
        "product": "Malate",
        "type": "reversible",
        "description": "Hydration of fumarate's double bond.",
        "x": 400,
        "y": 150
      },
      {
        "step": 8,
        "title": "Malate Dehydrogenase",
        "enzyme": "Malate Dehydrogenase",
        "substrate": "Malate",
        "product": "Oxaloacetate",
        "energyChange": "Produces 1 NADH",
        "nadhProduced": true,
        "type": "reversible",
        "description": "Final oxidation regenerating oxaloacetate to restart the cycle.",
        "cofactors": [
          "NAD+"
        ],
        "x": 500,
        "y": -50
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "electron-transport-chain",
    "name": "Electron Transport Chain",
    "category": "Carbohydrate",
    "overview": {
      "definition": "A series of protein complexes that transfer electrons from electron donors to electron acceptors via redox reactions.",
      "function": "Creates an electrochemical proton gradient that drives the synthesis of ATP.",
      "importance": "Responsible for the vast majority of ATP production in aerobic cells (Oxidative Phosphorylation)."
    },
    "location": {
      "organ": "All tissues with mitochondria",
      "cellType": "Various cells",
      "cellularLocation": "Inner Mitochondrial Membrane"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Complex I (NADH Dehydrogenase)",
        "enzyme": "NADH:ubiquinone oxidoreductase",
        "substrate": "NADH",
        "product": "Ubiquinone (CoQ) & 4 Protons Pumped",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Oxidizes NADH and transfers electrons to CoQ, pumping 4 protons into the intermembrane space.",
        "cofactors": [
          "FMN",
          "Fe-S clusters"
        ],
        "drugs": [
          "Rotenone (inhibitor)"
        ],
        "x": 200,
        "y": 100
      },
      {
        "step": 2,
        "title": "Complex II (Succinate Dehydrogenase)",
        "enzyme": "Succinate Dehydrogenase",
        "substrate": "FADH2 (from Succinate)",
        "product": "Ubiquinone (CoQ) & 0 Protons Pumped",
        "type": "irreversible",
        "description": "Oxidizes FADH2 (part of TCA cycle) and transfers electrons to CoQ without pumping protons.",
        "cofactors": [
          "FAD",
          "Fe-S clusters"
        ],
        "x": 400,
        "y": 250
      },
      {
        "step": 3,
        "title": "Complex III (Cytochrome bc1)",
        "enzyme": "Coenzyme Q: Cytochrome c oxidoreductase",
        "substrate": "Reduced CoQ (Ubiquinol)",
        "product": "Cytochrome C & 4 Protons Pumped",
        "type": "irreversible",
        "description": "Transfers electrons from CoQ to Cytochrome C, pumping 4 protons (Q cycle).",
        "cofactors": [
          "Heme b",
          "Heme c1",
          "Fe-S cluster (Rieske)"
        ],
        "drugs": [
          "Antimycin A (inhibitor)"
        ],
        "x": 600,
        "y": 100
      },
      {
        "step": 4,
        "title": "Complex IV (Cytochrome c Oxidase)",
        "enzyme": "Cytochrome c Oxidase",
        "substrate": "Cytochrome C & Oxygen",
        "product": "Water (H2O) & 2 Protons Pumped",
        "waterProduced": true,
        "type": "irreversible",
        "description": "Final electron acceptor is Oxygen, which is reduced to Water.",
        "cofactors": [
          "Heme a",
          "Heme a3",
          "Copper (CuA, CuB)"
        ],
        "drugs": [
          "Cyanide (CN-), Carbon Monoxide (CO), Azide (inhibit Complex IV)"
        ],
        "highYield": "Cyanide toxicity is treated with Nitrites (induce methemoglobinemia) and Thiosulfate.",
        "x": 800,
        "y": 250
      },
      {
        "step": 5,
        "title": "Complex V (ATP Synthase)",
        "enzyme": "F1F0 ATP Synthase",
        "substrate": "Proton Gradient + ADP + Pi",
        "product": "ATP",
        "energyChange": "Produces Massive ATP",
        "type": "irreversible",
        "description": "Protons flow back into the matrix through F0, causing F1 rotation and ATP synthesis.",
        "drugs": [
          "Oligomycin (inhibits F0 directly)",
          "2,4-DNP (uncouples gradient)"
        ],
        "highYield": "Uncoupling agents like 2,4-DNP destroy the proton gradient, producing HEAT instead of ATP (hyperthermia).",
        "x": 1000,
        "y": 100
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "beta-oxidation",
    "name": "Beta-Oxidation of Fatty Acids",
    "category": "Lipid",
    "overview": {
      "definition": "The catabolic process by which fatty acid molecules are broken down to generate Acetyl-CoA.",
      "function": "Provides a massive amount of ATP during fasting or high energy demand states.",
      "importance": "Primary energy source for the heart and liver. Cannot be used by the brain directly (must be converted to ketones) or RBCs."
    },
    "location": {
      "organ": "Liver, Muscle, Heart (Not in RBCs or Brain)",
      "cellType": "Various cells",
      "cellularLocation": "Mitochondrial Matrix"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Fatty Acyl-CoA Synthetase",
        "enzyme": "Fatty Acyl-CoA Synthetase",
        "substrate": "Fatty Acid",
        "product": "Fatty Acyl-CoA",
        "energyChange": "Consumes 2 ATP equivalents",
        "type": "irreversible",
        "description": "Activation of fatty acid in the cytosol before transport.",
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "Carnitine Shuttle (CPT-1)",
        "enzyme": "Carnitine Palmitoyltransferase I (CPT-1)",
        "substrate": "Fatty Acyl-CoA + Carnitine",
        "product": "Acylcarnitine",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Transports long-chain fatty acids into the mitochondria. Rate-limiting step.",
        "highYield": "Inhibited strongly by Malonyl-CoA (prevents simultaneous synthesis and degradation).",
        "x": 500,
        "y": 300
      },
      {
        "step": 3,
        "title": "Acyl-CoA Dehydrogenase",
        "enzyme": "Acyl-CoA Dehydrogenase",
        "substrate": "Fatty Acyl-CoA",
        "product": "Trans-Enoyl-CoA",
        "energyChange": "Produces 1 FADH2",
        "fadh2Produced": true,
        "type": "reversible",
        "description": "First oxidation step, introduces a trans double bond.",
        "diseases": [
          "MCAD Deficiency (hypoglycemia without ketones)"
        ],
        "x": 500,
        "y": 500
      },
      {
        "step": 4,
        "title": "Enoyl-CoA Hydratase",
        "enzyme": "Enoyl-CoA Hydratase",
        "substrate": "Trans-Enoyl-CoA",
        "product": "L-Beta-Hydroxyacyl-CoA",
        "type": "reversible",
        "waterProduced": false,
        "description": "Hydration of the double bond.",
        "x": 500,
        "y": 700
      },
      {
        "step": 5,
        "title": "Beta-Hydroxyacyl-CoA Dehydrogenase",
        "enzyme": "Beta-Hydroxyacyl-CoA Dehydrogenase",
        "substrate": "L-Beta-Hydroxyacyl-CoA",
        "product": "Beta-Ketoacyl-CoA",
        "energyChange": "Produces 1 NADH",
        "nadhProduced": true,
        "type": "reversible",
        "description": "Second oxidation step.",
        "x": 500,
        "y": 900
      },
      {
        "step": 6,
        "title": "Thiolase",
        "enzyme": "Beta-Ketoacyl-CoA Thiolase",
        "substrate": "Beta-Ketoacyl-CoA",
        "product": "Acetyl-CoA + Acyl-CoA (n-2)",
        "type": "irreversible",
        "description": "Cleavage releasing Acetyl-CoA and a fatty acyl-CoA shortened by 2 carbons, which re-enters step 3.",
        "x": 500,
        "y": 1100
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "fatty-acid-synthesis",
    "name": "Fatty Acid Synthesis",
    "category": "Lipid",
    "overview": {
      "definition": "The creation of fatty acids from acetyl-CoA and NADPH.",
      "function": "Stores excess energy (carbohydrates) as fat.",
      "importance": "Highly active in the fed state, stimulated by insulin."
    },
    "location": {
      "organ": "Liver, Adipose tissue, Lactating mammary glands",
      "cellType": "Various cells",
      "cellularLocation": "Cytosol"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Citrate Shuttle",
        "enzyme": "ATP Citrate Lyase",
        "substrate": "Citrate",
        "product": "Acetyl-CoA + Oxaloacetate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "description": "Citrate exits mitochondria and is cleaved in cytosol to provide Acetyl-CoA for synthesis.",
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "Acetyl-CoA Carboxylase (ACC)",
        "enzyme": "Acetyl-CoA Carboxylase (ACC)",
        "substrate": "Acetyl-CoA",
        "product": "Malonyl-CoA",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Carboxylation of Acetyl-CoA. The rate-limiting step of fatty acid synthesis.",
        "cofactors": [
          "Biotin (B7)",
          "CO2"
        ],
        "highYield": "Activated by Insulin and Citrate. Inhibited by Glucagon and Palmitoyl-CoA.",
        "x": 500,
        "y": 350
      },
      {
        "step": 3,
        "title": "Fatty Acid Synthase (Condensation)",
        "enzyme": "Fatty Acid Synthase (Condensing Enzyme)",
        "substrate": "Malonyl-CoA + Acetyl-CoA",
        "product": "Beta-Ketoacyl-ACP",
        "co2Produced": true,
        "type": "irreversible",
        "description": "Condensation reaction driven by decarboxylation.",
        "x": 500,
        "y": 600
      },
      {
        "step": 4,
        "title": "Fatty Acid Synthase (Reduction 1)",
        "enzyme": "Fatty Acid Synthase (Reductase)",
        "substrate": "Beta-Ketoacyl-ACP",
        "product": "Beta-Hydroxyacyl-ACP",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "description": "Reduction using NADPH (supplied by Pentose Phosphate Pathway).",
        "x": 500,
        "y": 800
      },
      {
        "step": 5,
        "title": "Fatty Acid Synthase (Dehydration)",
        "enzyme": "Fatty Acid Synthase (Dehydratase)",
        "substrate": "Beta-Hydroxyacyl-ACP",
        "product": "Enoyl-ACP",
        "waterProduced": true,
        "type": "irreversible",
        "description": "Removal of water.",
        "x": 500,
        "y": 1000
      },
      {
        "step": 6,
        "title": "Fatty Acid Synthase (Reduction 2)",
        "enzyme": "Fatty Acid Synthase (Reductase)",
        "substrate": "Enoyl-ACP",
        "product": "Acyl-ACP (n+2)",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "description": "Second reduction using NADPH, completing one cycle of 2-carbon elongation.",
        "x": 500,
        "y": 1200
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "cholesterol-biosynthesis",
    "name": "Cholesterol Biosynthesis",
    "category": "Lipid",
    "overview": {
      "definition": "The metabolic synthesis of cholesterol from Acetyl-CoA.",
      "function": "Provides structural components for cell membranes and precursors for steroid hormones and bile acids.",
      "importance": "Crucial pathway targeted by statins to lower serum cholesterol levels."
    },
    "location": {
      "organ": "Liver (primarily)",
      "cellType": "Various cells",
      "cellularLocation": "Cytosol and Smooth Endoplasmic Reticulum"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Thiolase",
        "enzyme": "Acetoacetyl-CoA Thiolase",
        "substrate": "2 Acetyl-CoA",
        "product": "Acetoacetyl-CoA",
        "type": "reversible",
        "description": "Condensation of two Acetyl-CoA molecules.",
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "HMG-CoA Synthase",
        "enzyme": "HMG-CoA Synthase (Cytosolic)",
        "substrate": "Acetoacetyl-CoA + Acetyl-CoA",
        "product": "HMG-CoA",
        "type": "irreversible",
        "description": "Addition of a third Acetyl-CoA.",
        "x": 500,
        "y": 300
      },
      {
        "step": 3,
        "title": "HMG-CoA Reductase",
        "enzyme": "HMG-CoA Reductase",
        "substrate": "HMG-CoA",
        "product": "Mevalonate",
        "energyChange": "Consumes 2 NADPH",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "The rate-limiting and committed step of cholesterol synthesis.",
        "drugs": [
          "Statins (competitive inhibitors)"
        ],
        "highYield": "Inhibited by Glucagon and intracellular cholesterol. Activated by Insulin.",
        "x": 500,
        "y": 550
      },
      {
        "step": 4,
        "title": "Mevalonate Kinase",
        "enzyme": "Mevalonate Kinase",
        "substrate": "Mevalonate",
        "product": "5-Phosphomevalonate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "description": "First phosphorylation step.",
        "x": 500,
        "y": 800
      },
      {
        "step": 5,
        "title": "Squalene Synthase",
        "enzyme": "Squalene Synthase",
        "substrate": "Farnesyl Pyrophosphate (x2)",
        "product": "Squalene",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "description": "Condensation of two 15-carbon units to form a 30-carbon squalene.",
        "x": 500,
        "y": 1050
      },
      {
        "step": 6,
        "title": "Lanosterol Synthase",
        "enzyme": "Lanosterol Synthase",
        "substrate": "Squalene Epoxide",
        "product": "Lanosterol",
        "type": "irreversible",
        "description": "Cyclization of the linear squalene into the four-ring steroid nucleus.",
        "x": 500,
        "y": 1300
      },
      {
        "step": 7,
        "title": "Cholesterol Synthesis",
        "enzyme": "Multiple Enzymes (e.g. 7-Dehydrocholesterol Reductase)",
        "substrate": "Lanosterol",
        "product": "Cholesterol",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "description": "19-step conversion removing 3 methyl groups.",
        "x": 500,
        "y": 1550
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "ketogenesis",
    "name": "Ketogenesis",
    "category": "Lipid",
    "overview": {
      "definition": "The process by which ketone bodies are produced as a result of fatty acid breakdown.",
      "function": "Provides a water-soluble alternative energy source for the brain during fasting.",
      "importance": "Crucial during starvation or uncontrolled diabetes (can lead to DKA)."
    },
    "location": {
      "organ": "Liver exclusively",
      "cellType": "Various cells",
      "cellularLocation": "Mitochondrial Matrix"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Thiolase",
        "enzyme": "Thiolase",
        "substrate": "2 Acetyl-CoA",
        "product": "Acetoacetyl-CoA",
        "type": "reversible",
        "description": "Condensation of acetyl-CoA generated from beta-oxidation.",
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "HMG-CoA Synthase",
        "enzyme": "HMG-CoA Synthase (Mitochondrial)",
        "substrate": "Acetoacetyl-CoA + Acetyl-CoA",
        "product": "HMG-CoA",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Rate-limiting step of ketogenesis. Note: Mitochondrial isoform (cytosolic is for cholesterol).",
        "x": 500,
        "y": 350
      },
      {
        "step": 3,
        "title": "HMG-CoA Lyase",
        "enzyme": "HMG-CoA Lyase",
        "substrate": "HMG-CoA",
        "product": "Acetoacetate + Acetyl-CoA",
        "type": "irreversible",
        "description": "Cleavage to form the first ketone body, Acetoacetate.",
        "x": 500,
        "y": 600
      },
      {
        "step": 4,
        "title": "Beta-Hydroxybutyrate Dehydrogenase",
        "enzyme": "Beta-Hydroxybutyrate Dehydrogenase",
        "substrate": "Acetoacetate",
        "product": "Beta-Hydroxybutyrate",
        "energyChange": "Consumes 1 NADH",
        "type": "reversible",
        "description": "Reduction to form the primary circulating ketone body.",
        "x": 500,
        "y": 850
      },
      {
        "step": 5,
        "title": "Spontaneous Decarboxylation",
        "enzyme": "Non-enzymatic",
        "substrate": "Acetoacetate",
        "product": "Acetone",
        "co2Produced": true,
        "type": "irreversible",
        "description": "Spontaneous breakdown causing fruity breath in DKA.",
        "x": 750,
        "y": 600
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "urea-cycle",
    "name": "Urea Cycle",
    "category": "Protein",
    "overview": {
      "definition": "The metabolic cycle that converts highly toxic ammonia to urea for excretion.",
      "function": "Detoxifies ammonia generated from amino acid catabolism.",
      "importance": "Prevents fatal hyperammonemia and hepatic encephalopathy."
    },
    "location": {
      "organ": "Liver exclusively",
      "cellType": "Various cells",
      "cellularLocation": "Mitochondrial Matrix (Steps 1-2) and Cytosol (Steps 3-5)"
    },
    "reactions": [
      {
        "step": 1,
        "title": "Carbamoyl Phosphate Synthetase I",
        "enzyme": "Carbamoyl Phosphate Synthetase I (CPS I)",
        "substrate": "Ammonia + CO2 + 2 ATP",
        "product": "Carbamoyl Phosphate",
        "energyChange": "Consumes 2 ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Rate-limiting step of the Urea Cycle in the mitochondria.",
        "cofactors": [
          "N-Acetylglutamate (NAG)"
        ],
        "diseases": [
          "CPS I Deficiency (Hyperammonemia without orotic aciduria)"
        ],
        "highYield": "Absolutely requires NAG for activation. NAG is synthesized when Arginine levels are high.",
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "Ornithine Transcarbamylase",
        "enzyme": "Ornithine Transcarbamylase (OTC)",
        "substrate": "Carbamoyl Phosphate + Ornithine",
        "product": "Citrulline",
        "type": "irreversible",
        "description": "Condensation forming Citrulline, which is then transported out of the mitochondria.",
        "diseases": [
          "OTC Deficiency (Most common UCD, X-linked, Hyperammonemia WITH orotic aciduria)"
        ],
        "x": 500,
        "y": 350
      },
      {
        "step": 3,
        "title": "Argininosuccinate Synthetase",
        "enzyme": "Argininosuccinate Synthetase",
        "substrate": "Citrulline + Aspartate",
        "product": "Argininosuccinate",
        "energyChange": "Consumes 1 ATP (to AMP + PPi = 2 ATP equivalents)",
        "type": "irreversible",
        "description": "Incorporation of the second nitrogen atom (from Aspartate).",
        "diseases": [
          "Citrullinemia Type I"
        ],
        "x": 500,
        "y": 600
      },
      {
        "step": 4,
        "title": "Argininosuccinate Lyase",
        "enzyme": "Argininosuccinate Lyase",
        "substrate": "Argininosuccinate",
        "product": "Arginine + Fumarate",
        "type": "irreversible",
        "description": "Cleavage step. Fumarate links the Urea Cycle to the Krebs Cycle.",
        "diseases": [
          "Argininosuccinic Aciduria"
        ],
        "x": 500,
        "y": 850
      },
      {
        "step": 5,
        "title": "Arginase",
        "enzyme": "Arginase",
        "substrate": "Arginine",
        "product": "Urea + Ornithine",
        "waterProduced": false,
        "type": "irreversible",
        "description": "Final step releasing Urea for kidney excretion and regenerating Ornithine.",
        "cofactors": [
          "Mn2+"
        ],
        "diseases": [
          "Argininemia (Arginase deficiency, no hyperammonemia usually)"
        ],
        "x": 500,
        "y": 1100
      }
    ],
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "gluconeogenesis",
    "name": "Gluconeogenesis",
    "category": "Carbohydrate",
    "overview": {
      "definition": "Gluconeogenesis is the metabolic synthesis of glucose from non-carbohydrate precursors like lactate, glycerol, and glucogenic amino acids, predominantly occurring during fasting.",
      "function": "To maintain blood glucose levels during fasting, starvation, or intense exercise to meet brain and RBC energy needs.",
      "importance": "Ensures survival by preventing severe hypoglycemia when dietary glucose is unavailable."
    },
    "reactions": [
      {
        "step": 1,
        "title": "Carboxylation of Pyruvate",
        "enzyme": "Pyruvate Carboxylase",
        "substrate": "Pyruvate",
        "product": "Oxaloacetate (OAA)",
        "energyChange": "Consumes 1 ATP (x2)",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Pyruvate is carboxylated in mitochondria to Oxaloacetate. This requires Biotin (B7) and Acetyl-CoA as an obligate allosteric activator.",
        "cofactors": [
          "Biotin (B7)",
          "Mg2+"
        ],
        "x": 500,
        "y": 100
      },
      {
        "step": 2,
        "title": "Reduction to Malate",
        "enzyme": "Malate Dehydrogenase (Mitochondrial)",
        "substrate": "Oxaloacetate",
        "product": "Malate",
        "energyChange": "Consumes 1 NADH (x2)",
        "type": "reversible",
        "description": "OAA cannot cross the mitochondrial membrane, so it is reduced to Malate for transport into the cytosol.",
        "cofactors": [
          "NADH"
        ],
        "x": 500,
        "y": 250
      },
      {
        "step": 3,
        "title": "Oxidation to OAA",
        "enzyme": "Malate Dehydrogenase (Cytosolic)",
        "substrate": "Malate",
        "product": "Oxaloacetate",
        "energyChange": "Produces 1 NADH (x2)",
        "nadhProduced": true,
        "type": "reversible",
        "description": "Once in the cytosol, Malate is oxidized back to OAA, carrying reducing equivalents to the cytosol.",
        "cofactors": [
          "NAD+"
        ],
        "x": 500,
        "y": 400
      },
      {
        "step": 4,
        "title": "Decarboxylation & Phosphorylation",
        "enzyme": "PEP Carboxykinase (PEPCK)",
        "substrate": "Oxaloacetate",
        "product": "Phosphoenolpyruvate (PEP)",
        "energyChange": "Consumes 1 GTP (x2)",
        "co2Produced": true,
        "type": "irreversible",
        "description": "OAA is converted to PEP, expending GTP and releasing CO2.",
        "highYield": "Upregulated transcriptionally by Glucagon and Cortisol.",
        "x": 500,
        "y": 550
      },
      {
        "step": 5,
        "title": "Hydration to 2-PG",
        "enzyme": "Enolase",
        "substrate": "Phosphoenolpyruvate (PEP)",
        "product": "2-Phosphoglycerate (2-PG)",
        "waterProduced": false,
        "type": "reversible",
        "description": "Reversible hydration step shared with glycolysis.",
        "x": 500,
        "y": 700
      },
      {
        "step": 6,
        "title": "Shift of Phosphate Group",
        "enzyme": "Phosphoglycerate Mutase",
        "substrate": "2-Phosphoglycerate (2-PG)",
        "product": "3-Phosphoglycerate (3-PG)",
        "type": "reversible",
        "description": "Reversible phosphate shift.",
        "x": 500,
        "y": 850
      },
      {
        "step": 7,
        "title": "Phosphorylation to 1,3-BPG",
        "enzyme": "Phosphoglycerate Kinase",
        "substrate": "3-Phosphoglycerate (3-PG)",
        "product": "1,3-Bisphosphoglycerate (1,3-BPG)",
        "energyChange": "Consumes 1 ATP (x2)",
        "type": "reversible",
        "description": "Requires ATP to phosphorylate 3-PG.",
        "x": 500,
        "y": 1000
      },
      {
        "step": 8,
        "title": "Reduction to GAP",
        "enzyme": "Glyceraldehyde-3-Phosphate Dehydrogenase",
        "substrate": "1,3-Bisphosphoglycerate",
        "product": "Glyceraldehyde-3-Phosphate (GAP)",
        "energyChange": "Consumes 1 NADH (x2)",
        "type": "reversible",
        "description": "Requires NADH to reduce 1,3-BPG to GAP.",
        "x": 500,
        "y": 1150
      },
      {
        "step": 9,
        "title": "Isomerization and Condensation",
        "enzyme": "Triose Phosphate Isomerase & Aldolase",
        "substrate": "GAP + DHAP",
        "product": "Fructose-1,6-Bisphosphate",
        "type": "reversible",
        "description": "Some GAP is isomerized to DHAP, and the two trioses condense to form Fructose-1,6-Bisphosphate.",
        "x": 500,
        "y": 1300
      },
      {
        "step": 10,
        "title": "Dephosphorylation of F1,6BP",
        "enzyme": "Fructose-1,6-Bisphosphatase-1 (FBPase-1)",
        "substrate": "Fructose-1,6-Bisphosphate",
        "product": "Fructose-6-Phosphate",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "The rate-limiting step of gluconeogenesis. Bypasses PFK-1 of glycolysis.",
        "drugs": [
          "Fructose-2,6-bisphosphate (potent inhibitor)"
        ],
        "x": 500,
        "y": 1450
      },
      {
        "step": 11,
        "title": "Isomerization to G6P",
        "enzyme": "Phosphoglucose Isomerase",
        "substrate": "Fructose-6-Phosphate",
        "product": "Glucose-6-Phosphate",
        "type": "reversible",
        "description": "Reversible isomerization.",
        "x": 500,
        "y": 1600
      },
      {
        "step": 12,
        "title": "Dephosphorylation to Glucose",
        "enzyme": "Glucose-6-Phosphatase",
        "substrate": "Glucose-6-Phosphate",
        "product": "Glucose",
        "type": "irreversible",
        "description": "Occurs inside the Endoplasmic Reticulum lumen. Frees glucose to be exported into the blood.",
        "diseases": [
          "Von Gierke Disease (Type I GSD)"
        ],
        "x": 500,
        "y": 1750
      }
    ],
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm or Mitochondria"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "ppp",
    "name": "Pentose Phosphate Pathway",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Glucose-6-Phosphate Dehydrogenase",
        "enzyme": "G6PD",
        "substrate": "Glucose-6-Phosphate",
        "product": "6-Phosphoglucono-δ-lactone",
        "energyChange": "+ NADPH",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Generates NADPH.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Lactonase",
        "enzyme": "6-Phosphogluconolactonase",
        "substrate": "6-Phosphoglucono-δ-lactone",
        "product": "6-Phosphogluconate",
        "energyChange": "+ H2O",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Hydrolysis.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "6-Phosphogluconate Dehydrogenase",
        "enzyme": "6-Phosphogluconate Dehydrogenase",
        "substrate": "6-Phosphogluconate",
        "product": "Ribulose-5-Phosphate",
        "energyChange": "+ NADPH, + CO2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Oxidative decarboxylation.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Isomerase",
        "enzyme": "Phosphopentose Isomerase",
        "substrate": "Ribulose-5-Phosphate",
        "product": "Ribose-5-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Precursor for nucleotides.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Epimerase",
        "enzyme": "Phosphopentose Epimerase",
        "substrate": "Ribulose-5-Phosphate",
        "product": "Xylulose-5-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Non-oxidative phase.",
        "x": 250,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Pentose Phosphate Pathway.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "glycogenolysis",
    "name": "Glycogenolysis",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Phosphorylase",
        "enzyme": "Glycogen Phosphorylase",
        "substrate": "Glycogen",
        "product": "Glucose-1-Phosphate",
        "energyChange": "- Pi",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Cleaves α-1,4 bonds.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Debranching Enzyme 1",
        "enzyme": "4-α-Glucanotransferase",
        "substrate": "Limit Dextrin",
        "product": "Elongated Glycogen Core",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Transfers 3 glucose residues.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Debranching Enzyme 2",
        "enzyme": "Amylo-α-1,6-Glucosidase",
        "substrate": "Branched Residue",
        "product": "Free Glucose",
        "energyChange": "+ H2O",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Cleaves α-1,6 bond.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Phosphoglucomutase",
        "enzyme": "Phosphoglucomutase",
        "substrate": "Glucose-1-Phosphate",
        "product": "Glucose-6-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Interconversion.",
        "x": 50,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Glycogenolysis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "glycogenesis",
    "name": "Glycogenesis",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Hexokinase",
        "enzyme": "Hexokinase/Glucokinase",
        "substrate": "Glucose",
        "product": "Glucose-6-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Phosphorylation.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Phosphoglucomutase",
        "enzyme": "Phosphoglucomutase",
        "substrate": "Glucose-6-Phosphate",
        "product": "Glucose-1-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Isomerization.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "UDP-Glucose Pyrophosphorylase",
        "enzyme": "UDP-Glucose Pyrophosphorylase",
        "substrate": "Glucose-1-Phosphate",
        "product": "UDP-Glucose",
        "energyChange": "- UTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Activation.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Glycogen Synthase",
        "enzyme": "Glycogen Synthase",
        "substrate": "UDP-Glucose",
        "product": "Glycogen (α-1,4)",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Elongation.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Branching Enzyme",
        "enzyme": "Amylo-(1,4 to 1,6)-transglycosylase",
        "substrate": "Linear Glycogen",
        "product": "Branched Glycogen",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Creates branches.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Glycogenesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "fructose-metabolism",
    "name": "Fructose Metabolism",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Fructokinase",
        "enzyme": "Fructokinase",
        "substrate": "Fructose",
        "product": "Fructose-1-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Traps fructose in cells.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Aldolase B",
        "enzyme": "Aldolase B",
        "substrate": "Fructose-1-Phosphate",
        "product": "DHAP + Glyceraldehyde",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Cleavage.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Triokinase",
        "enzyme": "Triokinase",
        "substrate": "Glyceraldehyde",
        "product": "Glyceraldehyde-3-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Enters glycolysis.",
        "x": 50,
        "y": 250
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Fructose Metabolism.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "galactose-metabolism",
    "name": "Galactose Metabolism",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Galactokinase",
        "enzyme": "Galactokinase",
        "substrate": "Galactose",
        "product": "Galactose-1-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Phosphorylation.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "GALT",
        "enzyme": "Galactose-1-Phosphate Uridyltransferase",
        "substrate": "Galactose-1-P + UDP-Glucose",
        "product": "Glucose-1-P + UDP-Galactose",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": true,
        "description": "Exchange.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Epimerase",
        "enzyme": "UDP-Hexose 4-Epimerase",
        "substrate": "UDP-Galactose",
        "product": "UDP-Glucose",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Recycling.",
        "x": 50,
        "y": 250
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Galactose Metabolism.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "amino-acid-degradation",
    "name": "Amino Acid Degradation",
    "category": "Protein",
    "reactions": [
      {
        "step": 1,
        "title": "Transamination",
        "enzyme": "Aminotransferase (PLP)",
        "substrate": "Amino Acid + α-Ketoglutarate",
        "product": "α-Keto Acid + Glutamate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Transfer of amino group.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Oxidative Deamination",
        "enzyme": "Glutamate Dehydrogenase",
        "substrate": "Glutamate",
        "product": "α-Ketoglutarate + NH3",
        "energyChange": "+ NADH",
        "type": "reversible",
        "isRateLimiting": true,
        "description": "Releases free ammonia.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Carbon Skeleton Metabolism",
        "enzyme": "Various",
        "substrate": "α-Keto Acid",
        "product": "TCA Intermediates",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Glucogenic or ketogenic fate.",
        "x": 50,
        "y": 250
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Amino Acid Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "purine-synthesis",
    "name": "Purine Synthesis",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "PRPP Synthesis",
        "enzyme": "PRPP Synthetase",
        "substrate": "Ribose-5-Phosphate",
        "product": "PRPP",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Activation.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Committed Step",
        "enzyme": "PRPP Amidotransferase",
        "substrate": "PRPP + Glutamine",
        "product": "5-Phosphoribosyl-1-Amine",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Inhibited by AMP/GMP.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Ring Formation",
        "enzyme": "Various (GAR, FGAR)",
        "substrate": "5-PRA",
        "product": "IMP",
        "energyChange": "Consumes multiple ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Requires THF and Glycine.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "AMP/GMP Synthesis",
        "enzyme": "Adenylosuccinate Synthetase / IMP Dehydrogenase",
        "substrate": "IMP",
        "product": "AMP / GMP",
        "energyChange": "Consumes GTP / ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Branch point.",
        "x": 50,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Purine Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "pyrimidine-synthesis",
    "name": "Pyrimidine Synthesis",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "CPS II",
        "enzyme": "Carbamoyl Phosphate Synthetase II",
        "substrate": "Glutamine + CO2",
        "product": "Carbamoyl Phosphate",
        "energyChange": "Consumes 2 ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Cytosolic.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "ATCase",
        "enzyme": "Aspartate Transcarbamoylase",
        "substrate": "Carbamoyl Phosphate + Aspartate",
        "product": "Carbamoylaspartate",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Key regulation in bacteria.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Ring Closure",
        "enzyme": "Dihydroorotase",
        "substrate": "Carbamoylaspartate",
        "product": "Dihydroorotate",
        "energyChange": "- H2O",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Forms ring.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Oxidation",
        "enzyme": "Dihydroorotate Dehydrogenase",
        "substrate": "Dihydroorotate",
        "product": "Orotate",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Mitochondrial enzyme.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "UMP Synthase",
        "enzyme": "UMP Synthase (OPRT + ODC)",
        "substrate": "Orotate + PRPP",
        "product": "UMP",
        "energyChange": "- CO2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Bifunctional enzyme.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Pyrimidine Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "purine-degradation",
    "name": "Purine Degradation",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "Nucleotidase",
        "enzyme": "5'-Nucleotidase",
        "substrate": "AMP / GMP",
        "product": "Adenosine / Guanosine",
        "energyChange": "- Pi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Removes phosphate.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Deamination",
        "enzyme": "Adenosine Deaminase (ADA)",
        "substrate": "Adenosine",
        "product": "Inosine",
        "energyChange": "- NH3",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Deficiency causes SCID.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Phosphorolysis",
        "enzyme": "Purine Nucleoside Phosphorylase",
        "substrate": "Inosine / Guanosine",
        "product": "Hypoxanthine / Guanine",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Releases Ribose-1-P.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Xanthine Formation",
        "enzyme": "Xanthine Oxidase / Guanase",
        "substrate": "Hypoxanthine / Guanine",
        "product": "Xanthine",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Generates H2O2.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Uric Acid Formation",
        "enzyme": "Xanthine Oxidase",
        "substrate": "Xanthine",
        "product": "Uric Acid",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Target of Allopurinol.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Purine Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "pyrimidine-degradation",
    "name": "Pyrimidine Degradation",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "Nucleotidase",
        "enzyme": "5'-Nucleotidase",
        "substrate": "CMP / UMP",
        "product": "Cytidine / Uridine",
        "energyChange": "- Pi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Removes phosphate.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Deamination",
        "enzyme": "Cytidine Deaminase",
        "substrate": "Cytidine",
        "product": "Uridine",
        "energyChange": "- NH3",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms Uridine.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Cleavage",
        "enzyme": "Pyrimidine Nucleoside Phosphorylase",
        "substrate": "Uridine",
        "product": "Uracil",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Releases Ribose.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Reduction",
        "enzyme": "Dihydropyrimidine Dehydrogenase",
        "substrate": "Uracil",
        "product": "Dihydrouracil",
        "energyChange": "- NADPH",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Rate-limiting step.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Degradation",
        "enzyme": "Various",
        "substrate": "Dihydrouracil",
        "product": "Beta-Alanine + CO2 + NH3",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Highly water soluble products.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Pyrimidine Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "heme-synthesis",
    "name": "Heme Synthesis",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "ALAS",
        "enzyme": "ALA Synthase",
        "substrate": "Succinyl-CoA + Glycine",
        "product": "Aminolevulinic Acid (ALA)",
        "energyChange": "Requires PLP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Mitochondrial. Inhibited by Heme.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "ALAD",
        "enzyme": "ALA Dehydratase",
        "substrate": "2 ALA",
        "product": "Porphobilinogen (PBG)",
        "energyChange": "- 2 H2O",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Cytosolic. Inhibited by Lead.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "PBG Deaminase",
        "enzyme": "Hydroxymethylbilane Synthase",
        "substrate": "4 PBG",
        "product": "Hydroxymethylbilane",
        "energyChange": "- 4 NH3",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Deficiency causes AIP.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Ring Closure",
        "enzyme": "Uroporphyrinogen III Synthase",
        "substrate": "Hydroxymethylbilane",
        "product": "Uroporphyrinogen III",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms asymmetric ring.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Ferrochelatase",
        "enzyme": "Ferrochelatase",
        "substrate": "Protoporphyrin IX + Fe2+",
        "product": "Heme",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Mitochondrial. Inhibited by Lead.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Heme Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "heme-degradation",
    "name": "Heme Degradation",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Heme Oxygenase",
        "enzyme": "Heme Oxygenase",
        "substrate": "Heme",
        "product": "Biliverdin",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Releases CO and Fe2+.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Biliverdin Reductase",
        "enzyme": "Biliverdin Reductase",
        "substrate": "Biliverdin",
        "product": "Unconjugated Bilirubin",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms insoluble bilirubin.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Transport",
        "enzyme": "Albumin",
        "substrate": "Unconjugated Bilirubin (Blood)",
        "product": "Unconjugated Bilirubin (Liver)",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Transported to liver.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Conjugation",
        "enzyme": "UDP-Glucuronosyltransferase (UGT)",
        "substrate": "Unconjugated Bilirubin",
        "product": "Conjugated Bilirubin",
        "energyChange": "Consumes UDP-Glucuronic Acid",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Makes bilirubin water soluble.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Excretion",
        "enzyme": "Gut Flora",
        "substrate": "Conjugated Bilirubin",
        "product": "Urobilinogen",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Excreted in feces/urine.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Heme Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "dna-replication",
    "name": "DNA Replication",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Unwinding",
        "enzyme": "Helicase",
        "substrate": "dsDNA",
        "product": "ssDNA",
        "energyChange": "Consumes ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Separates strands.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Tension Relief",
        "enzyme": "Topoisomerase",
        "substrate": "Supercoiled DNA",
        "product": "Relaxed DNA",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Target of quinolones.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Priming",
        "enzyme": "Primase",
        "substrate": "ssDNA",
        "product": "RNA Primer",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Provides 3'-OH.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Elongation",
        "enzyme": "DNA Polymerase III",
        "substrate": "Primer + dNTPs",
        "product": "New DNA Strand",
        "energyChange": "- PPi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "High processivity.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Ligation",
        "enzyme": "DNA Ligase",
        "substrate": "Okazaki Fragments",
        "product": "Continuous DNA",
        "energyChange": "Consumes ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Seals nicks.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for DNA Replication.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "transcription",
    "name": "Transcription",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Initiation",
        "enzyme": "RNA Polymerase",
        "substrate": "Promoter DNA",
        "product": "Open Complex",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": true,
        "description": "Binding of factors.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Elongation",
        "enzyme": "RNA Polymerase",
        "substrate": "DNA Template + NTPs",
        "product": "pre-mRNA",
        "energyChange": "- PPi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Synthesis 5' to 3'.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Termination",
        "enzyme": "Termination Factors",
        "substrate": "pre-mRNA",
        "product": "Released mRNA",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Rho-dependent or independent.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "5' Capping",
        "enzyme": "Guanylyltransferase",
        "substrate": "5' mRNA",
        "product": "7-Methylguanosine Cap",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Protects mRNA.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Splicing",
        "enzyme": "Spliceosome",
        "substrate": "pre-mRNA",
        "product": "Mature mRNA",
        "energyChange": "Consumes ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Removes introns.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Transcription.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "translation",
    "name": "Translation",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Activation",
        "enzyme": "Aminoacyl-tRNA Synthetase",
        "substrate": "Amino Acid + tRNA",
        "product": "Charged tRNA",
        "energyChange": "Consumes 2 ATP eq.",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "High fidelity.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Initiation",
        "enzyme": "Ribosome (IFs)",
        "substrate": "mRNA + Met-tRNA",
        "product": "Initiation Complex",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Finds start codon.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Elongation (Binding)",
        "enzyme": "Ribosome (EF-Tu)",
        "substrate": "Charged tRNA",
        "product": "A-site bound tRNA",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Codon recognition.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Peptidyl Transfer",
        "enzyme": "Peptidyl Transferase",
        "substrate": "Amino Acids",
        "product": "Peptide Bond",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Ribozyme activity.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Translocation",
        "enzyme": "Ribosome (EF-G)",
        "substrate": "Ribosome",
        "product": "Advanced Ribosome",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Moves by 3 nucleotides.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Translation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "eicosanoid-synthesis",
    "name": "Eicosanoid Synthesis",
    "category": "Lipid",
    "reactions": [
      {
        "step": 1,
        "title": "Release",
        "enzyme": "Phospholipase A2",
        "substrate": "Membrane Phospholipids",
        "product": "Arachidonic Acid",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Inhibited by corticosteroids.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Cyclooxygenase Pathway",
        "enzyme": "COX-1 / COX-2",
        "substrate": "Arachidonic Acid",
        "product": "Prostaglandins (PGG2)",
        "energyChange": "Consumes O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Inhibited by NSAIDs.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Peroxidase",
        "enzyme": "COX (Peroxidase active site)",
        "substrate": "PGG2",
        "product": "PGH2",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Precursor for TXA2 and PGs.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Lipoxygenase Pathway",
        "enzyme": "5-Lipoxygenase",
        "substrate": "Arachidonic Acid",
        "product": "Leukotrienes (LTA4)",
        "energyChange": "Consumes O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Inhibited by Zileuton.",
        "x": 250,
        "y": 150
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Eicosanoid Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "sphingolipid-synthesis",
    "name": "Sphingolipid Synthesis",
    "category": "Lipid",
    "reactions": [
      {
        "step": 1,
        "title": "Condensation",
        "enzyme": "Serine Palmitoyltransferase",
        "substrate": "Palmitoyl-CoA + Serine",
        "product": "3-Ketosphinganine",
        "energyChange": "Requires PLP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "ER localized.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Reduction",
        "enzyme": "3-Ketosphinganine Reductase",
        "substrate": "3-Ketosphinganine",
        "product": "Sphinganine",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms alcohol.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Acylation",
        "enzyme": "Ceramide Synthase",
        "substrate": "Sphinganine + Fatty Acyl-CoA",
        "product": "Dihydroceramide",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Adds fatty acid.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Desaturation",
        "enzyme": "Dihydroceramide Desaturase",
        "substrate": "Dihydroceramide",
        "product": "Ceramide",
        "energyChange": "+ FADH2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Central sphingolipid.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Head Group Addition",
        "enzyme": "Sphingomyelin Synthase",
        "substrate": "Ceramide + Phosphatidylcholine",
        "product": "Sphingomyelin",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Major membrane lipid.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Sphingolipid Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  },
  {
    "slug": "steroid-hormone-synthesis",
    "name": "Steroid Hormone Synthesis",
    "category": "Lipid",
    "reactions": [
      {
        "step": 1,
        "title": "Transport",
        "enzyme": "StAR Protein",
        "substrate": "Cholesterol (Cytosol)",
        "product": "Cholesterol (Mitochondria)",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Regulated by ACTH/LH.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Desmolase",
        "enzyme": "Cholesterol Desmolase (CYP11A1)",
        "substrate": "Cholesterol",
        "product": "Pregnenolone",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Cleaves side chain.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Isomerization",
        "enzyme": "3β-Hydroxysteroid Dehydrogenase",
        "substrate": "Pregnenolone",
        "product": "Progesterone",
        "energyChange": "+ NADH",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Precursor for mineralo/gluco-corticoids.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Hydroxylation",
        "enzyme": "21-Hydroxylase (CYP21A2)",
        "substrate": "Progesterone",
        "product": "11-Deoxycorticosterone",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Deficiency causes CAH.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Final Hydroxylation",
        "enzyme": "11β-Hydroxylase (CYP11B1)",
        "substrate": "11-Deoxycortisol",
        "product": "Cortisol",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Glucocorticoid synthesis.",
        "x": 250,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Steroid Hormone Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    },
    "inputs": [
      "Precursors"
    ],
    "outputs": [
      "Products"
    ],
    "energyBalance": {
      "atpUsed": 0,
      "atpProduced": 0,
      "nadh": 0,
      "fadh2": 0,
      "gtp": 0,
      "summary": "Energy balance depends on the specific pathway steps."
    },
    "rateLimitingStep": {
      "name": "Regulatory Step",
      "enzyme": "Regulatory Enzyme",
      "description": "Regulates the flow of the pathway.",
      "regulation": "Allosteric and Hormonal control.",
      "clinicalImportance": "Mutations may cause metabolic diseases."
    },
    "regulationSummary": {
      "activators": [],
      "inhibitors": [],
      "hormonalControl": "Insulin/Glucagon ratio generally dictates activity."
    },
    "clinicalSignificance": {
      "diseases": [
        "Specific enzyme deficiencies lead to metabolic disorders."
      ],
      "drugTargets": [],
      "labFindings": []
    },
    "summaryCard": "A crucial metabolic pathway."
  }
];

const INITIAL_QUIZZES: QuizQuestion[] = [];

const INITIAL_FLASHCARDS: Flashcard[] = [];

const INITIAL_NOTES: StudyNote[] = [];

const INITIAL_FAQS: FAQItem[] = [];


// -------------------------------------------------------------
// Database Service Operations
// -------------------------------------------------------------

// LocalStorage Helper (fallback if Firebase is not used)
const getStoredData = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading localStorage", error);
    return defaultValue;
  }
};

const setStoredData = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing localStorage", error);
  }
};

export const dbService = {
  getPathways: (): Pathway[] => {
    return INITIAL_PATHWAYS;
  },

  getPathwayBySlug: (slug: string): Pathway | undefined => {
    return INITIAL_PATHWAYS.find((p) => p.slug === slug);
  },

  getStaticPathways: (): Pathway[] => INITIAL_PATHWAYS,
  
  savePathway: (pathway: Pathway): void => {
    const idx = INITIAL_PATHWAYS.findIndex((p) => p.slug === pathway.slug);
    if (idx >= 0) INITIAL_PATHWAYS[idx] = pathway;
    else INITIAL_PATHWAYS.push(pathway);
  },

  deletePathway: (slug: string): void => {
    const idx = INITIAL_PATHWAYS.findIndex((p) => p.slug === slug);
    if (idx >= 0) INITIAL_PATHWAYS.splice(idx, 1);
  },

  getQuizzes: (): QuizQuestion[] => INITIAL_QUIZZES,
  
  getAllQuizzes: (): QuizQuestion[] => INITIAL_QUIZZES, // alias

  getQuizzesByPathway: (slug: string): QuizQuestion[] => {
    return INITIAL_QUIZZES.filter((q) => q.pathwaySlug === slug);
  },

  saveQuizQuestion: (quiz: QuizQuestion): void => {
    const idx = INITIAL_QUIZZES.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) INITIAL_QUIZZES[idx] = quiz;
    else INITIAL_QUIZZES.push(quiz);
  },

  deleteQuizQuestion: (id: string): void => {
    const idx = INITIAL_QUIZZES.findIndex((q) => q.id === id);
    if (idx >= 0) INITIAL_QUIZZES.splice(idx, 1);
  },

  getFlashcards: (): Flashcard[] => INITIAL_FLASHCARDS,
  getStaticFlashcards: (): Flashcard[] => INITIAL_FLASHCARDS,

  toggleFlashcardBookmark: (id: string): void => {},
  updateFlashcardLeitner: (id: string, state: any): void => {},

  getNotes: (): StudyNote[] => INITIAL_NOTES,
  getStudyNotes: (): StudyNote[] => INITIAL_NOTES,
  getStaticNotes: (): StudyNote[] => INITIAL_NOTES,

  toggleNoteBookmark: (slug: string): StudyNote[] => INITIAL_NOTES,

  getNoteBySlug: (slug: string): StudyNote | undefined => {
    return INITIAL_NOTES.find((n) => n.slug === slug);
  },

  getFAQs: (): FAQItem[] => {
    return INITIAL_FAQS;
  },

  getUserProgress: (userId: string): any => {
    const progressKey = `bc_progress_${userId}`;
    const initialProgress = {
      userId,
      xp: 0,
      streak: 0,
      lastActive: new Date().toISOString(),
      completedPathways: [],
      quizScores: [],
      badges: [],
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    };
    return getStoredData(progressKey, initialProgress);
  },

  saveUserProgress: (userId: string, progress: any): void => {
    setStoredData(`bc_progress_${userId}`, progress);
  },

  addXP: (userId: string, amount: number): { currentXp: number; leveledUp: boolean } => {
    const progress = dbService.getUserProgress(userId);
    const oldLevel = Math.floor(progress.xp / 100);
    progress.xp += amount;
    const newLevel = Math.floor(progress.xp / 100);
    
    if (newLevel >= 1 && !progress.badges.includes("lvl1")) {
      progress.badges.push("lvl1");
    }
    if (newLevel >= 5 && !progress.badges.includes("lvl5")) {
      progress.badges.push("lvl5");
    }
    
    dbService.saveUserProgress(userId, progress);
    return { currentXp: progress.xp, leveledUp: newLevel > oldLevel };
  },

  updateStreak: (userId: string): number => {
    const progress = dbService.getUserProgress(userId);
    const lastActive = new Date(progress.lastActive);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      progress.streak += 1;
    } else if (diffDays > 1) {
      progress.streak = 1;
    }
    progress.lastActive = now.toISOString();
    
    if (progress.streak >= 7 && !progress.badges.includes("streak7")) {
      progress.badges.push("streak7");
    }
    
    dbService.saveUserProgress(userId, progress);
    return progress.streak;
  },

  completePathway: (userId: string, slug: string): string[] => {
    const progress = dbService.getUserProgress(userId);
    if (!progress.completedPathways.includes(slug)) {
      progress.completedPathways.push(slug);
      progress.xp += 50;
      
      const badgeId = `${slug}_master`;
      if (!progress.badges.includes(badgeId)) {
        progress.badges.push(badgeId);
      }
      
      dbService.saveUserProgress(userId, progress);
    }
    return progress.badges;
  },

  saveScore: (userId: string, quizId: string, score: number, total: number): void => {
    const progress = dbService.getUserProgress(userId);
    progress.quizScores.push({
      quizId,
      score,
      total,
      timestamp: new Date().toISOString(),
    });
    
    if (score === total && !progress.badges.includes("perfectionist")) {
      progress.badges.push("perfectionist");
    }
    
    const dayOfWeek = (new Date().getDay() + 6) % 7;
    progress.weeklyActivity[dayOfWeek] += 1;
    
    progress.xp += (score * 10) + 20;
    
    dbService.saveUserProgress(userId, progress);
  }
};

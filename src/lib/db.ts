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

export let app: any;
export let auth: any;
export let db: any;
export let storage: any;

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


export type MoleculeCount = {
  ATP?: number; ADP?: number; AMP?: number; Pi?: number; PPi?: number;
  NAD_plus?: number; NADH?: number;
  NADP_plus?: number; NADPH?: number;
  FAD?: number; FADH2?: number;
  GTP?: number; GDP?: number;
  Acetyl_CoA?: number; CoA?: number;
  CO2?: number; H2O?: number; O2?: number;
  H_plus?: number; NH3?: number;
};
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
  ecNumber?: string;
  substrate: string;
  product: string;
  energyChange?: string; // e.g. "ATP -> ADP", "NAD+ -> NADH", etc.
  type: "regulatory" | "reversible" | "irreversible";
  isRateLimiting?: boolean;
  isCommittedStep?: boolean;
  description: string;
  compartment?: string;
  cofactors?: string[];
  vitamins?: string[];
  diseases?: string[];
  drugs?: string[];
  clinicalInhibitors?: string[];
  drugTargets?: string[];
  feedbackInhibition?: string[];
  feedforwardActivation?: string[];
  hormonalRegulation?: string;
  allostericRegulation?: string;
  phosphorylation?: string;
  highYield?: string;
  vivaQuestions?: string[];
  mnemonics?: string[];
  nadhProduced?: boolean;
  fadh2Produced?: boolean;
  waterProduced?: boolean;
  co2Produced?: boolean;
  productX?: number; // custom product node coordinate if branching
  productY?: number;
  molecules?: {
    consumes?: Partial<Record<string, number>>;
    produces?: Partial<Record<string, number>>;
  };
  x?: number; // UI positioning (Deprecated, handled by React Flow)
  y?: number;
}

export interface Pathway {
  slug: string;
  title: string;
  category: "Carbohydrate" | "Lipid" | "Protein" | "Nucleotide" | "Metabolic Integration" | "Signaling" | "Molecular" | "Specialized" | "Drug" | "Nutrition" | "Enzymes";
  description: string;
  clinicalImportance?: string;
  cellularLocation?: string;
  rateLimitingStep?: {
    name: string;
    enzyme: string;
    description: string;
    regulation: string;
    clinicalImportance?: string;
  };
  regulationSummary?: {
    activators: string[];
    inhibitors: string[];
    hormonalControl?: string;
  };
  clinicalSignificance?: {
    diseases: string[];
    drugTargets?: string[];
    labFindings?: string[];
    enzymeDeficiencies?: string[];
    vitaminDeficiencies?: string[];
  };
  pharmacyNotes?: {
    whyStudy: string;
    clinicalUses?: string;
    importantInhibitors?: string[];
    importantActivators?: string[];
    commonQuestions?: string[];
    highYieldPoints: string[];
  };
  atpSummary?: {
    consumedATP: number;
    producedATP: number;
    netATP: number;
    producedNADH: number;
    producedFADH2: number;
    producedNADPH: number;
    producedGTP: number;
    releasedCO2: number;
    usedH2O: number;
    producedH2O: number;
    overallYield: string;
  };
  memoryAids?: {
    mnemonics: string[];
    tricks: string[];
    examTips: string[];
    commonMistakes: string[];
  };
  pathwayConnections?: {
    upstream: string[];
    downstream: string[];
    related: string[];
  };
  reactions: ReactionNode[];
  summaryCard: string;
  mindMapUrl?: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "boolean" | "fill-blank" | "enzyme-id" | "match" | "clinical" | "diagram" | "sequence" | "clinical-case";
  question: string;
  options?: string[]; // for mcq
  correctAnswer: string | string[]; // index for mcq, "true"/"false" for boolean, exact text for fill-blank, array for match/sequence
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pathwaySlug: string;
  memoryTrick?: string;
  relatedEnzyme?: string;
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
  mindMapUrl?: string;
}

export interface FAQItem {
  id: string;
  category: "General" | "Pathways" | "Exams" | "App";
  question: string;
  answer: string;
  keywords: string[];
}

import pathwaysData from './data/pathways.json';
import flashcardsData from './data/flashcards.json';
import { glycolysisGoldPathway, glycolysisQuizzes, glycolysisFlashcards } from './data/glycolysis-gold';

// -------------------------------------------------------------
// Expanded Biochemistry Pathways Database (B.Pharm Standard)
// -------------------------------------------------------------

import { bpharmCarboPathways } from './data/bpharm-core';
import { bpharmCarboModule } from './data/bpharm-carbo';
import { bpharmLipidModule } from './data/bpharm-lipid';
import { bpharmProteinModule } from './data/bpharm-protein';
import { bpharmMolecularModule } from './data/bpharm-molecular';

const INITIAL_PATHWAYS: Pathway[] = [
  ...bpharmCarboPathways,
  ...bpharmCarboModule,
  ...bpharmLipidModule,
  ...bpharmProteinModule,
  ...bpharmMolecularModule
];

const INITIAL_QUIZZES: QuizQuestion[] = [...glycolysisQuizzes];

const INITIAL_FLASHCARDS: Flashcard[] = [
  ...glycolysisFlashcards,
  ...(flashcardsData as Flashcard[])
];

const INITIAL_NOTES: StudyNote[] = [
  {
    "slug": "carbo-metabolism-mastery",
    "title": "Carbohydrate Metabolism Mastery",
    "category": "Carbohydrate",
    "readingTime": "5 min read",
    "content": "# Carbohydrate Metabolism High-Yield\n\n## 1. Glycolysis\n- **Location:** Cytosol\n- **Rate Limiting Enzyme:** Phosphofructokinase-1 (PFK-1)\n- **Net Yield:** 2 ATP, 2 NADH, 2 Pyruvate\n- **Key Regulators:** Activated by AMP, F2,6-BP. Inhibited by ATP, Citrate.\n\n> [!NOTE]\n> RBCs rely 100% on glycolysis for ATP because they lack mitochondria.\n\n### Clinical Pearls\n- **Pyruvate Kinase Deficiency:** Leads to chronic hemolytic anemia.\n- **Fluoride** in blood collection tubes inhibits **Enolase** to stop in-vitro glycolysis.\n\n## 2. Krebs Cycle (TCA Cycle)\n- **Location:** Mitochondrial Matrix\n- **Rate Limiting Enzyme:** Isocitrate Dehydrogenase\n- **Net Yield (per Acetyl-CoA):** 3 NADH, 1 FADH2, 1 GTP, 2 CO2\n\n### High-Yield Cofactors\n- Alpha-Ketoglutarate Dehydrogenase requires 5 cofactors: Thiamine (B1), Lipoic Acid, CoA (B5), FAD (B2), NAD+ (B3).\n- **Wernicke-Korsakoff** syndrome occurs due to B1 deficiency impairing this step.\n\n## 3. Electron Transport Chain\n- **Location:** Inner Mitochondrial Membrane\n- **Function:** Uses NADH and FADH2 to pump protons and drive ATP Synthase.\n\n| Complex | Name | Key Inhibitors |\n|---|---|---|\n| Complex I | NADH Dehydrogenase | Rotenone |\n| Complex II | Succinate Dehydrogenase | Malonate |\n| Complex III | Cytochrome bc1 | Antimycin A |\n| Complex IV | Cytochrome c Oxidase | Cyanide, CO, Azide |\n| Complex V | ATP Synthase | Oligomycin |\n\n- **Uncoupling Agents:** (e.g., 2,4-DNP, Aspirin overdose) destroy the proton gradient. Energy is lost as HEAT (hyperthermia) instead of making ATP."
  },
  {
    "slug": "lipid-steroid-biochemistry",
    "title": "Lipid & Steroid Biochemistry",
    "category": "Lipid",
    "readingTime": "4 min read",
    "content": "# Lipid Metabolism & Steroids\n\n## 1. Beta-Oxidation of Fatty Acids\n- **Location:** Mitochondrial Matrix (cannot happen in RBCs or Brain).\n- **Rate Limiting Enzyme:** Carnitine Palmitoyltransferase I (CPT-1).\n- **Inhibitor:** Malonyl-CoA (prevents breakdown during lipid synthesis).\n- **Yield:** massive amounts of ATP, FADH2, NADH, and Acetyl-CoA.\n\n### Clinical Note\n- **MCAD Deficiency:** Medium-chain acyl-CoA dehydrogenase deficiency causes fasting hypoglycemia with NO ketone body formation (non-ketotic hypoglycemia).\n\n## 2. Fatty Acid Synthesis\n- **Location:** Cytosol (mainly Liver and Lactating Mammary Glands).\n- **Rate Limiting Enzyme:** Acetyl-CoA Carboxylase (requires Biotin, ATP, CO2).\n- **Key Reactants:** Acetyl-CoA, NADPH (from HMP shunt).\n\n## 3. Eicosanoid Synthesis\n- **Precursor:** Arachidonic Acid (cleaved from membrane by Phospholipase A2).\n- **COX Pathway:** Synthesizes Prostaglandins and Thromboxanes. Inhibited by NSAIDs.\n- **LOX Pathway:** Synthesizes Leukotrienes. Inhibited by Zileuton.\n\n## 4. Steroid Hormone Synthesis\n- **Precursor:** Cholesterol.\n- **Rate Limiting Enzyme:** Cholesterol Desmolase (CYP11A1) which converts Cholesterol to Pregnenolone.\n- **Location:** Adrenal Cortex, Gonads.\n\n> [!CAUTION]\n> **21-Hydroxylase Deficiency:** Most common Congenital Adrenal Hyperplasia. Lack of cortisol and aldosterone, excess androgens (virilization, salt wasting)."
  },
  {
    "slug": "protein-amino-acid-metabolism",
    "title": "Protein & Urea Cycle",
    "category": "Protein",
    "readingTime": "6 min read",
    "content": "# Protein & Amino Acid Metabolism\n\n## 1. The Urea Cycle\nAmmonia is highly toxic to the brain. The liver converts it to urea for safe excretion.\n\n- **Location:** Mitochondria (first 2 steps) and Cytosol (last 3 steps).\n- **Rate Limiting Enzyme:** Carbamoyl Phosphate Synthetase I (CPS I).\n- **Obligate Activator:** N-Acetylglutamate (NAG).\n\n### Key Diseases\n- **OTC Deficiency:** X-linked recessive. Most common urea cycle disorder. Causes hyperammonemia, low BUN, and elevated orotic acid.\n\n## 2. Important Amino Acid Derivatives\n- **Phenylalanine:** Tyrosine -> DOPA -> Dopamine -> Norepinephrine -> Epinephrine.\n- **Tryptophan:** Serotonin, Melatonin, Niacin.\n- **Histidine:** Histamine.\n- **Glycine:** Porphyrin (Heme).\n- **Arginine:** Creatine, Urea, Nitric Oxide.\n\n## 3. Amino Acid Pathologies\n- **Phenylketonuria (PKU):** Deficiency of Phenylalanine Hydroxylase (PAH) or BH4 cofactor. Causes intellectual disability, musty body odor, hypopigmentation.\n- **Alkaptonuria:** Deficiency of homogentisate oxidase. Causes dark connective tissue, brown sclera, urine turns black on prolonged exposure to air.\n- **Maple Syrup Urine Disease (MSUD):** Blocked degradation of branched-chain amino acids (Isoleucine, Leucine, Valine) due to decreased alpha-ketoacid dehydrogenase. Causes severe CNS defects and sweet-smelling urine."
  },
  {
    "slug": "nucleotide-metabolism-genetics",
    "title": "Nucleotides & Genetics",
    "category": "Genetics",
    "readingTime": "5 min read",
    "content": "# Nucleotide Metabolism & Molecular Biology\n\n## 1. Purine Metabolism (A, G)\n- **De Novo Synthesis:** Builds the purine ring directly onto a PRPP sugar base.\n- **Rate Limiting Enzyme:** Glutamine-PRPP amidotransferase.\n- **Degradation:** Purines are degraded into **Uric Acid** by Xanthine Oxidase.\n\n> [!TIP]\n> **Allopurinol** inhibits Xanthine Oxidase to prevent gout attacks by stopping uric acid production.\n\n### Lesch-Nyhan Syndrome\n- **Defect:** Absent HGPRT (Hypoxanthine-guanine phosphoribosyltransferase).\n- **Result:** Defective purine salvage. Massive overproduction of uric acid.\n- **Symptoms:** Gout, intellectual disability, self-mutilation (lip/finger biting).\n\n## 2. Pyrimidine Metabolism (C, U, T)\n- **De Novo Synthesis:** Builds the pyrimidine ring first, then adds PRPP.\n- **Rate Limiting Enzyme:** Carbamoyl Phosphate Synthetase II (CPS II) in the cytosol.\n\n## 3. DNA Replication\n- **Helicase:** Unwinds DNA template at replication fork.\n- **Topoisomerase:** Creates single/double-strand breaks to relieve supercoiling. (Target of Fluoroquinolones).\n- **Primase:** Makes an RNA primer on which DNA polymerase III can initiate replication.\n- **DNA Ligase:** Catalyzes the formation of a phosphodiester bond, joining Okazaki fragments.\n\n## 4. Transcription & Translation\n- **RNA Polymerase II:** Synthesizes mRNA in eukaryotes.\n- **TATA Box:** Essential promoter sequence binding site.\n- **Translation:** mRNA is translated by ribosomes (A site binds incoming tRNA, P site holds growing peptide, E site exits)."
  },
  {
    "slug": "pharma-drug-metabolism",
    "title": "Pharmacology & Drug Metabolism",
    "category": "Drug",
    "readingTime": "3 min read",
    "content": "# Drug Metabolism (Phase I & Phase II)\n\nDrugs are mostly lipophilic so they can cross cell membranes. The liver must convert them to hydrophilic metabolites for renal or biliary excretion.\n\n## Phase I: Modification (Oxidation, Reduction, Hydrolysis)\n- **Primary System:** Cytochrome P450 (CYP450) Enzymes in the smooth ER.\n- **Function:** Exposes or introduces a polar functional group (like -OH).\n- **CYP3A4:** Metabolizes ~50% of all drugs.\n- **Interactions:** \n  - *Inducers* (Rifampin, Phenobarbital) increase metabolism, lowering drug levels.\n  - *Inhibitors* (Grapefruit juice, Ketoconazole) decrease metabolism, increasing toxicity risk.\n\n## Phase II: Conjugation\n- **Function:** Attaches a large, highly polar molecule to the drug or Phase I metabolite.\n- **Glucuronidation:** Mediated by UGT. *Gilbert Syndrome* involves mild UGT deficiency causing benign jaundice.\n- **Sulfation:** Mediated by SULTs using PAPS.\n- **Glutathione Conjugation:** Mediated by GST. Essential for detoxifying highly reactive intermediates.\n\n> [!WARNING]\n> **Acetaminophen Toxicity:** Overdose saturates Phase II. Phase I (CYP2E1) metabolizes it to **NAPQI** (highly hepatotoxic). Treat immediately with **N-acetylcysteine (NAC)** to replenish glutathione."
  },
{
    "slug": "vitamins-coenzymes-high-yield",
    "title": "Vitamins & Coenzymes",
    "category": "Nutrition",
    "readingTime": "6 min read",
    "content": "# Vitamins & Coenzymes\n\n## 1. Water-Soluble Vitamins (B-Complex & C)\nThey wash out easily from the body, except B12 and B9 (stored in liver).\n\n- **B1 (Thiamine):** TPP. Cofactor for PDH, alpha-KGDH, Transketolase, Branched-chain ketoacid DH. *Deficiency:* Beriberi, Wernicke-Korsakoff.\n- **B2 (Riboflavin):** FAD, FMN. Used in redox reactions (e.g., Succinate DH). *Deficiency:* Cheilosis, Corneal vascularization.\n- **B3 (Niacin):** NAD+, NADP+. Derived from Tryptophan. *Deficiency:* Pellagra (Diarrhea, Dementia, Dermatitis, Death).\n- **B6 (Pyridoxine):** PLP. Required for transaminases (ALT, AST), glycogen phosphorylase, and heme synthesis (ALAS).\n- **B9 (Folate):** THF. Crucial for 1-carbon transfers (purine/pyrimidine synthesis). *Deficiency:* Megaloblastic anemia, Neural tube defects.\n- **B12 (Cobalamin):** Cofactor for Methionine synthase and Methylmalonyl-CoA mutase. *Deficiency:* Megaloblastic anemia + Neurologic symptoms (subacute combined degeneration).\n- **Vitamin C (Ascorbic Acid):** Antioxidant. Facilitates iron absorption. Hydroxylates proline/lysine in collagen. *Deficiency:* Scurvy (swollen gums, bruising, poor wound healing).\n\n## 2. Fat-Soluble Vitamins (A, D, E, K)\nToxicity is more common because they accumulate in fat.\n\n- **Vitamin A (Retinol):** Visual pigments, epithelial differentiation. *Deficiency:* Night blindness, Bitot spots. *Toxicity:* Teratogenic, pseudotumor cerebri.\n- **Vitamin D (Calciferol):** Increases intestinal absorption of calcium and phosphate. *Deficiency:* Rickets (children), Osteomalacia (adults).\n- **Vitamin E (Tocopherol):** Antioxidant (protects RBCs from free radical damage). *Deficiency:* Hemolytic anemia, neurologic dysfunction.\n- **Vitamin K (Phytomenadione):** Cofactor for gamma-carboxylation of clotting factors II, VII, IX, X, C, S. *Deficiency:* Neonatal hemorrhage (given as injection at birth).\n\n> [!CAUTION]\n> **Warfarin** acts as an anticoagulant by inhibiting Vitamin K epoxide reductase, blocking the regeneration of active Vitamin K."
},
{
    "slug": "enzymology-kinetics",
    "title": "Enzymology & Enzyme Kinetics",
    "category": "Enzymes",
    "readingTime": "4 min read",
    "content": "# Enzymology & Kinetics\n\n## 1. Michaelis-Menten Kinetics\n- **Vmax:** The maximum rate of reaction when all enzyme active sites are saturated.\n- **Km:** The substrate concentration at which the reaction velocity is half of Vmax.\n\n> [!NOTE]\n> Km is inversely related to affinity. A **LOW Km** means **HIGH affinity** (the enzyme binds tightly and reaches Vmax quickly).\n\n## 2. Lineweaver-Burk Plot\n- **y-intercept:** 1 / Vmax\n- **x-intercept:** -1 / Km\n\n## 3. Enzyme Inhibition\n\n### Competitive Inhibition\n- **Mechanism:** Inhibitor mimics the substrate and binds the active site.\n- **Vmax:** Unchanged (can be overcome by adding more substrate).\n- **Km:** Increases (affinity appears to decrease).\n- *Example:* Statins (competitive inhibitors of HMG-CoA reductase).\n\n### Non-Competitive Inhibition\n- **Mechanism:** Inhibitor binds to an allosteric site, altering enzyme conformation.\n- **Vmax:** Decreases (cannot be overcome by substrate).\n- **Km:** Unchanged (affinity for substrate remains the same).\n- *Example:* Allopurinol (though technically a suicide inhibitor, classic non-competitive examples include heavy metals).\n\n### Uncompetitive Inhibition\n- **Mechanism:** Inhibitor binds ONLY to the enzyme-substrate (ES) complex.\n- **Vmax:** Decreases.\n- **Km:** Decreases (locks the substrate in, appearing to increase affinity).\n\n## 4. Allosteric Regulation\n- Enzymes controlled by effectors that bind at sites other than the active site.\n- Often show a **sigmoidal (S-shaped)** curve instead of a hyperbolic Michaelis-Menten curve.\n- **Positive effectors** shift the curve left; **negative effectors** shift it right."
},
{
    "slug": "metabolic-integration",
    "title": "Integration of Metabolism",
    "category": "Metabolic Integration",
    "readingTime": "5 min read",
    "content": "# Integration of Metabolism\n\n## 1. Well-Fed State (Absorptive)\n- **Hormone Profile:** HIGH Insulin, LOW Glucagon.\n- **Liver:** \n  - Glycolysis is active (making energy/acetyl-CoA).\n  - Glycogenesis is active (storing glucose).\n  - Fatty Acid Synthesis is active (excess citrate shuttled out to make fat).\n- **Muscle:** Takes up glucose (GLUT4) and stores it as glycogen. Uses some for energy.\n- **Adipose:** Takes up glucose (GLUT4) and fatty acids (via LPL) to synthesize and store Triglycerides.\n\n## 2. Fasting State (Post-Absorptive, 4-18 hrs)\n- **Hormone Profile:** LOW Insulin, HIGH Glucagon.\n- **Liver:**\n  - **Glycogenolysis** is the primary source of blood glucose.\n  - **Gluconeogenesis** begins to ramp up.\n- **Adipose:** Hormone-Sensitive Lipase (HSL) breaks down Triglycerides into free fatty acids and glycerol.\n- **Muscle:** Shifts to using fatty acids for energy to save glucose for the brain.\n\n## 3. Starvation State (1-3 Days and Beyond)\n- **Hormone Profile:** VERY LOW Insulin, HIGH Glucagon, High Epinephrine/Cortisol.\n- **Liver:**\n  - Glycogen stores are completely depleted after ~24 hours.\n  - **Gluconeogenesis** is the sole source of new glucose (using amino acids, lactate, and glycerol).\n  - Massive Beta-Oxidation of fatty acids leads to excess Acetyl-CoA, triggering **Ketogenesis**.\n- **Muscle:** Relies entirely on fatty acids and ketone bodies. Decreases protein breakdown after a few days to preserve mass.\n- **Brain:** Slowly adapts to using **Ketone Bodies** (up to 60-70% of energy) to drastically reduce the brain demand for glucose.\n\n> [!IMPORTANT]\n> The brain and RBCs absolutely depend on glucose. RBCs can never use ketones because they lack mitochondria."
},
{
    "slug": "gluconeogenesis-glycogen-metabolism",
    "title": "Gluconeogenesis & Glycogen",
    "category": "Carbohydrate",
    "readingTime": "6 min read",
    "content": "# Gluconeogenesis & Glycogen Metabolism\n\n## 1. Gluconeogenesis\nThe synthesis of new glucose from non-carbohydrate precursors (lactate, amino acids, glycerol). Primarily occurs in the **Liver** and kidney cortex.\n\n### The 4 Irreversible Bypasses of Glycolysis\n1. **Pyruvate Carboxylase** (bypasses Pyruvate Kinase): Converts Pyruvate to Oxaloacetate. Requires **Biotin**, ATP, and CO2. Activated by Acetyl-CoA.\n2. **PEP Carboxykinase** (bypasses Pyruvate Kinase): Converts Oxaloacetate to PEP. Requires GTP.\n3. **Fructose-1,6-bisphosphatase** (bypasses PFK-1): **RATE-LIMITING STEP**. Activated by ATP. Inhibited by AMP and Fructose 2,6-bisphosphate.\n4. **Glucose-6-phosphatase** (bypasses Hexokinase): Found ONLY in the liver/ER. Allows glucose to enter the blood.\n\n## 2. Glycogenesis (Synthesis)\n- **Rate Limiting Enzyme:** Glycogen Synthase.\n- Activated by Insulin, inhibited by Glucagon/Epinephrine.\n- Uses **UDP-Glucose** as the activated building block.\n\n## 3. Glycogenolysis (Breakdown)\n- **Rate Limiting Enzyme:** Glycogen Phosphorylase.\n- Activated by Glucagon (liver) / Epinephrine and AMP (muscle).\n- Cleaves alpha-1,4 bonds to release Glucose-1-phosphate until it reaches a branch point.\n- **Debranching Enzyme** handles the alpha-1,6 branch points.\n\n## 4. Glycogen Storage Diseases (GSDs)\n- **Type I (Von Gierke):** Glucose-6-phosphatase deficiency. Severe fasting hypoglycemia, massive hepatomegaly, lactic acidosis.\n- **Type II (Pompe):** Lysosomal alpha-1,4-glucosidase deficiency. Cardiomegaly, early death (Pompe trashes the Pump).\n- **Type III (Cori):** Debranching enzyme deficiency. Milder hypoglycemia, normal blood lactate.\n- **Type V (McArdle):** Muscle Glycogen Phosphorylase deficiency. Muscle cramps, myoglobinuria with strenuous exercise. No hypoglycemia."
},
{
    "slug": "pentose-phosphate-pathway",
    "title": "Pentose Phosphate Pathway (HMP Shunt)",
    "category": "Carbohydrate",
    "readingTime": "4 min read",
    "mindMapUrl": "/mind-map/ppp-mindmap.png",
    "content": "# Pentose Phosphate Pathway\n\nAlso known as the Hexose Monophosphate (HMP) Shunt. It occurs entirely in the **Cytosol** and produces NO ATP.\n\n## 1. Main Purposes\n1. Generate **NADPH** for reductive biosynthesis (fatty acids, cholesterol) and maintaining glutathione in RBCs.\n2. Generate **Ribose-5-phosphate** for nucleotide (DNA/RNA) synthesis.\n\n## 2. Oxidative Phase (Irreversible)\n- **Rate Limiting Enzyme:** Glucose-6-Phosphate Dehydrogenase (G6PD).\n- Produces 2 NADPH and Ribulose-5-phosphate from G6P.\n- Strongly inhibited by high levels of NADPH.\n\n## 3. Non-Oxidative Phase (Reversible)\n- Uses enzymes like **Transketolase** (requires **Thiamine/B1**).\n- Can convert ribulose back into glycolytic intermediates (Fructose-6-P and GAP) depending on cellular needs.\n\n> [!WARNING]\n> **G6PD Deficiency:** An X-linked recessive disorder. RBCs cannot produce NADPH, leaving them vulnerable to oxidative stress (fava beans, antimalarial drugs, sulfa drugs). Leads to episodic hemolytic anemia. Blood smears show **Heinz bodies** and **Bite cells**."
},
{
    "slug": "fructose-galactose-disorders",
    "title": "Fructose & Galactose Metabolism",
    "category": "Carbohydrate",
    "readingTime": "4 min read",
    "content": "# Fructose & Galactose Metabolism\n\n## 1. Fructose Metabolism\nFructose bypasses PFK-1, meaning it enters glycolysis much faster than glucose.\n\n- **Essential Fructosuria:** Defect in **Fructokinase**. Benign, asymptomatic condition where fructose appears in urine.\n- **Hereditary Fructose Intolerance:** Defect in **Aldolase B**. Fructose-1-P accumulates, depleting intracellular ATP/Pi. Causes severe hypoglycemia, jaundice, cirrhosis, vomiting after consuming fruit/juice or honey.\n\n## 2. Galactose Metabolism\n- **Galactokinase Deficiency:** Causes galactosemia and galactosuria. Mild. Causes **infantile cataracts** (due to conversion of galactose to galactitol by aldose reductase).\n- **Classic Galactosemia:** Defect in **Galactose-1-phosphate uridyltransferase (GALT)**. Severe condition. Toxic accumulation of Galactose-1-P. Causes failure to thrive, jaundice, hepatomegaly, cataracts, and intellectual disability. Must strictly avoid all lactose/milk products.\n\n> [!CAUTION]\n> In neonates, Classic Galactosemia strongly predisposes them to **E. coli sepsis**."
},
{
    "slug": "lipoproteins-cholesterol-synthesis",
    "title": "Cholesterol & Lipoproteins",
    "category": "Lipid",
    "readingTime": "5 min read",
    "content": "# Cholesterol Synthesis & Lipoproteins\n\n## 1. Cholesterol Synthesis\n- **Precursor:** Acetyl-CoA.\n- **Location:** Cytosol and Smooth ER.\n- **Rate Limiting Enzyme:** **HMG-CoA Reductase** (Converts HMG-CoA to Mevalonate).\n- **Regulation:** Inhibited by cholesterol, glucagon, and **Statins**. Activated by insulin.\n\n## 2. Lipoprotein Metabolism\nLipids are not water-soluble and must be transported in blood by lipoproteins.\n\n- **Chylomicrons:** Transport **dietary** triglycerides from intestines to tissues. (Apo B-48).\n- **VLDL:** Transports **endogenous** triglycerides from liver to tissues. (Apo B-100).\n- **LDL:** Transports **cholesterol** to peripheral tissues. Picked up by LDL receptors. (The 'Bad' cholesterol).\n- **HDL:** Mediates **Reverse Cholesterol Transport** (peripheral tissues back to liver). Synthesized by liver/intestines. (The 'Good' cholesterol, Apo A-I).\n\n## 3. Important Apolipoproteins\n- **Apo E:** Mediates remnant uptake. Present on all EXCEPT LDL.\n- **Apo A-I:** Activates LCAT on HDL.\n- **Apo C-II:** Activates Lipoprotein Lipase (LPL) to clear triglycerides.\n- **Apo B-48:** Secretion of chylomicrons.\n- **Apo B-100:** Binds LDL receptor.\n\n## 4. Dyslipidemias\n- **Type I (Hyperchylomicronemia):** LPL or Apo C-II deficiency. Creamy layer in blood, pancreatitis. No increased risk for atherosclerosis.\n- **Type IIa (Familial Hypercholesterolemia):** Absent/Defective LDL receptors or Apo B-100. Severe atherosclerosis, early MIs, tendon xanthomas (Achilles).\n- **Type IV (Hypertriglyceridemia):** Hepatic overproduction of VLDL. Can cause acute pancreatitis."
},
{
    "slug": "heme-synthesis-porphyrias",
    "title": "Heme Synthesis & Porphyrias",
    "category": "Specialized",
    "readingTime": "4 min read",
    "content": "# Heme Synthesis & Porphyrias\n\n## 1. Heme Synthesis\nHeme is essential for Hemoglobin, Myoglobin, and Cytochromes (ETC, CYP450).\n- **Location:** Partly mitochondria, partly cytosol (Bone marrow and Liver).\n- **Precursors:** Glycine + Succinyl-CoA.\n- **Rate Limiting Enzyme:** **Aminolevulinic Acid Synthase (ALAS)**. Requires Vitamin B6 (PLP). Inhibited by Heme and Glucose.\n- **Ferrochelatase:** The final enzyme; adds Iron (Fe2+) into the protoporphyrin ring to make Heme.\n\n## 2. Lead Poisoning\nLead inhibits two key enzymes in heme synthesis:\n1. **ALA Dehydratase**\n2. **Ferrochelatase**\n- **Symptoms:** Microcytic anemia, basophilic stippling on blood smear, lead lines on gingivae, neuropathy (wrist/foot drop), abdominal colic.\n\n## 3. The Porphyrias\nDefects in heme synthesis leading to accumulation of toxic precursors.\n\n- **Acute Intermittent Porphyria (AIP):** Defect in Porphobilinogen Deaminase. Accumulates porphobilinogen. **Symptoms (5 Ps):** Painful abdomen, Port wine-colored urine, Polyneuropathy, Psychological disturbances, Precipitated by drugs (e.g., CYP450 inducers, alcohol). *Treatment:* Glucose and Hemin (inhibits ALAS).\n- **Porphyria Cutanea Tarda (PCT):** Defect in Uroporphyrinogen Decarboxylase (UROD). Most common porphyria. **Symptoms:** Blistering cutaneous photosensitivity (lesions on sun-exposed skin), hyperpigmentation, tea-colored urine. Exacerbated by alcohol and hepatitis C."
},
{
    "slug": "hormone-signaling-pathways",
    "title": "Hormone Signaling Pathways",
    "category": "Signaling",
    "readingTime": "5 min read",
    "content": "# Hormone Signaling Pathways\n\n## 1. cAMP / PKA Pathway (Gs and Gi)\n- **Mechanism:** Hormone binds GPCR -> Gs subunit activates Adenylyl Cyclase -> converts ATP to cAMP -> activates Protein Kinase A (PKA) -> phosphorylates target enzymes.\n- **Hormones (FLAT ChAMP):** FSH, LH, ACTH, TSH, CRH, hCG, ADH (V2), MSH, PTH, Calcitonin, **Glucagon**.\n\n## 2. IP3 / DAG / Calcium Pathway (Gq)\n- **Mechanism:** Hormone binds GPCR -> Gq activates Phospholipase C -> cleaves PIP2 into IP3 and DAG.\n  - IP3 triggers Calcium release from ER.\n  - DAG + Calcium activate Protein Kinase C (PKC).\n- **Hormones (GOAT HAG):** GnRH, Oxytocin, ADH (V1), TRH, Histamine (H1), Angiotensin II, Gastrin.\n\n## 3. Receptor Tyrosine Kinase (MAPK Pathway)\n- **Mechanism:** Hormone binds directly to receptor -> receptor dimerizes and autophosphorylates tyrosine residues -> downstream activation (e.g., RAS, PI3K/AKT).\n- **Hormones:** **Insulin**, IGF-1, Growth Factors (FGF, PDGF, EGF).\n- *Crucial Note:* Insulin uses this pathway to translocate GLUT4 receptors to the membrane in muscle/fat, and to activate phosphatases (dephosphorylating/activating Glycogen Synthase).\n\n## 4. Intracellular (Steroid) Receptors\n- **Mechanism:** Highly lipophilic hormones cross the cell membrane and bind cytosolic or nuclear receptors -> complex binds DNA and alters gene transcription. (Slow acting but long lasting).\n- **Hormones (PET CAT in TV):** Progesterone, Estrogen, Testosterone, Cortisol, Aldosterone, T3/T4, Vitamin D.\n\n## 5. Non-Receptor Tyrosine Kinase (JAK/STAT)\n- **Mechanism:** Hormone binds receptor -> receptor recruits cytosolic JAK kinases -> phosphorylate STAT -> STAT translocates to nucleus.\n- **Hormones (PIGGlET):** Prolactin, Immunomodulators (Cytokines/ILs), GH, G-CSF, Erythropoietin (EPO), Thrombopoietin."
}
];

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

  getFlashcards: (): Flashcard[] => {
    const savedStates = getStoredData('bc_flashcards_state', {});
    return INITIAL_FLASHCARDS.map(fc => ({
      ...fc,
      bookmarked: savedStates[fc.id]?.bookmarked || false,
      leitnerState: savedStates[fc.id]?.leitnerState || 'new'
    }));
  },
  
  getStaticFlashcards: (): Flashcard[] => INITIAL_FLASHCARDS,

  toggleFlashcardBookmark: (id: string): void => {
    const savedStates = getStoredData('bc_flashcards_state', {});
    if (!savedStates[id]) savedStates[id] = {};
    savedStates[id].bookmarked = !savedStates[id].bookmarked;
    setStoredData('bc_flashcards_state', savedStates);
  },
  
  updateFlashcardLeitner: (id: string, state: any): void => {
    const savedStates = getStoredData('bc_flashcards_state', {});
    if (!savedStates[id]) savedStates[id] = {};
    savedStates[id].leitnerState = state;
    setStoredData('bc_flashcards_state', savedStates);
  },

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

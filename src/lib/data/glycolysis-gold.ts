import { Pathway, QuizQuestion, Flashcard } from "../db";

export const glycolysisGoldPathway: Pathway = {
  slug: "glycolysis",
  title: "Glycolysis",
  mindMapUrl: "/mind-map/glycolysis-mindmap.jpeg",
  category: "Carbohydrate",
  description: "The metabolic pathway that converts glucose into pyruvate, generating free energy.",
  cellularLocation: "Cytosol",
  clinicalImportance: "Universal central pathway of glucose metabolism. Operates anaerobically or aerobically.",
  rateLimitingStep: {
    name: "Phosphorylation of Fructose-6-Phosphate",
    enzyme: "Phosphofructokinase-1 (PFK-1)",
    description: "The committed and most important rate-limiting step of glycolysis.",
    regulation: "Inhibited by ATP, Citrate. Activated by AMP, Fructose-2,6-bisphosphate.",
    clinicalImportance: "Tarui disease (GSD VII) is caused by muscle PFK-1 deficiency leading to exercise intolerance."
  },
  regulationSummary: {
    activators: ["AMP", "Fructose-2,6-bisphosphate", "Insulin"],
    inhibitors: ["ATP", "Citrate", "Alanine", "Glucagon"],
    hormonalControl: "Insulin promotes glycolysis by activating key enzymes; Glucagon inhibits it."
  },
  clinicalSignificance: {
    diseases: ["Pyruvate Kinase Deficiency", "Tarui Disease (GSD VII)", "MODY 2 (Glucokinase deficiency)"],
    drugTargets: ["Enolase (targeted by Fluoride)", "Hexokinase (inhibited by Glucose-6-Phosphate)"],
    labFindings: ["Hemolytic anemia in PK deficiency", "Elevated 2,3-BPG"]
  },
  reactions: [
    {
      step: 1,
      title: "Hexokinase / Glucokinase",
      enzyme: "Hexokinase / Glucokinase",
      substrate: "Glucose",
      product: "Glucose-6-Phosphate",
      energyChange: "Consumes 1 ATP",
      type: "irreversible",
      isRateLimiting: false,
      description: "Phosphorylation traps glucose inside the cell.",
      cofactors: ["Mg2+"],
      diseases: ["MODY 2 (Glucokinase deficiency)"],
      highYield: "Hexokinase has low Km (high affinity) and is found in most tissues. Glucokinase has high Km and is found in Liver/Pancreas.",
      vivaQuestions: ["What is the difference between Hexokinase and Glucokinase?", "Why is glucose phosphorylated immediately upon entering the cell?"],
      mnemonics: ["Hexo is for eXtra-hepatic tissues; Gluco is for Gluttonous liver."],
      molecules: {
        consumes: { ATP: 1 },
        produces: { ADP: 1 }
      },
      x: 500, y: 100
    },
    {
      step: 2,
      title: "Phosphohexose Isomerase",
      enzyme: "Phosphohexose Isomerase",
      substrate: "Glucose-6-Phosphate",
      product: "Fructose-6-Phosphate",
      type: "reversible",
      description: "Isomerization of an aldose to a ketose.",
      x: 500, y: 300
    },
    {
      step: 3,
      title: "Phosphofructokinase-1 (PFK-1)",
      enzyme: "Phosphofructokinase-1",
      substrate: "Fructose-6-Phosphate",
      product: "Fructose-1,6-Bisphosphate",
      energyChange: "Consumes 1 ATP",
      type: "irreversible",
      isRateLimiting: true,
      description: "The committed and most important rate-limiting step of glycolysis.",
      cofactors: ["Mg2+"],
      drugs: ["Fructose-2,6-bisphosphate (potent activator)"],
      diseases: ["Tarui disease (Type VII Glycogen Storage Disease)"],
      highYield: "PFK-1 is inhibited by ATP and Citrate. It is activated by AMP and Fructose-2,6-bisphosphate.",
      vivaQuestions: ["What is the most important rate-limiting enzyme of glycolysis?", "How does Fructose-2,6-bisphosphate affect PFK-1?"],
      molecules: {
        consumes: { ATP: 1 },
        produces: { ADP: 1 }
      },
      x: 500, y: 500
    },
    {
      step: 4,
      title: "Aldolase",
      enzyme: "Aldolase (A, B, C)",
      substrate: "Fructose-1,6-Bisphosphate",
      product: "DHAP & Glyceraldehyde-3-Phosphate",
      type: "reversible",
      description: "Cleavage of the 6-carbon sugar into two 3-carbon sugars.",
      diseases: ["Hereditary Fructose Intolerance (Aldolase B deficiency)"],
      vivaQuestions: ["Which aldolase is responsible for hereditary fructose intolerance?"],
      x: 500, y: 700
    },
    {
      step: 5,
      title: "Triose Phosphate Isomerase",
      enzyme: "Triose Phosphate Isomerase",
      substrate: "Dihydroxyacetone Phosphate (DHAP)",
      product: "Glyceraldehyde-3-Phosphate (G3P)",
      type: "reversible",
      description: "Isomerization allowing DHAP to enter the glycolytic payoff phase.",
      highYield: "From this point onward, all reactions occur twice for every one molecule of glucose.",
      x: 500, y: 900
    },
    {
      step: 6,
      title: "G3P Dehydrogenase",
      enzyme: "Glyceraldehyde-3-Phosphate Dehydrogenase",
      substrate: "Glyceraldehyde-3-Phosphate",
      product: "1,3-Bisphosphoglycerate",
      energyChange: "Produces 1 NADH (x2 per glucose)",
      nadhProduced: true,
      type: "reversible",
      description: "Oxidation and phosphorylation yielding NADH and a high-energy anhydride bond.",
      cofactors: ["NAD+", "Inorganic Phosphate"],
      vitamins: ["Niacin (B3)"],
      drugs: ["Arsenate (inhibitor replacing phosphate)"],
      vivaQuestions: ["How does Arsenate poisoning affect this step?"],
      molecules: {
        consumes: { NAD_plus: 2, Pi: 2 },
        produces: { NADH: 2, H_plus: 2 }
      },
      x: 500, y: 1100
    },
    {
      step: 7,
      title: "Phosphoglycerate Kinase",
      enzyme: "Phosphoglycerate Kinase",
      substrate: "1,3-Bisphosphoglycerate",
      product: "3-Phosphoglycerate",
      energyChange: "Produces 1 ATP (x2 per glucose)",
      type: "reversible",
      description: "Substrate-level phosphorylation yielding ATP. Breakeven point of glycolysis.",
      cofactors: ["Mg2+"],
      highYield: "This is a rare reversible kinase.",
      molecules: {
        consumes: { ADP: 2 },
        produces: { ATP: 2 }
      },
      x: 500, y: 1300
    },
    {
      step: 8,
      title: "Phosphoglycerate Mutase",
      enzyme: "Phosphoglycerate Mutase",
      substrate: "3-Phosphoglycerate",
      product: "2-Phosphoglycerate",
      type: "reversible",
      description: "Intramolecular shift of the phosphate group.",
      x: 500, y: 1500
    },
    {
      step: 9,
      title: "Enolase",
      enzyme: "Enolase",
      substrate: "2-Phosphoglycerate",
      product: "Phosphoenolpyruvate (PEP)",
      waterProduced: true,
      type: "reversible",
      description: "Dehydration reaction forming a high-energy enol phosphate.",
      cofactors: ["Mg2+", "Mn2+"],
      drugs: ["Fluoride (inhibits enolase)"],
      highYield: "Fluoride is added to blood collection tubes to prevent glycolysis in vitro.",
      molecules: {
        produces: { H2O: 2 }
      },
      x: 500, y: 1700
    },
    {
      step: 10,
      title: "Pyruvate Kinase",
      enzyme: "Pyruvate Kinase",
      substrate: "Phosphoenolpyruvate (PEP)",
      product: "Pyruvate",
      energyChange: "Produces 1 ATP (x2 per glucose)",
      type: "irreversible",
      description: "Second substrate-level phosphorylation yielding ATP and Pyruvate.",
      cofactors: ["Mg2+", "K+"],
      diseases: ["Pyruvate Kinase Deficiency (causes hemolytic anemia)"],
      highYield: "Activated by Fructose-1,6-Bisphosphate (feed-forward activation). Inhibited by ATP and Alanine.",
      vivaQuestions: ["Why does PK deficiency cause hemolytic anemia but not affect muscle cells?", "What is feed-forward activation?"],
      mnemonics: ["PK deficiency Pales RBCs (hemolytic anemia)"],
      molecules: {
        consumes: { ADP: 2 },
        produces: { ATP: 2 }
      },
      x: 500, y: 1900
    }
  ],
  summaryCard: "Glycolysis converts 1 Glucose into 2 Pyruvate, generating a net of 2 ATP and 2 NADH. It occurs in the cytosol and its rate-limiting step is catalyzed by PFK-1."
};

export const glycolysisQuizzes: QuizQuestion[] = [
  {
    id: "glyco-q1",
    type: "mcq",
    question: "Which of the following is the net ATP yield from one molecule of glucose during aerobic glycolysis?",
    options: ["2 ATP", "4 ATP", "32 ATP", "36 ATP"],
    correctAnswer: "2 ATP",
    explanation: "During glycolysis, 4 ATP are produced via substrate-level phosphorylation, but 2 ATP are consumed in the preparatory phase (by hexokinase and PFK-1), resulting in a net yield of 2 ATP.",
    difficulty: "Easy",
    pathwaySlug: "glycolysis",
    memoryTrick: "Gross 4, Net 2. You invest 2 to make 4."
  },
  {
    id: "glyco-q2",
    type: "mcq",
    question: "Which enzyme catalyzes the committed, rate-limiting step of glycolysis?",
    options: ["Hexokinase", "Phosphofructokinase-1 (PFK-1)", "Pyruvate kinase", "Aldolase"],
    correctAnswer: "Phosphofructokinase-1 (PFK-1)",
    explanation: "PFK-1 catalyzes the conversion of Fructose 6-phosphate to Fructose 1,6-bisphosphate. This is the first irreversible step unique to glycolysis.",
    difficulty: "Hard",
    pathwaySlug: "glycolysis",
    relatedEnzyme: "Phosphofructokinase-1"
  },
  {
    id: "glyco-q3",
    type: "mcq",
    question: "In blood collection tubes used for glucose estimation, which chemical is added to inhibit glycolysis, and what enzyme does it target?",
    options: ["EDTA inhibiting Hexokinase", "Fluoride inhibiting Enolase", "Citrate inhibiting PFK-1", "Oxalate inhibiting Pyruvate Kinase"],
    correctAnswer: "Fluoride inhibiting Enolase",
    explanation: "Sodium fluoride is added to blood samples to prevent red blood cells from consuming the glucose via glycolysis. It does this by competitively inhibiting the enzyme enolase.",
    difficulty: "Medium",
    pathwaySlug: "glycolysis",
    relatedEnzyme: "Enolase"
  },
  {
    id: "glyco-q4",
    type: "clinical",
    question: "A young patient presents with chronic fatigue and jaundice. Blood smear shows normocytic anemia with spiculated red blood cells (echinocytes). He has splenomegaly. A deficiency in which glycolytic enzyme is most likely?",
    options: ["Hexokinase", "Phosphofructokinase-1", "Pyruvate Kinase", "Glucose-6-Phosphate Dehydrogenase"],
    correctAnswer: "Pyruvate Kinase",
    explanation: "Pyruvate Kinase (PK) deficiency is the most common glycolytic enzyme defect causing hemolytic anemia. Red blood cells rely entirely on glycolysis for ATP to maintain their Na+/K+ ATPase pumps. Without ATP, the cells swell and lyse.",
    difficulty: "Hard",
    pathwaySlug: "glycolysis",
    relatedEnzyme: "Pyruvate Kinase"
  },
  {
    id: "glyco-q5",
    type: "boolean",
    question: "Hexokinase has a lower Km for glucose than Glucokinase.",
    correctAnswer: "True",
    explanation: "Hexokinase has a very low Km (high affinity) allowing it to trap glucose in peripheral tissues even at low blood concentrations. Glucokinase (found in the liver) has a high Km (low affinity) and only operates effectively after a high-carb meal.",
    difficulty: "Medium",
    pathwaySlug: "glycolysis",
    memoryTrick: "Hexokinase is a 'Hoarder' (keeps glucose always). Glucokinase is 'Gluttonous' (only eats when there's a feast)."
  },
  {
    id: "glyco-q6",
    type: "fill-blank",
    question: "The most potent allosteric activator of PFK-1 is ________.",
    correctAnswer: "Fructose-2,6-bisphosphate",
    explanation: "Fructose-2,6-bisphosphate (F2,6-BP) overrides ATP inhibition and strongly activates PFK-1, ensuring glycolysis proceeds in the fed state when insulin is high.",
    difficulty: "Hard",
    pathwaySlug: "glycolysis"
  },
  {
    id: "glyco-q7",
    type: "match",
    question: "Match the glycolytic enzyme with its clinical relevance/inhibitor.",
    correctAnswer: [
      "Enolase - Inhibited by Fluoride",
      "Pyruvate Kinase - Deficiency causes hemolytic anemia",
      "Glucokinase - Mutation causes MODY-2",
      "PFK-1 - Activated by AMP"
    ],
    explanation: "Fluoride blocks enolase. PK deficiency causes RBC lysis. Glucokinase mutations impair insulin release causing MODY. PFK-1 is the rate-limiting enzyme activated by AMP.",
    difficulty: "Medium",
    pathwaySlug: "glycolysis"
  }
];

export const glycolysisFlashcards: Flashcard[] = [
  {
    id: "fc-glyco-1",
    pathwayName: "Glycolysis",
    category: "Enzymes",
    front: "What is the rate-limiting enzyme of glycolysis?",
    back: "Phosphofructokinase-1 (PFK-1)"
  },
  {
    id: "fc-glyco-2",
    pathwayName: "Glycolysis",
    category: "Energy Yield",
    front: "What is the net ATP yield of aerobic glycolysis?",
    back: "2 ATP (4 produced, 2 consumed)"
  },
  {
    id: "fc-glyco-3",
    pathwayName: "Glycolysis",
    category: "Clinical",
    front: "Why does Pyruvate Kinase deficiency cause hemolytic anemia?",
    back: "RBCs lack mitochondria and rely 100% on glycolysis. Without ATP from PK, the Na+/K+ pump fails, leading to RBC swelling and destruction in the spleen."
  },
  {
    id: "fc-glyco-4",
    pathwayName: "Glycolysis",
    category: "Pharmacology",
    front: "Which glycolytic enzyme is inhibited by Fluoride?",
    back: "Enolase"
  },
  {
    id: "fc-glyco-5",
    pathwayName: "Glycolysis",
    category: "Enzymes",
    front: "Hexokinase vs Glucokinase: Which has a higher Km (lower affinity) for glucose?",
    back: "Glucokinase (Found in liver/pancreas; active only after a meal)"
  }
];

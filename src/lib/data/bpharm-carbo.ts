import { Pathway } from '../db';

export const bpharmCarboModule: Pathway[] = [
  {
    slug: "gluconeogenesis",
    title: "Gluconeogenesis",
    category: "Carbohydrate",
    mindMapUrl: "/mind-map/gluconeogenesis-mindmap.jpeg",
    description: "Synthesis of new glucose from non-carbohydrate precursors (lactate, glycerol, and glucogenic amino acids) during fasting.",
    clinicalImportance: "Essential for maintaining blood glucose levels during fasting and starvation to fuel the brain and RBCs.",
    cellularLocation: "Liver (primary) and Kidney cortex (secondary). Occurs in both mitochondria and cytosol.",
    rateLimitingStep: {
      name: "Fructose-1,6-bisphosphatase",
      enzyme: "Fructose-1,6-bisphosphatase (FBPase-1)",
      description: "Bypasses the irreversible PFK-1 step of glycolysis.",
      regulation: "Activated by ATP. Inhibited by AMP and Fructose-2,6-bisphosphate.",
      clinicalImportance: "Deficiency causes severe fasting hypoglycemia and lactic acidosis."
    },
    regulationSummary: {
      activators: ["Glucagon", "Cortisol", "Acetyl-CoA (activates Pyruvate Carboxylase)", "ATP"],
      inhibitors: ["Insulin", "AMP", "Fructose-2,6-bisphosphate"],
      hormonalControl: "Glucagon stimulates PKA, which inactivates PFK-2 and activates FBPase-2, lowering F-2,6-BP levels and promoting gluconeogenesis."
    },
    clinicalSignificance: {
      diseases: ["Von Gierke Disease (Type I GSD): Glucose-6-Phosphatase deficiency.", "Alcohol-induced hypoglycemia: NADH blocks gluconeogenesis."],
      drugTargets: ["Metformin: Inhibits hepatic gluconeogenesis via AMPK activation."],
      labFindings: ["Hypoglycemia with lactic acidosis if G6Pase is deficient."],
      vitaminDeficiencies: ["Biotin (B7) is strictly required for Pyruvate Carboxylase."]
    },
    pharmacyNotes: {
      whyStudy: "Explains how the body prevents fatal hypoglycemia and why excessive alcohol causes hypoglycemia.",
      clinicalUses: "Understanding the primary mechanism of action for Metformin (first-line Type 2 Diabetes drug).",
      importantInhibitors: ["Metformin", "Ethanol (indirectly via NADH elevation)"],
      importantActivators: ["Glucagon", "Epinephrine", "Cortisol"],
      commonQuestions: ["Which 3 glycolytic steps must be bypassed?", "What is the role of Biotin in gluconeogenesis?"],
      highYieldPoints: ["Requires 4 unique enzymes to bypass 3 irreversible glycolytic steps (Pathway: Pyruvate Carboxylase, PEPCK, FBPase-1, G6Pase).", "Ethanol metabolism consumes NAD+ to make NADH. High NADH forces Pyruvate to Lactate, halting gluconeogenesis."]
    },
    atpSummary: {
      consumedATP: 4,
      producedATP: 0,
      netATP: -6,
      producedNADH: 0,
      producedFADH2: 0,
      producedNADPH: 0,
      producedGTP: 0,
      releasedCO2: 0,
      usedH2O: 0,
      producedH2O: 0,
      overallYield: "Consumes 4 ATP, 2 GTP, and 2 NADH per molecule of glucose synthesized."
    },
    memoryAids: {
      mnemonics: ["Pathway Producing Fresh Glucose (Pyruvate carboxylase, PEPCK, FBPase-1, G6Pase)"],
      tricks: ["To go backward from Pyruvate, you need to 'Carboxylate' then 'Kinase'."],
      examTips: ["Odd-chain fatty acids can enter gluconeogenesis via Propionyl-CoA to Succinyl-CoA. Even-chain fatty acids CANNOT."],
      commonMistakes: ["Thinking that Acetyl-CoA from beta-oxidation can become glucose. It cannot. It only provides the ATP to drive the process."]
    },
    pathwayConnections: {
      upstream: ["Cori Cycle (Lactate)", "Beta-Oxidation (ATP source)"],
      downstream: ["Glycolysis (reciprocal regulation)"],
      related: ["Glycogenolysis"]
    },
    reactions: [
      {
        step: 1,
        title: "Pyruvate Carboxylation",
        enzyme: "Pyruvate Carboxylase",
        ecNumber: "6.4.1.1",
        substrate: "Pyruvate",
        product: "Oxaloacetate",
        type: "irreversible",
        isCommittedStep: false,
        description: "Bypasses Pyruvate Kinase (Part 1). Occurs in mitochondria.",
        compartment: "Mitochondrial Matrix",
        cofactors: ["Biotin (B7)", "ATP", "CO2"],
        allostericRegulation: "Obligatory activation by Acetyl-CoA.",
        molecules: { consumes: { ATP: 1, CO2: 1 } }
      },
      {
        step: 2,
        title: "Malate Shuttle",
        enzyme: "Malate Dehydrogenase (Mito & Cyto)",
        ecNumber: "1.1.1.37",
        substrate: "Oxaloacetate",
        product: "Phosphoenolpyruvate (PEP)",
        type: "reversible",
        description: "OAA is reduced to malate to exit mitochondria, then re-oxidized to OAA in cytosol, then converted to PEP by PEPCK.",
        compartment: "Cytosol",
        cofactors: ["GTP"],
        molecules: { consumes: { GTP: 1 }, produces: { CO2: 1 } }
      },
      {
        step: 3,
        title: "Reverse Enolase to Aldolase",
        enzyme: "Enolase, Phosphoglycerate Mutase, PGK, GAPDH, Aldolase",
        ecNumber: "Various",
        substrate: "Phosphoenolpyruvate (PEP)",
        product: "Fructose-1,6-bisphosphate",
        type: "reversible",
        description: "Reversible steps of glycolysis driven backward by high concentrations of intermediates.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1, NADH: 1 } }
      },
      {
        step: 4,
        title: "Fructose-1,6-bisphosphatase",
        enzyme: "Fructose-1,6-bisphosphatase (FBPase-1)",
        ecNumber: "3.1.3.11",
        substrate: "Fructose-1,6-bisphosphate",
        product: "Fructose-6-Phosphate",
        type: "irreversible",
        isRateLimiting: true,
        description: "Bypasses PFK-1. Rate-limiting step of gluconeogenesis.",
        compartment: "Cytosol",
        allostericRegulation: "Inhibited by AMP and F2,6BP. Activated by ATP.",
        molecules: { consumes: { H2O: 1 }, produces: { Pi: 1 } }
      },
      {
        step: 5,
        title: "Phosphohexose Isomerase",
        enzyme: "Phosphoglucose Isomerase",
        ecNumber: "5.3.1.9",
        substrate: "Fructose-6-Phosphate",
        product: "Glucose-6-Phosphate",
        type: "reversible",
        description: "Reversible isomerization.",
        compartment: "Cytosol"
      },
      {
        step: 6,
        title: "Glucose-6-phosphatase",
        enzyme: "Glucose-6-Phosphatase",
        ecNumber: "3.1.3.9",
        substrate: "Glucose-6-Phosphate",
        product: "Glucose",
        type: "irreversible",
        description: "Bypasses Hexokinase/Glucokinase. Allows free glucose to enter blood.",
        compartment: "ER Lumen",
        clinicalInhibitors: ["Deficient in Von Gierke disease"],
        molecules: { consumes: { H2O: 1 }, produces: { Pi: 1 } }
      }
    ],
    summaryCard: "Gluconeogenesis is the critical liver pathway that synthesizes new glucose from lactate, amino acids, and glycerol to prevent fasting hypoglycemia. It requires 4 unique enzymes to bypass glycolysis's 3 irreversible steps."
  },
  {
    slug: "ppp",
    title: "Pentose Phosphate Pathway (HMP Shunt)",
    category: "Carbohydrate",
    mindMapUrl: "/mind-map/ppp-mindmap.png",
    description: "Cytosolic pathway that runs parallel to glycolysis to generate NADPH and Ribose-5-Phosphate.",
    clinicalImportance: "Crucial for RBC protection against oxidative stress (via NADPH and glutathione) and nucleotide synthesis.",
    cellularLocation: "Cytosol (highly active in lactating mammary glands, liver, adrenal cortex, RBCs).",
    rateLimitingStep: {
      name: "Glucose-6-Phosphate Dehydrogenase (G6PD)",
      enzyme: "Glucose-6-Phosphate Dehydrogenase (G6PD)",
      description: "First step of the oxidative phase.",
      regulation: "Inhibited strongly by NADPH (feedback inhibition).",
      clinicalImportance: "G6PD Deficiency is the most common human enzyme defect."
    },
    regulationSummary: {
      activators: ["NADP+"],
      inhibitors: ["NADPH"],
      hormonalControl: "Insulin upregulates G6PD gene expression."
    },
    clinicalSignificance: {
      diseases: ["G6PD Deficiency: X-linked recessive. Causes episodic hemolytic anemia triggered by oxidative stress (fava beans, antimalarial drugs, sulfa drugs)."],
      drugTargets: [],
      labFindings: ["Heinz bodies (denatured hemoglobin) and Bite cells on peripheral blood smear."],
      vitaminDeficiencies: ["Thiamine (B1) is required for Transketolase in the non-oxidative phase."]
    },
    pharmacyNotes: {
      whyStudy: "Essential for understanding drug-induced hemolysis (e.g., primaquine, sulfonamides).",
      clinicalUses: "Transketolase activity in RBCs is measured to diagnose Thiamine (B1) deficiency.",
      importantInhibitors: [],
      importantActivators: ["NADP+"],
      commonQuestions: ["What are the two main products of the HMP shunt?", "Which phase is reversible?"],
      highYieldPoints: ["Produces exactly 0 ATP.", "Oxidative phase is irreversible (makes NADPH). Non-oxidative phase is reversible (makes Ribose-5-P)."]
    },
    atpSummary: {
      consumedATP: 0,
      producedATP: 0,
      netATP: 0,
      producedNADH: 0,
      producedFADH2: 0,
      producedNADPH: 2,
      producedGTP: 0,
      releasedCO2: 1,
      usedH2O: 0,
      producedH2O: 0,
      overallYield: "Produces 2 NADPH and 1 CO2 per Glucose-6-Phosphate. Zero ATP."
    },
    memoryAids: {
      mnemonics: ["G6PD = Glucose-6-Phosphate Defends (against oxidative stress)."],
      tricks: ["TransKetoLase requires TK (Thiamine pyrophosphate)."],
      examTips: ["Bite cells happen because splenic macrophages 'bite' out the Heinz bodies.", "Phagocytes use NADPH oxidase to generate respiratory burst (ROS to kill bacteria)."],
      commonMistakes: ["Confusing NADH (catabolic, ETC) with NADPH (anabolic, antioxidants)."]
    },
    pathwayConnections: {
      upstream: ["Glycolysis (G6P branch point)"],
      downstream: ["Nucleotide Synthesis (Ribose-5-P)", "Fatty Acid Synthesis (NADPH requirement)"],
      related: ["Glutathione reduction"]
    },
    reactions: [
      {
        step: 1,
        title: "G6PD (Oxidation)",
        enzyme: "Glucose-6-Phosphate Dehydrogenase",
        ecNumber: "1.1.1.49",
        substrate: "Glucose-6-Phosphate",
        product: "6-Phosphoglucono-δ-lactone",
        type: "irreversible",
        isRateLimiting: true,
        isCommittedStep: true,
        description: "Produces first NADPH. Rate-limiting step.",
        compartment: "Cytosol",
        allostericRegulation: "Inhibited by NADPH.",
        molecules: { consumes: { NADP_plus: 1 }, produces: { NADPH: 1 } }
      },
      {
        step: 2,
        title: "Lactonase",
        enzyme: "6-Phosphogluconolactonase",
        ecNumber: "3.1.1.31",
        substrate: "6-Phosphoglucono-δ-lactone",
        product: "6-Phosphogluconate",
        type: "irreversible",
        description: "Hydrolysis of the lactone ring.",
        compartment: "Cytosol",
        molecules: { consumes: { H2O: 1 } }
      },
      {
        step: 3,
        title: "Oxidative Decarboxylation",
        enzyme: "6-Phosphogluconate Dehydrogenase",
        ecNumber: "1.1.1.44",
        substrate: "6-Phosphogluconate",
        product: "Ribulose-5-Phosphate",
        type: "irreversible",
        description: "Produces second NADPH and CO2.",
        compartment: "Cytosol",
        molecules: { consumes: { NADP_plus: 1 }, produces: { NADPH: 1, CO2: 1 } }
      },
      {
        step: 4,
        title: "Isomerization (Non-Oxidative)",
        enzyme: "Phosphopentose Isomerase",
        ecNumber: "5.3.1.6",
        substrate: "Ribulose-5-Phosphate",
        product: "Ribose-5-Phosphate",
        type: "reversible",
        description: "Forms the aldose sugar required for nucleotide synthesis.",
        compartment: "Cytosol"
      },
      {
        step: 5,
        title: "Transketolase & Transaldolase",
        enzyme: "Transketolase (requires B1) & Transaldolase",
        ecNumber: "Various",
        substrate: "Ribose-5-Phosphate + Xylulose-5-Phosphate",
        product: "Fructose-6-Phosphate + Glyceraldehyde-3-Phosphate",
        type: "reversible",
        description: "Complex carbon shuffling linking the PPP back to glycolysis.",
        compartment: "Cytosol",
        cofactors: ["Thiamine (B1)"]
      }
    ],
    summaryCard: "The Pentose Phosphate Pathway is essential for producing NADPH (for reductive biosynthesis and antioxidant defense) and Ribose-5-Phosphate (for nucleotide synthesis), without consuming or producing ATP."
  },
  {
    slug: "glycogenesis",
    title: "Glycogenesis",
    category: "Carbohydrate",
    mindMapUrl: "/mind-map/glycogenesis-mindmap.png",
    description: "Synthesis of glycogen from glucose for storage.",
    clinicalImportance: "Maintains hepatic glycogen stores for fasting blood glucose regulation and muscle glycogen for exercise.",
    cellularLocation: "Cytosol of Liver and Skeletal Muscle.",
    rateLimitingStep: {
      name: "Glycogen Synthase",
      enzyme: "Glycogen Synthase",
      description: "Creates alpha-1,4 glycosidic bonds to elongate the glycogen chain.",
      regulation: "Activated by Insulin and G6P. Inhibited by Glucagon and Epinephrine.",
      clinicalImportance: "Deficiency (GSD Type 0) causes fasting hypoglycemia."
    },
    regulationSummary: {
      activators: ["Insulin (via dephosphorylation)", "Glucose-6-Phosphate"],
      inhibitors: ["Glucagon", "Epinephrine (via PKA phosphorylation)"],
      hormonalControl: "Insulin activates protein phosphatase 1, which dephosphorylates (activates) Glycogen Synthase."
    },
    clinicalSignificance: {
      diseases: ["Glycogen Storage Disease Type IV (Andersen): Branching enzyme deficiency. Causes cirrhosis and early death."],
      drugTargets: [],
      labFindings: [],
      vitaminDeficiencies: []
    },
    pharmacyNotes: {
      whyStudy: "Explains how the body stores glucose during the fed state.",
      clinicalUses: "",
      importantInhibitors: ["Glucagon", "Epinephrine"],
      importantActivators: ["Insulin"],
      commonQuestions: ["What bond does Glycogen Synthase make?", "What bond does the branching enzyme make?"],
      highYieldPoints: ["Glycogen Synthase creates alpha-1,4 bonds.", "Branching Enzyme creates alpha-1,6 bonds.", "Phosphorylation INACTIVATES Glycogen Synthase."]
    },
    reactions: [
      {
        step: 1,
        title: "Phosphorylation",
        enzyme: "Hexokinase / Glucokinase",
        ecNumber: "2.7.1.1",
        substrate: "Glucose",
        product: "Glucose-6-Phosphate",
        type: "irreversible",
        description: "Traps glucose in cell.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 }, produces: { ADP: 1 } }
      },
      {
        step: 2,
        title: "Mutase",
        enzyme: "Phosphoglucomutase",
        ecNumber: "5.4.2.2",
        substrate: "Glucose-6-Phosphate",
        product: "Glucose-1-Phosphate",
        type: "reversible",
        description: "Prepares glucose for activation.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Activation",
        enzyme: "UDP-Glucose Pyrophosphorylase",
        ecNumber: "2.7.7.9",
        substrate: "Glucose-1-Phosphate",
        product: "UDP-Glucose",
        type: "irreversible",
        description: "Forms the activated high-energy precursor for glycogen synthesis.",
        compartment: "Cytosol",
        molecules: { consumes: { UTP: 1 }, produces: { PPi: 1 } }
      },
      {
        step: 4,
        title: "Elongation",
        enzyme: "Glycogen Synthase",
        ecNumber: "2.4.1.11",
        substrate: "UDP-Glucose",
        product: "Linear Glycogen (α-1,4)",
        type: "irreversible",
        isRateLimiting: true,
        description: "Adds glucose to non-reducing end.",
        compartment: "Cytosol",
        molecules: { produces: { UDP: 1 } }
      },
      {
        step: 5,
        title: "Branching",
        enzyme: "Branching Enzyme",
        ecNumber: "2.4.1.18",
        substrate: "Linear Glycogen (α-1,4)",
        product: "Branched Glycogen (α-1,6)",
        type: "irreversible",
        description: "Transfers ~7 residues to create an α-1,6 branch point.",
        compartment: "Cytosol"
      }
    ],
    summaryCard: "Glycogenesis stores excess glucose as highly branched glycogen. It is driven by Insulin and relies on Glycogen Synthase for elongation and Branching Enzyme for structure."
  },
  {
    slug: "glycogenolysis",
    title: "Glycogenolysis",
    category: "Carbohydrate",
    mindMapUrl: "/mind-map/glycogenolysis-mindmap.png",
    description: "Breakdown of glycogen to release glucose during fasting (liver) or exercise (muscle).",
    clinicalImportance: "Defects lead to massive glycogen accumulation (Glycogen Storage Diseases) and profound fasting hypoglycemia.",
    cellularLocation: "Cytosol of Liver and Skeletal Muscle.",
    rateLimitingStep: {
      name: "Glycogen Phosphorylase",
      enzyme: "Glycogen Phosphorylase",
      description: "Cleaves alpha-1,4 bonds using inorganic phosphate.",
      regulation: "Activated by Glucagon, Epinephrine, AMP, and Calcium. Inhibited by ATP, Insulin.",
      clinicalImportance: "Requires Vitamin B6 (PLP). Deficient in McArdle's (Muscle) and Hers (Liver) disease."
    },
    regulationSummary: {
      activators: ["Glucagon", "Epinephrine", "AMP (Muscle)", "Ca2+ (Muscle)"],
      inhibitors: ["Insulin", "ATP", "Glucose-6-Phosphate"],
      hormonalControl: "Glucagon/Epi activates PKA, which phosphorylates (activates) Phosphorylase Kinase, which phosphorylates (activates) Glycogen Phosphorylase."
    },
    clinicalSignificance: {
      diseases: [
        "Type I (Von Gierke): G6Pase deficiency. Severe hypoglycemia, hepatomegaly.",
        "Type II (Pompe): Lysosomal alpha-1,4-glucosidase defect. Cardiomegaly.",
        "Type III (Cori): Debranching enzyme defect. Milder hypoglycemia.",
        "Type V (McArdle): Muscle Phosphorylase defect. Muscle cramps, myoglobinuria."
      ],
      drugTargets: [],
      labFindings: ["Myoglobinuria and elevated CK after exercise in McArdle's."],
      vitaminDeficiencies: ["Vitamin B6 (PLP) is an essential cofactor for Glycogen Phosphorylase."]
    },
    pharmacyNotes: {
      whyStudy: "Mastery of GSDs (Glycogen Storage Diseases) is extremely high-yield for board exams.",
      clinicalUses: "Glucagon injections are used for emergency severe hypoglycemia.",
      importantInhibitors: ["Insulin"],
      importantActivators: ["Glucagon"],
      commonQuestions: ["Which GSD presents with cardiomegaly? (Pompe)", "Why doesn't McArdle's cause hypoglycemia? (Liver enzyme is normal)."],
      highYieldPoints: ["Muscle glycogen CANNOT maintain blood glucose because muscle lacks Glucose-6-Phosphatase.", "Phosphorylation ACTIVATES Glycogen Phosphorylase."]
    },
    reactions: [
      {
        step: 1,
        title: "Phosphorolysis",
        enzyme: "Glycogen Phosphorylase",
        ecNumber: "2.4.1.1",
        substrate: "Glycogen (α-1,4 bonds)",
        product: "Glucose-1-Phosphate",
        type: "irreversible",
        isRateLimiting: true,
        description: "Cleaves glucose until 4 residues remain before a branch point (Limit Dextrin).",
        compartment: "Cytosol",
        cofactors: ["Vitamin B6 (PLP)"],
        molecules: { consumes: { Pi: 1 } }
      },
      {
        step: 2,
        title: "Transferase (Debranching Pt 1)",
        enzyme: "4-α-Glucanotransferase (Debranching Enzyme)",
        ecNumber: "2.4.1.25",
        substrate: "Limit Dextrin",
        product: "Exposed α-1,6 branch",
        type: "irreversible",
        description: "Moves 3 glucose residues to the main chain.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Glucosidase (Debranching Pt 2)",
        enzyme: "Amylo-α-1,6-Glucosidase (Debranching Enzyme)",
        ecNumber: "3.2.1.33",
        substrate: "Exposed α-1,6 branch",
        product: "Free Glucose",
        type: "irreversible",
        description: "Cleaves the single remaining α-1,6 bond, releasing FREE glucose (not phosphorylated).",
        compartment: "Cytosol",
        molecules: { consumes: { H2O: 1 } }
      },
      {
        step: 4,
        title: "Mutase",
        enzyme: "Phosphoglucomutase",
        ecNumber: "5.4.2.2",
        substrate: "Glucose-1-Phosphate",
        product: "Glucose-6-Phosphate",
        type: "reversible",
        description: "Prepares for entry into glycolysis or release to blood.",
        compartment: "Cytosol"
      },
      {
        step: 5,
        title: "Glucose Release (Liver Only)",
        enzyme: "Glucose-6-Phosphatase",
        ecNumber: "3.1.3.9",
        substrate: "Glucose-6-Phosphate",
        product: "Glucose",
        type: "irreversible",
        description: "Liver ONLY. Removes phosphate so glucose can exit via GLUT2 into the blood.",
        compartment: "ER Lumen",
        molecules: { consumes: { H2O: 1 }, produces: { Pi: 1 } }
      }
    ],
    summaryCard: "Glycogenolysis rapidly mobilizes stored glycogen into glucose. Liver performs this to maintain blood sugar (via Glucagon), while muscle performs this for localized energy during exercise (via Epinephrine and Calcium)."
  },
  {
    slug: "fructose-metabolism",
    title: "Fructose Metabolism",
    category: "Carbohydrate",
    mindMapUrl: "/mind-map/fructose-metabolism-mindmap.png",
    description: "Metabolism of dietary fructose (found in fruits and high-fructose corn syrup).",
    clinicalImportance: "Fructose metabolism bypasses PFK-1 (the major rate-limiting step of glycolysis), allowing rapid, unregulated conversion into fat.",
    cellularLocation: "Liver (primarily), Kidney, and Small Intestine.",
    rateLimitingStep: {
      name: "Fructokinase",
      enzyme: "Fructokinase",
      description: "Phosphorylates fructose to trap it inside the cell.",
      regulation: "Not heavily regulated. Very fast enzyme.",
      clinicalImportance: "Defect causes Essential Fructosuria (benign)."
    },
    clinicalSignificance: {
      diseases: [
        "Essential Fructosuria: Defect in Fructokinase. Benign, asymptomatic. Fructose appears in blood/urine.",
        "Hereditary Fructose Intolerance (HFI): Defect in Aldolase B. Fructose-1-P accumulates, draining intracellular phosphate/ATP. Causes severe hypoglycemia, jaundice, and cirrhosis."
      ],
      drugTargets: [],
      labFindings: ["Reducing sugar in urine that is NOT glucose (tests positive on Clinitest but negative on glucose dipstick)."]
    },
    pharmacyNotes: {
      whyStudy: "HFI is a life-threatening pediatric emergency upon introduction of fruit/juice to a baby's diet.",
      clinicalUses: "Strict avoidance of fructose and sucrose in patients with HFI.",
      commonQuestions: ["Why is HFI so much worse than Essential Fructosuria?", "Why does Fructose metabolize faster than Glucose?"],
      highYieldPoints: ["Fructose enters glycolysis AFTER PFK-1. This is why high fructose diets lead to rapid fat synthesis.", "Aldolase B defect = Bad (HFI). Fructokinase defect = Fine (Essential Fructosuria)."]
    },
    reactions: [
      {
        step: 1,
        title: "Phosphorylation",
        enzyme: "Fructokinase",
        ecNumber: "2.7.1.3",
        substrate: "Fructose",
        product: "Fructose-1-Phosphate",
        type: "irreversible",
        isRateLimiting: true,
        description: "Traps fructose in the liver.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 }, produces: { ADP: 1 } }
      },
      {
        step: 2,
        title: "Cleavage",
        enzyme: "Aldolase B",
        ecNumber: "4.1.2.13",
        substrate: "Fructose-1-Phosphate",
        product: "Glyceraldehyde + DHAP",
        type: "reversible",
        isCommittedStep: true,
        description: "Deficiency causes Hereditary Fructose Intolerance (HFI). Accumulation of F1P depletes ATP.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Triokinase",
        enzyme: "Triokinase",
        ecNumber: "2.7.1.28",
        substrate: "Glyceraldehyde",
        product: "Glyceraldehyde-3-Phosphate",
        type: "irreversible",
        description: "Glyceraldehyde is phosphorylated to enter glycolysis directly.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 }, produces: { ADP: 1 } }
      }
    ],
    summaryCard: "Fructose metabolism is incredibly fast because it bypasses PFK-1. Aldolase B deficiency is a severe disease (Hereditary Fructose Intolerance), while Fructokinase deficiency is benign."
  },
  {
    slug: "galactose-metabolism",
    title: "Galactose Metabolism",
    category: "Carbohydrate",
    mindMapUrl: "/mind-map/galactose-metabolism-mindmap.png",
    description: "Metabolism of dietary galactose, derived primarily from lactose (milk sugar).",
    clinicalImportance: "Defects lead to Galactosemia. Untreated Classic Galactosemia causes cataracts, liver failure, and severe intellectual disability in neonates.",
    cellularLocation: "Liver (primarily).",
    rateLimitingStep: {
      name: "Galactose-1-Phosphate Uridyltransferase (GALT)",
      enzyme: "GALT",
      description: "Exchanges UDP-Glucose with Galactose-1-P.",
      regulation: "Not heavily regulated allosterically.",
      clinicalImportance: "Defect causes Classic Galactosemia."
    },
    clinicalSignificance: {
      diseases: [
        "Galactokinase Deficiency: Mild condition. Causes infantile cataracts due to galactitol accumulation.",
        "Classic Galactosemia: GALT deficiency. Severe. Failure to thrive, jaundice, hepatomegaly, cataracts, mental retardation."
      ],
      labFindings: ["Elevated Galactose-1-P. Reducing sugars in urine.", "Neonates with Classic Galactosemia are at high risk for E. coli sepsis."]
    },
    pharmacyNotes: {
      whyStudy: "Recognizing Classic Galactosemia early saves an infant's life and prevents irreversible brain damage.",
      clinicalUses: "Treatment involves absolute removal of galactose (and lactose) from diet.",
      commonQuestions: ["What causes cataracts in galactose disorders?", "Why is Classic Galactosemia worse than Galactokinase deficiency?"],
      highYieldPoints: ["Aldose Reductase converts accumulated galactose into galactitol, which is osmotically active and causes cataracts.", "GALT deficiency = severe (Classic). Galactokinase deficiency = mild (cataracts only)."]
    },
    reactions: [
      {
        step: 1,
        title: "Phosphorylation",
        enzyme: "Galactokinase",
        ecNumber: "2.7.1.6",
        substrate: "Galactose",
        product: "Galactose-1-Phosphate",
        type: "irreversible",
        description: "Traps galactose in the cell. Deficiency causes mild galactosemia and cataracts.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 }, produces: { ADP: 1 } }
      },
      {
        step: 2,
        title: "Uridyltransferase",
        enzyme: "Galactose-1-Phosphate Uridyltransferase (GALT)",
        ecNumber: "2.7.7.12",
        substrate: "Galactose-1-P + UDP-Glucose",
        product: "Glucose-1-P + UDP-Galactose",
        type: "reversible",
        isRateLimiting: true,
        isCommittedStep: true,
        description: "Deficiency causes Classic Galactosemia (severe).",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Epimerase",
        enzyme: "UDP-Hexose 4-Epimerase",
        ecNumber: "5.1.3.2",
        substrate: "UDP-Galactose",
        product: "UDP-Glucose",
        type: "reversible",
        description: "Recycles UDP-Galactose back into UDP-Glucose to keep the cycle going.",
        compartment: "Cytosol"
      }
    ],
    summaryCard: "Galactose metabolism converts milk sugar into glucose precursors. Classic Galactosemia (GALT deficiency) is a pediatric emergency requiring immediate lactose elimination."
  }
];

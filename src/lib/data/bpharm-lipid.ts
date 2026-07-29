import { Pathway } from '../db';

export const bpharmLipidModule: Pathway[] = [
  {
    slug: "beta-oxidation",
    title: "Beta-Oxidation of Fatty Acids",
    category: "Lipid",
    mindMapUrl: "/mind-map/beta-oxidation-mindmap.png",
    description: "Catabolic process breaking down long-chain fatty acids into Acetyl-CoA to generate massive amounts of ATP during fasting.",
    clinicalImportance: "The primary energy source for liver and muscle during fasting. Defects cause severe non-ketotic hypoglycemia.",
    cellularLocation: "Mitochondrial Matrix. (Note: Very long chain fatty acids are oxidized in peroxisomes).",
    rateLimitingStep: {
      name: "Carnitine Palmitoyltransferase I (CPT-1)",
      enzyme: "CPT-1",
      description: "Transports long-chain fatty acids from the cytosol into the mitochondria.",
      regulation: "Strongly inhibited by Malonyl-CoA (an intermediate of fatty acid synthesis) to prevent a futile cycle.",
      clinicalImportance: "Defects in the carnitine shuttle cause myopathy and episodic hypoketotic hypoglycemia."
    },
    regulationSummary: {
      activators: ["Low energy state (High AMP, low ATP)"],
      inhibitors: ["Malonyl-CoA (inhibits CPT-1)", "High ATP", "High NADH"],
      hormonalControl: "Glucagon activates Hormone-Sensitive Lipase (HSL) in adipose tissue to release free fatty acids into the blood, driving beta-oxidation in liver/muscle."
    },
    clinicalSignificance: {
      diseases: ["MCAD Deficiency: Medium-Chain Acyl-CoA Dehydrogenase deficiency. Most common beta-oxidation defect. Causes profound fasting hypoketotic hypoglycemia and lethargy.", "Zellweger Syndrome: Peroxisomal defect preventing oxidation of Very Long Chain Fatty Acids (VLCFAs)."],
      drugTargets: [],
      labFindings: ["Hypoglycemia WITHOUT ketone bodies (Hypoketotic Hypoglycemia).", "Dicarboxylic aciduria in MCAD."],
      vitaminDeficiencies: ["Carnitine deficiency (primary or secondary to dialysis) impairs transport."]
    },
    pharmacyNotes: {
      whyStudy: "Explains why patients with MCAD deficiency must NEVER fast and need frequent carbohydrate meals.",
      importantInhibitors: ["Malonyl-CoA"],
      importantActivators: ["Glucagon (via FFA release)"],
      commonQuestions: ["Why is it called Hypoketotic Hypoglycemia?", "What is the function of the carnitine shuttle?"],
      highYieldPoints: ["RBCs and Brain cannot use fatty acids for energy.", "Odd-chain fatty acids yield Propionyl-CoA, which CAN enter gluconeogenesis (unlike Acetyl-CoA)."]
    },
    atpSummary: {
      consumedATP: 2,
      producedATP: 0,
      netATP: 106,
      producedNADH: 7,
      producedFADH2: 7,
      producedNADPH: 0,
      producedGTP: 0,
      releasedCO2: 0,
      usedH2O: 7,
      producedH2O: 0,
      overallYield: "Palmitate (16C) yields 8 Acetyl-CoA, 7 NADH, and 7 FADH2, resulting in ~106 net ATP."
    },
    reactions: [
      {
        step: 1,
        title: "Fatty Acid Activation",
        enzyme: "Fatty Acyl-CoA Synthetase",
        ecNumber: "6.2.1.3",
        substrate: "Fatty Acid",
        product: "Fatty Acyl-CoA",
        type: "irreversible",
        description: "Activates fatty acid in the cytosol.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 2 } }
      },
      {
        step: 2,
        title: "Carnitine Shuttle",
        enzyme: "CPT-1, Translocase, CPT-2",
        ecNumber: "2.3.1.21",
        substrate: "Fatty Acyl-CoA + Carnitine",
        product: "Fatty Acyl-CoA (in Matrix)",
        type: "irreversible",
        isRateLimiting: true,
        description: "Transports the acyl group across the inner mitochondrial membrane.",
        compartment: "Inner Mitochondrial Membrane",
        allostericRegulation: "CPT-1 is inhibited by Malonyl-CoA."
      },
      {
        step: 3,
        title: "Oxidation 1 (FAD)",
        enzyme: "Acyl-CoA Dehydrogenase",
        ecNumber: "1.3.8.1",
        substrate: "Fatty Acyl-CoA",
        product: "trans-Δ2-Enoyl-CoA",
        type: "irreversible",
        description: "Creates a double bond. Deficient in MCAD.",
        compartment: "Mitochondrial Matrix",
        molecules: { consumes: { FAD: 1 }, produces: { FADH2: 1 } }
      },
      {
        step: 4,
        title: "Hydration",
        enzyme: "Enoyl-CoA Hydratase",
        ecNumber: "4.2.1.17",
        substrate: "trans-Δ2-Enoyl-CoA",
        product: "L-3-Hydroxyacyl-CoA",
        type: "reversible",
        description: "Adds water across the double bond.",
        compartment: "Mitochondrial Matrix",
        molecules: { consumes: { H2O: 1 } }
      },
      {
        step: 5,
        title: "Oxidation 2 (NAD+)",
        enzyme: "3-Hydroxyacyl-CoA Dehydrogenase",
        ecNumber: "1.1.1.35",
        substrate: "L-3-Hydroxyacyl-CoA",
        product: "3-Ketoacyl-CoA",
        type: "reversible",
        description: "Oxidizes the hydroxyl group to a ketone.",
        compartment: "Mitochondrial Matrix",
        molecules: { consumes: { NAD_plus: 1 }, produces: { NADH: 1 } }
      },
      {
        step: 6,
        title: "Thiolysis",
        enzyme: "β-Ketothiolase",
        ecNumber: "2.3.1.16",
        substrate: "3-Ketoacyl-CoA",
        product: "Acyl-CoA (n-2) + Acetyl-CoA",
        type: "irreversible",
        description: "Cleaves off a 2-carbon Acetyl-CoA unit, leaving a shortened Acyl-CoA to repeat the cycle.",
        compartment: "Mitochondrial Matrix",
        molecules: { consumes: { CoA: 1 }, produces: { Acetyl_CoA: 1 } }
      }
    ],
    summaryCard: "Beta-Oxidation is a 4-step cyclic process (Oxidation, Hydration, Oxidation, Thiolysis) that chops 2 carbons at a time from a fatty acid to yield Acetyl-CoA, NADH, and FADH2 for massive ATP production."
  },
  {
    slug: "fatty-acid-synthesis",
    title: "Fatty Acid Synthesis",
    category: "Lipid",
    mindMapUrl: "/mind-map/fatty-acid-synthesis-mindmap.png",
    description: "Anabolic synthesis of palmitate (16C) from Acetyl-CoA, occurring during the well-fed state.",
    clinicalImportance: "Converts excess dietary carbohydrates and proteins into stored fat.",
    cellularLocation: "Cytosol of Liver, Lactating Mammary Glands, and Adipose Tissue.",
    rateLimitingStep: {
      name: "Acetyl-CoA Carboxylase (ACC)",
      enzyme: "ACC",
      description: "Converts Acetyl-CoA to Malonyl-CoA. Requires Biotin, ATP, and CO2.",
      regulation: "Activated by Insulin and Citrate. Inhibited by Glucagon and Palmitoyl-CoA.",
      clinicalImportance: "A primary target for metabolic regulation of body fat."
    },
    regulationSummary: {
      activators: ["Insulin (dephosphorylates ACC)", "Citrate"],
      inhibitors: ["Glucagon", "Epinephrine (phosphorylates ACC)", "Palmitoyl-CoA"],
      hormonalControl: "Insulin strongly stimulates synthesis. Glucagon halts it."
    },
    pharmacyNotes: {
      whyStudy: "Fundamental to understanding obesity, lipogenesis, and metabolic syndrome.",
      commonQuestions: ["What are the cofactors for ACC? (ABC = ATP, Biotin, CO2)"],
      highYieldPoints: ["Occurs in the CYTOSOL.", "Requires NADPH from the HMP Shunt.", "Citrate shuttle moves Acetyl-CoA from mitochondria to cytosol."]
    },
    reactions: [
      {
        step: 1,
        title: "Citrate Shuttle",
        enzyme: "ATP Citrate Lyase",
        ecNumber: "4.1.3.8",
        substrate: "Citrate (Cytosol)",
        product: "Acetyl-CoA + Oxaloacetate",
        type: "irreversible",
        description: "Acetyl-CoA cannot cross the mitochondrial membrane. It exits as Citrate and is cleaved in the cytosol.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 }, produces: { ADP: 1 } }
      },
      {
        step: 2,
        title: "Carboxylation (Rate Limiting)",
        enzyme: "Acetyl-CoA Carboxylase (ACC)",
        ecNumber: "6.4.1.2",
        substrate: "Acetyl-CoA",
        product: "Malonyl-CoA",
        type: "irreversible",
        isRateLimiting: true,
        description: "Requires ABC (ATP, Biotin, CO2). Rate Limiting Step.",
        compartment: "Cytosol",
        cofactors: ["Biotin", "ATP", "CO2"],
        allostericRegulation: "Activated by Citrate. Inhibited by Palmitoyl-CoA.",
        molecules: { consumes: { ATP: 1, CO2: 1 } }
      },
      {
        step: 3,
        title: "Fatty Acid Synthase Complex",
        enzyme: "Fatty Acid Synthase (FAS)",
        ecNumber: "2.3.1.85",
        substrate: "Acetyl-CoA + Malonyl-CoA",
        product: "Palmitate (16C)",
        type: "irreversible",
        description: "A massive multifunctional enzyme that performs repeated cycles of Condensation, Reduction, Dehydration, Reduction using NADPH.",
        compartment: "Cytosol",
        cofactors: ["Vitamin B5 (Pantothenic Acid / ACP)"],
        molecules: { consumes: { NADPH: 14 }, produces: { CO2: 7, H2O: 6 } }
      }
    ],
    summaryCard: "Fatty Acid Synthesis builds Palmitate in the cytosol using Acetyl-CoA, ATP, and NADPH. It is strongly upregulated by Insulin and Citrate."
  },
  {
    slug: "cholesterol-biosynthesis",
    title: "Cholesterol Biosynthesis",
    category: "Lipid",
    mindMapUrl: "/mind-map/cholesterol-biosynthesis-mindmap.png",
    description: "De novo synthesis of cholesterol, a crucial component of cell membranes and precursor to steroid hormones and bile acids.",
    clinicalImportance: "High blood cholesterol is a major risk factor for atherosclerosis and cardiovascular disease.",
    cellularLocation: "Cytosol and Smooth Endoplasmic Reticulum (mostly Liver).",
    rateLimitingStep: {
      name: "HMG-CoA Reductase",
      enzyme: "HMG-CoA Reductase",
      description: "Converts HMG-CoA to Mevalonate. Uses 2 NADPH.",
      regulation: "Strongly inhibited by Statins (competitive), Glucagon, and intracellular Cholesterol. Activated by Insulin and Thyroxine.",
      clinicalImportance: "The target of Statin drugs (Atorvastatin, Rosuvastatin), the most widely prescribed lipid-lowering agents."
    },
    pharmacyNotes: {
      whyStudy: "Statins are among the most prescribed drugs globally. Understanding this pathway is mandatory.",
      importantInhibitors: ["Statins (competitive inhibition)", "Cholesterol (feedback)"],
      importantActivators: ["Insulin"],
      commonQuestions: ["What is the mechanism of statins?", "Where does synthesis occur? (Cytosol/sER)"],
      highYieldPoints: ["HMG-CoA Reductase is embedded in the ER membrane.", "Statins lower LDL by upregulating hepatic LDL receptors in response to decreased intracellular cholesterol synthesis."]
    },
    reactions: [
      {
        step: 1,
        title: "Condensation",
        enzyme: "Thiolase",
        ecNumber: "2.3.1.9",
        substrate: "2 Acetyl-CoA",
        product: "Acetoacetyl-CoA",
        type: "reversible",
        description: "Combines two Acetyl-CoA molecules.",
        compartment: "Cytosol",
        molecules: { produces: { CoA: 1 } }
      },
      {
        step: 2,
        title: "HMG-CoA Synthesis",
        enzyme: "HMG-CoA Synthase (Cytosolic)",
        ecNumber: "4.1.3.5",
        substrate: "Acetoacetyl-CoA + Acetyl-CoA",
        product: "HMG-CoA",
        type: "irreversible",
        description: "Note: The mitochondrial version of this enzyme makes Ketone bodies. The cytosolic version makes cholesterol.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Mevalonate Synthesis",
        enzyme: "HMG-CoA Reductase",
        ecNumber: "1.1.1.34",
        substrate: "HMG-CoA",
        product: "Mevalonate",
        type: "irreversible",
        isRateLimiting: true,
        description: "The major control point. Target of statins.",
        compartment: "Smooth ER",
        allostericRegulation: "Inhibited by cholesterol and statins.",
        clinicalInhibitors: ["Statins"],
        molecules: { consumes: { NADPH: 2 } }
      },
      {
        step: 4,
        title: "Isoprene Formation",
        enzyme: "Multiple Kinases",
        ecNumber: "Various",
        substrate: "Mevalonate",
        product: "Isopentenyl Pyrophosphate (IPP)",
        type: "irreversible",
        description: "Requires 3 ATP to form activated isoprene units.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 3 } }
      },
      {
        step: 5,
        title: "Squalene Synthesis",
        enzyme: "Squalene Synthase",
        ecNumber: "2.5.1.21",
        substrate: "6 IPP",
        product: "Squalene",
        type: "irreversible",
        description: "Condensation of 6 isoprene units (30 carbons).",
        compartment: "ER Lumen",
        molecules: { consumes: { NADPH: 1 } }
      },
      {
        step: 6,
        title: "Cyclization",
        enzyme: "Squalene Epoxidase / Lanosterol Synthase",
        ecNumber: "1.14.99.7",
        substrate: "Squalene",
        product: "Cholesterol",
        type: "irreversible",
        description: "Multiple complex steps involving cyclization of squalene to lanosterol, then cholesterol.",
        compartment: "ER Lumen"
      }
    ],
    summaryCard: "Cholesterol is synthesized in the liver from Acetyl-CoA. The rate-limiting enzyme, HMG-CoA Reductase, is the target of Statin drugs, which effectively lower cardiovascular risk."
  },
  {
    slug: "ketogenesis",
    title: "Ketogenesis",
    category: "Lipid",
    mindMapUrl: "/mind-map/ketogenesis-mindmap.png",
    description: "Synthesis of ketone bodies (Acetoacetate, Beta-Hydroxybutyrate, Acetone) from excess Acetyl-CoA during prolonged fasting or starvation.",
    clinicalImportance: "Provides a crucial alternative fuel source for the brain during starvation, sparing muscle protein breakdown. Uncontrolled ketogenesis in Type 1 Diabetes causes Diabetic Ketoacidosis (DKA).",
    cellularLocation: "Mitochondrial Matrix of Liver ONLY.",
    rateLimitingStep: {
      name: "HMG-CoA Synthase",
      enzyme: "Mitochondrial HMG-CoA Synthase",
      description: "Combines Acetoacetyl-CoA and Acetyl-CoA to form HMG-CoA.",
      regulation: "Activated by high levels of Acetyl-CoA from beta-oxidation and low Insulin/high Glucagon.",
      clinicalImportance: "The primary driver of DKA."
    },
    pharmacyNotes: {
      whyStudy: "Diabetic Ketoacidosis (DKA) is a life-threatening emergency caused by absolute insulin deficiency.",
      commonQuestions: ["Why can't the liver use ketone bodies? (Lacks thiophorase)"],
      highYieldPoints: ["Brain heavily relies on ketones during prolonged starvation.", "Acetone is exhaled, causing 'fruity breath' in DKA.", "Urine dipsticks detect acetoacetate, NOT beta-hydroxybutyrate."]
    },
    reactions: [
      {
        step: 1,
        title: "Condensation",
        enzyme: "Thiolase",
        ecNumber: "2.3.1.9",
        substrate: "2 Acetyl-CoA",
        product: "Acetoacetyl-CoA",
        type: "reversible",
        description: "Driven by massive excess of Acetyl-CoA from beta-oxidation.",
        compartment: "Mitochondrial Matrix",
        molecules: { produces: { CoA: 1 } }
      },
      {
        step: 2,
        title: "HMG-CoA Synthesis (Rate Limiting)",
        enzyme: "HMG-CoA Synthase",
        ecNumber: "4.1.3.5",
        substrate: "Acetoacetyl-CoA + Acetyl-CoA",
        product: "HMG-CoA",
        type: "irreversible",
        isRateLimiting: true,
        description: "Mitochondrial specific enzyme. Rate Limiting Step.",
        compartment: "Mitochondrial Matrix"
      },
      {
        step: 3,
        title: "Ketone Cleavage",
        enzyme: "HMG-CoA Lyase",
        ecNumber: "4.1.3.4",
        substrate: "HMG-CoA",
        product: "Acetoacetate",
        type: "irreversible",
        description: "Produces the first ketone body and releases Acetyl-CoA.",
        compartment: "Mitochondrial Matrix",
        molecules: { produces: { Acetyl_CoA: 1 } }
      },
      {
        step: 4,
        title: "Reduction (Major Blood Ketone)",
        enzyme: "β-Hydroxybutyrate Dehydrogenase",
        ecNumber: "1.1.1.30",
        substrate: "Acetoacetate",
        product: "β-Hydroxybutyrate",
        type: "reversible",
        description: "Dependent on high NADH/NAD+ ratio. This is the predominant ketone body in the blood.",
        compartment: "Mitochondrial Matrix",
        molecules: { consumes: { NADH: 1 }, produces: { NAD_plus: 1 } }
      },
      {
        step: 5,
        title: "Spontaneous Decarboxylation",
        enzyme: "None (Spontaneous)",
        ecNumber: "None",
        substrate: "Acetoacetate",
        product: "Acetone",
        type: "irreversible",
        description: "Slow spontaneous breakdown causing fruity breath. Acetone is metabolically useless.",
        compartment: "Blood/Lungs",
        molecules: { produces: { CO2: 1 } }
      }
    ],
    summaryCard: "Ketogenesis occurs in liver mitochondria when excess Acetyl-CoA accumulates. Ketone bodies fuel the brain during starvation, but cause severe acidosis (DKA) when unregulated."
  },
  {
    slug: "eicosanoid-synthesis",
    title: "Eicosanoid Synthesis",
    category: "Lipid",
    mindMapUrl: "/mind-map/eicosanoid-synthesis-mindmap.png",
    description: "Synthesis of signaling lipids (prostaglandins, thromboxanes, leukotrienes) from arachidonic acid.",
    clinicalImportance: "Eicosanoids mediate inflammation, pain, fever, and blood clotting. They are the primary targets for NSAIDs, Aspirin, and asthma medications.",
    cellularLocation: "All cells except RBCs.",
    rateLimitingStep: {
      name: "Phospholipase A2",
      enzyme: "Phospholipase A2",
      description: "Cleaves arachidonic acid from membrane phospholipids.",
      regulation: "Inhibited strongly by Glucocorticoids (Cortisol).",
      clinicalImportance: "Explains why steroids are the most potent anti-inflammatory drugs (they block the entire cascade)."
    },
    pharmacyNotes: {
      whyStudy: "Essential for understanding Pharmacology of NSAIDs, Aspirin, and Asthma drugs (Montelukast, Zileuton).",
      importantInhibitors: ["NSAIDs (Inhibit COX-1/COX-2)", "Aspirin (Irreversibly inhibits COX-1/COX-2)", "Steroids (Inhibit PLA2)", "Zileuton (Inhibits 5-LOX)"],
      commonQuestions: ["How does Aspirin prevent heart attacks? (Irreversibly inhibits COX-1 in platelets, blocking TXA2 synthesis)."],
      highYieldPoints: ["COX-1 is constitutive (gastric mucosa protection). COX-2 is inducible (inflammation).", "Leukotrienes (LTC4, LTD4, LTE4) cause intense bronchoconstriction (asthma)."]
    },
    reactions: [
      {
        step: 1,
        title: "Arachidonic Acid Release",
        enzyme: "Phospholipase A2",
        ecNumber: "3.1.1.4",
        substrate: "Membrane Phospholipids",
        product: "Arachidonic Acid",
        type: "irreversible",
        isRateLimiting: true,
        description: "Rate-limiting step of the entire cascade.",
        compartment: "Cell Membrane",
        clinicalInhibitors: ["Corticosteroids"]
      },
      {
        step: 2,
        title: "Cyclooxygenase Pathway",
        enzyme: "COX-1 / COX-2",
        ecNumber: "1.14.99.1",
        substrate: "Arachidonic Acid",
        product: "Prostaglandin H2 (PGH2)",
        type: "irreversible",
        description: "The target of NSAIDs and Aspirin.",
        compartment: "ER",
        clinicalInhibitors: ["Aspirin", "Ibuprofen", "Celecoxib"],
        molecules: { consumes: { O2: 2 } }
      },
      {
        step: 3,
        title: "Thromboxane Synthesis",
        enzyme: "Thromboxane Synthase",
        ecNumber: "5.3.99.5",
        substrate: "PGH2",
        product: "Thromboxane A2 (TXA2)",
        type: "irreversible",
        description: "In platelets: Causes platelet aggregation and vasoconstriction.",
        compartment: "Platelets"
      },
      {
        step: 4,
        title: "Lipoxygenase Pathway",
        enzyme: "5-Lipoxygenase",
        ecNumber: "1.13.11.34",
        substrate: "Arachidonic Acid",
        product: "Leukotriene A4 (LTA4)",
        type: "irreversible",
        description: "Alternative pathway. Target of Asthma drugs.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Zileuton"]
      }
    ],
    summaryCard: "Arachidonic acid is converted into inflammatory mediators via the COX and LOX pathways. Steroids block PLA2, NSAIDs block COX, and Zileuton blocks LOX."
  },
  {
    slug: "sphingolipid-synthesis",
    title: "Sphingolipid Synthesis",
    category: "Lipid",
    mindMapUrl: "/mind-map/sphingolipid-synthesis-mindmap.png",
    description: "Synthesis of sphingolipids, which are essential for cell membranes, especially myelin sheaths in the nervous system.",
    clinicalImportance: "Defects in sphingolipid DEGRADATION cause Lysosomal Storage Diseases (Tay-Sachs, Gaucher, Niemann-Pick).",
    cellularLocation: "Endoplasmic Reticulum and Golgi.",
    rateLimitingStep: {
      name: "Serine Palmitoyltransferase",
      enzyme: "Serine Palmitoyltransferase",
      description: "Condenses Palmitoyl-CoA and Serine.",
      regulation: "Requires Vitamin B6 (PLP).",
      clinicalImportance: "Key committed step."
    },
    pharmacyNotes: {
      whyStudy: "Provides context for the Lysosomal Storage Diseases.",
      highYieldPoints: ["Sphingomyelin is a major component of myelin. Degraded by sphingomyelinase (deficient in Niemann-Pick disease)."]
    },
    reactions: [
      {
        step: 1,
        title: "Condensation",
        enzyme: "Serine Palmitoyltransferase",
        ecNumber: "2.3.1.50",
        substrate: "Palmitoyl-CoA + Serine",
        product: "3-Ketosphinganine",
        type: "irreversible",
        isRateLimiting: true,
        description: "Requires Vitamin B6 (PLP).",
        compartment: "ER",
        cofactors: ["PLP (B6)"],
        molecules: { produces: { CO2: 1, CoA: 1 } }
      },
      {
        step: 2,
        title: "Reduction",
        enzyme: "3-Ketosphinganine Reductase",
        ecNumber: "1.1.1.102",
        substrate: "3-Ketosphinganine",
        product: "Sphinganine",
        type: "irreversible",
        description: "Reduces ketone to an alcohol.",
        compartment: "ER",
        molecules: { consumes: { NADPH: 1 } }
      },
      {
        step: 3,
        title: "Acylation",
        enzyme: "Ceramide Synthase",
        ecNumber: "2.3.1.24",
        substrate: "Sphinganine + Acyl-CoA",
        product: "Dihydroceramide",
        type: "irreversible",
        description: "Adds a fatty acid to the amino group.",
        compartment: "ER"
      },
      {
        step: 4,
        title: "Desaturation",
        enzyme: "Dihydroceramide Desaturase",
        ecNumber: "1.14.19.1",
        substrate: "Dihydroceramide",
        product: "Ceramide",
        type: "irreversible",
        description: "Ceramide is the precursor to all major sphingolipids.",
        compartment: "ER",
        molecules: { consumes: { O2: 1 }, produces: { H2O: 2 } }
      }
    ],
    summaryCard: "Sphingolipid synthesis begins with Palmitoyl-CoA and Serine to form Ceramide, the backbone for sphingomyelin and gangliosides."
  },
  {
    slug: "steroid-hormone-synthesis",
    title: "Steroid Hormone Synthesis",
    category: "Lipid",
    mindMapUrl: "/mind-map/steroid-hormone-synthesis-mindmap.png",
    description: "Synthesis of Mineralocorticoids (Aldosterone), Glucocorticoids (Cortisol), and Androgens (Testosterone) from Cholesterol.",
    clinicalImportance: "Defects in these enzymes cause Congenital Adrenal Hyperplasia (CAH), presenting with ambiguous genitalia, salt wasting, and hypertension.",
    cellularLocation: "Adrenal Cortex (Zona Glomerulosa, Fasciculata, Reticularis) and Gonads.",
    rateLimitingStep: {
      name: "Cholesterol Desmolase (CYP11A1)",
      enzyme: "Cholesterol Desmolase",
      description: "Cleaves the cholesterol side chain to form Pregnenolone.",
      regulation: "Stimulated by ACTH, Angiotensin II, and LH/FSH.",
      clinicalImportance: "First step in all steroid hormone synthesis."
    },
    pharmacyNotes: {
      whyStudy: "CAH is highly tested on exams. Understanding the enzyme blocks is critical for diagnosis.",
      importantInhibitors: ["Ketoconazole (Inhibits Desmolase and 17-alpha-hydroxylase)", "Metyrapone (Inhibits 11-beta-hydroxylase)"],
      commonQuestions: ["Which enzyme deficiency causes virilization AND salt wasting? (21-Hydroxylase)"],
      highYieldPoints: ["21-Hydroxylase Deficiency: Most common. Low Aldosterone (salt wasting), Low Cortisol (hypoglycemia), High Androgens (virilization).", "11-Beta-Hydroxylase Deficiency: Low Cortisol, High Androgens, HIGH 11-Deoxycorticosterone (causes HYPERTENSION)."]
    },
    reactions: [
      {
        step: 1,
        title: "Rate Limiting Step",
        enzyme: "Cholesterol Desmolase (CYP11A1)",
        ecNumber: "1.14.15.6",
        substrate: "Cholesterol",
        product: "Pregnenolone",
        type: "irreversible",
        isRateLimiting: true,
        description: "Stimulated by ACTH.",
        compartment: "Mitochondria",
        clinicalInhibitors: ["Ketoconazole"]
      },
      {
        step: 2,
        title: "Progesterone Synthesis",
        enzyme: "3β-Hydroxysteroid Dehydrogenase",
        ecNumber: "1.1.1.145",
        substrate: "Pregnenolone",
        product: "Progesterone",
        type: "irreversible",
        description: "Precursor for mineralo/gluco-corticoids.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "21-Hydroxylation",
        enzyme: "21-Hydroxylase",
        ecNumber: "1.14.12.1",
        substrate: "Progesterone",
        product: "11-Deoxycorticosterone",
        type: "irreversible",
        description: "Most common enzyme deficiency in CAH (causes salt wasting and virilization).",
        compartment: "ER",
        clinicalInhibitors: ["Deficient in Classic CAH"]
      },
      {
        step: 4,
        title: "11β-Hydroxylation",
        enzyme: "11β-Hydroxylase",
        ecNumber: "1.14.15.4",
        substrate: "11-Deoxycorticosterone",
        product: "Corticosterone / Cortisol",
        type: "irreversible",
        description: "Deficiency causes hypertension due to buildup of 11-Deoxycorticosterone.",
        compartment: "Mitochondria",
        clinicalInhibitors: ["Metyrapone"]
      },
      {
        step: 5,
        title: "Aldosterone Synthesis",
        enzyme: "Aldosterone Synthase",
        ecNumber: "1.14.15.5",
        substrate: "Corticosterone",
        product: "Aldosterone",
        type: "irreversible",
        description: "Occurs ONLY in the Zona Glomerulosa. Stimulated by Angiotensin II.",
        compartment: "Mitochondria"
      }
    ],
    summaryCard: "Steroid hormones are synthesized from cholesterol in the adrenal cortex. 21-Hydroxylase deficiency is the most common cause of Congenital Adrenal Hyperplasia."
  }
];

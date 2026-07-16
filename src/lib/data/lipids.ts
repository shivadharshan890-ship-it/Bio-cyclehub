import { Pathway } from "../db";

export const lipidPathways: any[] = [
  {
    slug: "beta-oxidation",
    name: "Beta-Oxidation of Fatty Acids",
    category: "Lipid",
    overview: {
      definition: "The catabolic process by which fatty acid molecules are broken down to generate Acetyl-CoA.",
      function: "Provides a massive amount of ATP during fasting or high energy demand states.",
      importance: "Primary energy source for the heart and liver. Cannot be used by the brain directly (must be converted to ketones) or RBCs."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Mitochondrial Matrix",
      organ: "Liver, Muscle, Heart (Not in RBCs or Brain)"
    },
    reactions: [
      {
        step: 1,
        title: "Fatty Acyl-CoA Synthetase",
        enzyme: "Fatty Acyl-CoA Synthetase",
        substrate: "Fatty Acid",
        product: "Fatty Acyl-CoA",
        energyChange: "Consumes 2 ATP equivalents",
        type: "irreversible",
        description: "Activation of fatty acid in the cytosol before transport.",
        x: 500, y: 100
      },
      {
        step: 2,
        title: "Carnitine Shuttle (CPT-1)",
        enzyme: "Carnitine Palmitoyltransferase I (CPT-1)",
        substrate: "Fatty Acyl-CoA + Carnitine",
        product: "Acylcarnitine",
        type: "irreversible",
        isRateLimiting: true,
        description: "Transports long-chain fatty acids into the mitochondria. Rate-limiting step.",
        highYield: "Inhibited strongly by Malonyl-CoA (prevents simultaneous synthesis and degradation).",
        x: 500, y: 300
      },
      {
        step: 3,
        title: "Acyl-CoA Dehydrogenase",
        enzyme: "Acyl-CoA Dehydrogenase",
        substrate: "Fatty Acyl-CoA",
        product: "Trans-Enoyl-CoA",
        energyChange: "Produces 1 FADH2",
        fadh2Produced: true,
        type: "reversible",
        description: "First oxidation step, introduces a trans double bond.",
        diseases: ["MCAD Deficiency (hypoglycemia without ketones)"],
        x: 500, y: 500
      },
      {
        step: 4,
        title: "Enoyl-CoA Hydratase",
        enzyme: "Enoyl-CoA Hydratase",
        substrate: "Trans-Enoyl-CoA",
        product: "L-Beta-Hydroxyacyl-CoA",
        type: "reversible",
        waterProduced: false, // consumes water
        description: "Hydration of the double bond.",
        x: 500, y: 700
      },
      {
        step: 5,
        title: "Beta-Hydroxyacyl-CoA Dehydrogenase",
        enzyme: "Beta-Hydroxyacyl-CoA Dehydrogenase",
        substrate: "L-Beta-Hydroxyacyl-CoA",
        product: "Beta-Ketoacyl-CoA",
        energyChange: "Produces 1 NADH",
        nadhProduced: true,
        type: "reversible",
        description: "Second oxidation step.",
        x: 500, y: 900
      },
      {
        step: 6,
        title: "Thiolase",
        enzyme: "Beta-Ketoacyl-CoA Thiolase",
        substrate: "Beta-Ketoacyl-CoA",
        product: "Acetyl-CoA + Acyl-CoA (n-2)",
        type: "irreversible",
        description: "Cleavage releasing Acetyl-CoA and a fatty acyl-CoA shortened by 2 carbons, which re-enters step 3.",
        x: 500, y: 1100
      }
    ]
  },
  {
    slug: "fatty-acid-synthesis",
    name: "Fatty Acid Synthesis",
    category: "Lipid",
    overview: {
      definition: "The creation of fatty acids from acetyl-CoA and NADPH.",
      function: "Stores excess energy (carbohydrates) as fat.",
      importance: "Highly active in the fed state, stimulated by insulin."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Cytosol",
      organ: "Liver, Adipose tissue, Lactating mammary glands"
    },
    reactions: [
      {
        step: 1,
        title: "Citrate Shuttle",
        enzyme: "ATP Citrate Lyase",
        substrate: "Citrate",
        product: "Acetyl-CoA + Oxaloacetate",
        energyChange: "Consumes 1 ATP",
        type: "irreversible",
        description: "Citrate exits mitochondria and is cleaved in cytosol to provide Acetyl-CoA for synthesis.",
        x: 500, y: 100
      },
      {
        step: 2,
        title: "Acetyl-CoA Carboxylase (ACC)",
        enzyme: "Acetyl-CoA Carboxylase (ACC)",
        substrate: "Acetyl-CoA",
        product: "Malonyl-CoA",
        energyChange: "Consumes 1 ATP",
        type: "irreversible",
        isRateLimiting: true,
        description: "Carboxylation of Acetyl-CoA. The rate-limiting step of fatty acid synthesis.",
        cofactors: ["Biotin (B7)", "CO2"],
        highYield: "Activated by Insulin and Citrate. Inhibited by Glucagon and Palmitoyl-CoA.",
        x: 500, y: 350
      },
      {
        step: 3,
        title: "Fatty Acid Synthase (Condensation)",
        enzyme: "Fatty Acid Synthase (Condensing Enzyme)",
        substrate: "Malonyl-CoA + Acetyl-CoA",
        product: "Beta-Ketoacyl-ACP",
        co2Produced: true,
        type: "irreversible",
        description: "Condensation reaction driven by decarboxylation.",
        x: 500, y: 600
      },
      {
        step: 4,
        title: "Fatty Acid Synthase (Reduction 1)",
        enzyme: "Fatty Acid Synthase (Reductase)",
        substrate: "Beta-Ketoacyl-ACP",
        product: "Beta-Hydroxyacyl-ACP",
        energyChange: "Consumes NADPH",
        type: "irreversible",
        description: "Reduction using NADPH (supplied by Pentose Phosphate Pathway).",
        x: 500, y: 800
      },
      {
        step: 5,
        title: "Fatty Acid Synthase (Dehydration)",
        enzyme: "Fatty Acid Synthase (Dehydratase)",
        substrate: "Beta-Hydroxyacyl-ACP",
        product: "Enoyl-ACP",
        waterProduced: true,
        type: "irreversible",
        description: "Removal of water.",
        x: 500, y: 1000
      },
      {
        step: 6,
        title: "Fatty Acid Synthase (Reduction 2)",
        enzyme: "Fatty Acid Synthase (Reductase)",
        substrate: "Enoyl-ACP",
        product: "Acyl-ACP (n+2)",
        energyChange: "Consumes NADPH",
        type: "irreversible",
        description: "Second reduction using NADPH, completing one cycle of 2-carbon elongation.",
        x: 500, y: 1200
      }
    ]
  },
  {
    slug: "cholesterol-biosynthesis",
    name: "Cholesterol Biosynthesis",
    category: "Lipid",
    overview: {
      definition: "The metabolic synthesis of cholesterol from Acetyl-CoA.",
      function: "Provides structural components for cell membranes and precursors for steroid hormones and bile acids.",
      importance: "Crucial pathway targeted by statins to lower serum cholesterol levels."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Cytosol and Smooth Endoplasmic Reticulum",
      organ: "Liver (primarily)"
    },
    reactions: [
      {
        step: 1,
        title: "Thiolase",
        enzyme: "Acetoacetyl-CoA Thiolase",
        substrate: "2 Acetyl-CoA",
        product: "Acetoacetyl-CoA",
        type: "reversible",
        description: "Condensation of two Acetyl-CoA molecules.",
        x: 500, y: 100
      },
      {
        step: 2,
        title: "HMG-CoA Synthase",
        enzyme: "HMG-CoA Synthase (Cytosolic)",
        substrate: "Acetoacetyl-CoA + Acetyl-CoA",
        product: "HMG-CoA",
        type: "irreversible",
        description: "Addition of a third Acetyl-CoA.",
        x: 500, y: 300
      },
      {
        step: 3,
        title: "HMG-CoA Reductase",
        enzyme: "HMG-CoA Reductase",
        substrate: "HMG-CoA",
        product: "Mevalonate",
        energyChange: "Consumes 2 NADPH",
        type: "irreversible",
        isRateLimiting: true,
        description: "The rate-limiting and committed step of cholesterol synthesis.",
        drugs: ["Statins (competitive inhibitors)"],
        highYield: "Inhibited by Glucagon and intracellular cholesterol. Activated by Insulin.",
        x: 500, y: 550
      },
      {
        step: 4,
        title: "Mevalonate Kinase",
        enzyme: "Mevalonate Kinase",
        substrate: "Mevalonate",
        product: "5-Phosphomevalonate",
        energyChange: "Consumes 1 ATP",
        type: "irreversible",
        description: "First phosphorylation step.",
        x: 500, y: 800
      },
      {
        step: 5,
        title: "Squalene Synthase",
        enzyme: "Squalene Synthase",
        substrate: "Farnesyl Pyrophosphate (x2)",
        product: "Squalene",
        energyChange: "Consumes NADPH",
        type: "irreversible",
        description: "Condensation of two 15-carbon units to form a 30-carbon squalene.",
        x: 500, y: 1050
      },
      {
        step: 6,
        title: "Lanosterol Synthase",
        enzyme: "Lanosterol Synthase",
        substrate: "Squalene Epoxide",
        product: "Lanosterol",
        type: "irreversible",
        description: "Cyclization of the linear squalene into the four-ring steroid nucleus.",
        x: 500, y: 1300
      },
      {
        step: 7,
        title: "Cholesterol Synthesis",
        enzyme: "Multiple Enzymes (e.g. 7-Dehydrocholesterol Reductase)",
        substrate: "Lanosterol",
        product: "Cholesterol",
        energyChange: "Consumes NADPH",
        type: "irreversible",
        description: "19-step conversion removing 3 methyl groups.",
        x: 500, y: 1550
      }
    ]
  },
  {
    slug: "ketogenesis",
    name: "Ketogenesis",
    category: "Lipid",
    overview: {
      definition: "The process by which ketone bodies are produced as a result of fatty acid breakdown.",
      function: "Provides a water-soluble alternative energy source for the brain during fasting.",
      importance: "Crucial during starvation or uncontrolled diabetes (can lead to DKA)."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Mitochondrial Matrix",
      organ: "Liver exclusively"
    },
    reactions: [
      {
        step: 1,
        title: "Thiolase",
        enzyme: "Thiolase",
        substrate: "2 Acetyl-CoA",
        product: "Acetoacetyl-CoA",
        type: "reversible",
        description: "Condensation of acetyl-CoA generated from beta-oxidation.",
        x: 500, y: 100
      },
      {
        step: 2,
        title: "HMG-CoA Synthase",
        enzyme: "HMG-CoA Synthase (Mitochondrial)",
        substrate: "Acetoacetyl-CoA + Acetyl-CoA",
        product: "HMG-CoA",
        type: "irreversible",
        isRateLimiting: true,
        description: "Rate-limiting step of ketogenesis. Note: Mitochondrial isoform (cytosolic is for cholesterol).",
        x: 500, y: 350
      },
      {
        step: 3,
        title: "HMG-CoA Lyase",
        enzyme: "HMG-CoA Lyase",
        substrate: "HMG-CoA",
        product: "Acetoacetate + Acetyl-CoA",
        type: "irreversible",
        description: "Cleavage to form the first ketone body, Acetoacetate.",
        x: 500, y: 600
      },
      {
        step: 4,
        title: "Beta-Hydroxybutyrate Dehydrogenase",
        enzyme: "Beta-Hydroxybutyrate Dehydrogenase",
        substrate: "Acetoacetate",
        product: "Beta-Hydroxybutyrate",
        energyChange: "Consumes 1 NADH",
        type: "reversible",
        description: "Reduction to form the primary circulating ketone body.",
        x: 500, y: 850
      },
      {
        step: 5,
        title: "Spontaneous Decarboxylation",
        enzyme: "Non-enzymatic",
        substrate: "Acetoacetate",
        product: "Acetone",
        co2Produced: true,
        type: "irreversible",
        description: "Spontaneous breakdown causing fruity breath in DKA.",
        x: 750, y: 600
      }
    ]
  }
];

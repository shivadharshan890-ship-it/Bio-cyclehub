import { Pathway } from "../db";

export const carbohydratePathways: any[] = [
  {
    slug: "glycolysis",
    name: "Glycolysis",
    mindMapUrl: "/mind-map/glycolysis-mindmap.jpeg",
    category: "Carbohydrate",
    overview: {
      definition: "The metabolic pathway that converts glucose into pyruvate, generating free energy.",
      function: "Provides ATP, NADH, and precursors for other pathways like the TCA cycle.",
      importance: "Universal central pathway of glucose metabolism. Operates anaerobically or aerobically."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Cytosol",
      organ: "All tissues (sole energy source for RBCs)"
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
        highYield: "PFK-1 is inhibited by ATP and Citrate. It is activated by AMP and Fructose-2,6-bisphosphate.",
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
        drugs: ["Arsenate (inhibitor replacing phosphate)"],
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
        x: 500, y: 1900
      }
    ]
  },
  {
    slug: "krebs-cycle",
    name: "Krebs Cycle (Citric Acid Cycle)",
    category: "Carbohydrate",
    overview: {
      definition: "A series of chemical reactions used by all aerobic organisms to generate energy.",
      function: "Oxidizes Acetyl-CoA to CO2, generating NADH, FADH2, and GTP/ATP.",
      importance: "Final common pathway for the oxidation of carbohydrates, lipids, and proteins."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Mitochondrial Matrix (except Succinate Dehydrogenase in inner membrane)",
      organ: "All tissues with mitochondria"
    },
    reactions: [
      {
        step: 1,
        title: "Citrate Synthase",
        enzyme: "Citrate Synthase",
        substrate: "Acetyl-CoA + Oxaloacetate",
        product: "Citrate",
        type: "irreversible",
        isRateLimiting: false,
        description: "Condensation of acetyl-CoA with oxaloacetate to form a 6-carbon molecule.",
        highYield: "Inhibited by ATP, NADH, Succinyl-CoA, and Citrate (product inhibition).",
        x: 500, y: 100
      },
      {
        step: 2,
        title: "Aconitase",
        enzyme: "Aconitase",
        substrate: "Citrate",
        product: "Isocitrate",
        waterProduced: true, // actually dehydration followed by hydration
        type: "reversible",
        description: "Isomerization via cis-Aconitate intermediate.",
        cofactors: ["Iron-Sulfur cluster"],
        drugs: ["Fluoroacetate (rat poison) inhibits aconitase."],
        x: 650, y: 300
      },
      {
        step: 3,
        title: "Isocitrate Dehydrogenase",
        enzyme: "Isocitrate Dehydrogenase",
        substrate: "Isocitrate",
        product: "Alpha-Ketoglutarate",
        energyChange: "Produces 1 NADH",
        nadhProduced: true,
        co2Produced: true,
        type: "irreversible",
        isRateLimiting: true,
        description: "Oxidative decarboxylation. Rate-limiting step of the TCA cycle.",
        cofactors: ["NAD+", "Mg2+", "Mn2+"],
        highYield: "Activated by ADP and Ca2+. Inhibited by ATP and NADH.",
        x: 650, y: 550
      },
      {
        step: 4,
        title: "Alpha-Ketoglutarate Dehydrogenase",
        enzyme: "Alpha-Ketoglutarate Dehydrogenase",
        substrate: "Alpha-Ketoglutarate",
        product: "Succinyl-CoA",
        energyChange: "Produces 1 NADH",
        nadhProduced: true,
        co2Produced: true,
        type: "irreversible",
        description: "Second oxidative decarboxylation.",
        cofactors: ["Thiamine Pyrophosphate (B1)", "Lipoic Acid", "CoA (B5)", "FAD (B2)", "NAD+ (B3)"],
        diseases: ["Wernicke-Korsakoff (Thiamine deficiency impairs this step)"],
        highYield: "Mnemonic for cofactors: Tender Loving Care For No-one.",
        x: 500, y: 800
      },
      {
        step: 5,
        title: "Succinyl-CoA Synthetase",
        enzyme: "Succinyl-CoA Synthetase (Thiokinase)",
        substrate: "Succinyl-CoA",
        product: "Succinate",
        energyChange: "Produces 1 GTP (ATP equivalent)",
        type: "reversible",
        description: "Substrate-level phosphorylation yielding GTP.",
        cofactors: ["GDP", "Pi", "Mg2+"],
        x: 350, y: 550
      },
      {
        step: 6,
        title: "Succinate Dehydrogenase (Complex II)",
        enzyme: "Succinate Dehydrogenase",
        substrate: "Succinate",
        product: "Fumarate",
        energyChange: "Produces 1 FADH2",
        fadh2Produced: true,
        type: "reversible",
        description: "Oxidation of succinate. Unique enzyme as it is embedded in the inner mitochondrial membrane (Complex II).",
        cofactors: ["FAD"],
        drugs: ["Malonate (competitive inhibitor)"],
        x: 350, y: 300
      },
      {
        step: 7,
        title: "Fumarase",
        enzyme: "Fumarase",
        substrate: "Fumarate",
        product: "Malate",
        type: "reversible",
        description: "Hydration of fumarate's double bond.",
        x: 400, y: 150
      },
      {
        step: 8,
        title: "Malate Dehydrogenase",
        enzyme: "Malate Dehydrogenase",
        substrate: "Malate",
        product: "Oxaloacetate",
        energyChange: "Produces 1 NADH",
        nadhProduced: true,
        type: "reversible",
        description: "Final oxidation regenerating oxaloacetate to restart the cycle.",
        cofactors: ["NAD+"],
        x: 500, y: -50
      }
    ]
  },
  {
    slug: "electron-transport-chain",
    name: "Electron Transport Chain",
    category: "Carbohydrate",
    overview: {
      definition: "A series of protein complexes that transfer electrons from electron donors to electron acceptors via redox reactions.",
      function: "Creates an electrochemical proton gradient that drives the synthesis of ATP.",
      importance: "Responsible for the vast majority of ATP production in aerobic cells (Oxidative Phosphorylation)."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Inner Mitochondrial Membrane",
      organ: "All tissues with mitochondria"
    },
    reactions: [
      {
        step: 1,
        title: "Complex I (NADH Dehydrogenase)",
        enzyme: "NADH:ubiquinone oxidoreductase",
        substrate: "NADH",
        product: "Ubiquinone (CoQ) & 4 Protons Pumped",
        type: "irreversible",
        isRateLimiting: false,
        description: "Oxidizes NADH and transfers electrons to CoQ, pumping 4 protons into the intermembrane space.",
        cofactors: ["FMN", "Fe-S clusters"],
        drugs: ["Rotenone (inhibitor)"],
        x: 200, y: 100
      },
      {
        step: 2,
        title: "Complex II (Succinate Dehydrogenase)",
        enzyme: "Succinate Dehydrogenase",
        substrate: "FADH2 (from Succinate)",
        product: "Ubiquinone (CoQ) & 0 Protons Pumped",
        type: "irreversible",
        description: "Oxidizes FADH2 (part of TCA cycle) and transfers electrons to CoQ without pumping protons.",
        cofactors: ["FAD", "Fe-S clusters"],
        x: 400, y: 250
      },
      {
        step: 3,
        title: "Complex III (Cytochrome bc1)",
        enzyme: "Coenzyme Q: Cytochrome c oxidoreductase",
        substrate: "Reduced CoQ (Ubiquinol)",
        product: "Cytochrome C & 4 Protons Pumped",
        type: "irreversible",
        description: "Transfers electrons from CoQ to Cytochrome C, pumping 4 protons (Q cycle).",
        cofactors: ["Heme b", "Heme c1", "Fe-S cluster (Rieske)"],
        drugs: ["Antimycin A (inhibitor)"],
        x: 600, y: 100
      },
      {
        step: 4,
        title: "Complex IV (Cytochrome c Oxidase)",
        enzyme: "Cytochrome c Oxidase",
        substrate: "Cytochrome C & Oxygen",
        product: "Water (H2O) & 2 Protons Pumped",
        waterProduced: true,
        type: "irreversible",
        description: "Final electron acceptor is Oxygen, which is reduced to Water.",
        cofactors: ["Heme a", "Heme a3", "Copper (CuA, CuB)"],
        drugs: ["Cyanide (CN-), Carbon Monoxide (CO), Azide (inhibit Complex IV)"],
        highYield: "Cyanide toxicity is treated with Nitrites (induce methemoglobinemia) and Thiosulfate.",
        x: 800, y: 250
      },
      {
        step: 5,
        title: "Complex V (ATP Synthase)",
        enzyme: "F1F0 ATP Synthase",
        substrate: "Proton Gradient + ADP + Pi",
        product: "ATP",
        energyChange: "Produces Massive ATP",
        type: "irreversible",
        description: "Protons flow back into the matrix through F0, causing F1 rotation and ATP synthesis.",
        drugs: ["Oligomycin (inhibits F0 directly)", "2,4-DNP (uncouples gradient)"],
        highYield: "Uncoupling agents like 2,4-DNP destroy the proton gradient, producing HEAT instead of ATP (hyperthermia).",
        x: 1000, y: 100
      }
    ]
  }
];

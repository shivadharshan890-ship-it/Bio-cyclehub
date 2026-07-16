import { Pathway } from "../db";

export const proteinPathways: any[] = [
  {
    slug: "urea-cycle",
    name: "Urea Cycle",
    category: "Protein",
    overview: {
      definition: "The metabolic cycle that converts highly toxic ammonia to urea for excretion.",
      function: "Detoxifies ammonia generated from amino acid catabolism.",
      importance: "Prevents fatal hyperammonemia and hepatic encephalopathy."
    },
    location: {
      cellType: "Various cells",
      cellularLocation: "Mitochondrial Matrix (Steps 1-2) and Cytosol (Steps 3-5)",
      organ: "Liver exclusively"
    },
    reactions: [
      {
        step: 1,
        title: "Carbamoyl Phosphate Synthetase I",
        enzyme: "Carbamoyl Phosphate Synthetase I (CPS I)",
        substrate: "Ammonia + CO2 + 2 ATP",
        product: "Carbamoyl Phosphate",
        energyChange: "Consumes 2 ATP",
        type: "irreversible",
        isRateLimiting: true,
        description: "Rate-limiting step of the Urea Cycle in the mitochondria.",
        cofactors: ["N-Acetylglutamate (NAG)"],
        diseases: ["CPS I Deficiency (Hyperammonemia without orotic aciduria)"],
        highYield: "Absolutely requires NAG for activation. NAG is synthesized when Arginine levels are high.",
        x: 500, y: 100
      },
      {
        step: 2,
        title: "Ornithine Transcarbamylase",
        enzyme: "Ornithine Transcarbamylase (OTC)",
        substrate: "Carbamoyl Phosphate + Ornithine",
        product: "Citrulline",
        type: "irreversible",
        description: "Condensation forming Citrulline, which is then transported out of the mitochondria.",
        diseases: ["OTC Deficiency (Most common UCD, X-linked, Hyperammonemia WITH orotic aciduria)"],
        x: 500, y: 350
      },
      {
        step: 3,
        title: "Argininosuccinate Synthetase",
        enzyme: "Argininosuccinate Synthetase",
        substrate: "Citrulline + Aspartate",
        product: "Argininosuccinate",
        energyChange: "Consumes 1 ATP (to AMP + PPi = 2 ATP equivalents)",
        type: "irreversible",
        description: "Incorporation of the second nitrogen atom (from Aspartate).",
        diseases: ["Citrullinemia Type I"],
        x: 500, y: 600
      },
      {
        step: 4,
        title: "Argininosuccinate Lyase",
        enzyme: "Argininosuccinate Lyase",
        substrate: "Argininosuccinate",
        product: "Arginine + Fumarate",
        type: "irreversible",
        description: "Cleavage step. Fumarate links the Urea Cycle to the Krebs Cycle.",
        diseases: ["Argininosuccinic Aciduria"],
        x: 500, y: 850
      },
      {
        step: 5,
        title: "Arginase",
        enzyme: "Arginase",
        substrate: "Arginine",
        product: "Urea + Ornithine",
        waterProduced: false, // consumes water
        type: "irreversible",
        description: "Final step releasing Urea for kidney excretion and regenerating Ornithine.",
        cofactors: ["Mn2+"],
        diseases: ["Argininemia (Arginase deficiency, no hyperammonemia usually)"],
        x: 500, y: 1100
      }
    ]
  }
];

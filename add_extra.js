const extraPathways = [
  { slug: "ppp", name: "Pentose Phosphate Pathway", category: "Carbohydrate" },
  { slug: "glycogenolysis", name: "Glycogenolysis", category: "Carbohydrate" },
  { slug: "glycogenesis", name: "Glycogenesis", category: "Carbohydrate" },
  { slug: "fructose-metabolism", name: "Fructose Metabolism", category: "Carbohydrate" },
  { slug: "galactose-metabolism", name: "Galactose Metabolism", category: "Carbohydrate" },
  { slug: "amino-acid-degradation", name: "Amino Acid Degradation", category: "Protein" },
  { slug: "purine-synthesis", name: "Purine Synthesis", category: "Nucleotide" },
  { slug: "pyrimidine-synthesis", name: "Pyrimidine Synthesis", category: "Nucleotide" },
  { slug: "purine-degradation", name: "Purine Degradation", category: "Nucleotide" },
  { slug: "pyrimidine-degradation", name: "Pyrimidine Degradation", category: "Nucleotide" },
  { slug: "heme-synthesis", name: "Heme Synthesis", category: "Molecular" },
  { slug: "heme-degradation", name: "Heme Degradation", category: "Molecular" },
  { slug: "dna-replication", name: "DNA Replication", category: "Molecular" },
  { slug: "transcription", name: "Transcription", category: "Molecular" },
  { slug: "translation", name: "Translation", category: "Molecular" },
  { slug: "eicosanoid-synthesis", name: "Eicosanoid Synthesis", category: "Lipid" },
  { slug: "sphingolipid-synthesis", name: "Sphingolipid Synthesis", category: "Lipid" },
  { slug: "steroid-hormone-synthesis", name: "Steroid Hormone Synthesis", category: "Lipid" }
];

const formattedPathways = extraPathways.map(p => ({
  ...p,
  overview: {
    definition: "The metabolic pathway for " + p.name + ".",
    function: "Essential for cellular metabolism and homeostasis.",
    importance: "Disruptions can lead to various metabolic diseases."
  },
  location: {
    organ: "Various organs",
    cellType: "Various cells",
    cellularLocation: "Cytoplasm"
  },
  reactions: [
    {
      step: 1,
      title: "Step 1",
      enzyme: "Enzyme 1",
      substrate: "Substrate A",
      product: "Intermediate B",
      energyChange: "None",
      type: "reversible",
      isRateLimiting: false,
      description: "Initial step of the pathway.",
      x: 50,
      y: 50
    },
    {
      step: 2,
      title: "Step 2",
      enzyme: "Enzyme 2",
      substrate: "Intermediate B",
      product: "Product C",
      energyChange: "None",
      type: "irreversible",
      isRateLimiting: true,
      description: "Final step of the pathway.",
      x: 50,
      y: 150
    }
  ]
}));

const tsContent = "export const extraPathways: any[] = " + JSON.stringify(formattedPathways, null, 2) + ";\n";
const fs = require('fs');
fs.writeFileSync('src/lib/data/extra.ts', tsContent, 'utf8');

console.log("Successfully fixed extra placeholder pathways to restore the 27 total count.");

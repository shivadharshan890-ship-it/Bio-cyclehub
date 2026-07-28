export interface PathwayEnergy {
  id: string;
  title: string;
  atpConsumed?: number;
  atpProduced?: number;
  netATP?: number;
  gtp?: number;
  nadh?: number;
  fadh2?: number;
  nadph?: number;
  // Extras to support consumption of these molecules
  gtpConsumed?: number;
  nadhConsumed?: number;
  fadh2Consumed?: number;
  nadphConsumed?: number;
  
  location: string;
  rateLimitingEnzyme: string;
  endProduct: string;
}

export const pathwayEnergy: Record<string, PathwayEnergy> = {
  "glycolysis": {
    id: "glycolysis",
    title: "Glycolysis",
    location: "Cytosol",
    rateLimitingEnzyme: "Phosphofructokinase-1 (PFK-1)",
    atpConsumed: 2,
    atpProduced: 4,
    netATP: 2,
    nadh: 2,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "2 Pyruvate"
  },
  "krebs-cycle": {
    id: "krebs-cycle",
    title: "Krebs Cycle",
    location: "Mitochondrial Matrix",
    rateLimitingEnzyme: "Isocitrate Dehydrogenase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 1, // 1 GTP equivalent
    nadh: 3,
    fadh2: 1,
    gtp: 1,
    nadph: 0,
    endProduct: "2 CO₂, 1 CoA, 1 GTP"
  },
  "electron-transport-chain": {
    id: "electron-transport-chain",
    title: "Electron Transport Chain",
    location: "Inner Mitochondrial Membrane",
    rateLimitingEnzyme: "Cytochrome c Oxidase",
    atpConsumed: 0,
    atpProduced: 28,
    netATP: 28,
    nadhConsumed: 10,
    fadh2Consumed: 2,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "H₂O, ATP"
  },
  "ppp": {
    id: "ppp",
    title: "Pentose Phosphate Pathway",
    location: "Cytosol",
    rateLimitingEnzyme: "Glucose-6-Phosphate Dehydrogenase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 2,
    endProduct: "Ribose-5-Phosphate"
  },
  "gluconeogenesis": {
    id: "gluconeogenesis",
    title: "Gluconeogenesis",
    location: "Mitochondria / Cytosol",
    rateLimitingEnzyme: "Fructose-1,6-Bisphosphatase",
    atpConsumed: 4,
    atpProduced: 0,
    netATP: -6, // -4 ATP, -2 GTP
    gtpConsumed: 2,
    nadhConsumed: 2,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Glucose"
  },
  "beta-oxidation": {
    id: "beta-oxidation",
    title: "Beta-Oxidation (Palmitate)",
    location: "Mitochondrial Matrix",
    rateLimitingEnzyme: "Carnitine Palmitoyltransferase I",
    atpConsumed: 2,
    atpProduced: 108,
    netATP: 106,
    nadh: 7,
    fadh2: 7,
    gtp: 0,
    nadph: 0,
    endProduct: "8 Acetyl-CoA"
  },
  "fatty-acid-synthesis": {
    id: "fatty-acid-synthesis",
    title: "Fatty Acid Synthesis",
    location: "Cytosol",
    rateLimitingEnzyme: "Acetyl-CoA Carboxylase (ACC)",
    atpConsumed: 7,
    atpProduced: 0,
    netATP: -7,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadphConsumed: 14,
    nadph: 0,
    endProduct: "Palmitate (16:0)"
  },
  "cholesterol-biosynthesis": {
    id: "cholesterol-biosynthesis",
    title: "Cholesterol Biosynthesis",
    location: "Cytosol / ER",
    rateLimitingEnzyme: "HMG-CoA Reductase",
    atpConsumed: 18,
    atpProduced: 0,
    netATP: -18,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadphConsumed: 16,
    nadph: 0,
    endProduct: "Cholesterol"
  },
  "ketogenesis": {
    id: "ketogenesis",
    title: "Ketogenesis",
    location: "Mitochondrial Matrix (Liver)",
    rateLimitingEnzyme: "HMG-CoA Synthase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 1,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Acetoacetate, Beta-Hydroxybutyrate"
  },
  "urea-cycle": {
    id: "urea-cycle",
    title: "Urea Cycle",
    location: "Mitochondria / Cytosol (Liver)",
    rateLimitingEnzyme: "Carbamoyl Phosphate Synthetase I",
    atpConsumed: 3,
    atpProduced: 0,
    netATP: -4, // 3 ATP used but 4 high-energy bonds broken
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Urea, Fumarate"
  },
  "glycogenolysis": {
    id: "glycogenolysis",
    title: "Glycogenolysis",
    location: "Cytosol",
    rateLimitingEnzyme: "Glycogen Phosphorylase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Glucose-6-Phosphate / Glucose"
  },
  "glycogenesis": {
    id: "glycogenesis",
    title: "Glycogenesis",
    location: "Cytosol",
    rateLimitingEnzyme: "Glycogen Synthase",
    atpConsumed: 2, // 1 ATP + 1 UTP
    atpProduced: 0,
    netATP: -2,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Glycogen"
  },
  "fructose-metabolism": {
    id: "fructose-metabolism",
    title: "Fructose Metabolism",
    location: "Cytosol (Liver)",
    rateLimitingEnzyme: "Aldolase B",
    atpConsumed: 2,
    atpProduced: 0,
    netATP: -2,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "DHAP, Glyceraldehyde-3-Phosphate"
  },
  "galactose-metabolism": {
    id: "galactose-metabolism",
    title: "Galactose Metabolism",
    location: "Cytosol",
    rateLimitingEnzyme: "Galactose-1-Phosphate Uridyltransferase",
    atpConsumed: 1,
    atpProduced: 0,
    netATP: -1,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Glucose-1-Phosphate"
  },
  "amino-acid-degradation": {
    id: "amino-acid-degradation",
    title: "Amino Acid Degradation",
    location: "Various",
    rateLimitingEnzyme: "Various Aminotransferases",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Krebs Intermediates, Pyruvate, Acetyl-CoA"
  },
  "purine-synthesis": {
    id: "purine-synthesis",
    title: "Purine De Novo Synthesis",
    location: "Cytosol",
    rateLimitingEnzyme: "PRPP Amidotransferase",
    atpConsumed: 6,
    atpProduced: 0,
    netATP: -6,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "IMP"
  },
  "pyrimidine-synthesis": {
    id: "pyrimidine-synthesis",
    title: "Pyrimidine De Novo Synthesis",
    location: "Cytosol",
    rateLimitingEnzyme: "Carbamoyl Phosphate Synthetase II",
    atpConsumed: 2,
    atpProduced: 0,
    netATP: -2,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "UMP"
  },
  "purine-degradation": {
    id: "purine-degradation",
    title: "Purine Degradation",
    location: "Cytosol",
    rateLimitingEnzyme: "Xanthine Oxidase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Uric Acid"
  },
  "pyrimidine-degradation": {
    id: "pyrimidine-degradation",
    title: "Pyrimidine Degradation",
    location: "Cytosol / Mitochondria",
    rateLimitingEnzyme: "Various",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Beta-Alanine, Beta-Aminoisobutyrate"
  },
  "heme-synthesis": {
    id: "heme-synthesis",
    title: "Heme Synthesis",
    location: "Mitochondria / Cytosol",
    rateLimitingEnzyme: "ALA Synthase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Heme"
  },
  "heme-degradation": {
    id: "heme-degradation",
    title: "Heme Degradation",
    location: "Macrophages (Spleen/Liver)",
    rateLimitingEnzyme: "Heme Oxygenase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadphConsumed: 2,
    endProduct: "Bilirubin"
  },
  "dna-replication": {
    id: "dna-replication",
    title: "DNA Replication",
    location: "Nucleus",
    rateLimitingEnzyme: "DNA Polymerase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Replicated DNA"
  },
  "transcription": {
    id: "transcription",
    title: "Transcription",
    location: "Nucleus",
    rateLimitingEnzyme: "RNA Polymerase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "mRNA, tRNA, rRNA"
  },
  "translation": {
    id: "translation",
    title: "Translation",
    location: "Cytosol / RER",
    rateLimitingEnzyme: "Ribosome (Peptidyl Transferase)",
    atpConsumed: 4, // 4 high energy bonds per amino acid usually
    atpProduced: 0,
    netATP: -4,
    nadh: 0,
    fadh2: 0,
    gtpConsumed: 2, // 2 GTP per AA
    nadph: 0,
    endProduct: "Polypeptide Chain"
  },
  "eicosanoid-synthesis": {
    id: "eicosanoid-synthesis",
    title: "Eicosanoid Synthesis",
    location: "Cytosol",
    rateLimitingEnzyme: "Phospholipase A2",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadph: 0,
    endProduct: "Prostaglandins, Leukotrienes"
  },
  "sphingolipid-synthesis": {
    id: "sphingolipid-synthesis",
    title: "Sphingolipid Synthesis",
    location: "ER / Golgi",
    rateLimitingEnzyme: "Serine Palmitoyltransferase",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 1,
    gtp: 0,
    nadphConsumed: 1,
    endProduct: "Ceramide, Sphingomyelin"
  },
  "steroid-hormone-synthesis": {
    id: "steroid-hormone-synthesis",
    title: "Steroid Hormone Synthesis",
    location: "Adrenal Cortex / Gonads",
    rateLimitingEnzyme: "Cholesterol Desmolase (CYP11A1)",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadphConsumed: 3,
    endProduct: "Cortisol, Aldosterone, Sex Steroids"
  },
  "drug-metabolism-phase-1-2": {
    id: "drug-metabolism-phase-1-2",
    title: "Drug Metabolism",
    location: "Liver (Smooth ER)",
    rateLimitingEnzyme: "Cytochrome P450",
    atpConsumed: 0,
    atpProduced: 0,
    netATP: 0,
    nadh: 0,
    fadh2: 0,
    gtp: 0,
    nadphConsumed: 1,
    endProduct: "Water-soluble Metabolites"
  }
};

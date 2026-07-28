import { Pathway } from '../db';

export const bpharmProteinModule: Pathway[] = [
  {
    slug: "urea-cycle",
    title: "The Urea Cycle",
    category: "Protein",
    description: "The primary metabolic pathway for the disposal of toxic ammonia (derived from amino acid catabolism) by converting it into urea for renal excretion.",
    clinicalImportance: "Defects in any of the urea cycle enzymes lead to life-threatening hyperammonemia, which causes severe encephalopathy and brain damage in infants.",
    cellularLocation: "First two steps in the Mitochondrial Matrix, remaining three steps in the Cytosol. Occurs almost exclusively in the Liver.",
    rateLimitingStep: {
      name: "Carbamoyl Phosphate Synthetase I (CPS I)",
      enzyme: "CPS I",
      description: "Combines NH4+ and CO2 to form Carbamoyl Phosphate. Occurs in Mitochondria.",
      regulation: "Absolutely requires N-Acetylglutamate (NAG) as an obligate allosteric activator.",
      clinicalImportance: "CPS I deficiency is a severe autosomal recessive cause of hyperammonemia."
    },
    regulationSummary: {
      activators: ["N-Acetylglutamate (NAG)"],
      inhibitors: [],
      hormonalControl: "High-protein diets and prolonged fasting (which increases amino acid breakdown) upregulate urea cycle enzymes."
    },
    clinicalSignificance: {
      diseases: [
        "Ornithine Transcarbamylase (OTC) Deficiency: Most common urea cycle disorder. X-Linked Recessive. Causes severe hyperammonemia and VERY HIGH orotic acid in urine."
      ],
      drugTargets: ["Lactulose: Acidifies the GI tract to trap NH3 as NH4+ for excretion in hepatic encephalopathy.", "Rifaximin: Kills ammonia-producing gut bacteria."],
      labFindings: ["Elevated blood ammonia.", "Decreased BUN (Blood Urea Nitrogen).", "Orotic aciduria (only in OTC deficiency)."]
    },
    pharmacyNotes: {
      whyStudy: "Hyperammonemia is a critical medical emergency. OTC deficiency is a classic high-yield board question.",
      importantInhibitors: [],
      importantActivators: ["NAG"],
      commonQuestions: ["Why does OTC deficiency cause Orotic Aciduria? (Excess Carbamoyl Phosphate leaks into the cytosol and enters the pyrimidine synthesis pathway)."],
      highYieldPoints: ["OTC deficiency is X-Linked Recessive; all other urea cycle defects are Autosomal Recessive.", "Mnemonic for intermediates: Ordinarily Careless Crappers Are Also Frivolous About Urination (Ornithine, Carbamoyl, Citrulline, Aspartate, Argininosuccinate, Fumarate, Arginine, Urea)."]
    },
    atpSummary: {
      consumedATP: 3, // Actually 4 high-energy bonds (2 ATP to ADP, 1 ATP to AMP)
      producedATP: 0,
      netATP: -3,
      producedNADH: 0,
      producedFADH2: 0,
      producedNADPH: 0,
      producedGTP: 0,
      releasedCO2: 0,
      usedH2O: 1,
      producedH2O: 0,
      overallYield: "Consumes 3 ATP (4 high-energy phosphate bonds) per molecule of urea synthesized."
    },
    reactions: [
      {
        step: 1,
        title: "Carbamoyl Phosphate Synthesis",
        enzyme: "Carbamoyl Phosphate Synthetase I (CPS I)",
        ecNumber: "6.3.4.16",
        substrate: "Ammonia + CO2",
        product: "Carbamoyl Phosphate",
        type: "irreversible",
        isRateLimiting: true,
        description: "Mitochondrial step. Requires NAG.",
        compartment: "Mitochondrial Matrix",
        cofactors: ["N-Acetylglutamate (NAG)"],
        molecules: { consumes: { ATP: 2 } }
      },
      {
        step: 2,
        title: "Citrulline Synthesis",
        enzyme: "Ornithine Transcarbamylase (OTC)",
        ecNumber: "2.1.3.3",
        substrate: "Carbamoyl Phosphate + Ornithine",
        product: "Citrulline",
        type: "irreversible",
        description: "Most common enzyme deficiency (X-linked). Citrulline then exits the mitochondria.",
        compartment: "Mitochondrial Matrix"
      },
      {
        step: 3,
        title: "Argininosuccinate Synthesis",
        enzyme: "Argininosuccinate Synthetase",
        ecNumber: "6.3.4.5",
        substrate: "Citrulline + Aspartate",
        product: "Argininosuccinate",
        type: "irreversible",
        description: "Aspartate provides the second nitrogen for urea. Consumes ATP (to AMP).",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 } }
      },
      {
        step: 4,
        title: "Argininosuccinate Cleavage",
        enzyme: "Argininosuccinase",
        ecNumber: "4.3.2.1",
        substrate: "Argininosuccinate",
        product: "Arginine + Fumarate",
        type: "irreversible",
        description: "Fumarate connects the urea cycle to the TCA cycle.",
        compartment: "Cytosol"
      },
      {
        step: 5,
        title: "Urea Formation",
        enzyme: "Arginase",
        ecNumber: "3.5.3.1",
        substrate: "Arginine",
        product: "Urea + Ornithine",
        type: "irreversible",
        description: "Releases Urea for renal excretion. Ornithine re-enters the mitochondria to repeat the cycle.",
        compartment: "Cytosol",
        molecules: { consumes: { H2O: 1 } }
      }
    ],
    summaryCard: "The Urea Cycle converts highly toxic ammonia into non-toxic urea in the liver. It spans the mitochondria and cytosol, and defects cause severe hyperammonemia."
  },
  {
    slug: "amino-acid-degradation",
    title: "Amino Acid Degradation",
    category: "Protein",
    description: "The breakdown of amino acids into their carbon skeletons (to be used for energy) and amino groups (to be excreted as urea).",
    clinicalImportance: "Defects in specific amino acid degradation pathways cause severe metabolic disorders (e.g., PKU, Alkaptonuria, MSUD).",
    cellularLocation: "Liver (primarily). Branched-chain amino acids (BCAAs) are primarily degraded in Muscle.",
    rateLimitingStep: {
      name: "Transamination",
      enzyme: "Aminotransferases (ALT, AST)",
      description: "Transfers the alpha-amino group from an amino acid to alpha-ketoglutarate, forming glutamate.",
      regulation: "Require Vitamin B6 (Pyridoxal Phosphate).",
      clinicalImportance: "ALT and AST are the primary clinical markers for liver damage."
    },
    clinicalSignificance: {
      diseases: [
        "Phenylketonuria (PKU): Defect in Phenylalanine Hydroxylase. Causes intellectual disability and musty body odor.",
        "Maple Syrup Urine Disease (MSUD): Defect in Branched-Chain Ketoacid Dehydrogenase. Causes severe CNS defects."
      ],
      vitaminDeficiencies: ["Vitamin B6 (PLP) for all aminotransferases.", "Vitamin B1 (Thiamine) for BCAA dehydrogenase."]
    },
    pharmacyNotes: {
      whyStudy: "These pathways explain the pathophysiology of several classic newborn screening diseases.",
      highYieldPoints: ["Transaminases ALWAYS require Vitamin B6 (PLP).", "Glutamate Dehydrogenase is the only enzyme that can directly deaminate an amino acid (oxidative deamination)."]
    },
    reactions: [
      {
        step: 1,
        title: "Transamination",
        enzyme: "Aminotransferases (e.g., ALT, AST)",
        ecNumber: "2.6.1.1",
        substrate: "Amino Acid + α-Ketoglutarate",
        product: "α-Keto Acid + Glutamate",
        type: "reversible",
        isRateLimiting: true,
        description: "Funnels amino groups into Glutamate.",
        compartment: "Cytosol",
        cofactors: ["PLP (Vitamin B6)"]
      },
      {
        step: 2,
        title: "Oxidative Deamination",
        enzyme: "Glutamate Dehydrogenase",
        ecNumber: "1.4.1.2",
        substrate: "Glutamate",
        product: "α-Ketoglutarate + NH4+",
        type: "reversible",
        description: "Releases free ammonia to feed the urea cycle.",
        compartment: "Mitochondria",
        molecules: { produces: { NADH: 1 } }
      },
      {
        step: 3,
        title: "Carbon Skeleton Fate",
        enzyme: "Various Enzymes",
        ecNumber: "Various",
        substrate: "α-Keto Acid",
        product: "Glucogenic or Ketogenic Precursors",
        type: "irreversible",
        description: "Carbon skeletons become Pyruvate, Acetyl-CoA, or TCA intermediates.",
        compartment: "Mitochondria/Cytosol"
      }
    ],
    summaryCard: "Amino acid degradation removes the toxic nitrogen via transamination (using B6) and deamination, funneling the carbon skeleton into energy production."
  },
  {
    slug: "purine-synthesis",
    title: "Purine Synthesis (De Novo)",
    category: "Nucleotide",
    description: "Synthesis of the purine nucleotides (AMP, GMP) from scratch, building the purine ring directly onto a ribose sugar.",
    clinicalImportance: "Target of numerous immunosuppressive and chemotherapeutic drugs (e.g., Methotrexate, Mycophenolate, 6-Mercaptopurine).",
    cellularLocation: "Cytosol (highly active in dividing cells).",
    rateLimitingStep: {
      name: "Glutamine-PRPP Amidotransferase",
      enzyme: "Glutamine-PRPP Amidotransferase",
      description: "Commits PRPP to the purine synthesis pathway.",
      regulation: "Strongly inhibited by AMP, GMP, and IMP.",
      clinicalImportance: "Target of 6-Mercaptopurine (Azathioprine)."
    },
    pharmacyNotes: {
      whyStudy: "Pharmacology of Gout, Immunosuppressants, and Chemotherapy heavily relies on this pathway.",
      importantInhibitors: ["6-Mercaptopurine (Inhibits PRPP Amidotransferase)", "Mycophenolate & Ribavirin (Inhibit IMP Dehydrogenase)", "Methotrexate (Inhibits Dihydrofolate Reductase, starving the pathway of THF)"],
      commonQuestions: ["What amino acids are required for purine synthesis? (GAG: Glycine, Aspartate, Glutamine)"],
      highYieldPoints: ["Purines are built ON the ribose sugar. Pyrimidines are built FIRST, then attached to the sugar."]
    },
    reactions: [
      {
        step: 1,
        title: "PRPP Synthesis",
        enzyme: "PRPP Synthetase",
        ecNumber: "2.7.6.1",
        substrate: "Ribose-5-Phosphate",
        product: "PRPP",
        type: "irreversible",
        description: "Activates the sugar. Also used in pyrimidine synthesis.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 } }
      },
      {
        step: 2,
        title: "Committed Step",
        enzyme: "Glutamine-PRPP Amidotransferase",
        ecNumber: "2.4.2.14",
        substrate: "PRPP + Glutamine",
        product: "5-Phosphoribosyl-1-Amine",
        type: "irreversible",
        isRateLimiting: true,
        description: "Inhibited by 6-Mercaptopurine and AMP/GMP.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Ring Formation",
        enzyme: "Multiple Enzymes (e.g., GAR Transformylase)",
        ecNumber: "Various",
        substrate: "5-Phosphoribosyl-1-Amine",
        product: "Inosine Monophosphate (IMP)",
        type: "irreversible",
        description: "Complex 10-step process requiring Glycine, Aspartate, Glutamine, and THF (Folate).",
        compartment: "Cytosol",
        cofactors: ["Tetrahydrofolate (THF)"],
        clinicalInhibitors: ["Methotrexate (indirectly via THF depletion)"]
      },
      {
        step: 4,
        title: "AMP/GMP Branch",
        enzyme: "Adenylosuccinate Synthetase / IMP Dehydrogenase",
        ecNumber: "1.1.1.205",
        substrate: "IMP",
        product: "AMP or GMP",
        type: "irreversible",
        description: "IMP is the common precursor. IMP Dehydrogenase (makes GMP) is inhibited by Mycophenolate Mofetil.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Mycophenolate"]
      }
    ],
    summaryCard: "De novo purine synthesis builds the double-ring structure on top of PRPP. It requires Folate and is a major target for chemotherapy and immunosuppression."
  },
  {
    slug: "pyrimidine-synthesis",
    title: "Pyrimidine Synthesis (De Novo)",
    category: "Nucleotide",
    description: "Synthesis of pyrimidine nucleotides (UMP, CMP, TMP). The ring is built first and then attached to PRPP.",
    clinicalImportance: "Target of anti-cancer (5-FU) and anti-rheumatic (Leflunomide) drugs.",
    cellularLocation: "Cytosol (except Dihydroorotate Dehydrogenase, which is in the inner mitochondrial membrane).",
    rateLimitingStep: {
      name: "Carbamoyl Phosphate Synthetase II (CPS II)",
      enzyme: "CPS II",
      description: "Combines Glutamine, ATP, and CO2. Located in the cytosol.",
      regulation: "Activated by PRPP. Inhibited by UTP.",
      clinicalImportance: "Do not confuse with CPS I (Urea Cycle, Mitochondria, uses Ammonia)."
    },
    pharmacyNotes: {
      whyStudy: "Essential for understanding 5-Fluorouracil, Hydroxyurea, and Leflunomide.",
      importantInhibitors: ["Leflunomide (Inhibits Dihydroorotate Dehydrogenase)", "5-Fluorouracil (Inhibits Thymidylate Synthase)", "Hydroxyurea (Inhibits Ribonucleotide Reductase)"],
      commonQuestions: ["What is the difference between CPS I and CPS II? (CPS I = Mitochondria, Urea Cycle. CPS II = Cytosol, Pyrimidine Synthesis)"],
      highYieldPoints: ["Orotic Aciduria (UMP Synthase defect) causes megaloblastic anemia that does NOT respond to B12 or Folate. Treat with Uridine."]
    },
    reactions: [
      {
        step: 1,
        title: "Carbamoyl Phosphate Synthesis",
        enzyme: "Carbamoyl Phosphate Synthetase II (CPS II)",
        ecNumber: "6.3.5.5",
        substrate: "Glutamine + CO2",
        product: "Carbamoyl Phosphate",
        type: "irreversible",
        isRateLimiting: true,
        description: "Cytosolic. Requires 2 ATP.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 2 } }
      },
      {
        step: 2,
        title: "Ring Assembly",
        enzyme: "Aspartate Transcarbamoylase (ATCase) & Dihydroorotase",
        ecNumber: "2.1.3.2",
        substrate: "Carbamoyl Phosphate + Aspartate",
        product: "Dihydroorotate",
        type: "irreversible",
        description: "Forms the pyrimidine ring structure.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Oxidation",
        enzyme: "Dihydroorotate Dehydrogenase",
        ecNumber: "1.3.5.2",
        substrate: "Dihydroorotate",
        product: "Orotate",
        type: "irreversible",
        description: "The ONLY mitochondrial enzyme in pyrimidine synthesis. Target of Leflunomide.",
        compartment: "Inner Mitochondrial Membrane",
        clinicalInhibitors: ["Leflunomide"]
      },
      {
        step: 4,
        title: "Attachment to Sugar",
        enzyme: "UMP Synthase",
        ecNumber: "2.4.2.10",
        substrate: "Orotate + PRPP",
        product: "UMP",
        type: "irreversible",
        description: "Defect causes Orotic Aciduria (megaloblastic anemia, failure to thrive).",
        compartment: "Cytosol",
        molecules: { produces: { CO2: 1 } }
      },
      {
        step: 5,
        title: "Thymidine Synthesis",
        enzyme: "Thymidylate Synthase",
        ecNumber: "2.1.1.45",
        substrate: "dUMP",
        product: "dTMP",
        type: "irreversible",
        description: "Requires N5,N10-Methylene THF. Target of 5-Fluorouracil (5-FU).",
        compartment: "Cytosol",
        cofactors: ["Tetrahydrofolate (THF)"],
        clinicalInhibitors: ["5-Fluorouracil", "Methotrexate"]
      }
    ],
    summaryCard: "Pyrimidine synthesis builds the ring first using Glutamine and Aspartate, then adds the sugar via UMP Synthase. It is a major target for antineoplastic agents like 5-FU."
  },
  {
    slug: "purine-degradation",
    title: "Purine Degradation (Salvage & Excretion)",
    category: "Nucleotide",
    description: "The breakdown of purine nucleotides into Uric Acid, and the salvage pathway that recycles them to prevent uric acid accumulation.",
    clinicalImportance: "Defects lead to hyperuricemia (Gout) or severe neurological disease (Lesch-Nyhan Syndrome).",
    cellularLocation: "Cytosol.",
    rateLimitingStep: {
      name: "Xanthine Oxidase",
      enzyme: "Xanthine Oxidase",
      description: "Converts Hypoxanthine to Xanthine, and Xanthine to Uric Acid.",
      regulation: "Target of Allopurinol and Febuxostat.",
      clinicalImportance: "Primary enzyme responsible for Gout."
    },
    pharmacyNotes: {
      whyStudy: "Essential for understanding Gout pharmacology and Lesch-Nyhan syndrome.",
      importantInhibitors: ["Allopurinol (competitive inhibitor of Xanthine Oxidase)", "Febuxostat (non-competitive inhibitor of Xanthine Oxidase)", "Probenecid (increases renal excretion of uric acid)"],
      commonQuestions: ["What causes Lesch-Nyhan syndrome? (Absent HGPRT)."],
      highYieldPoints: ["Absent HGPRT = Defective purine salvage = Massive de novo purine synthesis = Massive Uric Acid production (Gout + Self-mutilation)."]
    },
    reactions: [
      {
        step: 1,
        title: "Deamination",
        enzyme: "Adenosine Deaminase (ADA)",
        ecNumber: "3.5.4.4",
        substrate: "Adenosine",
        product: "Inosine",
        type: "irreversible",
        description: "Deficiency causes Severe Combined Immunodeficiency (SCID).",
        compartment: "Cytosol"
      },
      {
        step: 2,
        title: "Phosphorolysis",
        enzyme: "Purine Nucleoside Phosphorylase (PNP)",
        ecNumber: "2.4.2.1",
        substrate: "Inosine / Guanosine",
        product: "Hypoxanthine / Guanine",
        type: "irreversible",
        description: "Removes the ribose sugar.",
        compartment: "Cytosol"
      },
      {
        step: 3,
        title: "Salvage Pathway (Alternative)",
        enzyme: "HGPRT",
        ecNumber: "2.4.2.8",
        substrate: "Hypoxanthine + PRPP",
        product: "IMP",
        type: "irreversible",
        description: "Recycles purines back into nucleotides. Absence causes Lesch-Nyhan syndrome.",
        compartment: "Cytosol"
      },
      {
        step: 4,
        title: "Oxidation to Xanthine",
        enzyme: "Xanthine Oxidase",
        ecNumber: "1.17.3.2",
        substrate: "Hypoxanthine",
        product: "Xanthine",
        type: "irreversible",
        description: "Target of Gout medications.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Allopurinol", "Febuxostat"]
      },
      {
        step: 5,
        title: "Uric Acid Formation",
        enzyme: "Xanthine Oxidase",
        ecNumber: "1.17.3.2",
        substrate: "Xanthine",
        product: "Uric Acid",
        type: "irreversible",
        isRateLimiting: true,
        description: "Uric acid is poorly soluble and precipitates in joints causing Gout.",
        compartment: "Cytosol"
      }
    ],
    summaryCard: "Purines are broken down into Uric Acid by Xanthine Oxidase. The salvage pathway (HGPRT) prevents excessive uric acid buildup, and its absence causes Lesch-Nyhan syndrome."
  }
];

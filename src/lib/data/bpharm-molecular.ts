import { Pathway } from '../db';

export const bpharmMolecularModule: Pathway[] = [
  {
    slug: "dna-replication",
    title: "DNA Replication",
    category: "Molecular",
    description: "Semiconservative process by which a cell duplicates its entire genome before cell division.",
    clinicalImportance: "Target of numerous antibacterial, antiviral, and antineoplastic agents.",
    cellularLocation: "Nucleus (Eukaryotes) or Cytoplasm (Prokaryotes).",
    rateLimitingStep: {
      name: "Initiation Complex Formation",
      enzyme: "Helicase & DNA Polymerase",
      description: "Unwinds the DNA and begins replication.",
      regulation: "Tightly controlled by cell cycle regulators (Cyclins/CDKs).",
      clinicalImportance: "Cancer cells bypass these checkpoints to replicate uncontrollably."
    },
    pharmacyNotes: {
      whyStudy: "Essential for understanding Antibiotics (Fluoroquinolones) and Chemotherapy (Etoposide).",
      importantInhibitors: ["Fluoroquinolones (Inhibit Prokaryotic Topoisomerase II / DNA Gyrase)", "Etoposide (Inhibits Eukaryotic Topoisomerase II)"],
      commonQuestions: ["Which enzyme removes RNA primers in eukaryotes? (RNase H)"],
      highYieldPoints: ["DNA is ALWAYS synthesized in the 5' to 3' direction.", "Topoisomerases relieve supercoiling tension created by Helicase."]
    },
    reactions: [
      {
        step: 1,
        title: "Unwinding",
        enzyme: "Helicase",
        ecNumber: "3.6.4.12",
        substrate: "dsDNA",
        product: "ssDNA",
        type: "irreversible",
        description: "Separates the two strands at the replication fork.",
        compartment: "Nucleus",
        molecules: { consumes: { ATP: 1 } }
      },
      {
        step: 2,
        title: "Tension Relief",
        enzyme: "Topoisomerase (DNA Gyrase in bacteria)",
        ecNumber: "5.99.1.2",
        substrate: "Supercoiled ssDNA",
        product: "Relaxed ssDNA",
        type: "irreversible",
        description: "Creates single or double strand breaks to relieve torsional strain.",
        compartment: "Nucleus",
        clinicalInhibitors: ["Fluoroquinolones (Ciprofloxacin)", "Etoposide"]
      },
      {
        step: 3,
        title: "Priming",
        enzyme: "Primase",
        ecNumber: "2.7.7.6",
        substrate: "ssDNA Template",
        product: "RNA Primer",
        type: "irreversible",
        description: "Provides a free 3'-OH group for DNA Polymerase to attach to.",
        compartment: "Nucleus"
      },
      {
        step: 4,
        title: "Elongation",
        enzyme: "DNA Polymerase (Pol III in bacteria)",
        ecNumber: "2.7.7.7",
        substrate: "Primer + dNTPs",
        product: "Elongated DNA Strand",
        type: "irreversible",
        isRateLimiting: true,
        description: "Synthesizes the leading and lagging (Okazaki fragments) strands 5' to 3'. Has 3' to 5' exonuclease (proofreading) activity.",
        compartment: "Nucleus"
      },
      {
        step: 5,
        title: "Ligation",
        enzyme: "DNA Ligase",
        ecNumber: "6.5.1.1",
        substrate: "Okazaki Fragments",
        product: "Continuous DNA Strand",
        type: "irreversible",
        description: "Seals the nicks in the sugar-phosphate backbone.",
        compartment: "Nucleus",
        molecules: { consumes: { ATP: 1 } }
      }
    ],
    summaryCard: "DNA Replication is carried out by Helicase (unwinds), Topoisomerase (relieves tension), Primase (starts), DNA Polymerase (builds), and Ligase (glues)."
  },
  {
    slug: "transcription",
    title: "Transcription",
    category: "Molecular",
    description: "Synthesis of an RNA transcript from a DNA template.",
    clinicalImportance: "Target of Rifampin (TB drug) and Actinomycin D (chemotherapy).",
    cellularLocation: "Nucleus.",
    rateLimitingStep: {
      name: "RNA Polymerase Binding",
      enzyme: "RNA Polymerase II (Eukaryotes)",
      description: "Binds to the promoter region (e.g., TATA box) to initiate transcription.",
      regulation: "Regulated by Transcription Factors, Enhancers, and Silencers.",
      clinicalImportance: "Mutations in promoter regions drastically alter gene expression."
    },
    pharmacyNotes: {
      whyStudy: "Explains the mechanism of action of Rifampin and alpha-amanitin poisoning.",
      importantInhibitors: ["Rifampin (Inhibits bacterial DNA-dependent RNA polymerase)", "Alpha-Amanitin (Inhibits eukaryotic RNA Polymerase II, found in Death Cap mushrooms)"],
      commonQuestions: ["Which RNA Polymerase makes mRNA? (RNA Pol II)"],
      highYieldPoints: ["Eukaryotes have 3 RNA Polymerases: Pol I (rRNA), Pol II (mRNA), Pol III (tRNA).", "Prokaryotes have only 1 RNA Polymerase that makes all 3 types."]
    },
    reactions: [
      {
        step: 1,
        title: "Initiation",
        enzyme: "RNA Polymerase",
        ecNumber: "2.7.7.6",
        substrate: "Promoter DNA",
        product: "Open Complex",
        type: "irreversible",
        isRateLimiting: true,
        description: "Requires Transcription Factors. RNA Pol II opens the double helix.",
        compartment: "Nucleus"
      },
      {
        step: 2,
        title: "Elongation",
        enzyme: "RNA Polymerase",
        ecNumber: "2.7.7.6",
        substrate: "DNA Template + NTPs",
        product: "pre-mRNA",
        type: "irreversible",
        description: "Reads DNA 3' to 5', synthesizes RNA 5' to 3'.",
        compartment: "Nucleus",
        clinicalInhibitors: ["Rifampin (Prokaryotes)", "Alpha-Amanitin (Eukaryotes)"]
      },
      {
        step: 3,
        title: "5' Capping (Processing)",
        enzyme: "Guanylyltransferase",
        ecNumber: "2.7.7.50",
        substrate: "5' end of pre-mRNA",
        product: "7-Methylguanosine Cap",
        type: "irreversible",
        description: "Eukaryotes only. Protects mRNA from degradation.",
        compartment: "Nucleus"
      },
      {
        step: 4,
        title: "Splicing (Processing)",
        enzyme: "Spliceosome (snRNPs)",
        ecNumber: "Complex",
        substrate: "pre-mRNA",
        product: "Mature mRNA",
        type: "irreversible",
        description: "Removes introns and joins exons. Defective splicing causes diseases like Beta-Thalassemia.",
        compartment: "Nucleus"
      },
      {
        step: 5,
        title: "Poly-A Tail (Processing)",
        enzyme: "Poly-A Polymerase",
        ecNumber: "2.7.7.19",
        substrate: "3' end of mRNA",
        product: "Polyadenylated mRNA",
        type: "irreversible",
        description: "Adds ~200 Adenine residues. Does NOT require a template.",
        compartment: "Nucleus",
        molecules: { consumes: { ATP: 200 } }
      }
    ],
    summaryCard: "Transcription converts DNA into pre-mRNA. In eukaryotes, it must undergo 3 processing steps (Capping, Splicing, Poly-A tail) before leaving the nucleus."
  },
  {
    slug: "translation",
    title: "Translation",
    category: "Molecular",
    description: "Synthesis of proteins from mRNA by ribosomes.",
    clinicalImportance: "The primary target of most classes of antibiotics (Macrolides, Tetracyclines, Aminoglycosides).",
    cellularLocation: "Cytosol (Free ribosomes) and Rough ER.",
    rateLimitingStep: {
      name: "Initiation",
      enzyme: "Ribosome (Initiation Factors)",
      description: "Assembly of the 40S and 60S ribosomal subunits onto the mRNA.",
      regulation: "Regulated by eukaryotic Initiation Factors (eIFs).",
      clinicalImportance: "Diphtheria toxin and Pseudomonas exotoxin A inactivate eEF-2, halting translation."
    },
    pharmacyNotes: {
      whyStudy: "Crucial for understanding how antibiotics kill bacteria without harming human cells.",
      importantInhibitors: [
        "Tetracyclines: Bind 30S, block tRNA binding.",
        "Macrolides / Clindamycin: Bind 50S, block translocation.",
        "Aminoglycosides: Bind 30S, cause misreading of mRNA."
      ],
      highYieldPoints: ["Eukaryotic ribosomes = 40S + 60S (80S). Prokaryotic ribosomes = 30S + 50S (70S).", "Translation costs a massive amount of energy (4 high-energy bonds per amino acid)."]
    },
    reactions: [
      {
        step: 1,
        title: "tRNA Activation",
        enzyme: "Aminoacyl-tRNA Synthetase",
        ecNumber: "6.1.1.-",
        substrate: "Amino Acid + tRNA",
        product: "Charged tRNA",
        type: "irreversible",
        description: "Matches the correct amino acid to the correct tRNA. Highly accurate proofreading.",
        compartment: "Cytosol",
        molecules: { consumes: { ATP: 1 } }
      },
      {
        step: 2,
        title: "Initiation",
        enzyme: "Ribosome (Initiation Complex)",
        ecNumber: "Complex",
        substrate: "mRNA + Methionine-tRNA",
        product: "Assembled Ribosome at Start Codon (AUG)",
        type: "irreversible",
        isRateLimiting: true,
        description: "Requires GTP. Starts at the AUG codon.",
        compartment: "Cytosol",
        molecules: { consumes: { GTP: 1 } }
      },
      {
        step: 3,
        title: "Elongation (A-Site Binding)",
        enzyme: "Elongation Factor (EF-Tu)",
        ecNumber: "Complex",
        substrate: "Charged tRNA",
        product: "tRNA bound to A-site",
        type: "irreversible",
        description: "Incoming tRNA binds. Target of Tetracyclines.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Tetracyclines", "Aminoglycosides"],
        molecules: { consumes: { GTP: 1 } }
      },
      {
        step: 4,
        title: "Peptidyl Transferase",
        enzyme: "Ribozyme (28S rRNA)",
        ecNumber: "2.3.2.12",
        substrate: "Amino Acids in P and A sites",
        product: "Peptide Bond",
        type: "irreversible",
        description: "Forms the peptide bond. Target of Chloramphenicol.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Chloramphenicol"]
      },
      {
        step: 5,
        title: "Translocation",
        enzyme: "Elongation Factor (EF-G / eEF-2)",
        ecNumber: "Complex",
        substrate: "Ribosome",
        product: "Advanced Ribosome",
        type: "irreversible",
        description: "Ribosome moves 3 nucleotides down. Target of Macrolides and Diphtheria toxin.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Macrolides", "Clindamycin"],
        molecules: { consumes: { GTP: 1 } }
      }
    ],
    summaryCard: "Translation synthesizes proteins in the cytosol. Antibiotics exploit the differences between bacterial (70S) and human (80S) ribosomes to stop bacterial protein synthesis."
  },
  {
    slug: "heme-synthesis",
    title: "Heme Synthesis",
    category: "Molecular",
    description: "Synthesis of the porphyrin ring that holds iron, essential for Hemoglobin, Myoglobin, and Cytochrome P450 enzymes.",
    clinicalImportance: "Enzyme defects cause the Porphyrias. Lead poisoning inhibits this pathway.",
    cellularLocation: "Starts and ends in the Mitochondria. Intermediate steps in the Cytosol. (Bone Marrow and Liver).",
    rateLimitingStep: {
      name: "Aminolevulinic Acid Synthase (ALAS)",
      enzyme: "ALAS",
      description: "Combines Glycine and Succinyl-CoA.",
      regulation: "Inhibited by Heme and Glucose. Requires Vitamin B6 (PLP).",
      clinicalImportance: "Defect causes X-linked Sideroblastic Anemia."
    },
    pharmacyNotes: {
      whyStudy: "Lead poisoning and Porphyrias are extremely high-yield test topics.",
      importantInhibitors: ["Lead (Inhibits ALA Dehydratase and Ferrochelatase)", "Glucose (Inhibits ALAS)"],
      commonQuestions: ["Why is glucose given for an acute porphyria attack? (It inhibits ALAS, slowing down the toxic accumulation of intermediates)."],
      highYieldPoints: ["Lead poisoning causes microcytic anemia with basophilic stippling.", "Acute Intermittent Porphyria (AIP) = Abdominal pain, Port-wine urine, Psych symptoms. NEVER give barbiturates."]
    },
    reactions: [
      {
        step: 1,
        title: "ALA Synthesis",
        enzyme: "ALA Synthase (ALAS)",
        ecNumber: "2.3.1.37",
        substrate: "Succinyl-CoA + Glycine",
        product: "Aminolevulinic Acid (ALA)",
        type: "irreversible",
        isRateLimiting: true,
        description: "Occurs in Mitochondria. Requires PLP (B6).",
        compartment: "Mitochondria",
        cofactors: ["PLP (Vitamin B6)"],
        allostericRegulation: "Inhibited by Heme."
      },
      {
        step: 2,
        title: "Porphobilinogen Synthesis",
        enzyme: "ALA Dehydratase",
        ecNumber: "4.2.1.24",
        substrate: "2 ALA",
        product: "Porphobilinogen (PBG)",
        type: "irreversible",
        description: "Occurs in Cytosol. Extremely sensitive to Lead inhibition.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Lead (Pb)"]
      },
      {
        step: 3,
        title: "Ring Assembly",
        enzyme: "Porphobilinogen Deaminase",
        ecNumber: "4.3.1.8",
        substrate: "4 Porphobilinogen",
        product: "Hydroxymethylbilane",
        type: "irreversible",
        description: "Defect causes Acute Intermittent Porphyria (AIP).",
        compartment: "Cytosol",
        clinicalInhibitors: ["Deficient in AIP"]
      },
      {
        step: 4,
        title: "Decarboxylation",
        enzyme: "Uroporphyrinogen Decarboxylase (UROD)",
        ecNumber: "4.1.1.37",
        substrate: "Uroporphyrinogen III",
        product: "Coproporphyrinogen III",
        type: "irreversible",
        description: "Defect causes Porphyria Cutanea Tarda (PCT) - blistering photosensitivity.",
        compartment: "Cytosol",
        clinicalInhibitors: ["Deficient in PCT"]
      },
      {
        step: 5,
        title: "Iron Insertion",
        enzyme: "Ferrochelatase",
        ecNumber: "4.99.1.1",
        substrate: "Protoporphyrin IX + Fe2+",
        product: "Heme",
        type: "irreversible",
        description: "Occurs in Mitochondria. Inhibited by Lead.",
        compartment: "Mitochondria",
        clinicalInhibitors: ["Lead (Pb)"]
      }
    ],
    summaryCard: "Heme synthesis requires Glycine and Succinyl-CoA. It is heavily inhibited by Lead. Enzyme defects cause the Porphyrias (AIP = abdominal pain; PCT = blistering skin)."
  },
  {
    slug: "heme-degradation",
    title: "Heme Degradation",
    category: "Molecular",
    description: "The breakdown of senescent RBCs, converting toxic heme into bilirubin for excretion.",
    clinicalImportance: "Understanding this pathway is mandatory to diagnose the different types of Jaundice (Pre-hepatic, Hepatic, Post-hepatic).",
    cellularLocation: "Macrophages (Spleen) -> Blood -> Liver -> Intestines.",
    rateLimitingStep: {
      name: "Heme Oxygenase",
      enzyme: "Heme Oxygenase",
      description: "Cleaves the porphyrin ring to release Biliverdin, Iron, and Carbon Monoxide.",
      regulation: "Inducible by oxidative stress.",
      clinicalImportance: "The only biochemical reaction in the human body that produces Carbon Monoxide (CO)."
    },
    pharmacyNotes: {
      whyStudy: "Jaundice is one of the most common physical exam findings in clinical medicine.",
      highYieldPoints: ["Unconjugated Bilirubin is fat soluble, neurotoxic (kernicterus), and cannot be excreted in urine.", "Conjugated Bilirubin is water soluble and can be excreted in urine (making urine dark in biliary obstruction)."]
    },
    reactions: [
      {
        step: 1,
        title: "Ring Cleavage",
        enzyme: "Heme Oxygenase",
        ecNumber: "1.14.137.3",
        substrate: "Heme",
        product: "Biliverdin + CO + Fe2+",
        type: "irreversible",
        isRateLimiting: true,
        description: "Occurs in splenic macrophages. Produces Carbon Monoxide.",
        compartment: "Macrophages",
        molecules: { consumes: { NADPH: 1, O2: 3 } }
      },
      {
        step: 2,
        title: "Reduction to Bilirubin",
        enzyme: "Biliverdin Reductase",
        ecNumber: "1.3.1.24",
        substrate: "Biliverdin",
        product: "Unconjugated (Indirect) Bilirubin",
        type: "irreversible",
        description: "Biliverdin is green (bruise color). Bilirubin is yellow.",
        compartment: "Macrophages",
        molecules: { consumes: { NADPH: 1 } }
      },
      {
        step: 3,
        title: "Transport",
        enzyme: "Albumin Binding",
        ecNumber: "None",
        substrate: "Unconjugated Bilirubin (Blood)",
        product: "Unconjugated Bilirubin (Liver)",
        type: "reversible",
        description: "Bilirubin is strictly transported bound to Albumin.",
        compartment: "Bloodstream"
      },
      {
        step: 4,
        title: "Conjugation",
        enzyme: "UDP-Glucuronosyltransferase (UGT)",
        ecNumber: "2.4.1.17",
        substrate: "Unconjugated Bilirubin",
        product: "Conjugated (Direct) Bilirubin",
        type: "irreversible",
        description: "Makes bilirubin water-soluble. Deficient in Gilbert Syndrome and Crigler-Najjar.",
        compartment: "Liver ER",
        clinicalInhibitors: ["Deficient in Gilbert Syndrome"]
      },
      {
        step: 5,
        title: "Excretion",
        enzyme: "Gut Flora",
        ecNumber: "Microbial",
        substrate: "Conjugated Bilirubin",
        product: "Urobilinogen",
        type: "irreversible",
        description: "Excreted in feces (stercobilin gives brown color) and urine (urobilin gives yellow color).",
        compartment: "Intestines"
      }
    ],
    summaryCard: "Heme from dead RBCs is converted to fat-soluble Unconjugated Bilirubin, transported to the liver, Conjugated to become water-soluble, and excreted in the bile."
  }
];

export const extraPathways: any[] = [
  {
    "slug": "ppp",
    "name": "Pentose Phosphate Pathway",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Glucose-6-Phosphate Dehydrogenase",
        "enzyme": "G6PD",
        "substrate": "Glucose-6-Phosphate",
        "product": "6-Phosphoglucono-δ-lactone",
        "energyChange": "+ NADPH",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Generates NADPH.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Lactonase",
        "enzyme": "6-Phosphogluconolactonase",
        "substrate": "6-Phosphoglucono-δ-lactone",
        "product": "6-Phosphogluconate",
        "energyChange": "+ H2O",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Hydrolysis.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "6-Phosphogluconate Dehydrogenase",
        "enzyme": "6-Phosphogluconate Dehydrogenase",
        "substrate": "6-Phosphogluconate",
        "product": "Ribulose-5-Phosphate",
        "energyChange": "+ NADPH, + CO2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Oxidative decarboxylation.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Isomerase",
        "enzyme": "Phosphopentose Isomerase",
        "substrate": "Ribulose-5-Phosphate",
        "product": "Ribose-5-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Precursor for nucleotides.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Epimerase",
        "enzyme": "Phosphopentose Epimerase",
        "substrate": "Ribulose-5-Phosphate",
        "product": "Xylulose-5-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Non-oxidative phase.",
        "x": 250,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Pentose Phosphate Pathway.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "glycogenolysis",
    "name": "Glycogenolysis",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Phosphorylase",
        "enzyme": "Glycogen Phosphorylase",
        "substrate": "Glycogen",
        "product": "Glucose-1-Phosphate",
        "energyChange": "- Pi",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Cleaves α-1,4 bonds.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Debranching Enzyme 1",
        "enzyme": "4-α-Glucanotransferase",
        "substrate": "Limit Dextrin",
        "product": "Elongated Glycogen Core",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Transfers 3 glucose residues.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Debranching Enzyme 2",
        "enzyme": "Amylo-α-1,6-Glucosidase",
        "substrate": "Branched Residue",
        "product": "Free Glucose",
        "energyChange": "+ H2O",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Cleaves α-1,6 bond.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Phosphoglucomutase",
        "enzyme": "Phosphoglucomutase",
        "substrate": "Glucose-1-Phosphate",
        "product": "Glucose-6-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Interconversion.",
        "x": 50,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Glycogenolysis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "glycogenesis",
    "name": "Glycogenesis",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Hexokinase",
        "enzyme": "Hexokinase/Glucokinase",
        "substrate": "Glucose",
        "product": "Glucose-6-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Phosphorylation.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Phosphoglucomutase",
        "enzyme": "Phosphoglucomutase",
        "substrate": "Glucose-6-Phosphate",
        "product": "Glucose-1-Phosphate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Isomerization.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "UDP-Glucose Pyrophosphorylase",
        "enzyme": "UDP-Glucose Pyrophosphorylase",
        "substrate": "Glucose-1-Phosphate",
        "product": "UDP-Glucose",
        "energyChange": "- UTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Activation.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Glycogen Synthase",
        "enzyme": "Glycogen Synthase",
        "substrate": "UDP-Glucose",
        "product": "Glycogen (α-1,4)",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Elongation.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Branching Enzyme",
        "enzyme": "Amylo-(1,4 to 1,6)-transglycosylase",
        "substrate": "Linear Glycogen",
        "product": "Branched Glycogen",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Creates branches.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Glycogenesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "fructose-metabolism",
    "name": "Fructose Metabolism",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Fructokinase",
        "enzyme": "Fructokinase",
        "substrate": "Fructose",
        "product": "Fructose-1-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Traps fructose in cells.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Aldolase B",
        "enzyme": "Aldolase B",
        "substrate": "Fructose-1-Phosphate",
        "product": "DHAP + Glyceraldehyde",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Cleavage.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Triokinase",
        "enzyme": "Triokinase",
        "substrate": "Glyceraldehyde",
        "product": "Glyceraldehyde-3-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Enters glycolysis.",
        "x": 50,
        "y": 250
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Fructose Metabolism.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "galactose-metabolism",
    "name": "Galactose Metabolism",
    "category": "Carbohydrate",
    "reactions": [
      {
        "step": 1,
        "title": "Galactokinase",
        "enzyme": "Galactokinase",
        "substrate": "Galactose",
        "product": "Galactose-1-Phosphate",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Phosphorylation.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "GALT",
        "enzyme": "Galactose-1-Phosphate Uridyltransferase",
        "substrate": "Galactose-1-P + UDP-Glucose",
        "product": "Glucose-1-P + UDP-Galactose",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": true,
        "description": "Exchange.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Epimerase",
        "enzyme": "UDP-Hexose 4-Epimerase",
        "substrate": "UDP-Galactose",
        "product": "UDP-Glucose",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Recycling.",
        "x": 50,
        "y": 250
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Galactose Metabolism.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "amino-acid-degradation",
    "name": "Amino Acid Degradation",
    "category": "Protein",
    "reactions": [
      {
        "step": 1,
        "title": "Transamination",
        "enzyme": "Aminotransferase (PLP)",
        "substrate": "Amino Acid + α-Ketoglutarate",
        "product": "α-Keto Acid + Glutamate",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Transfer of amino group.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Oxidative Deamination",
        "enzyme": "Glutamate Dehydrogenase",
        "substrate": "Glutamate",
        "product": "α-Ketoglutarate + NH3",
        "energyChange": "+ NADH",
        "type": "reversible",
        "isRateLimiting": true,
        "description": "Releases free ammonia.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Carbon Skeleton Metabolism",
        "enzyme": "Various",
        "substrate": "α-Keto Acid",
        "product": "TCA Intermediates",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Glucogenic or ketogenic fate.",
        "x": 50,
        "y": 250
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Amino Acid Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "purine-synthesis",
    "name": "Purine Synthesis",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "PRPP Synthesis",
        "enzyme": "PRPP Synthetase",
        "substrate": "Ribose-5-Phosphate",
        "product": "PRPP",
        "energyChange": "Consumes 1 ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Activation.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Committed Step",
        "enzyme": "PRPP Amidotransferase",
        "substrate": "PRPP + Glutamine",
        "product": "5-Phosphoribosyl-1-Amine",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Inhibited by AMP/GMP.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Ring Formation",
        "enzyme": "Various (GAR, FGAR)",
        "substrate": "5-PRA",
        "product": "IMP",
        "energyChange": "Consumes multiple ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Requires THF and Glycine.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "AMP/GMP Synthesis",
        "enzyme": "Adenylosuccinate Synthetase / IMP Dehydrogenase",
        "substrate": "IMP",
        "product": "AMP / GMP",
        "energyChange": "Consumes GTP / ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Branch point.",
        "x": 50,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Purine Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "pyrimidine-synthesis",
    "name": "Pyrimidine Synthesis",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "CPS II",
        "enzyme": "Carbamoyl Phosphate Synthetase II",
        "substrate": "Glutamine + CO2",
        "product": "Carbamoyl Phosphate",
        "energyChange": "Consumes 2 ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Cytosolic.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "ATCase",
        "enzyme": "Aspartate Transcarbamoylase",
        "substrate": "Carbamoyl Phosphate + Aspartate",
        "product": "Carbamoylaspartate",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Key regulation in bacteria.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Ring Closure",
        "enzyme": "Dihydroorotase",
        "substrate": "Carbamoylaspartate",
        "product": "Dihydroorotate",
        "energyChange": "- H2O",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Forms ring.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Oxidation",
        "enzyme": "Dihydroorotate Dehydrogenase",
        "substrate": "Dihydroorotate",
        "product": "Orotate",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Mitochondrial enzyme.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "UMP Synthase",
        "enzyme": "UMP Synthase (OPRT + ODC)",
        "substrate": "Orotate + PRPP",
        "product": "UMP",
        "energyChange": "- CO2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Bifunctional enzyme.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Pyrimidine Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "purine-degradation",
    "name": "Purine Degradation",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "Nucleotidase",
        "enzyme": "5'-Nucleotidase",
        "substrate": "AMP / GMP",
        "product": "Adenosine / Guanosine",
        "energyChange": "- Pi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Removes phosphate.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Deamination",
        "enzyme": "Adenosine Deaminase (ADA)",
        "substrate": "Adenosine",
        "product": "Inosine",
        "energyChange": "- NH3",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Deficiency causes SCID.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Phosphorolysis",
        "enzyme": "Purine Nucleoside Phosphorylase",
        "substrate": "Inosine / Guanosine",
        "product": "Hypoxanthine / Guanine",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Releases Ribose-1-P.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Xanthine Formation",
        "enzyme": "Xanthine Oxidase / Guanase",
        "substrate": "Hypoxanthine / Guanine",
        "product": "Xanthine",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Generates H2O2.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Uric Acid Formation",
        "enzyme": "Xanthine Oxidase",
        "substrate": "Xanthine",
        "product": "Uric Acid",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Target of Allopurinol.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Purine Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "pyrimidine-degradation",
    "name": "Pyrimidine Degradation",
    "category": "Nucleotide",
    "reactions": [
      {
        "step": 1,
        "title": "Nucleotidase",
        "enzyme": "5'-Nucleotidase",
        "substrate": "CMP / UMP",
        "product": "Cytidine / Uridine",
        "energyChange": "- Pi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Removes phosphate.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Deamination",
        "enzyme": "Cytidine Deaminase",
        "substrate": "Cytidine",
        "product": "Uridine",
        "energyChange": "- NH3",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms Uridine.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Cleavage",
        "enzyme": "Pyrimidine Nucleoside Phosphorylase",
        "substrate": "Uridine",
        "product": "Uracil",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Releases Ribose.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Reduction",
        "enzyme": "Dihydropyrimidine Dehydrogenase",
        "substrate": "Uracil",
        "product": "Dihydrouracil",
        "energyChange": "- NADPH",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Rate-limiting step.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Degradation",
        "enzyme": "Various",
        "substrate": "Dihydrouracil",
        "product": "Beta-Alanine + CO2 + NH3",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Highly water soluble products.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Pyrimidine Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "heme-synthesis",
    "name": "Heme Synthesis",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "ALAS",
        "enzyme": "ALA Synthase",
        "substrate": "Succinyl-CoA + Glycine",
        "product": "Aminolevulinic Acid (ALA)",
        "energyChange": "Requires PLP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Mitochondrial. Inhibited by Heme.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "ALAD",
        "enzyme": "ALA Dehydratase",
        "substrate": "2 ALA",
        "product": "Porphobilinogen (PBG)",
        "energyChange": "- 2 H2O",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Cytosolic. Inhibited by Lead.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "PBG Deaminase",
        "enzyme": "Hydroxymethylbilane Synthase",
        "substrate": "4 PBG",
        "product": "Hydroxymethylbilane",
        "energyChange": "- 4 NH3",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Deficiency causes AIP.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Ring Closure",
        "enzyme": "Uroporphyrinogen III Synthase",
        "substrate": "Hydroxymethylbilane",
        "product": "Uroporphyrinogen III",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms asymmetric ring.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Ferrochelatase",
        "enzyme": "Ferrochelatase",
        "substrate": "Protoporphyrin IX + Fe2+",
        "product": "Heme",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Mitochondrial. Inhibited by Lead.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Heme Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "heme-degradation",
    "name": "Heme Degradation",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Heme Oxygenase",
        "enzyme": "Heme Oxygenase",
        "substrate": "Heme",
        "product": "Biliverdin",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Releases CO and Fe2+.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Biliverdin Reductase",
        "enzyme": "Biliverdin Reductase",
        "substrate": "Biliverdin",
        "product": "Unconjugated Bilirubin",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms insoluble bilirubin.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Transport",
        "enzyme": "Albumin",
        "substrate": "Unconjugated Bilirubin (Blood)",
        "product": "Unconjugated Bilirubin (Liver)",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Transported to liver.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Conjugation",
        "enzyme": "UDP-Glucuronosyltransferase (UGT)",
        "substrate": "Unconjugated Bilirubin",
        "product": "Conjugated Bilirubin",
        "energyChange": "Consumes UDP-Glucuronic Acid",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Makes bilirubin water soluble.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Excretion",
        "enzyme": "Gut Flora",
        "substrate": "Conjugated Bilirubin",
        "product": "Urobilinogen",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Excreted in feces/urine.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Heme Degradation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "dna-replication",
    "name": "DNA Replication",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Unwinding",
        "enzyme": "Helicase",
        "substrate": "dsDNA",
        "product": "ssDNA",
        "energyChange": "Consumes ATP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Separates strands.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Tension Relief",
        "enzyme": "Topoisomerase",
        "substrate": "Supercoiled DNA",
        "product": "Relaxed DNA",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": false,
        "description": "Target of quinolones.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Priming",
        "enzyme": "Primase",
        "substrate": "ssDNA",
        "product": "RNA Primer",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Provides 3'-OH.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Elongation",
        "enzyme": "DNA Polymerase III",
        "substrate": "Primer + dNTPs",
        "product": "New DNA Strand",
        "energyChange": "- PPi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "High processivity.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Ligation",
        "enzyme": "DNA Ligase",
        "substrate": "Okazaki Fragments",
        "product": "Continuous DNA",
        "energyChange": "Consumes ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Seals nicks.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for DNA Replication.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "transcription",
    "name": "Transcription",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Initiation",
        "enzyme": "RNA Polymerase",
        "substrate": "Promoter DNA",
        "product": "Open Complex",
        "energyChange": "None",
        "type": "reversible",
        "isRateLimiting": true,
        "description": "Binding of factors.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Elongation",
        "enzyme": "RNA Polymerase",
        "substrate": "DNA Template + NTPs",
        "product": "pre-mRNA",
        "energyChange": "- PPi",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Synthesis 5' to 3'.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Termination",
        "enzyme": "Termination Factors",
        "substrate": "pre-mRNA",
        "product": "Released mRNA",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Rho-dependent or independent.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "5' Capping",
        "enzyme": "Guanylyltransferase",
        "substrate": "5' mRNA",
        "product": "7-Methylguanosine Cap",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Protects mRNA.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Splicing",
        "enzyme": "Spliceosome",
        "substrate": "pre-mRNA",
        "product": "Mature mRNA",
        "energyChange": "Consumes ATP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Removes introns.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Transcription.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "translation",
    "name": "Translation",
    "category": "Molecular",
    "reactions": [
      {
        "step": 1,
        "title": "Activation",
        "enzyme": "Aminoacyl-tRNA Synthetase",
        "substrate": "Amino Acid + tRNA",
        "product": "Charged tRNA",
        "energyChange": "Consumes 2 ATP eq.",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "High fidelity.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Initiation",
        "enzyme": "Ribosome (IFs)",
        "substrate": "mRNA + Met-tRNA",
        "product": "Initiation Complex",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Finds start codon.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Elongation (Binding)",
        "enzyme": "Ribosome (EF-Tu)",
        "substrate": "Charged tRNA",
        "product": "A-site bound tRNA",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Codon recognition.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Peptidyl Transfer",
        "enzyme": "Peptidyl Transferase",
        "substrate": "Amino Acids",
        "product": "Peptide Bond",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Ribozyme activity.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Translocation",
        "enzyme": "Ribosome (EF-G)",
        "substrate": "Ribosome",
        "product": "Advanced Ribosome",
        "energyChange": "Consumes GTP",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Moves by 3 nucleotides.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Translation.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "eicosanoid-synthesis",
    "name": "Eicosanoid Synthesis",
    "category": "Lipid",
    "reactions": [
      {
        "step": 1,
        "title": "Release",
        "enzyme": "Phospholipase A2",
        "substrate": "Membrane Phospholipids",
        "product": "Arachidonic Acid",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Inhibited by corticosteroids.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Cyclooxygenase Pathway",
        "enzyme": "COX-1 / COX-2",
        "substrate": "Arachidonic Acid",
        "product": "Prostaglandins (PGG2)",
        "energyChange": "Consumes O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Inhibited by NSAIDs.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Peroxidase",
        "enzyme": "COX (Peroxidase active site)",
        "substrate": "PGG2",
        "product": "PGH2",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Precursor for TXA2 and PGs.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Lipoxygenase Pathway",
        "enzyme": "5-Lipoxygenase",
        "substrate": "Arachidonic Acid",
        "product": "Leukotrienes (LTA4)",
        "energyChange": "Consumes O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Inhibited by Zileuton.",
        "x": 250,
        "y": 150
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Eicosanoid Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "sphingolipid-synthesis",
    "name": "Sphingolipid Synthesis",
    "category": "Lipid",
    "reactions": [
      {
        "step": 1,
        "title": "Condensation",
        "enzyme": "Serine Palmitoyltransferase",
        "substrate": "Palmitoyl-CoA + Serine",
        "product": "3-Ketosphinganine",
        "energyChange": "Requires PLP",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "ER localized.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Reduction",
        "enzyme": "3-Ketosphinganine Reductase",
        "substrate": "3-Ketosphinganine",
        "product": "Sphinganine",
        "energyChange": "Consumes NADPH",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Forms alcohol.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Acylation",
        "enzyme": "Ceramide Synthase",
        "substrate": "Sphinganine + Fatty Acyl-CoA",
        "product": "Dihydroceramide",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Adds fatty acid.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Desaturation",
        "enzyme": "Dihydroceramide Desaturase",
        "substrate": "Dihydroceramide",
        "product": "Ceramide",
        "energyChange": "+ FADH2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Central sphingolipid.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Head Group Addition",
        "enzyme": "Sphingomyelin Synthase",
        "substrate": "Ceramide + Phosphatidylcholine",
        "product": "Sphingomyelin",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Major membrane lipid.",
        "x": 50,
        "y": 450
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Sphingolipid Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  },
  {
    "slug": "steroid-hormone-synthesis",
    "name": "Steroid Hormone Synthesis",
    "category": "Lipid",
    "reactions": [
      {
        "step": 1,
        "title": "Transport",
        "enzyme": "StAR Protein",
        "substrate": "Cholesterol (Cytosol)",
        "product": "Cholesterol (Mitochondria)",
        "energyChange": "None",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Regulated by ACTH/LH.",
        "x": 50,
        "y": 50
      },
      {
        "step": 2,
        "title": "Desmolase",
        "enzyme": "Cholesterol Desmolase (CYP11A1)",
        "substrate": "Cholesterol",
        "product": "Pregnenolone",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": true,
        "description": "Cleaves side chain.",
        "x": 50,
        "y": 150
      },
      {
        "step": 3,
        "title": "Isomerization",
        "enzyme": "3β-Hydroxysteroid Dehydrogenase",
        "substrate": "Pregnenolone",
        "product": "Progesterone",
        "energyChange": "+ NADH",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Precursor for mineralo/gluco-corticoids.",
        "x": 50,
        "y": 250
      },
      {
        "step": 4,
        "title": "Hydroxylation",
        "enzyme": "21-Hydroxylase (CYP21A2)",
        "substrate": "Progesterone",
        "product": "11-Deoxycorticosterone",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Deficiency causes CAH.",
        "x": 50,
        "y": 350
      },
      {
        "step": 5,
        "title": "Final Hydroxylation",
        "enzyme": "11β-Hydroxylase (CYP11B1)",
        "substrate": "11-Deoxycortisol",
        "product": "Cortisol",
        "energyChange": "Consumes NADPH, O2",
        "type": "irreversible",
        "isRateLimiting": false,
        "description": "Glucocorticoid synthesis.",
        "x": 250,
        "y": 350
      }
    ],
    "overview": {
      "definition": "The metabolic pathway for Steroid Hormone Synthesis.",
      "function": "Essential for cellular metabolism and homeostasis.",
      "importance": "Disruptions can lead to various metabolic diseases."
    },
    "location": {
      "organ": "Various organs",
      "cellType": "Various cells",
      "cellularLocation": "Cytoplasm"
    }
  }
];

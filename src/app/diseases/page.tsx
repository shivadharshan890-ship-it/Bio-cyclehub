"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { ChevronRight, Stethoscope, AlertCircle, ShieldAlert } from "lucide-react";

const diseaseTopics = [
  "Glycolysis",
  "Krebs cycle (TCA cycle)",
  "Gluconeogenesis",
  "Pentose phosphate pathway",
  "Glycogenesis",
  "Glycogenolysis",
  "Fructose metabolism",
  "Galactose metabolism",
  "Beta-Oxidation of Fatty acids",
  "Fatty Acid synthesis",
  "Cholesterol Biosynthesis",
  "Ketogenesis",
  "Eicosanoid synthesis",
  "Sphingolipid synthesis",
  "Steroid Hormone synthesis",
  "The urea cycle",
  "Amino acid degradation",
  "Purine synthesis",
  "Pyrimidine synthesis",
  "Purine Degradation and salvage",
  "DNA Replication",
  "Transcription",
  "Translation",
  "Heme synthesis",
  "Heme Degradation"
];

const diseaseData: Record<string, { name: string; desc: string }[]> = {
  "Glycolysis": [
    { name: "Pyruvate Kinase Deficiency", desc: "The most common glycolytic enzyme defect, causing chronic non-spherocytic hemolytic anemia because red blood cells lack mitochondria and rely solely on glycolysis for ATP to maintain cell membrane integrity." },
    { name: "Phosphofructokinase Deficiency (Tarui Disease / Glycogen Storage Disease VII)", desc: "Impairs glycolysis in skeletal muscle and erythrocytes, causing muscle cramping, exertional rhabdomyolysis, and mild hemolysis." },
    { name: "Hexokinase Deficiency", desc: "Causes severe congenital hemolytic anemia." },
    { name: "Triosephosphate Isomerase (TPI) Deficiency", desc: "Leads to severe hemolytic anemia accompanied by progressive neurological dysfunction and recurrent infections." }
  ],
  "Krebs cycle (TCA cycle)": [
    { name: "Fumarase Deficiency (Fumaric Aciduria)", desc: "A severe neurodevelopmental disorder causing encephalopathy, seizures, hypotonia, and brain malformations in infants, as well as hereditary leiomyomatosis and renal cell cancer in heterozygous adults." },
    { name: "Succinate Dehydrogenase (SDH) Deficiency", desc: "Impairs Complex II of the electron transport chain, causing Leigh syndrome or familial paragangliomas and pheochromocytomas." },
    { name: "Isocitrate Dehydrogenase (IDH1/IDH2) Mutations", desc: "Somatic gain-of-function mutations produce the oncometabolite 2-hydroxyglutarate, driving gliomas and acute myeloid leukemia (AML)." }
  ],
  "Gluconeogenesis": [
    { name: "Glucose-6-Phosphatase Deficiency (Von Gierke Disease / GSD Ia)", desc: "Blocks the final step of gluconeogenesis and glycogenolysis, causing severe fasting hypoglycemia, lactic acidosis, hyperuricemia, and hyperlipidemia." },
    { name: "Fructose-1,6-Bisphosphatase Deficiency", desc: "Prevents glucose generation from lactate, alanine, and glycerol, leading to episodic fasting hypoglycemia and lactic acidosis precipitated by fasting or fever." },
    { name: "Pyruvate Carboxylase Deficiency", desc: "Impairs the conversion of pyruvate to oxaloacetate, causing infantile lactic acidosis, hyperammonemia, and severe developmental delay." }
  ],
  "Pentose phosphate pathway": [
    { name: "Glucose-6-Phosphate Dehydrogenase (G6PD) Deficiency", desc: "An X-linked disorder impairing NADPH production in erythrocytes, leaving them vulnerable to oxidative stress and causing acute hemolytic anemia (with Heinz bodies) after exposure to infections, fava beans, or oxidative drugs." },
    { name: "Transaldolase Deficiency", desc: "A defect in the non-oxidative branch causing early-onset liver dysfunction, splenomegaly, thrombocytopenia, and dysmorphic features." },
    { name: "Ribose-5-Phosphate Isomerase Deficiency", desc: "A rare condition presenting with leukoencephalopathy, peripheral neuropathy, and psychomotor regression." }
  ],
  "Glycogenesis": [
    { name: "Glycogen Synthase Deficiency (GSD Type 0)", desc: "Prevents glycogen storage in the liver, leading to fasting hypoglycemia accompanied by postprandial hyperglycemia and hyperlactatemia." },
    { name: "Branching Enzyme Deficiency (Andersen Disease / GSD IV)", desc: "Produces abnormal, poorly branched glycogen (polyglucosan bodies) that triggers an immune response, causing progressive infantile liver cirrhosis and cardiomyopathy." }
  ],
  "Glycogenolysis": [
    { name: "Lysosomal Acid Alpha-Glucosidase Deficiency (Pompe Disease / GSD II)", desc: "Lysosomal accumulation of glycogen leads to severe hypertrophic cardiomyopathy and generalized muscle weakness." },
    { name: "Debranching Enzyme Deficiency (Cori / Forbes Disease / GSD III)", desc: "Accumulation of limit-dextrin glycogen causes hepatomegaly, fasting hypoglycemia, and variable skeletal muscle weakness." },
    { name: "Muscle Glycogen Phosphorylase Deficiency (McArdle Disease / GSD V)", desc: "Selectively impairs muscle glycogen breakdown, causing painful exercise intolerance, muscle cramping, and myoglobinuria." },
    { name: "Liver Glycogen Phosphorylase Deficiency (Hers Disease / GSD VI)", desc: "Causes benign hepatomegaly and mild fasting hypoglycemia." }
  ],
  "Fructose metabolism": [
    { name: "Essential Fructosuria (Fructokinase Deficiency)", desc: "A benign, asymptomatic autosomal recessive condition where unmetabolized fructose is excreted in urine." },
    { name: "Hereditary Fructose Intolerance (Aldolase B Deficiency)", desc: "Fructose-1-phosphate accumulates intracellularly upon ingesting fructose, sucrose, or sorbitol, trapping inorganic phosphate, depleting ATP, and causing severe hypoglycemia, vomiting, jaundice, and acute liver/kidney failure." }
  ],
  "Galactose metabolism": [
    { name: "Classic Galactosemia (GALT Deficiency)", desc: "Accumulation of galactose-1-phosphate and galactitol causes neonatal jaundice, hepatomegaly, failure to thrive, early-onset cataracts, intellectual disability, and E. coli sepsis upon consuming lactose." },
    { name: "Galactokinase (GALK) Deficiency", desc: "Galactose is diverted to galactitol in the ocular lens, causing early infantile cataracts without major visceral organ toxicity." },
    { name: "UDP-Galactose 4-Epimerase (GALE) Deficiency", desc: "Ranges from a mild form confined to red blood cells to a severe classic-galactosemia-like systemic illness." }
  ],
  "Beta-Oxidation of Fatty acids": [
    { name: "Medium-Chain Acyl-CoA Dehydrogenase (MCAD) Deficiency", desc: "The most common fatty acid oxidation defect; fasting or viral illness triggers hypoketotic hypoglycemia, vomiting, lethargy, and sudden death." },
    { name: "Very Long-Chain Acyl-CoA Dehydrogenase (VLCAD) Deficiency", desc: "Causes hypoketotic hypoglycemia along with severe cardiomyopathy and exertional rhabdomyolysis." },
    { name: "Carnitine Palmitoyltransferase II (CPT II) Deficiency", desc: "Prevents long-chain fatty acids from entering the mitochondria, presenting with muscle pain, stiffness, and myoglobinuria after exertion or fasting." },
    { name: "Primary Systemic Carnitine Deficiency", desc: "Defective carnitine transport prevents fatty acid transport into mitochondria, leading to progressive cardiomyopathy and hypoketotic hypoglycemia." }
  ],
  "Fatty Acid synthesis": [
    { name: "Malonyl-CoA Decarboxylase Deficiency", desc: "Causes elevated malonyl-CoA levels that inhibit fatty acid oxidation and disrupt lipid regulation, presenting with developmental delay, seizures, and cardiomyopathy." },
    { name: "Fatty Acid Synthase (FASN) Overexpression", desc: "Plays a critical role in cancer metabolism (supplying lipids for tumor membrane growth) and contributes to non-alcoholic fatty liver disease (NAFLD) and metabolic syndrome." }
  ],
  "Cholesterol Biosynthesis": [
    { name: "Smith-Lemli-Opitz Syndrome (SLOS)", desc: "Mutations in 7-dehydrocholesterol reductase (DHCR7) block the final step of cholesterol synthesis, leading to microcephaly, dysmorphic facial features, 2-3 toe syndactyly, cleft palate, and intellectual disability." },
    { name: "Mevalonate Kinase Deficiency", desc: "Impairs early cholesterol precursor synthesis, causing recurrent periodic fever syndromes (Hyper-IgD syndrome) or severe mevalonic aciduria with neurological impairment." },
    { name: "Desmosterolosis / Lathosterolosis", desc: "Rare cholesterol pathway defects resulting in severe congenital malformations and developmental delay." }
  ],
  "Ketogenesis": [
    { name: "Mitochondrial HMG-CoA Lyase Deficiency", desc: "Disrupts both ketogenesis and leucine catabolism, causing hypoketotic hypoglycemia, severe metabolic acidosis, hyperammonemia, and encephalopathy." },
    { name: "Mitochondrial HMG-CoA Synthase Deficiency", desc: "Selectively impairs hepatic ketone body synthesis, leading to episodic fasting hypoketotic hypoglycemia and encephalopathy mimicking Reye-like syndrome." }
  ],
  "Eicosanoid synthesis": [
    { name: "Aspirin-Exacerbated Respiratory Disease (AERD / Samter's Triad)", desc: "Inhibition of COX-1 shunts arachidonic acid to the 5-lipoxygenase pathway, causing cysteinyl leukotriene overproduction that triggers asthma, nasal polyps, and aspirin sensitivity." },
    { name: "Thromboxane Synthase Deficiency", desc: "Leads to a bleeding diathesis due to impaired thromboxane A2 production and defective platelet aggregation." },
    { name: "COX-2 Overexpression", desc: "Drives chronic inflammation, gastric ulcers under non-selective NSAID use, and solid tumor growth (e.g., colorectal cancer)." }
  ],
  "Sphingolipid synthesis": [
    { name: "Gaucher Disease (Glucocerebrosidase Deficiency)", desc: "Accumulation of glucosylceramide in macrophages leads to hepatosplenomegaly, bone marrow infiltration, bone pain/crises, and cytopenias." },
    { name: "Tay-Sachs Disease (Hexosaminidase A Deficiency)", desc: "GM2 ganglioside accumulates in neurons, causing progressive neurodegeneration, developmental regression, a cherry-red macular spot, and early death." },
    { name: "Niemann-Pick Disease Types A & B (Sphingomyelinase Deficiency)", desc: "Sphingomyelin storage causes hepatosplenomegaly and progressive neurodegeneration (Type A) or visceral involvement (Type B)." },
    { name: "Fabry Disease (Alpha-Galactosidase A Deficiency)", desc: "An X-linked condition causing globotriaosylceramide accumulation, presenting with painful acroparesthesias, angiokeratomas, renal failure, and early stroke." }
  ],
  "Steroid Hormone synthesis": [
    { name: "21-Hydroxylase Deficiency (Classic CAH)", desc: "Accounts for >90% of Congenital Adrenal Hyperplasia cases; blocks cortisol and aldosterone synthesis while increasing adrenal androgens, causing salt-wasting crises, hypotension, and virilization of female genitalia." },
    { name: "11-Beta-Hydroxylase Deficiency", desc: "Elevates 11-deoxycorticosterone and androgens, causing virilization alongside hypertension and hypokalemia." },
    { name: "17-Alpha-Hydroxylase Deficiency", desc: "Prevents sex hormone and cortisol production while elevating mineralocorticoids, causing sexual infantilism, amenorrhea, and hypertension." },
    { name: "StAR Deficiency (Lipoid CAH)", desc: "Prevents cholesterol entry into adrenal mitochondria, leading to severe early-onset adrenal failure." }
  ],
  "The urea cycle": [
    { name: "Ornithine Transcarbamylase (OTC) Deficiency", desc: "The most common urea cycle defect and the only X-linked form; causes severe hyperammonemia, elevated urinary orotic acid, encephalopathy, and coma in newborns." },
    { name: "Carbamoyl Phosphate Synthetase I (CPS1) Deficiency", desc: "Causes life-threatening neonatal hyperammonemia without elevated urinary orotic acid." },
    { name: "Argininosuccinate Synthetase Deficiency (Citrullinemia Type I)", desc: "Causes severe hyperammonemia, lethargy, and seizures." },
    { name: "Arginase Deficiency", desc: "Presents differently from other urea cycle defects, manifesting as progressive spastic diplegia, microcephaly, and growth failure rather than acute early hyperammonemic coma." }
  ],
  "Amino acid degradation": [
    { name: "Phenylketonuria (PKU)", desc: "Deficiency of phenylalanine hydroxylase leads to phenylalanine accumulation, causing severe intellectual disability, microcephaly, seizures, hypopigmentation, and a musty body odor if untreated." },
    { name: "Maple Syrup Urine Disease (MSUD)", desc: "Deficiency in branched-chain alpha-keto acid dehydrogenase blocks leucine, isoleucine, and valine breakdown, causing sweet-smelling urine, neonatal ketoacidosis, and neurodegeneration." },
    { name: "Alkaptonuria", desc: "Homogentisate 1,2-dioxygenase deficiency causes homogentisic acid buildup, leading to urine turning dark upon standing, connective tissue pigmentation (ochronosis), and early-onset debilitating arthritis." },
    { name: "Homocystinuria", desc: "Cystathionine beta-synthase deficiency causes high homocysteine levels, leading to a marfanoid habitus, ectopia lentis (downward lens dislocation), intellectual disability, and premature thromboembolism." }
  ],
  "Purine synthesis": [
    { name: "PRPP Synthetase Superactivity", desc: "An X-linked gain-of-function disorder driving excessive purine production, resulting in hyperuricemia, early-onset gout, uric acid kidney stones, and neurodevelopmental abnormalities." },
    { name: "Adenylosuccinate Lyase (ADSL) Deficiency", desc: "Blocks de novo purine synthesis, causing succinylpurine accumulation in CSF, leading to severe psychomotor delay, intractable infantile seizures, and autistic features." }
  ],
  "Pyrimidine synthesis": [
    { name: "Hereditary Orotic Aciduria", desc: "Caused by UMP Synthase deficiency, preventing pyrimidine generation; results in severe megaloblastic anemia unresponsive to B12/folate, failure to thrive, and heavy urinary orotic acid crystals (without hyperammonemia)." },
    { name: "Dihydropyrimidine Dehydrogenase (DPD) Deficiency", desc: "Impairs pyrimidine breakdown, leading to neurological symptoms and severe, potentially fatal toxicity if exposed to 5-fluorouracil (5-FU) chemotherapy." }
  ],
  "Purine Degradation and salvage": [
    { name: "Lesch-Nyhan Syndrome", desc: "Complete HGPRT deficiency blocks hypoxanthine and guanine salvage, driving purine breakdown to uric acid; causes severe hyperuricemia, gout, choreoathetosis, intellectual disability, and self-mutilating behaviors." },
    { name: "Adenosine Deaminase (ADA) Deficiency", desc: "Toxic dATP accumulates in lymphocytes, inhibiting ribonucleotide reductase and destroying immune cells, causing Severe Combined Immunodeficiency (SCID)." },
    { name: "Gout", desc: "Hyperuricemia caused by purine overproduction or renal underexcretion leads to monosodium urate crystal deposition in joints (tophi, acute arthritis) and kidneys." }
  ],
  "DNA Replication": [
    { name: "Xeroderma Pigmentosum", desc: "Defective nucleotide excision repair mechanisms (which repair UV-induced thymine dimers during replication) cause extreme photosensitivity and a severe risk of skin cancers." },
    { name: "Bloom Syndrome (BLM Helicase Deficiency)", desc: "Impaired DNA unwinding during replication causes genomic instability, growth retardation, facial erythema, high sister chromatid exchange, and early malignancies." },
    { name: "Werner Syndrome (WRN Helicase Deficiency)", desc: "Causes adult progeria marked by premature aging, cataracts, atherosclerosis, and sarcomas." }
  ],
  "Transcription": [
    { name: "Cockayne Syndrome", desc: "Mutations in transcription-coupled repair proteins (CSA or CSB) cause RNA polymerase II stalling during transcription, leading to severe microcephaly, neurodegeneration, cachectic dwarfism, and premature aging." },
    { name: "Treacher Collins Syndrome", desc: "Defective RNA Polymerase I transcription of ribosomal RNA leads to neural crest cell apoptosis and severe craniofacial dysostosis." },
    { name: "Alpha-Amanitin Poisoning (Death Cap Mushroom)", desc: "Potently inhibits RNA Polymerase II, stopping mRNA synthesis and causing acute liver and kidney failure." }
  ],
  "Translation": [
    { name: "Leukoencephalopathy with Vanishing White Matter", desc: "Mutations in eukaryotic initiation factor 2B (eIF2B) impair translational stress responses, causing progressive brain white matter loss triggered by fever or head trauma." },
    { name: "Wolcott-Rallison Syndrome", desc: "Mutations in PERK (an eIF2-alpha kinase) disrupt translational regulation during ER stress, causing neonatal diabetes and skeletal dysplasia." },
    { name: "Charcot-Marie-Tooth Disease Type 2D", desc: "Mutations in glycyl-tRNA synthetase (GARS) disrupt peripheral nerve protein translation, causing motor and sensory neuropathy." }
  ],
  "Heme synthesis": [
    { name: "Acute Intermittent Porphyria (AIP)", desc: "Hydroxymethylbilane synthase deficiency causes accumulation of ALA and PBG, manifesting as acute abdominal pain, neurological symptoms, and dark urine without skin lesions." },
    { name: "Porphyria Cutanea Tarda (PCT)", desc: "Uroporphyrinogen decarboxylase deficiency causes photosensitive blistering, skin fragility, and hyperpigmentation on sun-exposed skin." },
    { name: "X-Linked Sideroblastic Anemia", desc: "ALAS2 deficiency impairs the initial step of heme synthesis in bone marrow, causing microcytic anemia with ringed sideroblasts." }
  ],
  "Heme Degradation": [
    { name: "Gilbert Syndrome", desc: "Reduced activity of UGT1A1 causes mild, benign unconjugated hyperbilirubinemia triggered by stress, fasting, or illness." },
    { name: "Crigler-Najjar Syndrome Type I", desc: "Total absence of UGT1A1 activity leads to severe unconjugated hyperbilirubinemia, kernicterus, and fatal brain damage in infants unless treated with phototherapy or liver transplantation." },
    { name: "Dubin-Johnson Syndrome", desc: "Defective MRP2 canalicular transporter prevents conjugated bilirubin excretion, causing conjugated hyperbilirubinemia and a darkly pigmented liver." },
    { name: "Rotor Syndrome", desc: "Defective hepatic reuptake of conjugated bilirubin leads to conjugated hyperbilirubinemia without liver pigmentation." }
  ]
};

export default function DiseasesPage() {
  const [selectedTopic, setSelectedTopic] = useState(diseaseTopics[0]);
  const currentDiseases = diseaseData[selectedTopic] || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Sidebar navigation */}
        <section className="w-full md:w-80 shrink-0 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-foreground flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-primary" />
              Diseases & Pathology
            </h1>
            <p className="text-[11px] text-muted-foreground">Clinical correlations for metabolic pathways</p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {diseaseTopics.map((topic, idx) => {
              const active = topic === selectedTopic;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-4 flex justify-between items-center transition ${
                    active ? "bg-primary/5 text-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="space-y-1 max-w-[210px]">
                    <h3 className={`text-xs font-bold leading-tight ${active ? "text-primary" : "text-foreground"}`}>
                      {topic}
                    </h3>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${active ? "text-primary translate-x-1" : "text-muted-foreground"}`} />
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Side: Content Area */}
        <section className="flex-grow bg-card border border-border rounded-3xl shadow-sm p-6 sm:p-12 flex flex-col relative h-[calc(100vh-140px)] overflow-y-auto">
          <div className="mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
              {selectedTopic}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pathologies and clinical conditions associated with this pathway.
            </p>
          </div>

          {currentDiseases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentDiseases.map((disease, idx) => (
                <div key={idx} className="bg-muted/30 border border-border rounded-2xl p-5 hover:border-primary/30 transition shadow-sm group">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-500/10 text-red-500 p-2 rounded-xl shrink-0 group-hover:bg-red-500 group-hover:text-white transition">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-1">{disease.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{disease.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-80 mt-10">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No specific diseases listed yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Check back later for updates on pathologies related to the {selectedTopic} pathway.
              </p>
            </div>
          )}
          
          <div className="mt-auto pt-8 w-full text-xs text-muted-foreground/60 flex items-center justify-center gap-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>BioCycle Hub Clinical Database</span>
          </div>
        </section>

      </main>
    </div>
  );
}

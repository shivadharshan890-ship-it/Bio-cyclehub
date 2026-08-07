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
    { name: "Pyruvate Kinase Deficiency", desc: "Causes chronic hemolytic anemia due to lack of ATP in red blood cells." },
    { name: "Tarui Disease (GSD Type VII)", desc: "Phosphofructokinase-1 (PFK-1) deficiency causing exercise-induced muscle cramps and weakness." }
  ],
  "Krebs cycle (TCA cycle)": [
    { name: "Fumarase Deficiency", desc: "Severe encephalopathy, seizures, and developmental delay due to impaired TCA cycle." }
  ],
  "Gluconeogenesis": [
    { name: "Von Gierke Disease (GSD Type I)", desc: "Glucose-6-phosphatase deficiency causing severe fasting hypoglycemia, lactic acidosis, hepatomegaly, and hyperuricemia." }
  ],
  "Pentose phosphate pathway": [
    { name: "G6PD Deficiency", desc: "X-linked recessive disorder causing episodic hemolytic anemia due to oxidative stress (e.g., fava beans, antimalarials)." },
    { name: "Wernicke-Korsakoff Syndrome", desc: "Thiamine (B1) deficiency impairing transketolase, causing confusion, ataxia, and memory loss." }
  ],
  "Glycogenesis": [
    { name: "Andersen Disease (GSD Type IV)", desc: "Branching enzyme deficiency leading to accumulation of abnormal glycogen, causing cirrhosis and early death." }
  ],
  "Glycogenolysis": [
    { name: "McArdle Disease (GSD Type V)", desc: "Skeletal muscle glycogen phosphorylase deficiency causing muscle cramps and myoglobinuria with strenuous exercise." },
    { name: "Pompe Disease (GSD Type II)", desc: "Lysosomal alpha-1,4-glucosidase deficiency leading to severe cardiomegaly and early death." },
    { name: "Cori Disease (GSD Type III)", desc: "Debranching enzyme deficiency causing milder fasting hypoglycemia and hepatomegaly." }
  ],
  "Fructose metabolism": [
    { name: "Essential Fructosuria", desc: "Fructokinase defect; benign, asymptomatic condition with fructose in blood and urine." },
    { name: "Hereditary Fructose Intolerance", desc: "Aldolase B defect; causes toxic accumulation of Fructose-1-P leading to hypoglycemia, jaundice, and cirrhosis." }
  ],
  "Galactose metabolism": [
    { name: "Galactokinase Deficiency", desc: "Causes accumulation of galactitol, leading to infantile cataracts. Relatively mild." },
    { name: "Classic Galactosemia", desc: "GALT deficiency; severe condition causing failure to thrive, jaundice, hepatomegaly, infantile cataracts, and intellectual disability." }
  ],
  "Beta-Oxidation of Fatty acids": [
    { name: "MCAD Deficiency", desc: "Medium-chain acyl-CoA dehydrogenase deficiency causing severe fasting non-ketotic hypoglycemia." },
    { name: "Zellweger Syndrome", desc: "Peroxisomal defect preventing oxidation of Very Long Chain Fatty Acids (VLCFAs)." }
  ],
  "Fatty Acid synthesis": [
    { name: "Metabolic Syndrome & Hepatic Steatosis", desc: "Excess dietary carbohydrates are converted into fatty acids, contributing to non-alcoholic fatty liver disease (NAFLD)." }
  ],
  "Cholesterol Biosynthesis": [
    { name: "Familial Hypercholesterolemia (Type IIa)", desc: "Defective LDL receptors or ApoB-100, causing severe atherosclerosis and tendon xanthomas." },
    { name: "Smith-Lemli-Opitz Syndrome", desc: "Defect in 7-Dehydrocholesterol reductase causing microcephaly, intellectual disability, and syndactyly." }
  ],
  "Ketogenesis": [
    { name: "Diabetic Ketoacidosis (DKA)", desc: "Absolute insulin deficiency leads to unchecked ketogenesis (acetoacetate, beta-hydroxybutyrate), causing severe metabolic acidosis." }
  ],
  "Eicosanoid synthesis": [
    { name: "Aspirin-Induced Asthma", desc: "COX inhibition diverts arachidonic acid to the lipoxygenase pathway, overproducing leukotrienes and causing bronchoconstriction." }
  ],
  "Sphingolipid synthesis": [
    { name: "Tay-Sachs Disease", desc: "Hexosaminidase A deficiency; GM2 ganglioside accumulates. Cherry-red spot on macula, neurodegeneration." },
    { name: "Gaucher Disease", desc: "Glucocerebrosidase deficiency; most common lysosomal storage disease. Hepatosplenomegaly, bone crises, Gaucher cells." },
    { name: "Niemann-Pick Disease", desc: "Sphingomyelinase deficiency; hepatosplenomegaly and cherry-red spot on macula (unlike Tay-Sachs)." }
  ],
  "Steroid Hormone synthesis": [
    { name: "21-Hydroxylase Deficiency", desc: "Most common form of Congenital Adrenal Hyperplasia. Causes salt wasting, hypotension, and female virilization." },
    { name: "17-Alpha-Hydroxylase Deficiency", desc: "Causes hypertension, hypokalemia, and delayed puberty/ambiguous genitalia." }
  ],
  "The urea cycle": [
    { name: "Ornithine Transcarbamylase (OTC) Deficiency", desc: "X-linked recessive; causes severe hyperammonemia, increased orotic acid in blood/urine, and encephalopathy." },
    { name: "CPS1 Deficiency", desc: "Autosomal recessive; causes hyperammonemia without orotic aciduria." }
  ],
  "Amino acid degradation": [
    { name: "Phenylketonuria (PKU)", desc: "Phenylalanine hydroxylase deficiency. Causes intellectual disability, microcephaly, and a musty body odor." },
    { name: "Alkaptonuria", desc: "Homogentisate oxidase deficiency. Causes dark connective tissue, brown sclera, and urine that turns black when exposed to air." },
    { name: "Maple Syrup Urine Disease (MSUD)", desc: "Branched-chain alpha-ketoacid dehydrogenase deficiency. Causes severe CNS defects and sweet-smelling urine." }
  ],
  "Purine synthesis": [
    { name: "PRPP Synthetase Overactivity", desc: "X-linked disorder leading to purine overproduction and gout." }
  ],
  "Pyrimidine synthesis": [
    { name: "Orotic Aciduria", desc: "Defect in UMP synthase. Causes megaloblastic anemia unresponsive to B12/folate, and growth retardation." }
  ],
  "Purine Degradation and salvage": [
    { name: "Lesch-Nyhan Syndrome", desc: "HGPRT deficiency in purine salvage. Causes hyperuricemia, gout, intellectual disability, and self-mutilation." },
    { name: "Adenosine Deaminase (ADA) Deficiency", desc: "Autosomal recessive cause of SCID (Severe Combined Immunodeficiency) due to dATP toxicity to lymphocytes." }
  ],
  "DNA Replication": [
    { name: "Xeroderma Pigmentosum", desc: "Defect in nucleotide excision repair. Extreme sensitivity to UV light and highly increased risk of skin cancer." },
    { name: "Bloom Syndrome", desc: "Defect in BLM helicase. Causes growth retardation, facial rash, and immunodeficiency." }
  ],
  "Transcription": [
    { name: "Alpha-amanitin Poisoning", desc: "Toxin from death cap mushrooms (Amanita phalloides) strongly inhibits RNA polymerase II, causing severe hepatotoxicity." }
  ],
  "Translation": [
    { name: "Diphtheria", desc: "Corynebacterium diphtheriae toxin inactivates Elongation Factor 2 (EF-2) via ADP-ribosylation, stopping translation." }
  ],
  "Heme synthesis": [
    { name: "Acute Intermittent Porphyria (AIP)", desc: "Defect in porphobilinogen deaminase. Causes painful abdomen, port-wine urine, polyneuropathy, and psychological disturbances." },
    { name: "Porphyria Cutanea Tarda (PCT)", desc: "Defect in uroporphyrinogen decarboxylase. Causes blistering cutaneous photosensitivity and tea-colored urine." },
    { name: "Lead Poisoning", desc: "Inhibits ALA dehydratase and ferrochelatase, causing microcytic anemia, lead lines on gums, and encephalopathy." }
  ],
  "Heme Degradation": [
    { name: "Gilbert Syndrome", desc: "Mild, benign reduction in UDP-glucuronosyltransferase (UGT) activity causing asymptomatic jaundice during stress." },
    { name: "Crigler-Najjar Syndrome", desc: "Severe or absent UGT activity. Causes dangerous unconjugated hyperbilirubinemia and kernicterus in infants." }
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

"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { ChevronRight, Stethoscope, AlertCircle } from "lucide-react";

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

export default function DiseasesPage() {
  const [selectedTopic, setSelectedTopic] = useState(diseaseTopics[0]);

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
        <section className="flex-grow bg-card border border-border rounded-3xl shadow-sm p-6 sm:p-12 flex flex-col relative h-[calc(100vh-140px)]">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-80">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-foreground">{selectedTopic}</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Clinical correlations, associated diseases, and pathologies related to the {selectedTopic} pathway will be populated here soon.
            </p>
            <div className="mt-8 pt-6 border-t border-border w-full text-xs text-muted-foreground/60 flex items-center justify-center gap-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>BioCycle Hub Clinical Database</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

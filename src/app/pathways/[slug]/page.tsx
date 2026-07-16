"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dbService, Pathway } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import PathwayViewer from "@/components/PathwayViewer";
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Flame, 
  Award, 
  BookOpen, 
  ShieldAlert, 
  Info,
  Layers,
  GraduationCap
} from "lucide-react";

interface PathwayPageProps {
  params: Promise<{ slug: string }>;
}

export default function PathwayDetailPage({ params }: PathwayPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  // Unwrap parameters
  const { slug } = React.use(params);
  
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "energy" | "enzymes" | "clinical">("overview");

  useEffect(() => {
    const data = dbService.getPathwayBySlug(slug);
    if (!data) {
      router.push("/pathways");
      return;
    }
    setPathway(data);

    // Complete pathway & award XP
    if (user && data) {
      dbService.completePathway(user.uid, data.slug);
    }
  }, [slug, user, router]);

  if (!pathway) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      {/* 1. STICKY SUB-HEADER */}
      <section className="bg-card border-b border-border py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link 
              href="/pathways" 
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center space-x-1 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Catalog</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center space-x-2">
              <span>{pathway.name} Pathway</span>
              <span className="text-[10px] font-black uppercase bg-primary/10 text-primary py-0.5 px-2.5 rounded-full">
                {pathway.category}
              </span>
            </h1>
          </div>

          <div className="flex space-x-3">
            <Link 
              href={`/quiz?slug=${pathway.slug}`}
              className="bg-accent text-accent-foreground hover:bg-accent-hover font-bold text-xs py-2 px-4 rounded-xl flex items-center shadow-sm shadow-accent/20 transition-all"
            >
              <Award className="h-4 w-4 mr-1.5" />
              <span>Take Revision Quiz</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN VIEWER SECTION */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Interactive Viewer panel */}
        <section className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-muted-foreground">Interactive Pathway Map</span>
            <span className="text-[10px] text-muted-foreground italic">Powered by SVG Vector Mapping</span>
          </div>
          <PathwayViewer pathway={pathway} />
        </section>

        {/* 3. INFORMATION SHEETS (TABS) */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Tabs Selector Header */}
          <div className="flex bg-muted/40 border-b border-border overflow-x-auto">
            {[
              { id: "overview", name: "Overview & Site", icon: Info },
              { id: "energy", name: "Energy Accounting", icon: Sparkles },
              { id: "enzymes", name: "Enzyme Regulation", icon: Layers },
              { id: "clinical", name: "Clinical Pathology", icon: ShieldAlert }
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center space-x-1.5 py-4 px-6 text-xs font-bold transition whitespace-nowrap border-b-2 ${
                    activeTab === t.id
                      ? "border-primary text-primary bg-card"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab contents */}
          <div className="p-6 text-xs text-muted-foreground leading-relaxed">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1.5">Description</h3>
                    <p>{pathway.overview.definition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1.5">Biological Importance</h3>
                    <p>{pathway.overview.importance}</p>
                  </div>
                </div>

                <div className="space-y-4 bg-muted/40 p-4 rounded-xl border border-border/80">
                  <h3 className="text-xs uppercase font-black text-foreground tracking-wider mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    Localization Spec Sheet
                  </h3>
                  <div className="space-y-3 font-semibold text-[11px]">
                    <div className="flex justify-between">
                      <span>Primary Organ Site:</span>
                      <span className="text-foreground">{pathway.location.organ}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Cell Types:</span>
                      <span className="text-foreground">{pathway.location.cellType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cellular Compartment:</span>
                      <span className="text-foreground bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[9px] uppercase">
                        {pathway.location.cellularLocation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ENERGY TAB */}
            {activeTab === "energy" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground">ATP Yield Accounting</h3>
                  <p>{pathway.energyBalance.summary}</p>
                  
                  <div className="bg-yellow-500/5 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-4 rounded-xl text-xs flex items-start space-x-2">
                    <GraduationCap className="h-5 w-5 shrink-0 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-bold">GPAT Highlight: Substrate-Level Phosphorylation</h4>
                      <p className="text-[10px] mt-0.5 leading-normal">
                        Identify steps where ATP/GTP is formed directly without oxygen. In Glycolysis, these are Steps 7 (PGK) and 10 (PK). In Krebs Cycle, it is Step 5 (Succinyl-CoA Synthetase).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-red-500/5 border border-red-500/15 p-4 rounded-xl">
                    <span className="text-[9px] font-black uppercase block tracking-wider">ATP Expended</span>
                    <span className="text-2xl font-black text-red-500 block mt-1">-{pathway.energyBalance.atpUsed} ATP</span>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-xl">
                    <span className="text-[9px] font-black uppercase block tracking-wider">ATP Synthesized</span>
                    <span className="text-2xl font-black text-emerald-500 block mt-1">+{pathway.energyBalance.atpProduced} ATP</span>
                  </div>
                  <div className="bg-sky-500/5 border border-sky-500/15 p-4 rounded-xl col-span-2 flex justify-around items-center">
                    <div>
                      <span className="text-[9px] font-black uppercase block tracking-wider">Coenzyme NADH</span>
                      <span className="text-xl font-black text-sky-500 block">+{pathway.energyBalance.nadh} NADH</span>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div>
                      <span className="text-[9px] font-black uppercase block tracking-wider">Coenzyme FADH₂</span>
                      <span className="text-xl font-black text-sky-500 block">+{pathway.energyBalance.fadh2} FADH₂</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ENZYMES TAB */}
            {activeTab === "enzymes" && (
              <div className="space-y-6">
                {/* Rate limiting details block */}
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 flex items-start space-x-3">
                  <div className="bg-red-500/15 text-red-600 dark:text-red-400 p-2 rounded-lg shrink-0">
                    <Flame className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs uppercase font-black text-foreground">Critical Gatekeeper (Rate-Limiting)</h3>
                    <h4 className="text-xs font-bold text-red-500">{pathway.rateLimitingStep.enzyme}</h4>
                    <p className="text-[11px] leading-relaxed mt-1 text-muted-foreground">{pathway.rateLimitingStep.description}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      <span className="font-bold text-foreground">Regulation:</span> {pathway.rateLimitingStep.regulation}
                    </p>
                  </div>
                </div>

                {/* Regulation summary columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-muted/40 p-4 rounded-xl border border-border">
                    <h3 className="text-xs uppercase font-black text-foreground mb-3">Allosteric Factors</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-emerald-600 block mb-0.5">Activators (Turn ON):</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {pathway.regulationSummary.activators.map(a => (
                            <span key={a} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">{a}</span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="font-bold text-red-600 block mb-0.5">Inhibitors (Turn OFF):</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {pathway.regulationSummary.inhibitors.map(i => (
                            <span key={i} className="bg-red-500/10 text-red-700 dark:text-red-400 font-bold px-2 py-0.5 rounded text-[10px]">{i}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/40 p-4 rounded-xl border border-border flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs uppercase font-black text-foreground mb-2">Hormonal Control</h3>
                      <p className="text-[11px] leading-relaxed">{pathway.regulationSummary.hormonalControl}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 italic pt-4">
                      * Hormonal effects act via kinase cascades modifying enzyme phosphorylation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CLINICAL TAB */}
            {activeTab === "clinical" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pathology & Syndromes */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-1 text-red-500" />
                    Pathology & Inherited Syndromes
                  </h3>
                  <ul className="space-y-3">
                    {pathway.clinicalSignificance.diseases.map((dis, idx) => {
                      const parts = dis.split(":");
                      return (
                        <li key={idx} className="bg-muted/40 p-3 rounded-lg border border-border">
                          <span className="font-bold text-foreground text-[11px] block">{parts[0]}</span>
                          {parts[1] && <span className="text-[11px] text-muted-foreground mt-0.5 block leading-normal">{parts[1].trim()}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Drug Targets & Labs */}
                <div className="space-y-6">
                  {/* Targets */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-foreground">Pharmacology & Drug Targets</h3>
                    <ul className="space-y-2">
                      {pathway.clinicalSignificance.drugTargets.map((dt, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px] mt-0.5 shrink-0">
                            {idx + 1}
                          </div>
                          <span>{dt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lab markers */}
                  <div className="space-y-2 bg-muted/30 p-4 rounded-xl border border-border">
                    <h4 className="text-[10px] uppercase font-black text-foreground">Diagnostic Lab Findings</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {pathway.clinicalSignificance.labFindings.map((lf, idx) => (
                        <li key={idx} className="text-[11px] text-muted-foreground leading-normal">{lf}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

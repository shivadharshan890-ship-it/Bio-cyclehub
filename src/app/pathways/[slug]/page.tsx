"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dbService, Pathway } from "@/lib/db";
import { pathwayEnergy } from "@/lib/pathwayData";
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
  GraduationCap,
  Pill
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
  const [activeTab, setActiveTab] = useState<"overview" | "energy" | "enzymes" | "clinical" | "pharmacy">("overview");

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
              <span>{pathway.title} Pathway</span>
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
              { id: "clinical", name: "Clinical Pathology", icon: ShieldAlert },
              { id: "pharmacy", name: "Pharmacy & Exam Notes", icon: Pill }
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
                    <p>{pathway.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1.5">Clinical Importance</h3>
                    <p>{pathway.clinicalImportance || "No clinical importance provided."}</p>
                  </div>
                </div>

                <div className="space-y-4 bg-muted/40 p-4 rounded-xl border border-border/80">
                  <h3 className="text-xs uppercase font-black text-foreground tracking-wider mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    Localization Spec Sheet
                  </h3>
                  <div className="space-y-3 font-semibold text-[11px]">
                    <div className="flex justify-between">
                      <span>Cellular Compartment:</span>
                      <span className="text-foreground bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[9px] uppercase">
                        {pathway.cellularLocation}
                      </span>
                    </div>
                  </div>
                  {pathway.pathwayConnections && (
                    <div className="space-y-3 font-semibold text-[11px] mt-4 pt-4 border-t border-border/80">
                      <h4 className="text-[10px] uppercase font-black text-foreground">Pathway Connections</h4>
                      {pathway.pathwayConnections.upstream.length > 0 && (
                        <div>
                          <span className="text-muted-foreground block mb-1">Upstream (Precursors):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {pathway.pathwayConnections.upstream.map(u => <span key={u} className="bg-muted text-foreground px-2 py-0.5 rounded text-[10px]">{u}</span>)}
                          </div>
                        </div>
                      )}
                      {pathway.pathwayConnections.downstream.length > 0 && (
                        <div className="mt-2">
                          <span className="text-muted-foreground block mb-1">Downstream (Fates):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {pathway.pathwayConnections.downstream.map(d => <span key={d} className="bg-muted text-foreground px-2 py-0.5 rounded text-[10px]">{d}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ENERGY TAB */}
            {activeTab === "energy" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground">Net Energy Accounting</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Overview of the energy equivalents (ATP, GTP, reducing equivalents) either consumed or produced throughout this entire biochemical pathway.
                  </p>
                  
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
                  {(() => {
                    const energyData = pathwayEnergy[pathway.slug];
                    if (!energyData) return null;
                    
                    return (
                      <>
                        {(energyData.atpConsumed ?? 0) > 0 && (
                          <div className="bg-red-500/5 border border-red-500/15 p-4 rounded-xl">
                            <span className="text-[9px] font-black uppercase block tracking-wider">ATP Expended</span>
                            <span className="text-2xl font-black text-red-500 block mt-1">-{energyData.atpConsumed}</span>
                          </div>
                        )}
                        {(energyData.atpProduced ?? 0) > 0 && (
                          <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-xl">
                            <span className="text-[9px] font-black uppercase block tracking-wider">ATP Synthesized</span>
                            <span className="text-2xl font-black text-emerald-500 block mt-1">+{energyData.atpProduced}</span>
                          </div>
                        )}

                        <div className="col-span-2 bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 flex flex-col items-center justify-center">
                          <span className="text-xs uppercase font-black text-yellow-600 dark:text-yellow-400 block tracking-widest">Net ATP Equivalent</span>
                          <span className="text-4xl font-black text-yellow-500">{energyData.netATP ?? 0}</span>
                        </div>

                        {/* Reducing Equivalents & Others */}
                        <div className="bg-sky-500/5 border border-sky-500/15 p-4 rounded-xl col-span-2 flex flex-wrap justify-around items-center gap-4">
                          {(energyData.nadh ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">NADH Produced</span>
                              <span className="text-xl font-black text-sky-500 block">+{energyData.nadh}</span>
                            </div>
                          )}
                          {(energyData.nadhConsumed ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">NADH Consumed</span>
                              <span className="text-xl font-black text-red-400 block">-{energyData.nadhConsumed}</span>
                            </div>
                          )}
                          {(energyData.fadh2 ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">FADH₂ Produced</span>
                              <span className="text-xl font-black text-sky-500 block">+{energyData.fadh2}</span>
                            </div>
                          )}
                          {(energyData.fadh2Consumed ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">FADH₂ Consumed</span>
                              <span className="text-xl font-black text-red-400 block">-{energyData.fadh2Consumed}</span>
                            </div>
                          )}
                          {(energyData.nadph ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">NADPH Produced</span>
                              <span className="text-xl font-black text-purple-400 block">+{energyData.nadph}</span>
                            </div>
                          )}
                          {(energyData.nadphConsumed ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">NADPH Consumed</span>
                              <span className="text-xl font-black text-red-400 block">-{energyData.nadphConsumed}</span>
                            </div>
                          )}
                          {(energyData.gtp ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">GTP Produced</span>
                              <span className="text-xl font-black text-emerald-400 block">+{energyData.gtp}</span>
                            </div>
                          )}
                          {(energyData.gtpConsumed ?? 0) > 0 && (
                            <div>
                              <span className="text-[9px] font-black uppercase block tracking-wider">GTP Consumed</span>
                              <span className="text-xl font-black text-red-400 block">-{energyData.gtpConsumed}</span>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ENZYMES TAB */}
            {activeTab === "enzymes" && (
              <div className="space-y-6">
                {/* Rate limiting details block */}
                {pathway.rateLimitingStep && (
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 flex items-start space-x-3">
                  <div className="bg-red-500/15 text-red-600 dark:text-red-400 p-2 rounded-lg shrink-0">
                    <Flame className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs uppercase font-black text-foreground">Critical Gatekeeper (Rate-Limiting)</h3>
                    <h4 className="text-xs font-bold text-red-500">{pathway.rateLimitingStep?.enzyme}</h4>
                    <p className="text-[11px] leading-relaxed mt-1 text-muted-foreground">{pathway.rateLimitingStep?.description}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      <span className="font-bold text-foreground">Regulation:</span> {pathway.rateLimitingStep?.regulation}
                    </p>
                  </div>
                </div>
                )}

                {/* Regulation summary columns */}
                {pathway.regulationSummary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-muted/40 p-4 rounded-xl border border-border">
                    <h3 className="text-xs uppercase font-black text-foreground mb-3">Allosteric Factors</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-emerald-600 block mb-0.5">Activators (Turn ON):</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {pathway.regulationSummary?.activators?.map(a => (
                            <span key={a} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">{a}</span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="font-bold text-red-600 block mb-0.5">Inhibitors (Turn OFF):</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {pathway.regulationSummary?.inhibitors?.map(i => (
                            <span key={i} className="bg-red-500/10 text-red-700 dark:text-red-400 font-bold px-2 py-0.5 rounded text-[10px]">{i}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/40 p-4 rounded-xl border border-border flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs uppercase font-black text-foreground mb-2">Hormonal Control</h3>
                      <p className="text-[11px] leading-relaxed">{pathway.regulationSummary?.hormonalControl}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 italic pt-4">
                      * Hormonal effects act via kinase cascades modifying enzyme phosphorylation.
                    </p>
                  </div>
                </div>
                )}
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
                    {pathway.clinicalSignificance?.diseases?.map((dis, idx) => {
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
                      {pathway.clinicalSignificance?.drugTargets?.map((dt, idx) => (
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
                      {pathway.clinicalSignificance?.labFindings?.map((lf, idx) => (
                        <li key={idx} className="text-[11px] text-muted-foreground leading-normal">{lf}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* PHARMACY & EXAM TAB */}
            {activeTab === "pharmacy" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pharmacy Notes */}
                <div className="space-y-6">
                  {pathway.pharmacyNotes ? (
                    <>
                      <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl">
                        <h3 className="text-sm font-black uppercase text-purple-600 dark:text-purple-400 mb-2 flex items-center">
                          <Pill className="w-4 h-4 mr-2" />
                          Pharmacy Quick Notes
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{pathway.pharmacyNotes.whyStudy}</p>
                        <h4 className="text-[10px] font-bold uppercase text-foreground mb-1">Clinical Uses:</h4>
                        <p className="text-xs text-foreground mb-3">{pathway.pharmacyNotes.clinicalUses}</p>
                        
                        <div className="flex gap-4">
                          {pathway.pharmacyNotes.importantInhibitors && pathway.pharmacyNotes.importantInhibitors.length > 0 && (
                            <div className="flex-1">
                              <h4 className="text-[10px] font-bold uppercase text-red-500 mb-1">Key Inhibitors</h4>
                              <ul className="list-disc pl-4 space-y-1 text-[11px] text-foreground">
                                {pathway.pharmacyNotes.importantInhibitors.map(i => <li key={i}>{i}</li>)}
                              </ul>
                            </div>
                          )}
                          {pathway.pharmacyNotes.importantActivators && pathway.pharmacyNotes.importantActivators.length > 0 && (
                            <div className="flex-1">
                              <h4 className="text-[10px] font-bold uppercase text-green-500 mb-1">Key Activators</h4>
                              <ul className="list-disc pl-4 space-y-1 text-[11px] text-foreground">
                                {pathway.pharmacyNotes.importantActivators.map(a => <li key={a}>{a}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {pathway.pharmacyNotes.highYieldPoints.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                          <h3 className="text-sm font-black uppercase text-amber-600 dark:text-amber-500 mb-2 flex items-center">
                            <Flame className="w-4 h-4 mr-2" />
                            High-Yield Exam Points
                          </h3>
                          <ul className="list-disc pl-4 space-y-2 text-xs text-foreground font-medium">
                            {pathway.pharmacyNotes.highYieldPoints.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-muted-foreground italic p-4">Pharmacy notes pending verification.</div>
                  )}
                </div>

                {/* Memory Aids */}
                <div className="space-y-6">
                  {pathway.memoryAids ? (
                    <>
                      {pathway.memoryAids.mnemonics.length > 0 && (
                        <div className="bg-sky-500/5 border border-sky-500/20 p-4 rounded-xl">
                          <h3 className="text-sm font-black uppercase text-sky-600 dark:text-sky-400 mb-3 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Mnemonics & Memory Tricks
                          </h3>
                          <div className="space-y-3">
                            {pathway.memoryAids.mnemonics.map((m, i) => (
                              <div key={i} className="bg-muted/50 p-3 rounded text-xs font-bold text-foreground border-l-2 border-sky-500">{m}</div>
                            ))}
                            {pathway.memoryAids.tricks.map((t, i) => (
                              <p key={i} className="text-xs text-muted-foreground">{t}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {pathway.memoryAids.commonMistakes.length > 0 && (
                        <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl">
                          <h3 className="text-sm font-black uppercase text-orange-600 dark:text-orange-400 mb-2 flex items-center">
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Common Pitfalls
                          </h3>
                          <ul className="list-disc pl-4 space-y-2 text-[11px] text-muted-foreground">
                            {pathway.memoryAids.commonMistakes.map((c, i) => (
                              <li key={i}><span className="font-bold text-foreground block">Don't mix up:</span> {c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {pathway.pharmacyNotes?.commonQuestions && pathway.pharmacyNotes.commonQuestions.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-xs font-black uppercase text-foreground mb-2">Frequently Asked Viva Questions</h3>
                          <ul className="list-disc pl-4 space-y-1 text-[11px] text-muted-foreground">
                            {pathway.pharmacyNotes.commonQuestions.map((q, i) => <li key={i}>{q}</li>)}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-muted-foreground italic p-4">Memory aids pending verification.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

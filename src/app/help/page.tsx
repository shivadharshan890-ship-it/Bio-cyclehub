"use client";

import React, { useState, useEffect } from "react";
import { dbService, FAQItem } from "@/lib/db";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  HelpCircle, 
  Sparkles, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  User,
  GraduationCap
} from "lucide-react";

export default function HelpCenter() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // AI Assistant doubt solver state
  const [doubtText, setDoubtText] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Submit Doubt Form State
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [doubtTopic, setDoubtTopic] = useState("Carbohydrates");
  const [formQuestion, setFormQuestion] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setFaqs(dbService.getFAQs());
  }, []);

  const categories = ["All", "General", "Pathways", "Exams", "App"];

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Mock AI Doubt Solver Engine
  const handleSolveDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    setAiLoading(true);
    setAiAnswer(null);

    // Simulate thinking delay
    setTimeout(() => {
      const q = doubtText.toLowerCase();
      let answer = "";

      if (q.includes("fluoride") || q.includes("enolase")) {
        answer = `### Fluoride Inhibition of Enolase (Glycolysis Step 9)
In glycolysis, **Enolase** catalyzes the dehydration of 2-phosphoglycerate to phosphoenolpyruvate (PEP).
- **Mechanism:** Fluoride ions ($F^-$) bind to $Mg^{2+}$ ions in the active site of Enolase, forming a complex that blocks substrate binding.
- **Pharmacy Application:** Sodium fluoride is added to gray-top blood tubes. It halts glycolysis in red blood cells to prevent them from consuming glucose, allowing accurate blood glucose measurements in the lab.`;
      } else if (q.includes("metformin") || q.includes("diabetes")) {
        answer = `### Metformin and Gluconeogenesis Block
**Metformin** is the first-line medication for Type 2 Diabetes.
- **Mechanism:** It activates AMP-activated protein kinase (AMPK) in the liver. This leads to the transcriptional down-regulation of key gluconeogenesis enzymes, particularly **PEPCK** and **Glucose-6-phosphatase**.
- **Result:** Decreases hepatic glucose production, lowering fasting blood glucose without causing hypoglycemia.`;
      } else if (q.includes("lactate") || q.includes("cori") || q.includes("muscle")) {
        answer = `### Cori Lactic Acid Cycle
During anaerobic exercise, muscles undergo glycolysis, converting glucose to pyruvate, which is reduced to **Lactate** by Lactate Dehydrogenase (LDH-5) to recycle $NAD^+$.
- **Translocation:** Lactate is released into the blood and travels to the liver.
- **Hepatic Recycling:** Hepatocytes oxidize lactate back to pyruvate using LDH-1, which enters **gluconeogenesis** to regenerate glucose.
- **Energy Cost:** Muscle glycolysis yields 2 ATP, but liver gluconeogenesis consumes 6 ATP, resulting in a net cost of 4 ATP to prevent lactic acidosis.`;
      } else if (q.includes("ammonia") || q.includes("urea") || q.includes("hyperammonemia")) {
        answer = `### Ammonia Toxicity & Urea Cycle Disorders
Free ammonia ($NH_4^+$) is highly neurotoxic. In liver failure or genetic enzyme defects (e.g., OTC or CPS I deficiency), ammonia levels rise.
- **Mechanism of Injury:** Ammonia depletes $\\alpha$-ketoglutarate in astrocytes by forming glutamate/glutamine, blocking the Krebs cycle and depleting ATP, leading to brain edema.
- **Clinical Treatment:** Protein restriction, and **nitrogen scavengers** (Sodium Benzoate or Sodium Phenylbutyrate) which conjugate glycine and glutamine for urinary excretion, bypassing the urea cycle.`;
      } else if (q.includes("statin") || q.includes("cholesterol") || q.includes("hmg")) {
        answer = `### HMG-CoA Reductase and Statins
Cholesterol is synthesized in cytosol and smooth ER from Acetyl-CoA.
- **Rate-limiting step:** Conversion of HMG-CoA to Mevalonate by **HMG-CoA Reductase**, requiring 2 NADPH.
- **Drug Mechanism:** **Statins** (e.g. Atorvastatin) are competitive inhibitors that bind to the active site of HMG-CoA Reductase, blocking mevalonate synthesis.
- **Result:** Lowers cellular cholesterol, triggering transcription factor SREBP to increase hepatic LDL receptors, clearing bad cholesterol from blood.`;
      } else if (q.includes("thiamine") || q.includes("beriberi") || q.includes("b1")) {
        answer = `### Thiamine (Vitamin B1) Coenzyme Role
Thiamine pyrophosphate (TPP) is a critical decarboxylation cofactor for:
1. **Pyruvate Dehydrogenase (PDH):** Connects glycolysis to Krebs cycle.
2. **$\\alpha$-Ketoglutarate Dehydrogenase ($\\alpha$-KGDH):** Step 4 of the Krebs cycle.
- **Pathophysiology:** Thiamine deficiency (due to malnutrition or alcoholism) halts these reactions. Brain and heart suffer energy crises due to Krebs cycle block, causing **Beriberi** or **Wernicke-Korsakoff syndrome** with pyruvate and lactate accumulation.`;
      } else if (q.includes("g6pd") || q.includes("favism") || q.includes("anemia")) {
        answer = `### G6PD Deficiency & Oxidative Hemolysis
**Glucose-6-Phosphate Dehydrogenase (G6PD)** is the rate-limiting enzyme of the Pentose Phosphate Pathway (PPP).
- **Role:** Produces NADPH, which is essential to regenerate **reduced glutathione** in red blood cells. Reduced glutathione detoxifies reactive oxygen species ($H_2O_2$).
- **Deficiency:** X-linked G6PD deficiency prevents NADPH synthesis. Exposure to oxidants (fava beans, antimalarial drugs like primaquine) causes oxidative stress, denaturing hemoglobin (forming **Heinz bodies**) and triggering acute hemolytic anemia.`;
      } else if (q.includes("diphtheria") || q.includes("translation") || q.includes("pseudomembrane")) {
        answer = `### Diphtheria Toxin Translation Inhibition
*Corynebacterium diphtheriae* secretes Diphtheria Toxin.
- **Mechanism:** The toxin undergoes endocytosis, and its active subunit catalyzes the ADP-ribose transfer from $NAD^+$ to **Eukaryotic Elongation Factor 2 (eEF-2)** on ribosomes.
- **Result:** eEF-2 is inactivated, halting translocation during translation. Protein synthesis stops entirely, causing cell death and producing the grey pseudomembrane in the throat.`;
      } else if (q.includes("gout") || q.includes("uric") || q.includes("allopurinol")) {
        answer = `### Purine Degradation & Gout Pathology
Purine nucleotides (AMP, GMP) are degraded to hypoxanthine and xanthine, which are oxidized to **Uric Acid** by the enzyme **Xanthine Oxidase**.
- **Pathophysiology:** High uric acid (hyperuricemia) leads to sodium urate crystal deposition in joints, causing **Gout**.
- **Pharmacotherapy:** **Allopurinol** and **Febuxostat** are competitive inhibitors of Xanthine Oxidase, lowering uric acid production.`;
      } else if (q.includes("orotic") || q.includes("uridine")) {
        answer = `### Orotic Aciduria & Pyrimidine Synthesis
Orotic acid is an intermediate in pyrimidine nucleotide synthesis.
- **Defect:** Deficiency in **UMP Synthase** (Step 3) causes accumulation of orotic acid.
- **Clinical Signs:** Orotic aciduria, severe megaloblastic anemia (unresponsive to B12/folate) due to lack of pyrimidines for DNA, and growth delay.
- **Treatment:** Oral administration of **Uridine**, which is salvaged into UMP, bypassing the block and feed-back inhibiting CPS II.`;
      } else if (q.includes("antibiotic") || q.includes("tetracycline") || q.includes("erythromycin")) {
        answer = `### Antibiotic Inhibition of Ribosomal Translation
Many antibiotics selectively target bacterial 70S ribosomes (30S and 50S subunits) to inhibit translation:
- **Tetracyclines:** Bind the 30S subunit, blocking aminoacyl-tRNA from entering the A-site.
- **Aminoglycosides (Gentamicin):** Bind the 30S subunit, causing misreading of mRNA.
- **Macrolides (Erythromycin):** Bind the 50S subunit, blocking peptidyl transferase and ribosome translocation.`;
      } else if (q.includes("acetaminophen") || q.includes("paracetamol") || q.includes("napqi")) {
        answer = `### Acetaminophen (Paracetamol) Toxicity
Normally, paracetamol is conjugated via Phase II pathways (glucuronidation/sulfation).
- **Overdose:** Phase II pathways saturate. Excess paracetamol is oxidized by CYP2E1 (Phase I) to form **NAPQI**, a highly reactive hepatotoxic compound.
- **Pathology:** NAPQI depletes liver **glutathione**, binding to hepatocyte proteins and causing acute liver necrosis.
- **Antidote:** **N-Acetylcysteine (NAC)** is administered to replenish hepatic glutathione stores and safely conjugate NAPQI.`;
      } else {
        answer = `### Doubt Solver Search Result
Thank you for your inquiry. Based on the B.Pharmacy biochemistry syllabus:
- Your query is related to **cellular metabolic cycles**. 
- We recommend verifying the specific enzyme cofactor requirements (e.g., Vitamin B-complex, ATP, Magnesium) or check the **Study Notes** for structured outlines.
- If you need a detailed response from a faculty member, please fill out the **Submit Doubt to Faculty** form below!`;
      }

      setAiAnswer(answer);
      setAiLoading(false);
    }, 1200);
  };

  // Submit Doubt to Faculty Form Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !formQuestion) return;

    setFormSubmitted(true);
    setTimeout(() => {
      setStudentName("");
      setStudentEmail("");
      setFormQuestion("");
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Section */}
        <section className="text-left space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center">
            <HelpCircle className="h-7 w-7 mr-2 text-primary animate-pulse" />
            Biochemistry Help Center
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Clear your metabolic doubts instantly. Search our frequently asked questions, consult our simulated AI study assistant, or submit a question directly to our pharmacy professors.
          </p>
        </section>

        {/* 1. AI STUDY ASSISTANT SIMULATION */}
        <section className="bg-card border border-border p-6 rounded-3xl shadow-md relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute right-0 top-0 h-40 w-40 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-2.5 mb-4 border-b border-border/80 pb-3">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Interactive Doubt Solver</h3>
              <p className="text-[10px] text-muted-foreground">Type a metabolic pathway doubt for an instant structured analysis</p>
            </div>
          </div>

          <form onSubmit={handleSolveDoubt} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder="e.g. Why does fluoride inhibit enolase? OR tell me about G6PD anemia..."
                className="flex-1 p-3.5 rounded-xl border border-border bg-muted/30 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                disabled={aiLoading || !doubtText.trim()}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-primary/10 disabled:opacity-40"
              >
                {aiLoading ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <span>Resolve Doubt</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Output Area */}
          <AnimatePresence>
            {aiAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-5 rounded-2xl bg-muted/50 border border-border text-left space-y-3 prose prose-sm max-w-none text-xs leading-relaxed"
              >
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-primary tracking-wider border-b border-border pb-2 mb-2">
                  <Sparkles className="h-4 w-4 text-accent fill-accent/15" />
                  <span>AI Study Assistant Explanation</span>
                </div>
                
                {/* Parse simple markdown in output */}
                {aiAnswer.split("\n").map((line, idx) => {
                  if (line.startsWith("### ")) {
                    return <h4 key={idx} className="font-extrabold text-foreground text-sm mt-3 mb-1.5">{line.substring(4)}</h4>;
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <ul key={idx} className="list-disc list-inside pl-2 space-y-1 my-1.5 text-muted-foreground">
                        <li dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
                      </ul>
                    );
                  }
                  return <p key={idx} className="text-muted-foreground leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: line }} />;
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 2. FAQ ACCORDION SECTION */}
        <section className="space-y-4">
          <div>
            <h2 className="text-md font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-foreground">Browse curriculum guidelines and platform tutorials</p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-3.5 rounded-2xl shadow-sm">
            <div className="flex bg-muted p-0.5 rounded-lg overflow-x-auto w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-[10px] font-bold rounded-md whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 border border-border bg-muted/40 rounded-lg focus-within:ring-1 focus-within:ring-primary/50 transition">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter FAQs by keyword..."
                className="w-full pl-8 pr-4 py-1.5 text-[11px] text-foreground bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-4 flex justify-between items-center hover:bg-muted/10 transition-colors"
                    >
                      <span className="text-xs font-bold text-foreground pr-4 leading-tight">{faq.question}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8 text-center text-xs text-muted-foreground">
                No FAQs matched your filter query. Ask the AI assistant above instead!
              </div>
            )}
          </div>
        </section>

        {/* 3. SUBMIT DOUBT TO FACULTY */}
        <section className="bg-card border border-border p-6 rounded-3xl shadow-sm max-w-xl mx-auto space-y-5">
          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <MessageSquare className="h-5 w-5 text-accent" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Submit Doubt to Faculty</h3>
              <p className="text-[10px] text-muted-foreground">Submit complex biochemistry questions to university professors</p>
            </div>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-500 animate-bounce" />
              <h4 className="text-sm font-bold">Doubt Submitted Successfully</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Thank you. Your question has been routed to our clinical pharmacy department. A biochemistry professor will respond to your email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Your Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full p-2.5 border border-border rounded-lg bg-card focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full p-2.5 border border-border rounded-lg bg-card focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Curriculum Topic</label>
                <select
                  value={doubtTopic}
                  onChange={(e) => setDoubtTopic(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-lg bg-card focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs font-bold"
                >
                  <option value="Carbohydrates">Carbohydrate Metabolism</option>
                  <option value="Lipids">Lipid Metabolism</option>
                  <option value="Proteins">Protein & Amino Acid Metabolism</option>
                  <option value="Nucleotides">Purine & Pyrimidine Metabolism</option>
                  <option value="Drugs">Xenobiotic / Drug Clearance</option>
                  <option value="Other">General / Exam Preparation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Doubt Details</label>
                <textarea
                  required
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Explain your doubt in detail. Mention specific reaction steps or enzymes if applicable..."
                  className="w-full p-2.5 border border-border rounded-lg bg-card focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-bold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition shadow-md shadow-accent/10"
              >
                <Send className="h-4 w-4" />
                <span>Submit Question</span>
              </button>
            </form>
          )}
        </section>

      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { dbService, StudyNote } from "@/lib/db";
import Header from "@/components/Header";
import { 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  ChevronRight, 
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  Eye
} from "lucide-react";

export default function StudyNotes() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [highlightActive, setHighlightActive] = useState(false);

  // Load notes
  useEffect(() => {
    const list = dbService.getNotes();
    setNotes(list);
    if (list.length > 0) {
      setSelectedSlug(list[0].slug);
    }
  }, []);

  const activeNote = notes.find(n => n.slug === selectedSlug);

  const handleBookmarkToggle = (slug: string) => {
    const updated = dbService.toggleNoteBookmark(slug);
    setNotes(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  // Simple custom markdown parser to render basic styling
  const renderMarkdown = (content: string) => {
    if (!content) return null;

    let text = content;

    // If highlight switch is toggled, insert highlights for key biochemistry terms
    if (highlightActive) {
      const keywords = [
        "Hexokinase", "Glucokinase", "Phosphofructokinase-1", "PFK-1", "Pyruvate Kinase", "Enolase",
        "Isocitrate Dehydrogenase", "Aconitase", "alpha-Ketoglutarate Dehydrogenase", "Succinate Dehydrogenase",
        "Carbamoyl Phosphate Synthetase I", "CPS I", "Ornithine Transcarbamoylase", "OTC", "Arginase",
        "Lactic Acidosis", "Tarui disease", "Pyruvate Kinase Deficiency", "Beriberi", "Wernicke-Korsakoff",
        "hyperammonemia", "OTC Deficiency", "Fluoride", "Arsenate", "Thiamine", "N-Acetylglutamate", "NAG",
        "substrate-level phosphorylation"
      ];
      
      // Escape special regex chars and replace safely
      keywords.forEach(keyword => {
        const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b(${escaped})(?!([^<]*>))\\b`, 'gi');
        text = text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600/50 text-foreground px-0.5 rounded font-semibold">$1</mark>');
      });
    }

    const lines = text.split("\n");
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    return lines.map((line, idx) => {
      // 1. Headers
      if (line.startsWith("# ")) {
        inTable = false;
        return <h1 key={idx} className="text-xl sm:text-2xl font-black text-foreground border-b border-border pb-2 mt-6 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        inTable = false;
        return <h2 key={idx} className="text-lg font-bold text-foreground mt-5 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        inTable = false;
        return <h3 key={idx} className="text-sm font-bold text-primary mt-4 mb-2">{line.substring(4)}</h3>;
      }

      // 2. Table Parsing
      if (line.startsWith("|")) {
        const cells = line.split("|").map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
        if (line.includes("---")) {
          // Alignment row, ignore
          return null;
        }
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
          tableRows = [];
          return null; // Don't render yet
        } else {
          tableRows.push(cells);
          // If next line is not a table, render table, else return null to accumulate
          const nextLine = lines[idx + 1];
          if (!nextLine || !nextLine.startsWith("|")) {
            inTable = false;
            return (
              <div key={idx} className="overflow-x-auto my-4 border border-border rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-border text-xs">
                  <thead className="bg-muted/50 text-[10px] font-black uppercase text-muted-foreground">
                    <tr>
                      {tableHeaders.map((h, i) => (
                        <th key={i} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {tableRows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-muted/10">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 font-medium text-foreground" dangerouslySetInnerHTML={{ __html: cell }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        }
      }

      // 3. Lists
      if (line.startsWith("* ") || line.startsWith("- ")) {
        inTable = false;
        return (
          <ul key={idx} className="list-disc list-inside space-y-1 my-2.5 pl-2 text-xs">
            <li dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
          </ul>
        );
      }
      if (line.startsWith("- `[ ]` ") || line.startsWith("- `[x]` ")) {
        inTable = false;
        const isChecked = line.includes("`[x]`");
        return (
          <div key={idx} className="flex items-center space-x-2 my-1 text-xs">
            <input type="checkbox" checked={isChecked} readOnly className="h-3.5 w-3.5 rounded border-border" />
            <span className={isChecked ? "line-through text-muted-foreground" : "text-foreground"} dangerouslySetInnerHTML={{ __html: line.substring(8) }} />
          </div>
        );
      }

      // 4. Code / Equation Block
      if (line.startsWith("`") && line.endsWith("`")) {
        inTable = false;
        return (
          <code key={idx} className="block bg-muted p-2 rounded-lg my-2 font-mono text-[10px] text-primary" dangerouslySetInnerHTML={{ __html: line.replaceAll("`", "") }} />
        );
      }

      // 5. Blank line
      if (!line.trim()) return <div key={idx} className="h-3" />;

      // 6. Regular paragraph
      inTable = false;
      return (
        <p key={idx} className="my-2.5 text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950/20">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Notes Sidebar (hidden during printing) */}
        <section className="w-full md:w-80 shrink-0 space-y-4 print:hidden">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-foreground">Exam Notes</h1>
            <p className="text-[11px] text-muted-foreground">High-yield summary sheets for pharmacy exams</p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
            {notes.map(n => {
              const active = n.slug === selectedSlug;
              return (
                <button
                  key={n.slug}
                  onClick={() => setSelectedSlug(n.slug)}
                  className={`w-full text-left p-4 flex justify-between items-center transition ${
                    active ? "bg-primary/5 text-primary" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="space-y-1 max-w-[210px]">
                    <h3 className={`text-xs font-bold leading-tight truncate ${active ? "text-primary" : "text-foreground"}`}>
                      {n.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[9px] text-muted-foreground">
                      <span className="capitalize">{n.category.split(" ")[0]}</span>
                      <span>•</span>
                      <span>{n.readingTime}</span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${active ? "text-primary translate-x-1" : "text-muted-foreground"}`} />
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Side: Active Reader Container */}
        {activeNote ? (
          <section className="flex-grow bg-card border border-border rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col justify-between relative print:border-none print:shadow-none print:p-0">
            {/* Top Toolbar controls (hidden during printing) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6 print:hidden">
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => handleBookmarkToggle(activeNote.slug)}
                  className="hover:bg-muted border border-border p-2 rounded-xl text-muted-foreground hover:text-foreground transition shadow-sm"
                  title="Bookmark Study Note"
                >
                  {activeNote.bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>

                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="hover:bg-muted border border-border p-2 rounded-xl text-muted-foreground hover:text-foreground transition shadow-sm flex items-center space-x-1.5 text-xs font-bold"
                  title="Print Note (PDF)"
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>
              </div>

              {/* Highlighter switch */}
              <div className="flex items-center space-x-2 text-xs bg-muted/40 p-2 rounded-xl border border-border">
                <span className="font-semibold text-muted-foreground">Highlight Key Terms</span>
                <button
                  onClick={() => setHighlightActive(!highlightActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    highlightActive ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      highlightActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Note Body */}
            <article className="flex-1 max-w-none text-left prose prose-sm prose-slate dark:prose-invert">
              {renderMarkdown(activeNote.content)}
            </article>

            {/* Reading feedback block (hidden during printing) */}
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-semibold print:hidden">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Verified Syllabus Content</span>
              </div>
              <span className="bg-muted px-2.5 py-0.5 rounded-full">{activeNote.readingTime}</span>
            </div>
          </section>
        ) : (
          <section className="flex-grow bg-card border border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground mb-2 animate-pulse" />
            <h3 className="text-md font-bold">No note selected</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Please choose a study note from the left panel.</p>
          </section>
        )}

      </main>
    </div>
  );
}

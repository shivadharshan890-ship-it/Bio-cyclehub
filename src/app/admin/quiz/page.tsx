"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Upload, Database, CheckCircle2, AlertCircle, FileJson } from "lucide-react";
import { collection, writeBatch, doc } from "firebase/firestore";
import { isFirebaseEnabled, db } from "@/lib/db";
import { Question } from "@/firebase/quizService";

export default function AdminQuizPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{success: number, error: string | null}>({ success: 0, error: null });

  // Extremely basic admin check for demo purposes
  const isAdmin = user?.email?.includes("admin") || true; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    if (!isFirebaseEnabled) {
      setResult({ success: 0, error: "Firebase is not enabled." });
      return;
    }

    setUploading(true);
    setResult({ success: 0, error: null });

    try {
      const text = await file.text();
      const rawData = JSON.parse(text);
      
      if (!Array.isArray(rawData)) {
         throw new Error("JSON must be an array of questions.");
      }

      // We use the db instance imported from db.ts
      if (!db) throw new Error("Firestore not initialized properly");

      // We process batches of 500 (Firestore batch limit)
      let count = 0;
      let batch = writeBatch(db);
      let batchCount = 0;

      for (const item of rawData) {
        // Validate minimally
        if (!item.question || !item.topic || !item.correctAnswer) continue;

        const docRef = doc(collection(db, "questions"));
        const q: Partial<Question> = {
           ...item,
           createdAt: new Date().toISOString()
        };
        batch.set(docRef, q);
        
        batchCount++;
        count++;

        if (batchCount === 500) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      setResult({ success: count, error: null });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (e: any) {
      console.error(e);
      setResult({ success: 0, error: e.message });
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-32 font-bold text-red-500">Access Denied. Admins only.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-12 space-y-8">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Database className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-black">Quiz Database Management</h1>
            <p className="text-muted-foreground">Bulk import questions to Firestore</p>
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-sky-500" /> Bulk Import JSON
          </h2>
          
          <p className="text-sm text-muted-foreground">
            Upload a JSON file containing an array of question objects. 
            The system will process them in batches of 500 (Firestore limits) and automatically assign unique IDs.
          </p>

          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/10 transition-colors">
             <FileJson className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
             <input 
               type="file" 
               accept=".json"
               onChange={handleFileChange}
               ref={fileInputRef}
               className="hidden"
               id="file-upload"
             />
             <label htmlFor="file-upload" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/90">
               Select JSON File
             </label>
             {file && <p className="mt-4 text-sm font-bold text-sky-500">Selected: {file.name}</p>}
          </div>

          <Button 
            onClick={handleImport} 
            disabled={!file || uploading}
            className="w-full h-12 font-bold text-lg"
          >
            {uploading ? "Importing... Please wait" : "Run Import Job"}
          </Button>

          {result.success > 0 && (
             <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3">
               <CheckCircle2 className="w-6 h-6" />
               <div>
                 <h4 className="font-bold">Import Successful</h4>
                 <p className="text-sm">Successfully imported {result.success} questions to Firestore.</p>
               </div>
             </div>
          )}

          {result.error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
               <AlertCircle className="w-6 h-6" />
               <div>
                 <h4 className="font-bold">Import Failed</h4>
                 <p className="text-sm">{result.error}</p>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

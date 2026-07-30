import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import ChatAssistant from "@/components/ChatAssistant";

export const metadata: Metadata = {
  title: "BioCycle Hub | Master B.Pharmacy Biochemistry Pathways",
  description: "Learn and visualize metabolic pathways (Glycolysis, Krebs Cycle, Urea Cycle) step-by-step. Interactive diagrams, custom quizzes, B.Pharmacy exam-focused study notes, and smart flashcards.",
  keywords: ["biochemistry", "pharmacy", "glycolysis", "krebs cycle", "urea cycle", "B.Pharmacy", "metabolic pathways", "flashcards", "quizzes"],
  authors: [{ name: "BioCycle Hub" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ChatAssistant />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

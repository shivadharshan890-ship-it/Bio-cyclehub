const pptxgen = require("pptxgenjs");

let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Slide 1: Title Slide
let slide1 = pptx.addSlide();
slide1.background = { color: "0F172A" }; // dark background
slide1.addText("BioCycle Hub", { x: 1, y: 2, w: '80%', fontSize: 48, color: "06B6D4", bold: true, align: "center" });
slide1.addText("Learn. Visualize. Master Biochemistry.", { x: 1, y: 3.5, w: '80%', fontSize: 24, color: "FFFFFF", align: "center" });
slide1.addText("Dedicated to B.Pharmacy & Medical Students", { x: 1, y: 4.5, w: '80%', fontSize: 16, color: "10B981", align: "center", italic: true });

// Slide 2: What is BioCycle Hub?
let slide2 = pptx.addSlide();
slide2.addText("What is BioCycle Hub?", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide2.addText([
    { text: "A modern platform to stop memorizing static textbooks.\n", options: { bullet: true } },
    { text: "Explore interactive metabolic processes inside our 3D animated Medicine Factory.\n", options: { bullet: true } },
    { text: "Test GPAT preparation with quizzes, flashcards, and study notes.\n", options: { bullet: true } },
    { text: "Built to help students excel in pharmacy exams.\n", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333", lineSpacing: 36 });

// Slide 3: Syllabus Aligned
let slide3 = pptx.addSlide();
slide3.addText("Syllabus Aligned", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide3.addText("Strictly mapped based on the Pharmacy Council of India (PCI) syllabus for Biochemistry.", { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333" });
slide3.addText([
    { text: "Covers 27 core pathways.", options: { bullet: true } },
    { text: "Includes clinical linkages and rate-limiting regulatory steps.", options: { bullet: true } },
    { text: "Designed specifically for B.Pharm and Pharm.D students.", options: { bullet: true } }
], { x: 0.5, y: 2.5, w: '90%', fontSize: 20, color: "333333", lineSpacing: 36 });

// Slide 4: Key Statistics
let slide4 = pptx.addSlide();
slide4.addText("Platform Impact & Statistics", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide4.addText("20+", { x: 1, y: 2, w: 2, fontSize: 44, color: "06B6D4", bold: true, align: "center" });
slide4.addText("Pathways Mapped", { x: 1, y: 3, w: 2, fontSize: 16, color: "666666", align: "center", bold: true });

slide4.addText("1,500+", { x: 3, y: 2, w: 2, fontSize: 44, color: "10B981", bold: true, align: "center" });
slide4.addText("Flashcards Flipped", { x: 3, y: 3, w: 2, fontSize: 16, color: "666666", align: "center", bold: true });

slide4.addText("800+", { x: 5, y: 2, w: 2, fontSize: 44, color: "F59E0B", bold: true, align: "center" });
slide4.addText("GPAT Quiz Prep", { x: 5, y: 3, w: 2, fontSize: 16, color: "666666", align: "center", bold: true });

slide4.addText("98%", { x: 7, y: 2, w: 2, fontSize: 44, color: "6366F1", bold: true, align: "center" });
slide4.addText("Exam Success Rate", { x: 7, y: 3, w: 2, fontSize: 16, color: "666666", align: "center", bold: true });

// Slide 5: Interactive Visualizations
let slide5 = pptx.addSlide();
slide5.addText("Interactive Visualizations", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide5.addText("Instead of staring at complex equations, students can toggle modes:", { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333" });
slide5.addText([
    { text: "Medicine Factory Theme: Watch molecules move along animated conveyor belts.", options: { bullet: true } },
    { text: "Cyber Neon Theme: A modern visual approach to metabolic loops.", options: { bullet: true } },
    { text: "Visual memory helps retain complex enzymes and pathways better than regular textbooks.", options: { bullet: true } }
], { x: 0.5, y: 2.5, w: '90%', fontSize: 20, color: "333333", lineSpacing: 36 });

// Slide 6: GPAT Exam Focused
let slide6 = pptx.addSlide();
slide6.addText("GPAT Exam Focused", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide6.addText([
    { text: "Highlight clinical relevance (diseases, drugs, targets).\n", options: { bullet: true } },
    { text: "High-yield exam tips to prepare for state and national qualification exams.\n", options: { bullet: true } },
    { text: "Direct connections between rate-limiting enzymes and drug targets (e.g., Enolase fluoride inhibition).\n", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333", lineSpacing: 36 });

// Slide 7: Core Learning Categories
let slide7 = pptx.addSlide();
slide7.addText("Core Learning Categories", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide7.addText([
    { text: "Carbohydrate Metabolism (9 Core Cycles)", options: { bullet: true } },
    { text: "Lipid Metabolism (4 Core Cycles)", options: { bullet: true } },
    { text: "Protein Metabolism (5 Core Cycles)", options: { bullet: true } },
    { text: "Nucleotide Metabolism (2 Core Cycles)", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 22, color: "333333", lineSpacing: 40 });

// Slide 8: Gamified Learning
let slide8 = pptx.addSlide();
slide8.addText("Gamified Learning Experience", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide8.addText([
    { text: "Study Streak & Level System similar to Duolingo.\n", options: { bullet: true } },
    { text: "Reward consistent learning: Earn XP by completing steps, flipping flashcards, or mastering quizzes.\n", options: { bullet: true } },
    { text: "Maintain daily streaks to level up biochemical rank.\n", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333", lineSpacing: 36 });

// Slide 9: Comprehensive Study Notes
let slide9 = pptx.addSlide();
slide9.addText("Comprehensive Study Notes", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide9.addText([
    { text: "Downloadable study notes for exam preparation.\n", options: { bullet: true } },
    { text: "Detailed exam tables summarizing net ATP yield, location, and key enzymes.\n", options: { bullet: true } },
    { text: "Printable cheat-sheets for sessional or university exams.\n", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333", lineSpacing: 36 });

// Slide 10: Daily Learning Tips
let slide10 = pptx.addSlide();
slide10.addText("Daily Learning Tips", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide10.addText("Every day a new high-yield fact is presented, for example:", { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333" });
slide10.addText('"Mature Red Blood Cells (RBCs) lack mitochondria and rely 100% on anaerobic glycolysis to generate ATP. A pyruvate kinase deficiency directly triggers hemolytic anemia."', { x: 1, y: 2.5, w: '80%', fontSize: 22, color: "06B6D4", italic: true, align: "center" });

// Slide 11: Instant Search Engine
let slide11 = pptx.addSlide();
slide11.addText("Instant Search Engine", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide11.addText([
    { text: "Search across pathways, enzymes, drugs, diseases, and cofactors in real-time.\n", options: { bullet: true } },
    { text: "Quickly locate specific rate-limiting steps or clinical significance notes.\n", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: "333333", lineSpacing: 36 });

// Slide 12: Testimonials - Student Success
let slide12 = pptx.addSlide();
slide12.addText("Student Success", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide12.addText('"BioCycle Hub transformed biochemistry from my worst subject to my highest scorer! The Medicine Factory theme helped me remember all rate-limiting enzymes easily."\n- Aditya Sharma, B.Pharm 2nd Year Student', { x: 0.5, y: 1.5, w: '90%', fontSize: 18, color: "333333", italic: true });
slide12.addText('"I used the Flashcards and dynamic Step Quizzes daily. The clinical links are direct questions on GPAT exams."\n- Priyanka Patel, GPAT 2026 Aspirant', { x: 0.5, y: 3, w: '90%', fontSize: 18, color: "333333", italic: true });

// Slide 13: Testimonials - Educator Feedback
let slide13 = pptx.addSlide();
slide13.addText("Educator Feedback", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide13.addText('"This tool is a brilliant pedagogical asset. Watching metabolic loops rotate and pathways animate provides deep visual understanding that regular textbooks fail to deliver." \n\n- Prof. Rajesh Mehta, HOD Pharmaceutical Chemistry', { x: 0.5, y: 2, w: '90%', fontSize: 22, color: "333333", italic: true, align: "center" });

// Slide 14: How to get started?
let slide14 = pptx.addSlide();
slide14.addText("How to get started?", { x: 0.5, y: 0.5, fontSize: 36, color: "0F172A", bold: true });
slide14.addText([
    { text: "1. Create a free student profile.\n", options: { bullet: false } },
    { text: "2. Explore the 20+ pathways.\n", options: { bullet: false } },
    { text: "3. Flip flashcards and take practice quizzes.\n", options: { bullet: false } },
    { text: "4. Download study notes and cheat sheets.\n", options: { bullet: false } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 24, color: "333333", lineSpacing: 40 });

// Slide 15: Call to Action
let slide15 = pptx.addSlide();
slide15.background = { color: "0F172A" };
slide15.addText("Ready to boost your exam score?", { x: 1, y: 2, w: '80%', fontSize: 44, color: "FFFFFF", bold: true, align: "center" });
slide15.addText("Sign Up for Free & Take a Practice Quiz Today", { x: 1, y: 3.5, w: '80%', fontSize: 24, color: "06B6D4", align: "center" });

pptx.writeFile({ fileName: "BioCycleHub_Presentation.pptx" }).then(fileName => {
    console.log("created file: " + fileName);
});

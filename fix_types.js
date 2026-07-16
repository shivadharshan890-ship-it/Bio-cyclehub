const fs = require('fs');
const files = [
  'src/lib/data/carbohydrates.ts',
  'src/lib/data/lipids.ts',
  'src/lib/data/proteins.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/cellular:/g, 'cellularLocation:');
  fs.writeFileSync(file, content, 'utf8');
}

let dbContent = fs.readFileSync('src/lib/db.ts', 'utf8');

const missingMethods = `
  getStaticPathways: (): Pathway[] => {
    return INITIAL_PATHWAYS;
  },
  getStaticNotes: (): StudyNote[] => {
    return INITIAL_NOTES;
  },
  getStaticFlashcards: (): Flashcard[] => {
    return INITIAL_FLASHCARDS;
  },
  toggleNoteBookmark: (slug: string): void => {
    console.log("Mock toggleNoteBookmark", slug);
  },
  toggleFlashcardBookmark: (id: string): void => {
    console.log("Mock toggleFlashcardBookmark", id);
  },
  updateFlashcardLeitner: (id: string, state: any): void => {
    console.log("Mock updateFlashcardLeitner", id, state);
  },
`;

dbContent = dbContent.replace(
  '  getPathwayBySlug: (slug: string): Pathway | undefined => {',
  missingMethods + '\n  getPathwayBySlug: (slug: string): Pathway | undefined => {'
);

fs.writeFileSync('src/lib/db.ts', dbContent, 'utf8');
console.log('Fixed types and db methods.');

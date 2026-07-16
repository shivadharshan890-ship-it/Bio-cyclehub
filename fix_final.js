const fs = require('fs');
const files = [
  'src/lib/data/carbohydrates.ts',
  'src/lib/data/lipids.ts',
  'src/lib/data/proteins.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/tissue:/g, 'organ:');
  fs.writeFileSync(file, content, 'utf8');
}

let dbContent = fs.readFileSync('src/lib/db.ts', 'utf8');

// Change return type of toggleNoteBookmark to StudyNote[]
dbContent = dbContent.replace(
  'toggleNoteBookmark: (slug: string): void => {',
  'toggleNoteBookmark: (slug: string): StudyNote[] => {'
);
dbContent = dbContent.replace(
  'console.log("Mock toggleNoteBookmark", slug);',
  'console.log("Mock toggleNoteBookmark", slug); return INITIAL_NOTES;'
);

fs.writeFileSync('src/lib/db.ts', dbContent, 'utf8');
console.log('Fixed tissue and toggleNoteBookmark.');

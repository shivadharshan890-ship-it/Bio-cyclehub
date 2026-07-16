const fs = require('fs');
const files = [
  'src/lib/data/carbohydrates.ts',
  'src/lib/data/lipids.ts',
  'src/lib/data/proteins.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/cellularLocation:/g, 'cellType: "Various cells",\n      cellularLocation:');
  fs.writeFileSync(file, content, 'utf8');
}

console.log('Fixed cellType.');

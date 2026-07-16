const fs = require('fs');

const slug = process.argv[2];
const newReactionsFile = process.argv[3];

if (!slug || !newReactionsFile) {
  console.error("Usage: node update_reactions.js <slug> <newReactions.json>");
  process.exit(1);
}

const newReactions = fs.readFileSync(newReactionsFile, 'utf8');

let dbContent = fs.readFileSync('src/lib/db.ts', 'utf8');

// The regex needs to find the specific pathway object and replace its reactions array.
// We look for: slug: "slugName", ... reactions: [ ... ]
const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?reactions:\\s*\\[)[\\s\\S]*?(\\]\\s*,\\s*(?:summaryCard|overview|learningTips|clinicalSignificance|}))`, 'g');

let replaced = false;
dbContent = dbContent.replace(regex, (match, p1, p2) => {
  replaced = true;
  // p1 is everything up to "reactions: ["
  // p2 is everything from "]" onwards
  // Since newReactions contains the full array WITH brackets, we just replace the inner part.
  // Wait, if newReactions is a JSON string of an array: [ {step:1...}, {step:2...} ]
  // Let's just replace the whole array.
  
  // We need to strip the outer brackets from newReactions to fit between p1 and p2 if p1 and p2 include the brackets.
  // Actually, p1 ends with "reactions: [" and p2 starts with "]".
  // So we just need the inside of the array.
  let innerContent = newReactions.trim();
  if (innerContent.startsWith('[')) innerContent = innerContent.substring(1);
  if (innerContent.endsWith(']')) innerContent = innerContent.substring(0, innerContent.length - 1);
  
  return p1 + '\n' + innerContent + '\n      ' + p2;
});

if (replaced) {
  fs.writeFileSync('src/lib/db.ts', dbContent, 'utf8');
  console.log(`Successfully updated reactions for ${slug}`);
} else {
  console.error(`Failed to find reactions array for ${slug}`);
  process.exit(1);
}

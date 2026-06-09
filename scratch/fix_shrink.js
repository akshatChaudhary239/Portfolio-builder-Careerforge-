const fs = require('fs');
const path = require('path');

const dir = 'c:/Projects/Portfolio builder/src/components/premiumTemplates/leadership';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix double space-y replacements
  content = content.replace(/space-y-1\.5 print:space-y-0\.5 print:space-y-1/g, 'space-y-2 print:space-y-1');
  
  // Fix double leading replacements
  content = content.replace(/leading-relaxed print:leading-snug print:leading-tight/g, 'leading-relaxed print:leading-snug');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${file}`);
}

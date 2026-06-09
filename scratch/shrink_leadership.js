const fs = require('fs');
const path = require('path');

const dir = 'c:/Projects/Portfolio builder/src/components/premiumTemplates/leadership';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace margins
  content = content.replace(/className="mb-4"/g, 'className="mb-3 print:mb-1.5"');
  
  // Reduce space-y 
  content = content.replace(/space-y-3/g, 'space-y-2 print:space-y-1');
  content = content.replace(/space-y-2/g, 'space-y-1.5 print:space-y-0.5');
  
  // Reduce line-heights for print
  content = content.replace(/leading-relaxed/g, 'leading-relaxed print:leading-snug');
  content = content.replace(/leading-snug/g, 'leading-snug print:leading-tight');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}

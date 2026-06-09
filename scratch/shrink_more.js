const fs = require('fs');
const path = require('path');

const dir = 'c:/Projects/Portfolio builder/src/components/premiumTemplates/leadership';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Reduce margins further
  content = content.replace(/print:mb-1\.5/g, 'print:mb-1');
  
  // Reduce spacing further
  content = content.replace(/print:space-y-1/g, 'print:space-y-0.5');
  
  // Reduce text sizes for print
  content = content.replace(/text-\[10\.5px\]/g, 'text-[10.5px] print:text-[9.5px]');
  content = content.replace(/text-\[11px\]/g, 'text-[11px] print:text-[10px]');
  content = content.replace(/text-\[12px\]/g, 'text-[12px] print:text-[11px]');
  content = content.replace(/text-\[10px\]/g, 'text-[10px] print:text-[9px]');
  
  // Header text sizes
  content = content.replace(/text-3xl/g, 'text-3xl print:text-2xl');
  content = content.replace(/text-sm/g, 'text-sm print:text-xs');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}

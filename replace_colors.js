const fs = require('fs');
const path = require('path');

const dir = 'src/components/portfolioTemplates/sections';

const replacements = [
  // Primary / Secondary Text
  { match: /\btext-(?:blue|fuchsia|purple|orange)-(?:400|500|600)\b/g, replace: 'text-[var(--color-primary)]' },
  { match: /\btext-(?:blue|fuchsia|purple|orange)-(?:200|300)\b/g, replace: 'text-[var(--color-secondary)]' },
  
  // Gradients
  { match: /\bfrom-(?:blue|fuchsia|purple|orange)-(?:400|500|600)\b/g, replace: 'from-[var(--color-primary)]' },
  { match: /\bvia-(?:blue|fuchsia|purple|orange)-(?:400|500|600)\b/g, replace: 'via-[var(--color-secondary)]' },
  { match: /\bto-(?:blue|fuchsia|purple|orange)-(?:400|500|600)\b/g, replace: 'to-[var(--color-primary)]' },
  
  // Text Neutral (White/Black/Slate)
  { match: /\btext-(?:white|black|\[#FAFAFA\]|\[#111111\]|\[#111\]|\[#EFEFEF\]|\[#EAEAEA\]|slate-100|slate-900|slate-800)\b/g, replace: 'text-[var(--color-text)]' },
  
  // Text Muted
  { match: /\btext-(?:\[#555555\]|\[#555\]|\[#777\]|\[#888\]|\[#A0A8B0\]|\[#CCCCCC\]|slate-300|slate-400|slate-500|gray-400|gray-500)\b/g, replace: 'text-[var(--color-muted)]' },
  
  // Section Backgrounds
  // Usually these are main section bgs
  { match: /\bbg-(?:slate-900|\[#0C1016\]|\[#FAFAFA\]|\[#111111\]|\[#050505\]|\[#0A0D14\])\b/g, replace: 'bg-transparent' },
  
  // Surface / Card Backgrounds
  { match: /\bbg-(?:slate-800|\[#1E242C\]|\[#1A1A1A\]|\[#222222\]|\[#222\]|white\/5|black\/5)\b/g, replace: 'bg-[var(--color-surface)]' },
  
  // Borders
  { match: /\bborder-(?:\[#111\]|\[#EAEAEA\]|\[#333\]|slate-700|slate-800|white\/10|white\/5|black\/10)\b/g, replace: 'border-[var(--color-text)]\/10' },
  
  // Background Accents / Buttons
  { match: /\bbg-(?:blue|fuchsia|purple|orange)-(?:500|600)\b/g, replace: 'bg-[var(--color-primary)]' },
];

let filesChanged = 0;

function walk(current) {
  if (fs.statSync(current).isDirectory()) {
    fs.readdirSync(current).forEach(f => walk(path.join(current, f)));
  } else if (current.endsWith('.tsx')) {
    let content = fs.readFileSync(current, 'utf8');
    let original = content;
    
    replacements.forEach(({ match, replace }) => {
      content = content.replace(match, replace);
    });
    
    // Hand-coded edge cases (e.g., hover states, text inversion)
    // We want text-[var(--color-text)] to be readable if it's on a bg-[var(--color-text)] (like a solid button)
    content = content.replace(/hover:bg-\[var\(--color-text\)\]/g, "hover:bg-[var(--color-text)] hover:text-[var(--color-background)]");
    content = content.replace(/bg-white text-black/g, "bg-[var(--color-text)] text-[var(--color-background)]");
    content = content.replace(/bg-black text-white/g, "bg-[var(--color-text)] text-[var(--color-background)]");
    
    // Fix any nested text colors that might have gotten duplicated or corrupted
    // Just in case text-white was replaced by text-[var(--color-text)] where bg was also text-[var(--color-text)]
    content = content.replace(/bg-\[var\(--color-text\)\] text-\[var\(--color-text\)\]/g, "bg-[var(--color-text)] text-[var(--color-background)]");

    if (content !== original) {
      fs.writeFileSync(current, content, 'utf8');
      filesChanged++;
      console.log('Updated:', current);
    }
  }
}

walk(dir);
console.log('Total files updated:', filesChanged);

const fs = require('fs');
const path = require('path');

function getBaseReplacements(content) {
  // Inject imports
  if (!content.includes('getVisualDNA')) {
    content = content.replace(
      "import { getDynamicSections } from '@/lib/blueprint-engine';",
      "import { getDynamicSections } from '@/lib/blueprint-engine';\nimport { getVisualDNA } from '@/lib/visual-dna';\n\nfunction hexToRgb(hex: string) {\n  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);\n  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';\n}"
    );
  }

  // Inject useMemo hook
  if (!content.includes('const dna = useMemo')) {
    content = content.replace(
      "const { firstName, lastName } = useMemo(() => {",
      "const dna = useMemo(() => getVisualDNA(profile.professionalBlueprint), [profile.professionalBlueprint]);\n\n  const { firstName, lastName } = useMemo(() => {"
    );
    if (!content.includes('const dna = useMemo')) {
      // In case it doesn't have firstName lastName useMemo
      content = content.replace(
        "const normalizedProjects = useMemo(() => normalizeShowcaseItems(profile), [profile]);",
        "const dna = useMemo(() => getVisualDNA(profile.professionalBlueprint), [profile.professionalBlueprint]);\n\n  const normalizedProjects = useMemo(() => normalizeShowcaseItems(profile), [profile]);"
      );
    }
  }

  // General Font replaces
  content = content.replace(/@import url\('.*?'\);/, `@import url('\${dna.tokens.typography.importUrl}');`);
  
  return content;
}

function processExecutive(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = getBaseReplacements(content);

  // Root Div injection
  if (!content.includes('--color-primary')) {
    content = content.replace(
      /<div className="min-h-screen bg-\[#040814\].*?relative">/,
      `<div className="min-h-screen font-sans overflow-x-hidden selection:bg-[rgba(var(--color-primary-rgb),0.3)] selection:text-[var(--color-text)] relative transition-colors duration-500" style={{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      '--color-primary': dna.tokens.colors.primary,
      '--color-primary-rgb': hexToRgb(dna.tokens.colors.primary),
      '--color-secondary': dna.tokens.colors.secondary,
      '--color-secondary-rgb': hexToRgb(dna.tokens.colors.secondary),
      '--color-bg': dna.tokens.colors.background,
      '--color-surface': dna.tokens.colors.surface,
      '--color-text': dna.tokens.colors.text,
      '--color-muted': dna.tokens.colors.muted,
      '--color-accent': dna.tokens.colors.accent,
      '--font-heading': dna.tokens.typography.heading,
      '--font-body': dna.tokens.typography.body,
      '--radius-card': dna.tokens.geometry.borderRadius,
      '--border-card': dna.tokens.geometry.cardBorder,
    } as React.CSSProperties}>`
    );
  }

  // Fonts
  content = content.replace(/font-family: 'Plus Jakarta Sans', sans-serif;/g, 'font-family: var(--font-body);');
  content = content.replace(/font-family: 'Cormorant Garamond', serif;/g, 'font-family: var(--font-heading);');

  // Colors
  // bg-#040814 -> bg-color-bg
  content = content.replace(/bg-\[\#040814\]/gi, 'bg-[var(--color-bg)]');
  // #dfab6c -> var(--color-primary)
  content = content.replace(/#dfab6c/gi, 'var(--color-primary)');
  
  content = content.replace(/text-amber-300/gi, 'text-[var(--color-primary)]');
  content = content.replace(/text-amber-400/gi, 'text-[var(--color-primary)]');
  content = content.replace(/text-amber-500/gi, 'text-[var(--color-primary)]');
  content = content.replace(/text-amber-600/gi, 'text-[var(--color-primary)]');

  content = content.replace(/bg-amber-400\b/gi, 'bg-[var(--color-primary)]');
  content = content.replace(/bg-amber-500\b/gi, 'bg-[var(--color-primary)]');
  content = content.replace(/border-amber-400\b/gi, 'border-[var(--color-primary)]');
  content = content.replace(/border-amber-500\b/gi, 'border-[var(--color-primary)]');

  // Opacity
  content = content.replace(/bg-amber-\d00\/(\d+)/g, (match, op) => `bg-[rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);
  content = content.replace(/border-amber-\d00\/(\d+)/g, (match, op) => `border-[rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);
  content = content.replace(/text-amber-\d00\/(\d+)/g, (match, op) => `text-[rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);

  // Hover
  content = content.replace(/hover:text-amber-\d00/g, 'hover:text-[var(--color-primary)]');
  content = content.replace(/hover:border-amber-\d00/g, 'hover:border-[var(--color-primary)]');

  content = content.replace(/rounded-3xl/g, 'rounded-[var(--radius-card)]');
  content = content.replace(/rounded-2xl/g, 'rounded-[var(--radius-card)]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed Executive');
}

function processProductBuilder(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = getBaseReplacements(content);

  // Root Div injection
  if (!content.includes('--color-primary')) {
    content = content.replace(
      /<div className="min-h-screen bg-slate-900.*?relative">/,
      `<div className="min-h-screen font-sans overflow-x-hidden selection:bg-[rgba(var(--color-primary-rgb),0.3)] selection:text-[var(--color-text)] relative transition-colors duration-500" style={{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      '--color-primary': dna.tokens.colors.primary,
      '--color-primary-rgb': hexToRgb(dna.tokens.colors.primary),
      '--color-secondary': dna.tokens.colors.secondary,
      '--color-secondary-rgb': hexToRgb(dna.tokens.colors.secondary),
      '--color-bg': dna.tokens.colors.background,
      '--color-surface': dna.tokens.colors.surface,
      '--color-text': dna.tokens.colors.text,
      '--color-muted': dna.tokens.colors.muted,
      '--color-accent': dna.tokens.colors.accent,
      '--font-heading': dna.tokens.typography.heading,
      '--font-body': dna.tokens.typography.body,
      '--radius-card': dna.tokens.geometry.borderRadius,
      '--border-card': dna.tokens.geometry.cardBorder,
    } as React.CSSProperties}>`
    );
  }

  content = content.replace(/font-family: 'Inter', sans-serif;/g, 'font-family: var(--font-body);');
  content = content.replace(/font-family: 'Manrope', sans-serif;/g, 'font-family: var(--font-heading);');

  content = content.replace(/bg-slate-900/g, 'bg-[var(--color-bg)]');
  content = content.replace(/bg-slate-800\/50/g, 'bg-[var(--color-surface)]');
  content = content.replace(/bg-slate-800\/40/g, 'bg-[var(--color-surface)]');
  content = content.replace(/bg-slate-800/g, 'bg-[var(--color-surface)]');
  content = content.replace(/border-slate-800/g, 'border-[var(--border-card)]');
  content = content.replace(/border-slate-700/g, 'border-[var(--border-card)]');

  content = content.replace(/text-blue-400/gi, 'text-[var(--color-primary)]');
  content = content.replace(/text-blue-500/gi, 'text-[var(--color-primary)]');
  content = content.replace(/text-blue-300/gi, 'text-[var(--color-primary)]');

  content = content.replace(/bg-blue-500\b/gi, 'bg-[var(--color-primary)]');
  content = content.replace(/bg-blue-600\b/gi, 'bg-[var(--color-primary)]');
  content = content.replace(/border-blue-500\b/gi, 'border-[var(--color-primary)]');

  // Opacity
  content = content.replace(/bg-blue-\d00\/(\d+)/g, (match, op) => `bg-[rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);
  content = content.replace(/border-blue-\d00\/(\d+)/g, (match, op) => `border-[rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);
  content = content.replace(/text-blue-\d00\/(\d+)/g, (match, op) => `text-[rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);
  content = content.replace(/shadow-blue-\d00\/(\d+)/g, (match, op) => `shadow-[0_0_15px_rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);
  content = content.replace(/ring-blue-\d00\/(\d+)/g, (match, op) => `ring-[rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);

  content = content.replace(/hover:text-blue-\d00/g, 'hover:text-[var(--color-primary)]');
  content = content.replace(/hover:border-blue-\d00/g, 'hover:border-[var(--color-primary)]');
  content = content.replace(/hover:shadow-blue-\d00\/(\d+)/g, (match, op) => `hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),${parseInt(op)/100})]`);

  content = content.replace(/rounded-3xl/g, 'rounded-[var(--radius-card)]');
  content = content.replace(/rounded-2xl/g, 'rounded-[var(--radius-card)]');
  content = content.replace(/rounded-xl/g, 'rounded-[calc(var(--radius-card)*0.75)]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed ProductBuilder');
}

processExecutive(path.join(__dirname, '../src/components/premium/ExecutiveTemplate.tsx'));
processProductBuilder(path.join(__dirname, '../src/components/premium/ProductBuilderTemplate.tsx'));

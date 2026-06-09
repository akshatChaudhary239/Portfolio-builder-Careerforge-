const fs = require('fs');
const path = require('path');

function processPublicClient(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Inject getVisualDNA and hexToRgb
  if (!content.includes('getVisualDNA')) {
    content = content.replace(
      "import ExecutiveTemplate from '@/components/premium/ExecutiveTemplate';",
      "import { getVisualDNA } from '@/lib/visual-dna';\nimport ExecutiveTemplate from '@/components/premium/ExecutiveTemplate';\n\nfunction hexToRgb(hex: string) {\n  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);\n  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';\n}"
    );
  }

  // Find the start of the component to add DNA variable
  if (!content.includes('const dna = React.useMemo(() => getVisualDNA')) {
    content = content.replace(
      "const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);",
      "const dna = React.useMemo(() => getVisualDNA(rawCareerProfile.professionalBlueprint), [rawCareerProfile]);\n  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);"
    );
  }

  // Instead of replacing every individual class blindly which might break the navbar or other UI components,
  // Let's create CSS variable overrides for Tailwind classes globally within the component's root or `<style>` block!
  
  // Wait, the navbar in public-client is outside the templates!
  // The navbar has conditional logic `isCreative`, `isDark`, `isDev`.
  // If we just inject a <style> block that overrides `text-indigo-600` with `var(--color-primary)`, it will apply to the navbar as well, which is PERFECT since we want the whole page to respect the DNA.
  
  // Let's inject a global CSS block right before `{/* Render selected layout */}`
  const styleBlock = `
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('\${dna.tokens.typography.importUrl}');
        
        .font-sans, .font-serif, .font-mono { font-family: var(--font-body) !important; }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading) !important; }
        
        /* Interactive developer theme */
        .bg-indigo-600, .bg-indigo-500, .bg-blue-600, .bg-blue-500, .bg-orange-500, .bg-orange-600 { background-color: var(--color-primary) !important; }
        .text-indigo-400, .text-indigo-500, .text-indigo-600, .text-blue-600, .text-orange-500, .text-orange-600 { color: var(--color-primary) !important; }
        .border-indigo-500, .border-indigo-200, .border-blue-600, .border-orange-500 { border-color: var(--color-primary) !important; }
        
        .bg-indigo-500\\\\/10, .bg-blue-500\\\\/10, .bg-orange-500\\\\/10 { background-color: rgba(var(--color-primary-rgb), 0.1) !important; }
        .bg-indigo-500\\\\/20, .bg-blue-500\\\\/20, .bg-orange-500\\\\/20 { background-color: rgba(var(--color-primary-rgb), 0.2) !important; }
        
        .border-indigo-500\\\\/20, .border-blue-500\\\\/20, .border-orange-500\\\\/20 { border-color: rgba(var(--color-primary-rgb), 0.2) !important; }
        
        .text-indigo-300, .text-blue-400, .text-orange-400 { color: var(--color-secondary) !important; }
        .from-indigo-400, .from-blue-600, .from-orange-400 { --tw-gradient-from: var(--color-primary) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-purple-400, .to-blue-400, .to-rose-400 { --tw-gradient-to: var(--color-secondary) !important; }
        
        /* Additional elements */
        .shadow-\\\\[0_0_20px_rgba\\\\(79\\\\,70\\\\,229\\\\,0\\\\.3\\\\)\\\\] { box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.3) !important; }
        .shadow-\\\\[0_0_10px_rgba\\\\(79\\\\,70\\\\,229\\\\,0\\\\.5\\\\)\\\\] { box-shadow: 0 0 10px rgba(var(--color-primary-rgb), 0.5) !important; }
      \`}} />
  `;

  if (!content.includes('/* DNA Dynamic Style Overrides */')) {
    content = content.replace(
      "{/* Render selected layout */}",
      `{/* DNA Dynamic Style Overrides */}\n${styleBlock}\n      {/* Render selected layout */}`
    );
  }

  // Inject the style variables wrapper into the main element
  if (!content.includes('--color-primary')) {
    content = content.replace(
      /<main className="relative flex min-h-screen flex-col overflow-x-hidden">/,
      `<main className="relative flex min-h-screen flex-col overflow-x-hidden transition-colors duration-500" style={{
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

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed Public Client Base Templates');
}

processPublicClient(path.join(__dirname, '../src/app/u/[username]/public-client.tsx'));

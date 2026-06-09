import { ProfessionalBlueprint } from '@/db/local-db';

export interface VisualDNAProfile {
  id: string;
  name: string;
  tokens: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      muted: string;
      accent: string;
    };
    typography: {
      heading: string;
      body: string;
      importUrl: string;
    };
    geometry: {
      borderRadius: string;
      cardBorder: string;
    };
    animation: {
      buttonScale: number;
      hoverDuration: string;
    };
  };
}

export class PRNG {
  private seed: number;
  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = Math.imul(31, hash) + seedStr.charCodeAt(i) | 0;
    }
    this.seed = hash;
  }
  next() {
    this.seed = Math.abs((this.seed * 9301 + 49297) % 233280);
    return this.seed / 233280;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const typographyPairs = [
  {
    heading: "'Clash Display', sans-serif",
    body: "'Satoshi', sans-serif",
    importUrl: "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@300,400,500,700&display=swap"
  },
  {
    heading: "'Syne', sans-serif",
    body: "'Inter', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap"
  },
  {
    heading: "'Oswald', sans-serif",
    body: "'Outfit', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap"
  },
  {
    heading: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap"
  },
  {
    heading: "'Manrope', sans-serif",
    body: "'DM Sans', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Manrope:wght@400;500;600;700;800&display=swap"
  },
  {
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
  },
  {
    heading: "'Cormorant Garamond', serif",
    body: "'Plus Jakarta Sans', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
  },
  {
    heading: "'Bebas Neue', sans-serif",
    body: "'Montserrat', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600&display=swap"
  },
  {
    heading: "'Outfit', sans-serif",
    body: "'Space Grotesk', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
  },
  {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap"
  }
];

export function getVisualDNA(blueprint?: ProfessionalBlueprint | null, identifier: string = 'default'): VisualDNAProfile {
  // We use the identifier (like a fullName or subdomain) to seed our generative engine
  const prng = new PRNG(identifier + (blueprint?.profession || ''));

  // 1. Generate Procedural Colors (Dark Mode By Default for Awwwards vibe)
  // Pick a base hue
  const baseHue = Math.floor(prng.next() * 360);
  
  // Decide color scheme strategy (Analogous, Complementary, Monochromatic)
  const strategySeed = prng.next();
  let secondaryHue = baseHue;
  let accentHue = baseHue;

  if (strategySeed < 0.33) {
    // Complementary
    secondaryHue = (baseHue + 180) % 360;
    accentHue = (baseHue + 150) % 360;
  } else if (strategySeed < 0.66) {
    // Analogous
    secondaryHue = (baseHue + 30) % 360;
    accentHue = (baseHue - 30 + 360) % 360;
  } else {
    // Monochromatic but varying lightness/saturation
    secondaryHue = baseHue;
    accentHue = baseHue;
  }

  // Generative Hexes
  const primary = hslToHex(baseHue, 80, 60);
  const secondary = hslToHex(secondaryHue, 70, 50);
  const accent = hslToHex(accentHue, 90, 65);
  
  // Create an ultra-dark tinted background
  const bgHue = baseHue;
  const background = hslToHex(bgHue, 15, 4); // Very dark, slightly tinted
  const surface = `rgba(${Math.floor(prng.next() * 20 + 10)}, ${Math.floor(prng.next() * 20 + 10)}, ${Math.floor(prng.next() * 20 + 20)}, 0.4)`;
  
  // 2. Typography
  const typography = prng.pick(typographyPairs);

  // 3. Geometry
  const radiuses = ['0px', '0.25rem', '0.5rem', '1rem', '1.5rem', '2rem'];
  const borderRadius = prng.pick(radiuses);
  const cardBorder = prng.next() > 0.5 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none';

  // 4. Animation
  const buttonScale = 1 + (prng.next() * 0.1); // 1.0 to 1.1
  const hoverDuration = `${Math.floor(200 + prng.next() * 300)}ms`;

  return {
    id: `gen-${identifier}`,
    name: 'Generative DNA',
    tokens: {
      colors: {
        primary,
        secondary,
        background,
        surface,
        text: '#f8fafc',
        muted: '#94a3b8',
        accent,
      },
      typography,
      geometry: {
        borderRadius,
        cardBorder,
      },
      animation: {
        buttonScale: Number(buttonScale.toFixed(2)),
        hoverDuration,
      },
    },
  };
}

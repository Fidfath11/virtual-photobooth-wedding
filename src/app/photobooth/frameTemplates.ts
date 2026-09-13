export interface FrameTemplate {
  id: string;
  name: string;
  aspectRatio: '3:4' | '9:16';
  width: number;
  height: number;
  description: string;
  badge: string;
  getSvgContent: (width?: number, height?: number) => string;
}

export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: 'botanical-gold',
    name: 'Botanical Gold',
    aspectRatio: '3:4',
    width: 1200,
    height: 1600,
    description: 'Bingkai emas mewah dengan ornamen floral botani di setiap sudut',
    badge: 'Gold Floral',
    getSvgContent: (w = 1200, h = 1600) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D4AF37" />
            <stop offset="25%" stop-color="#FFF2A1" />
            <stop offset="50%" stop-color="#AA771C" />
            <stop offset="75%" stop-color="#FDF0A6" />
            <stop offset="100%" stop-color="#8B6508" />
          </linearGradient>
          <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFF5C0" />
            <stop offset="50%" stop-color="#D4AF37" />
            <stop offset="100%" stop-color="#996515" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- Outer Double Golden Border -->
        <rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="none" stroke="url(#goldGrad)" stroke-width="4" rx="24" />
        <rect x="56" y="56" width="${w - 112}" height="${h - 112}" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="8 6" rx="16" />

        <!-- Corner Floral Ornaments -->
        <!-- Top-Left -->
        <g transform="translate(60, 60)" stroke="url(#goldGrad)" fill="none" stroke-width="2.5" stroke-linecap="round">
          <path d="M 0 60 C 0 20, 20 0, 60 0" />
          <path d="M 10 70 C 10 35, 35 10, 70 10" />
          <circle cx="28" cy="28" r="6" fill="url(#goldGrad)"/>
          <path d="M 28 22 Q 40 10 50 16 Q 44 28 28 22 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
          <path d="M 22 28 Q 10 40 16 50 Q 28 44 22 28 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
        </g>

        <!-- Top-Right -->
        <g transform="translate(${w - 60}, 60) scale(-1, 1)" stroke="url(#goldGrad)" fill="none" stroke-width="2.5" stroke-linecap="round">
          <path d="M 0 60 C 0 20, 20 0, 60 0" />
          <path d="M 10 70 C 10 35, 35 10, 70 10" />
          <circle cx="28" cy="28" r="6" fill="url(#goldGrad)"/>
          <path d="M 28 22 Q 40 10 50 16 Q 44 28 28 22 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
          <path d="M 22 28 Q 10 40 16 50 Q 28 44 22 28 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
        </g>

        <!-- Bottom-Left -->
        <g transform="translate(60, ${h - 60}) scale(1, -1)" stroke="url(#goldGrad)" fill="none" stroke-width="2.5" stroke-linecap="round">
          <path d="M 0 60 C 0 20, 20 0, 60 0" />
          <path d="M 10 70 C 10 35, 35 10, 70 10" />
          <circle cx="28" cy="28" r="6" fill="url(#goldGrad)"/>
          <path d="M 28 22 Q 40 10 50 16 Q 44 28 28 22 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
          <path d="M 22 28 Q 10 40 16 50 Q 28 44 22 28 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
        </g>

        <!-- Bottom-Right -->
        <g transform="translate(${w - 60}, ${h - 60}) scale(-1, -1)" stroke="url(#goldGrad)" fill="none" stroke-width="2.5" stroke-linecap="round">
          <path d="M 0 60 C 0 20, 20 0, 60 0" />
          <path d="M 10 70 C 10 35, 35 10, 70 10" />
          <circle cx="28" cy="28" r="6" fill="url(#goldGrad)"/>
          <path d="M 28 22 Q 40 10 50 16 Q 44 28 28 22 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
          <path d="M 22 28 Q 10 40 16 50 Q 28 44 22 28 Z" fill="url(#goldGrad)" fill-opacity="0.8"/>
        </g>

        <!-- Top Header Ribbon / Badge -->
        <g transform="translate(${w / 2}, 90)" filter="url(#shadow)">
          <text x="0" y="0" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="600" letter-spacing="8" fill="url(#goldTextGrad)">
            ✦ THE WEDDING CELEBRATION ✦
          </text>
          <line x1="-180" y1="18" x2="180" y2="18" stroke="url(#goldGrad)" stroke-width="1.5"/>
        </g>

        <!-- Bottom Footer Ribbon -->
        <g transform="translate(${w / 2}, ${h - 110})" filter="url(#shadow)">
          <line x1="-220" y1="-45" x2="220" y2="-45" stroke="url(#goldGrad)" stroke-width="1.5"/>
          <circle cx="0" cy="-45" r="5" fill="url(#goldGrad)"/>
          <circle cx="-100" cy="-45" r="3.5" fill="url(#goldGrad)"/>
          <circle cx="100" cy="-45" r="3.5" fill="url(#goldGrad)"/>

          <text x="0" y="-8" text-anchor="middle" font-family="'Brush Script MT', 'Great Vibes', 'Playfair Display', Georgia, cursive, serif" font-size="44" font-style="italic" fill="url(#goldTextGrad)">
            Forever Begins Today
          </text>
          <text x="0" y="26" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="5" fill="#F3E5AB">
            THANK YOU FOR CELEBRATING WITH US
          </text>
        </g>
      </svg>
    `
  },
  {
    id: 'classic-polaroid',
    name: 'Classic Polaroid',
    aspectRatio: '3:4',
    width: 1200,
    height: 1600,
    description: 'Gaya polaroid vintage elegan dengan aksen cincin pernikahan dan cap cinta',
    badge: 'Polaroid Chic',
    getSvgContent: (w = 1200, h = 1600) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          <linearGradient id="polaroidBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFDF9" />
            <stop offset="100%" stop-color="#F7F3EA" />
          </linearGradient>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE082" />
            <stop offset="50%" stop-color="#FFB300" />
            <stop offset="100%" stop-color="#FF8F00" />
          </linearGradient>
          <filter id="cutoutShadow" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#1A1816" flood-opacity="0.35"/>
          </filter>
        </defs>

        <!-- Solid Outer Polaroid Frame Mask with Transparent Center Cutout -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 64 64 L 64 ${h - 260} L ${w - 64} ${h - 260} L ${w - 64} 64 Z
        " fill="url(#polaroidBg)" fill-rule="evenodd" filter="url(#cutoutShadow)" />

        <!-- Delicate Inner Border around Photo Window -->
        <rect x="64" y="64" width="${w - 128}" height="${h - 324}" fill="none" stroke="#D7CCC8" stroke-width="1.5" />

        <!-- Bottom Polaroid Card Area -->
        <g transform="translate(${w / 2}, ${h - 185})">
          <!-- Interlocking Golden Wedding Rings Icon -->
          <g transform="translate(0, -28)">
            <circle cx="-14" cy="0" r="18" fill="none" stroke="url(#ringGrad)" stroke-width="4.5"/>
            <circle cx="14" cy="0" r="18" fill="none" stroke="url(#ringGrad)" stroke-width="4.5"/>
            <!-- Diamond accent on left ring -->
            <polygon points="-14,-22 -9,-17 -14,-13 -19,-17" fill="#80D8FF"/>
          </g>

          <text x="0" y="32" text-anchor="middle" font-family="'Great Vibes', 'Playfair Display', Georgia, cursive, serif" font-size="52" font-style="italic" fill="#2E241E">
            Together is a Beautiful Place to Be
          </text>
          <text x="0" y="70" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="7" fill="#7A685D">
            WEDDING PHOTOBOOTH MEMORIES
          </text>
        </g>

        <!-- Top Corner Tape Effect (Decorative) -->
        <rect x="${w / 2 - 80}" y="16" width="160" height="34" rx="4" fill="#FFFFFF" fill-opacity="0.75" stroke="#E2DCD5" stroke-width="1" />
      </svg>
    `
  },
  {
    id: 'royal-arch',
    name: 'Royal Archway',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    description: 'Format vertikal 9:16 modern dengan bingkai lengkungan pesta resepsi',
    badge: '9:16 Story',
    getSvgContent: (w = 1080, h = 1920) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D4AF37" />
            <stop offset="30%" stop-color="#FFEFA6" />
            <stop offset="70%" stop-color="#C59B27" />
            <stop offset="100%" stop-color="#84590A" />
          </linearGradient>
          <filter id="archShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.65"/>
          </filter>
        </defs>

        <!-- Royal Arch Border Line -->
        <g stroke="url(#archGold)" fill="none" stroke-linecap="round">
          <!-- Outer Arch: Vertical lines from bottom to arch top -->
          <path d="
            M 48 ${h - 140}
            L 48 500
            A 492 492 0 0 1 ${w - 48} 500
            L ${w - 48} ${h - 140}
            Z
          " stroke-width="3.5"/>

          <!-- Inner Arch dotted guideline -->
          <path d="
            M 64 ${h - 156}
            L 64 506
            A 476 476 0 0 1 ${w - 64} 506
            L ${w - 64} ${h - 156}
            Z
          " stroke-width="1.5" stroke-dasharray="6 8"/>
        </g>

        <!-- Crown & Floral Topper on Arch Apex -->
        <g transform="translate(${w / 2}, 80)" filter="url(#archShadow)">
          <!-- Golden Starburst & Heart -->
          <circle cx="0" cy="0" r="14" fill="url(#archGold)"/>
          <path d="M 0 -8 C -4 -16, -14 -12, -14 -4 C -14 6, 0 16, 0 16 C 0 16, 14 6, 14 -4 C 14 -12, 4 -16, 0 -8 Z" fill="#FFEFA6"/>
          <!-- Little stars -->
          <text x="-60" y="6" font-size="24" fill="url(#archGold)" text-anchor="middle">✦</text>
          <text x="60" y="6" font-size="24" fill="url(#archGold)" text-anchor="middle">✦</text>
        </g>

        <!-- Top Title inside Arch -->
        <g transform="translate(${w / 2}, 160)" filter="url(#archShadow)">
          <text x="0" y="0" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="6" fill="#FFEFA6" font-weight="600">
            OUR WEDDING DAY
          </text>
          <text x="0" y="36" text-anchor="middle" font-family="'Great Vibes', 'Playfair Display', Georgia, cursive, serif" font-size="48" font-style="italic" fill="url(#archGold)">
            Best Day Ever
          </text>
        </g>

        <!-- Bottom Story Banner -->
        <g transform="translate(${w / 2}, ${h - 75})" filter="url(#archShadow)">
          <rect x="-240" y="-38" width="480" height="56" rx="28" fill="#1C1917" fill-opacity="0.85" stroke="url(#archGold)" stroke-width="1.5"/>
          <text x="0" y="-2" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="4" fill="#F5E8C7">
            ✦ CELEBRATING WITH LOVE ✦
          </text>
        </g>
      </svg>
    `
  }
];


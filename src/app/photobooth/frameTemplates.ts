export interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
}

export interface FrameTemplate {
  id: string;
  name: string;
  photoCount: 1 | 2 | 3 | 4;
  aspectRatio: string;
  width: number;
  height: number;
  description: string;
  badge: string;
  theme: 'ivory' | 'gold' | 'noir';
  slots: PhotoSlot[];
  getSvgContent: (width?: number, height?: number) => string;
}

export const FRAME_TEMPLATES: FrameTemplate[] = [
  /* =========================================================================
     1. FORMAT 1 FOTO — SINGLE POLAROID CHIC (4:5)
     ========================================================================= */
  {
    id: 'single-polaroid',
    name: '1 Foto • Polaroid Chic',
    photoCount: 1,
    aspectRatio: '4:5',
    width: 1200,
    height: 1500,
    description: 'Format 1 foto klasik polaroid dengan elemen 3D botani menjalar, washi tape sudut, dan segel lilin',
    badge: '1 Foto',
    theme: 'ivory',
    slots: [
      { x: 80, y: 90, width: 1040, height: 1040, rx: 16 }
    ],
    getSvgContent: (w = 1200, h = 1500) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="paperGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFBF9" />
            <stop offset="100%" stop-color="#F3EFE6" />
          </linearGradient>
          <radialGradient id="waxGrad1" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FB7185" />
            <stop offset="40%" stop-color="#E11D48" />
            <stop offset="80%" stop-color="#881337" />
            <stop offset="100%" stop-color="#38030F" />
          </radialGradient>
          <filter id="shadow3d" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="3" dy="4" stdDeviation="4" flood-opacity="0.38"/>
          </filter>
        </defs>

        <!-- Base Paper Card -->
        <rect width="${w}" height="${h}" rx="28" fill="url(#paperGrad1)" />

        <!-- Photo Cutout Aperture -->
        <rect x="80" y="90" width="1040" height="1040" rx="16" fill="#292524" />
        <rect x="80" y="90" width="1040" height="1040" rx="16" fill="none" stroke="#D7CCC8" stroke-width="3" />

        <!-- Outer Frame Corner Flourishes -->
        <g stroke="#C59B27" fill="#C59B27">
          <circle cx="45" cy="45" r="4"/>
          <text x="32" y="42" font-size="16">✦</text>
          <circle cx="${w - 45}" cy="45" r="4"/>
          <text x="${w - 42}" y="42" font-size="16">✦</text>
        </g>

        <!-- Top Washi Tape Sticker (Tilted) -->
        <g transform="translate(${w / 2 - 110}, 22) rotate(-2)">
          <rect width="220" height="34" rx="3" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1.5"/>
          <text x="110" y="22" text-anchor="middle" font-family="monospace" font-size="14" fill="#92400E" letter-spacing="6">✦ ✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header Text -->
        <text x="${w / 2}" y="74" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="15" font-weight="700" letter-spacing="6" fill="#1C1917">
          ✦ THE WEDDING CELEBRATION ✦
        </text>

        <!-- 3D ELEMENTS DRAPING & OVERLAPPING PHOTO CORNERS -->
        <!-- 1. Top-Left: 3D Botanical Vine draping into photo -->
        <g filter="url(#shadow3d)" transform="translate(80, 90)">
          <path d="M -24 -24 Q 0 0 45 42" fill="none" stroke="#35523D" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M 0 0 Q 15 -10 26 0 Q 15 10 0 0" fill="#4E7059"/>
          <path d="M 18 18 Q 35 10 44 22 Q 30 32 18 18" fill="#6E9979"/>
          <path d="M 32 32 Q 52 24 58 40 Q 42 50 32 32" fill="#35523D"/>
          <circle cx="10" cy="-4" r="3" fill="#FCE7F3"/>
          <circle cx="38" cy="16" r="3.5" fill="#E11D48"/>
        </g>

        <!-- 2. Top-Right: 3D Washi Tape Strip across photo corner -->
        <g filter="url(#shadow3d)" transform="translate(${80 + 1040 - 14}, ${90 + 14}) rotate(-38)">
          <rect x="-60" y="-14" width="120" height="28" rx="2" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1"/>
          <text x="0" y="4" text-anchor="middle" font-size="12" fill="#92400E">✦ ♥ ✦ ♥ ✦</text>
        </g>

        <!-- 3. Bottom-Left: 3D Photo Mounting Corner -->
        <g filter="url(#shadow3d)" transform="translate(80, ${90 + 1040}) rotate(270)">
          <polygon points="-4,-4 40,-4 -4,40" fill="#CA8A04" stroke="#FDE047" stroke-width="1.5"/>
          <line x1="8" y1="36" x2="36" y2="8" stroke="#78350F" stroke-width="1.5"/>
        </g>

        <!-- 4. Bottom-Right: 3D WAX SEAL OVERLAPPING PHOTO & FRAME -->
        <g filter="url(#shadow3d)" transform="translate(${80 + 1040 - 16}, ${90 + 1040 - 16})">
          <circle cx="0" cy="0" r="44" fill="url(#waxGrad1)"/>
          <circle cx="0" cy="0" r="32" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>
          <circle cx="-9" cy="0" r="14" fill="none" stroke="#FFE082" stroke-width="4"/>
          <circle cx="9" cy="0" r="14" fill="none" stroke="#FFE082" stroke-width="4"/>
          <circle cx="-9" cy="-14" r="3" fill="#FFFFFF"/>
        </g>

        <!-- BOTTOM AREA: CLEAN, SPACIOUS & BALANCED FOOTER -->
        <g transform="translate(${w / 2}, 1215)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="52" font-style="italic" fill="#1C1917">
            Together is a Beautiful Place
          </text>
          <text y="38" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#1C1917">
            ✦ MR & MRS CELEBRATION ✦
          </text>
          <text y="64" font-family="'Montserrat', sans-serif" font-size="12" fill="#78716C">
            14 SEPTEMBER 2026 • JAKARTA, INDONESIA
          </text>
          <text y="92" font-size="15" fill="#E11D48">♥   ♥   ♥</text>
        </g>

        <!-- Bottom Left: Barcode -->
        <g transform="translate(100, 1370)" fill="#292524">
          <rect x="0" y="0" width="3" height="30"/>
          <rect x="6" y="0" width="6" height="30"/>
          <rect x="15" y="0" width="2" height="30"/>
          <rect x="20" y="0" width="8" height="30"/>
          <rect x="31" y="0" width="3" height="30"/>
          <rect x="37" y="0" width="6" height="30"/>
          <rect x="46" y="0" width="2" height="30"/>
          <rect x="52" y="0" width="7" height="30"/>
          <rect x="62" y="0" width="4" height="30"/>
          <rect x="70" y="0" width="2" height="30"/>
          <rect x="76" y="0" width="6" height="30"/>
          <rect x="85" y="0" width="3" height="30"/>
          <rect x="92" y="0" width="8" height="30"/>
          <rect x="104" y="0" width="4" height="30"/>
          <rect x="112" y="0" width="7" height="30"/>
          <text x="60" y="46" text-anchor="middle" font-family="monospace" font-size="11" fill="#78716C">2026.09.14 • PHOTOBOOTH</text>
        </g>

        <!-- Bottom Right: Isolated Vintage Postmark Stamp -->
        <g transform="translate(${w - 140}, 1385)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="32" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="26" fill="none" stroke-width="1" stroke-dasharray="4 2"/>
          <text x="0" y="-8" text-anchor="middle" font-size="14" stroke="none">★</text>
          <text x="0" y="6" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" stroke="none">OFFICIAL</text>
          <text x="0" y="16" text-anchor="middle" font-family="monospace" font-size="8" stroke="none">2026.09.14</text>
        </g>
      </svg>
    `
  },

  /* =========================================================================
     2. FORMAT 2 FOTO — DUO STRIP (1:2)
     ========================================================================= */
  {
    id: 'duo-strip',
    name: '2 Foto • Duo Strip',
    photoCount: 2,
    aspectRatio: '1:2',
    width: 800,
    height: 1600,
    description: 'Format 2 foto vertikal dengan aksen 3D sudut botani, washi tape, dan segel lilin',
    badge: '2 Foto',
    theme: 'ivory',
    slots: [
      { x: 60, y: 90, width: 680, height: 570, rx: 14 },
      { x: 60, y: 690, width: 680, height: 570, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 1600) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="paperGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF7" />
            <stop offset="100%" stop-color="#F2EDE4" />
          </linearGradient>
          <radialGradient id="waxGrad2" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FB7185" />
            <stop offset="40%" stop-color="#E11D48" />
            <stop offset="80%" stop-color="#881337" />
            <stop offset="100%" stop-color="#38030F" />
          </radialGradient>
          <filter id="shadow3d" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="3" dy="4" stdDeviation="4" flood-opacity="0.38"/>
          </filter>
        </defs>

        <rect width="${w}" height="${h}" rx="24" fill="url(#paperGrad2)" />

        <!-- 2 Photo Apertures -->
        <rect x="60" y="90" width="680" height="570" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="60" y="690" width="680" height="570" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />

        <!-- Top Washi Tape -->
        <g transform="translate(${w / 2 - 90}, 18) rotate(-2)">
          <rect width="180" height="30" rx="3" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1.5"/>
          <text x="90" y="20" text-anchor="middle" font-family="monospace" font-size="13" fill="#92400E" letter-spacing="5">✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header -->
        <text x="${w / 2}" y="70" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#1C1917">
          ✦ DUO MEMORIES • CELEBRATION ✦
        </text>

        <!-- 3D Overhang Elements -->
        <!-- Photo 1 Top-Left: Botanical Overhang -->
        <g filter="url(#shadow3d)" transform="translate(60, 90)">
          <path d="M -20 -20 Q 0 0 40 38" fill="none" stroke="#35523D" stroke-width="3" stroke-linecap="round"/>
          <path d="M 0 0 Q 12 -8 22 0 Q 12 8 0 0" fill="#4E7059"/>
          <path d="M 16 16 Q 30 8 38 18 Q 26 28 16 16" fill="#6E9979"/>
          <circle cx="8" cy="-4" r="3" fill="#FCE7F3"/>
        </g>

        <!-- Photo 1 Top-Right: Washi Tape Corner -->
        <g filter="url(#shadow3d)" transform="translate(${60 + 680 - 12}, ${90 + 12}) rotate(-38)">
          <rect x="-55" y="-12" width="110" height="24" rx="2" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1"/>
          <text x="0" y="4" text-anchor="middle" font-size="11" fill="#92400E">✦ ♥ ✦ ♥ ✦</text>
        </g>

        <!-- Photo 2 Bottom-Left: Botanical Overhang -->
        <g filter="url(#shadow3d)" transform="translate(60, ${690 + 570}) rotate(270)">
          <path d="M -20 -20 Q 0 0 40 38" fill="none" stroke="#35523D" stroke-width="3" stroke-linecap="round"/>
          <path d="M 16 16 Q 30 8 38 18 Q 26 28 16 16" fill="#6E9979"/>
        </g>

        <!-- Photo 2 Bottom-Right: 3D Wax Seal Overlapping Corner -->
        <g filter="url(#shadow3d)" transform="translate(${60 + 680 - 14}, ${690 + 570 - 14})">
          <circle cx="0" cy="0" r="40" fill="url(#waxGrad2)"/>
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="-8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3.5"/>
          <circle cx="8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3.5"/>
        </g>

        <!-- Clean Footer Area -->
        <g transform="translate(${w / 2}, 1335)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="46" font-style="italic" fill="#1C1917">
            Always & Forever
          </text>
          <text y="34" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" letter-spacing="4" fill="#1C1917">
            ✦ MR & MRS CELEBRATION ✦
          </text>
          <text y="56" font-family="'Montserrat', sans-serif" font-size="11" fill="#78716C">
            14 SEPTEMBER 2026 • JAKARTA, INDONESIA
          </text>
          <text y="80" font-size="14" fill="#E11D48">♥   ♥   ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(70, 1460)" fill="#292524">
          <rect x="0" y="0" width="3" height="28"/>
          <rect x="6" y="0" width="6" height="28"/>
          <rect x="15" y="0" width="2" height="28"/>
          <rect x="20" y="0" width="7" height="28"/>
          <rect x="30" y="0" width="3" height="28"/>
          <rect x="36" y="0" width="5" height="28"/>
          <rect x="44" y="0" width="2" height="28"/>
          <rect x="49" y="0" width="7" height="28"/>
          <rect x="59" y="0" width="4" height="28"/>
          <rect x="66" y="0" width="2" height="28"/>
          <rect x="71" y="0" width="6" height="28"/>
          <rect x="80" y="0" width="3" height="28"/>
          <rect x="86" y="0" width="7" height="28"/>
          <text x="46" y="42" text-anchor="middle" font-family="monospace" font-size="10" fill="#78716C">2026.09.14</text>
        </g>

        <!-- Postmark Stamp on Right -->
        <g transform="translate(${w - 110}, 1475)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="28" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="23" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="-4" text-anchor="middle" font-size="11" stroke="none">★</text>
          <text x="0" y="8" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" stroke="none">OFFICIAL</text>
        </g>
      </svg>
    `
  },

  /* =========================================================================
     3. FORMAT 3 FOTO — TRIO STRIP (2:5)
     ========================================================================= */
  {
    id: 'trio-strip',
    name: '3 Foto • Trio Strip',
    photoCount: 3,
    aspectRatio: '2:5',
    width: 800,
    height: 2000,
    description: 'Format 3 foto vertikal dengan aksen 3D sudut daun botani, washi tape, dan segel lilin',
    badge: '3 Foto',
    theme: 'ivory',
    slots: [
      { x: 60, y: 90, width: 680, height: 490, rx: 14 },
      { x: 60, y: 610, width: 680, height: 490, rx: 14 },
      { x: 60, y: 1130, width: 680, height: 490, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 2000) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="paperGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF7" />
            <stop offset="100%" stop-color="#F2EDE4" />
          </linearGradient>
          <radialGradient id="waxGrad3" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FB7185" />
            <stop offset="40%" stop-color="#E11D48" />
            <stop offset="80%" stop-color="#881337" />
            <stop offset="100%" stop-color="#38030F" />
          </radialGradient>
          <filter id="shadow3d" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="3" dy="4" stdDeviation="4" flood-opacity="0.38"/>
          </filter>
        </defs>

        <rect width="${w}" height="${h}" rx="24" fill="url(#paperGrad3)" />

        <!-- 3 Photo Apertures -->
        <rect x="60" y="90" width="680" height="490" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="60" y="610" width="680" height="490" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="60" y="1130" width="680" height="490" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />

        <!-- Top Washi Tape -->
        <g transform="translate(${w / 2 - 90}, 18) rotate(-2)">
          <rect width="180" height="30" rx="3" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1.5"/>
          <text x="90" y="20" text-anchor="middle" font-family="monospace" font-size="13" fill="#92400E" letter-spacing="5">✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header -->
        <text x="${w / 2}" y="70" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#1C1917">
          ✦ TRIO CUTS • WEDDING SPECIAL ✦
        </text>

        <!-- 3D Overlapping Elements -->
        <!-- Photo 1 Top-Left: Botanical Overhang -->
        <g filter="url(#shadow3d)" transform="translate(60, 90)">
          <path d="M -20 -20 Q 0 0 40 38" fill="none" stroke="#35523D" stroke-width="3" stroke-linecap="round"/>
          <path d="M 0 0 Q 12 -8 22 0 Q 12 8 0 0" fill="#4E7059"/>
          <path d="M 16 16 Q 30 8 38 18 Q 26 28 16 16" fill="#6E9979"/>
        </g>

        <!-- Photo 1 Top-Right: Washi Tape Corner -->
        <g filter="url(#shadow3d)" transform="translate(${60 + 680 - 12}, ${90 + 12}) rotate(-38)">
          <rect x="-55" y="-12" width="110" height="24" rx="2" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1"/>
          <text x="0" y="4" text-anchor="middle" font-size="11" fill="#92400E">✦ ♥ ✦ ♥ ✦</text>
        </g>

        <!-- Photo 3 Bottom-Right: 3D Wax Seal Overlapping Corner -->
        <g filter="url(#shadow3d)" transform="translate(${60 + 680 - 14}, ${1130 + 490 - 14})">
          <circle cx="0" cy="0" r="40" fill="url(#waxGrad3)"/>
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="-8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3.5"/>
          <circle cx="8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3.5"/>
        </g>

        <!-- Clean Footer Area -->
        <g transform="translate(${w / 2}, 1715)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="48" font-style="italic" fill="#1C1917">
            The Best Day Ever
          </text>
          <text y="34" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" letter-spacing="4" fill="#1C1917">
            ✦ MR & MRS CELEBRATION ✦
          </text>
          <text y="56" font-family="'Montserrat', sans-serif" font-size="11" fill="#78716C">
            14 SEPTEMBER 2026 • JAKARTA, INDONESIA
          </text>
          <text y="80" font-size="14" fill="#E11D48">♥   ♥   ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(70, 1840)" fill="#292524">
          <rect x="0" y="0" width="3" height="28"/>
          <rect x="6" y="0" width="6" height="28"/>
          <rect x="15" y="0" width="2" height="28"/>
          <rect x="20" y="0" width="7" height="28"/>
          <rect x="30" y="0" width="3" height="28"/>
          <rect x="36" y="0" width="5" height="28"/>
          <rect x="44" y="0" width="2" height="28"/>
          <rect x="49" y="0" width="7" height="28"/>
          <rect x="59" y="0" width="4" height="28"/>
          <rect x="66" y="0" width="2" height="28"/>
          <rect x="71" y="0" width="6" height="28"/>
          <rect x="80" y="0" width="3" height="28"/>
          <rect x="86" y="0" width="7" height="28"/>
          <text x="48" y="42" text-anchor="middle" font-family="monospace" font-size="10" fill="#78716C">2026.09.14</text>
        </g>

        <!-- Postmark Stamp on Right -->
        <g transform="translate(${w - 110}, 1855)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="28" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="23" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="-4" text-anchor="middle" font-size="11" stroke="none">★</text>
          <text x="0" y="8" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" stroke="none">OFFICIAL</text>
        </g>
      </svg>
    `
  },

  /* =========================================================================
     4. FORMAT 4 FOTO — KOREAN LIFE4CUTS STRIP (1:3)
     ========================================================================= */
  {
    id: 'life4cuts-strip',
    name: '4 Foto • Life4Cuts',
    photoCount: 4,
    aspectRatio: '1:3',
    width: 800,
    height: 2400,
    description: 'Format photostrip 4 foto bertingkat ala Korea dengan barcode, washi tape, dan wax seal sudut 3D',
    badge: '4 Foto',
    theme: 'ivory',
    slots: [
      { x: 50, y: 80, width: 700, height: 470, rx: 14 },
      { x: 50, y: 580, width: 700, height: 470, rx: 14 },
      { x: 50, y: 1080, width: 700, height: 470, rx: 14 },
      { x: 50, y: 1580, width: 700, height: 470, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 2400) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="paperGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF7" />
            <stop offset="100%" stop-color="#F2EDE4" />
          </linearGradient>
          <radialGradient id="waxGrad4" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FB7185" />
            <stop offset="40%" stop-color="#E11D48" />
            <stop offset="80%" stop-color="#881337" />
            <stop offset="100%" stop-color="#38030F" />
          </radialGradient>
          <filter id="shadow3d" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="3" dy="4" stdDeviation="4" flood-opacity="0.38"/>
          </filter>
        </defs>

        <rect width="${w}" height="${h}" rx="24" fill="url(#paperGrad4)" />

        <!-- 4 Photo Apertures -->
        <rect x="50" y="80" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="50" y="580" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="50" y="1080" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="50" y="1580" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />

        <!-- Top Washi Tape -->
        <g transform="translate(${w / 2 - 95}, 18) rotate(-2)">
          <rect width="190" height="32" rx="3" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1.5"/>
          <text x="95" y="21" text-anchor="middle" font-family="monospace" font-size="13" fill="#92400E" letter-spacing="5">✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header -->
        <text x="${w / 2}" y="65" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#1C1917">
          ✦ LIFE 4 CUTS • WEDDING EDITION ✦
        </text>

        <!-- 3D Overlapping Elements -->
        <!-- Photo 1 Top-Left: Botanical Overhang -->
        <g filter="url(#shadow3d)" transform="translate(50, 80)">
          <path d="M -20 -20 Q 0 0 42 40" fill="none" stroke="#35523D" stroke-width="3" stroke-linecap="round"/>
          <path d="M 0 0 Q 12 -8 24 0 Q 12 8 0 0" fill="#4E7059"/>
          <path d="M 16 16 Q 30 8 38 18 Q 26 28 16 16" fill="#6E9979"/>
          <circle cx="8" cy="-4" r="3" fill="#FCE7F3"/>
        </g>

        <!-- Photo 1 Top-Right: Washi Tape Corner -->
        <g filter="url(#shadow3d)" transform="translate(${50 + 700 - 14}, ${80 + 14}) rotate(-38)">
          <rect x="-55" y="-12" width="110" height="24" rx="2" fill="#FEF08A" fill-opacity="0.88" stroke="#FDE047" stroke-width="1"/>
          <text x="0" y="4" text-anchor="middle" font-size="11" fill="#92400E">✦ ♥ ✦ ♥ ✦</text>
        </g>

        <!-- Photo 4 Bottom-Right: 3D Wax Seal Overlapping Corner -->
        <g filter="url(#shadow3d)" transform="translate(${50 + 700 - 15}, ${1580 + 470 - 15})">
          <circle cx="0" cy="0" r="42" fill="url(#waxGrad4)"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="-8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3.5"/>
          <circle cx="8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3.5"/>
        </g>

        <!-- Clean Footer Area -->
        <g transform="translate(${w / 2}, 2150)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="52" font-style="italic" fill="#1C1917">
            Happy Ever After with You
          </text>
          <text y="36" font-family="'Montserrat', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#1C1917">
            ✦ MR & MRS CELEBRATION ✦
          </text>
          <text y="58" font-family="'Montserrat', sans-serif" font-size="11" fill="#78716C">
            14 SEPTEMBER 2026 • JAKARTA, INDONESIA
          </text>
          <text y="82" font-size="14" fill="#E11D48">♥   ♥   ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(65, 2270)" fill="#292524">
          <rect x="0" y="0" width="3" height="30"/>
          <rect x="6" y="0" width="6" height="30"/>
          <rect x="15" y="0" width="2" height="30"/>
          <rect x="20" y="0" width="8" height="30"/>
          <rect x="31" y="0" width="3" height="30"/>
          <rect x="37" y="0" width="6" height="30"/>
          <rect x="46" y="0" width="2" height="30"/>
          <rect x="52" y="0" width="7" height="30"/>
          <rect x="62" y="0" width="4" height="30"/>
          <rect x="70" y="0" width="2" height="30"/>
          <rect x="76" y="0" width="6" height="30"/>
          <rect x="85" y="0" width="3" height="30"/>
          <rect x="92" y="0" width="8" height="30"/>
          <text x="50" y="44" text-anchor="middle" font-family="monospace" font-size="10" fill="#78716C">2026.09.14</text>
        </g>

        <!-- Postmark Stamp on Right -->
        <g transform="translate(${w - 105}, 2285)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="28" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="23" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="-4" text-anchor="middle" font-size="11" stroke="none">★</text>
          <text x="0" y="8" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" stroke="none">OFFICIAL</text>
        </g>
      </svg>
    `
  },

  /* =========================================================================
     5. FORMAT 4 FOTO — LUXURY GOLD NOIR STRIP (1:3)
     ========================================================================= */
  {
    id: 'gold-noir-4cuts',
    name: '4 Foto • Gold Noir',
    photoCount: 4,
    aspectRatio: '1:3',
    width: 800,
    height: 2400,
    description: 'Format 4 foto mewah bernuansa obsidian noir dengan ornamen botani emas 3D dan segel emas',
    badge: 'Gold Noir',
    theme: 'noir',
    slots: [
      { x: 50, y: 80, width: 700, height: 470, rx: 14 },
      { x: 50, y: 580, width: 700, height: 470, rx: 14 },
      { x: 50, y: 1080, width: 700, height: 470, rx: 14 },
      { x: 50, y: 1580, width: 700, height: 470, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 2400) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <defs>
          <linearGradient id="noirGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#141416" />
            <stop offset="100%" stop-color="#09090B" />
          </linearGradient>
          <linearGradient id="goldNoirGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D4AF37" />
            <stop offset="50%" stop-color="#FFF2A1" />
            <stop offset="100%" stop-color="#AA771C" />
          </linearGradient>
          <radialGradient id="waxGradGold" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FFE87C" />
            <stop offset="40%" stop-color="#D4AF37" />
            <stop offset="80%" stop-color="#996515" />
            <stop offset="100%" stop-color="#4A2E05" />
          </radialGradient>
          <filter id="shadow3d" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="3" dy="4" stdDeviation="4" flood-opacity="0.45"/>
          </filter>
        </defs>

        <rect width="${w}" height="${h}" rx="24" fill="url(#noirGrad)" />

        <!-- 4 Photo Apertures -->
        <rect x="50" y="80" width="700" height="470" rx="14" fill="#000000" stroke="url(#goldNoirGrad)" stroke-width="2.5" />
        <rect x="50" y="580" width="700" height="470" rx="14" fill="#000000" stroke="url(#goldNoirGrad)" stroke-width="2.5" />
        <rect x="50" y="1080" width="700" height="470" rx="14" fill="#000000" stroke="url(#goldNoirGrad)" stroke-width="2.5" />
        <rect x="50" y="1580" width="700" height="470" rx="14" fill="#000000" stroke="url(#goldNoirGrad)" stroke-width="2.5" />

        <!-- Top Washi Tape -->
        <g transform="translate(${w / 2 - 95}, 18) rotate(-2)">
          <rect width="190" height="32" rx="3" fill="#D4AF37" fill-opacity="0.4" stroke="#FFF2A1" stroke-width="1.5"/>
          <text x="95" y="21" text-anchor="middle" font-family="monospace" font-size="13" fill="#FFF2A1" letter-spacing="5">✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header -->
        <text x="${w / 2}" y="65" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="14" font-weight="700" letter-spacing="6" fill="url(#goldNoirGrad)">
          ✦ THE WEDDING NOIR • 4 CUTS ✦
        </text>

        <!-- 3D Overlapping Elements in Gold -->
        <!-- Photo 1 Top-Left: Golden Botanical Overhang -->
        <g filter="url(#shadow3d)" transform="translate(50, 80)">
          <path d="M -20 -20 Q 0 0 42 40" fill="none" stroke="#CA8A04" stroke-width="3" stroke-linecap="round"/>
          <path d="M 0 0 Q 12 -8 24 0 Q 12 8 0 0" fill="#D4AF37"/>
          <path d="M 16 16 Q 30 8 38 18 Q 26 28 16 16" fill="#FEF08A"/>
          <circle cx="8" cy="-4" r="3" fill="#FFE082"/>
        </g>

        <!-- Photo 1 Top-Right: Gold Washi Tape Corner -->
        <g filter="url(#shadow3d)" transform="translate(${50 + 700 - 14}, ${80 + 14}) rotate(-38)">
          <rect x="-55" y="-12" width="110" height="24" rx="2" fill="#D4AF37" fill-opacity="0.65" stroke="#FFF2A1" stroke-width="1"/>
          <text x="0" y="4" text-anchor="middle" font-size="11" fill="#FFF2A1">✦ ♥ ✦ ♥ ✦</text>
        </g>

        <!-- Photo 4 Bottom-Right: 3D Gold Wax Seal Overlapping Corner -->
        <g filter="url(#shadow3d)" transform="translate(${50 + 700 - 15}, ${1580 + 470 - 15})">
          <circle cx="0" cy="0" r="42" fill="url(#waxGradGold)"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="-8" cy="0" r="12" fill="none" stroke="#FFF0A5" stroke-width="3.5"/>
          <circle cx="8" cy="0" r="12" fill="none" stroke="#FFF0A5" stroke-width="3.5"/>
        </g>

        <!-- Clean Footer Area -->
        <g transform="translate(${w / 2}, 2150)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="52" font-style="italic" fill="url(#goldNoirGrad)">
            Forever Begins Today
          </text>
          <text y="36" font-family="'Montserrat', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#FDF0A6">
            ✦ MR & MRS CELEBRATION ✦
          </text>
          <text y="58" font-family="'Montserrat', sans-serif" font-size="11" fill="#A1A1AA">
            14 SEPTEMBER 2026 • JAKARTA, INDONESIA
          </text>
          <text y="82" font-size="14" fill="#E11D48">♥   ♥   ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(65, 2270)" fill="#FDF0A6">
          <rect x="0" y="0" width="3" height="30"/>
          <rect x="6" y="0" width="6" height="30"/>
          <rect x="15" y="0" width="2" height="30"/>
          <rect x="20" y="0" width="8" height="30"/>
          <rect x="31" y="0" width="3" height="30"/>
          <rect x="37" y="0" width="6" height="30"/>
          <rect x="46" y="0" width="2" height="30"/>
          <rect x="52" y="0" width="7" height="30"/>
          <rect x="62" y="0" width="4" height="30"/>
          <rect x="70" y="0" width="2" height="30"/>
          <rect x="76" y="0" width="6" height="30"/>
          <rect x="85" y="0" width="3" height="30"/>
          <rect x="92" y="0" width="8" height="30"/>
          <text x="50" y="44" text-anchor="middle" font-family="monospace" font-size="10" fill="#A1A1AA">2026.09.14</text>
        </g>

        <!-- Postmark Stamp on Right -->
        <g transform="translate(${w - 105}, 2285)" stroke="#D4AF37" fill="#D4AF37">
          <circle cx="0" cy="0" r="28" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="23" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="-4" text-anchor="middle" font-size="11" stroke="none">★</text>
          <text x="0" y="8" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="700" stroke="none">OFFICIAL</text>
        </g>
      </svg>
    `
  }
];

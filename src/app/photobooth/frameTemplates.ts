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
  aspectRatio: string; // e.g. '4:5', '1:2', '2:5', '1:3'
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
    name: '1 Foto • Polaroid',
    photoCount: 1,
    aspectRatio: '4:5',
    width: 1200,
    height: 1500,
    description: 'Format 1 foto klasik polaroid dengan kartu catatan pernikahan di bawah',
    badge: '1 Foto',
    theme: 'ivory',
    slots: [
      { x: 80, y: 90, width: 1040, height: 1040, rx: 16 }
    ],
    getSvgContent: (w = 1200, h = 1500) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="paperGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFBF9" />
            <stop offset="100%" stop-color="#F4EFE6" />
          </linearGradient>
          <filter id="shadow1" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#1A1816" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Outer Card Mask with Cutout for 1 Photo Slot -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 80 90 L ${w - 80} 90 L ${w - 80} 1130 L 80 1130 Z
        " fill="url(#paperGrad1)" fill-rule="evenodd" filter="url(#shadow1)" />

        <!-- Delicate Frame Outline around Photo -->
        <rect x="80" y="90" width="1040" height="1040" rx="16" fill="none" stroke="#E2DCD5" stroke-width="2" />

        <!-- Top Delicate Tag -->
        <g transform="translate(${w / 2}, 52)" text-anchor="middle">
          <text font-family="'Montserrat', sans-serif" font-size="16" font-weight="700" letter-spacing="6" fill="#44403C">
            ✦ THE WEDDING MEMORIES ✦
          </text>
        </g>

        <!-- Bottom Polaroid Card Area -->
        <g transform="translate(${w / 2}, ${h - 210})" text-anchor="middle">
          <!-- Calligraphy Script -->
          <text y="0" font-family="'Great Vibes', 'Playfair Display', cursive, serif" font-size="58" font-style="italic" fill="#1C1917">
            Together is a Beautiful Place to Be
          </text>

          <text y="54" font-family="'Montserrat', sans-serif" font-size="18" font-weight="700" letter-spacing="5" fill="#78350F">
            HAPPY EVER AFTER
          </text>

          <text y="90" font-family="Georgia, serif" font-size="15" letter-spacing="4" fill="#78716C">
            2026.09.14 • PHOTOBOOTH EDITION
          </text>
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
    description: 'Format kolase 2 foto vertikal dengan gaya photostrip minimalis modern',
    badge: '2 Foto',
    theme: 'ivory',
    slots: [
      { x: 60, y: 80, width: 680, height: 580, rx: 14 },
      { x: 60, y: 700, width: 680, height: 580, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 1600) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="paperGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF7" />
            <stop offset="100%" stop-color="#F2EDE4" />
          </linearGradient>
          <filter id="shadow2" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#1A1816" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Outer Card Mask with Cutout for 2 Photo Slots -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 60 80 L ${w - 60} 80 L ${w - 60} 660 L 60 660 Z
          M 60 700 L ${w - 60} 700 L ${w - 60} 1280 L 60 1280 Z
        " fill="url(#paperGrad2)" fill-rule="evenodd" filter="url(#shadow2)" />

        <!-- Inner Slot Borders -->
        <rect x="60" y="80" width="680" height="580" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />
        <rect x="60" y="700" width="680" height="580" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />

        <!-- Top Header -->
        <g transform="translate(${w / 2}, 48)" text-anchor="middle">
          <text font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#44403C">
            DUO MEMORIES • CELEBRATION
          </text>
        </g>

        <!-- Bottom Footer with Barcode -->
        <g transform="translate(${w / 2}, ${h - 170})" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', 'Playfair Display', cursive, serif" font-size="44" font-style="italic" fill="#1C1917">
            Always & Forever
          </text>

          <!-- Aesthetic Barcode -->
          <g transform="translate(-80, 24)">
            <rect x="0" y="0" width="3" height="28" fill="#292524"/>
            <rect x="6" y="0" width="5" height="28" fill="#292524"/>
            <rect x="15" y="0" width="2" height="28" fill="#292524"/>
            <rect x="21" y="0" width="8" height="28" fill="#292524"/>
            <rect x="33" y="0" width="3" height="28" fill="#292524"/>
            <rect x="40" y="0" width="6" height="28" fill="#292524"/>
            <rect x="50" y="0" width="2" height="28" fill="#292524"/>
            <rect x="56" y="0" width="7" height="28" fill="#292524"/>
            <rect x="68" y="0" width="4" height="28" fill="#292524"/>
            <rect x="76" y="0" width="2" height="28" fill="#292524"/>
            <rect x="82" y="0" width="6" height="28" fill="#292524"/>
            <rect x="92" y="0" width="3" height="28" fill="#292524"/>
            <rect x="98" y="0" width="8" height="28" fill="#292524"/>
            <rect x="110" y="0" width="4" height="28" fill="#292524"/>
            <rect x="118" y="0" width="2" height="28" fill="#292524"/>
            <rect x="124" y="0" width="7" height="28" fill="#292524"/>
            <rect x="135" y="0" width="3" height="28" fill="#292524"/>
            <rect x="142" y="0" width="6" height="28" fill="#292524"/>
            <rect x="152" y="0" width="4" height="28" fill="#292524"/>
            <text x="80" y="42" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="3" fill="#57534E">2026.09.14</text>
          </g>

          <text y="92" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600" letter-spacing="3" fill="#78716C">
            WEDDING SPECIAL EDITION
          </text>
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
    description: 'Format kolase 3 foto vertikal klasik ala photobooth retro vintage',
    badge: '3 Foto',
    theme: 'ivory',
    slots: [
      { x: 60, y: 80, width: 680, height: 500, rx: 14 },
      { x: 60, y: 620, width: 680, height: 500, rx: 14 },
      { x: 60, y: 1160, width: 680, height: 500, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 2000) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="paperGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF7" />
            <stop offset="100%" stop-color="#F2EDE4" />
          </linearGradient>
          <filter id="shadow3" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#1A1816" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Outer Card Mask with Cutout for 3 Photo Slots -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 60 80 L ${w - 60} 80 L ${w - 60} 580 L 60 580 Z
          M 60 620 L ${w - 60} 620 L ${w - 60} 1120 L 60 1120 Z
          M 60 1160 L ${w - 60} 1160 L ${w - 60} 1660 L 60 1660 Z
        " fill="url(#paperGrad3)" fill-rule="evenodd" filter="url(#shadow3)" />

        <!-- Inner Slot Borders -->
        <rect x="60" y="80" width="680" height="500" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />
        <rect x="60" y="620" width="680" height="500" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />
        <rect x="60" y="1160" width="680" height="500" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />

        <!-- Top Header -->
        <g transform="translate(${w / 2}, 48)" text-anchor="middle">
          <text font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#44403C">
            TRIO CUTS • WEDDING DAY
          </text>
        </g>

        <!-- Bottom Footer -->
        <g transform="translate(${w / 2}, ${h - 180})" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', 'Playfair Display', cursive, serif" font-size="46" font-style="italic" fill="#1C1917">
            The Best Day Ever
          </text>

          <!-- 3 Cute Hearts -->
          <g transform="translate(0, 20)" fill="#E11D48">
            <path d="M -24 0 C -24 -6, -16 -6, -16 0 C -16 6, -24 10, -24 10 C -24 10, -32 6, -32 0 C -32 -6, -24 -6, -24 0 Z"/>
            <path d="M 0 -2 C 0 -9, 10 -9, 10 -2 C 10 5, 0 10, 0 10 C 0 10, -10 5, -10 -2 C -10 -9, 0 -9, 0 -2 Z" transform="scale(1.2) translate(0, -1)"/>
            <path d="M 24 0 C 24 -6, 32 -6, 32 0 C 32 6, 24 10, 24 10 C 24 10, 16 6, 16 0 C 16 -6, 24 -6, 24 0 Z"/>
          </g>

          <text y="64" font-family="'Montserrat', sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#78350F">
            MR & MRS CELEBRATION
          </text>
          <text y="88" font-family="monospace" font-size="11" letter-spacing="3" fill="#78716C">
            2026.09.14 • PHOTOBOOTH
          </text>
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
    description: 'Format photostrip 4 foto vertikal ala Korea (Haru Film / Life4Cuts) paling favorit',
    badge: '4 Foto',
    theme: 'ivory',
    slots: [
      { x: 50, y: 70, width: 700, height: 480, rx: 14 },
      { x: 50, y: 580, width: 700, height: 480, rx: 14 },
      { x: 50, y: 1090, width: 700, height: 480, rx: 14 },
      { x: 50, y: 1600, width: 700, height: 480, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 2400) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="paperGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF7" />
            <stop offset="100%" stop-color="#F2EDE4" />
          </linearGradient>
          <filter id="shadow4" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#1A1816" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Outer Card Mask with Cutout for 4 Photo Slots -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 50 70 L ${w - 50} 70 L ${w - 50} 550 L 50 550 Z
          M 50 580 L ${w - 50} 580 L ${w - 50} 1060 L 50 1060 Z
          M 50 1090 L ${w - 50} 1090 L ${w - 50} 1570 L 50 1570 Z
          M 50 1600 L ${w - 50} 1600 L ${w - 50} 2080 L 50 2080 Z
        " fill="url(#paperGrad4)" fill-rule="evenodd" filter="url(#shadow4)" />

        <!-- Inner Slot Borders -->
        <rect x="50" y="70" width="700" height="480" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />
        <rect x="50" y="580" width="700" height="480" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />
        <rect x="50" y="1090" width="700" height="480" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />
        <rect x="50" y="1600" width="700" height="480" rx="14" fill="none" stroke="#E2DCD5" stroke-width="2" />

        <!-- Top Header -->
        <g transform="translate(${w / 2}, 42)" text-anchor="middle">
          <text font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="6" fill="#44403C">
            LIFE 4 CUTS • WEDDING SPECIAL
          </text>
        </g>

        <!-- Bottom Card with Script and Barcode -->
        <g transform="translate(${w / 2}, ${h - 180})" text-anchor="middle">
          <text y="-20" font-family="'Great Vibes', 'Playfair Display', cursive, serif" font-size="52" font-style="italic" fill="#1C1917">
            Happy Ever After with You
          </text>

          <!-- Aesthetic Barcode & Details -->
          <g transform="translate(-140, 20)">
            <g fill="#292524">
              <rect x="0" y="0" width="3" height="34"/>
              <rect x="6" y="0" width="6" height="34"/>
              <rect x="16" y="0" width="2" height="34"/>
              <rect x="22" y="0" width="8" height="34"/>
              <rect x="34" y="0" width="3" height="34"/>
              <rect x="41" y="0" width="6" height="34"/>
              <rect x="51" y="0" width="2" height="34"/>
              <rect x="58" y="0" width="8" height="34"/>
              <rect x="70" y="0" width="4" height="34"/>
              <rect x="78" y="0" width="2" height="34"/>
              <rect x="84" y="0" width="6" height="34"/>
              <rect x="94" y="0" width="3" height="34"/>
              <rect x="101" y="0" width="8" height="34"/>
            </g>
            <text x="52" y="48" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="3" fill="#57534E">2026.09.14</text>
          </g>

          <g transform="translate(40, 22)" text-anchor="start">
            <text x="0" y="10" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="#1C1917">
              MR & MRS CELEBRATION
            </text>
            <text x="0" y="28" font-family="'Montserrat', sans-serif" font-size="11" letter-spacing="2" fill="#78716C">
              MEMORIES PHOTOBOOTH
            </text>
            <text x="0" y="44" font-family="'Montserrat', sans-serif" font-size="10" letter-spacing="1.5" fill="#A8A29E">
              ♥ STORED WITH LOVE ♥
            </text>
          </g>
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
    description: 'Format 4 foto vertikal mewah dengan tema hitam malam & emas berkilau',
    badge: 'Gold Noir',
    theme: 'noir',
    slots: [
      { x: 50, y: 70, width: 700, height: 480, rx: 14 },
      { x: 50, y: 580, width: 700, height: 480, rx: 14 },
      { x: 50, y: 1090, width: 700, height: 480, rx: 14 },
      { x: 50, y: 1600, width: 700, height: 480, rx: 14 }
    ],
    getSvgContent: (w = 800, h = 2400) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="noirGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#18181B" />
            <stop offset="100%" stop-color="#09090B" />
          </linearGradient>
          <linearGradient id="goldNoir" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D4AF37" />
            <stop offset="30%" stop-color="#FFF2A1" />
            <stop offset="70%" stop-color="#AA771C" />
            <stop offset="100%" stop-color="#FDF0A6" />
          </linearGradient>
        </defs>

        <!-- Outer Card Mask with Cutout for 4 Photo Slots -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 50 70 L ${w - 50} 70 L ${w - 50} 550 L 50 550 Z
          M 50 580 L ${w - 50} 580 L ${w - 50} 1060 L 50 1060 Z
          M 50 1090 L ${w - 50} 1090 L ${w - 50} 1570 L 50 1570 Z
          M 50 1600 L ${w - 50} 1600 L ${w - 50} 2080 L 50 2080 Z
        " fill="url(#noirGrad)" fill-rule="evenodd" />

        <!-- Gold Outlines around Slots -->
        <rect x="50" y="70" width="700" height="480" rx="14" fill="none" stroke="url(#goldNoir)" stroke-width="2" />
        <rect x="50" y="580" width="700" height="480" rx="14" fill="none" stroke="url(#goldNoir)" stroke-width="2" />
        <rect x="50" y="1090" width="700" height="480" rx="14" fill="none" stroke="url(#goldNoir)" stroke-width="2" />
        <rect x="50" y="1600" width="700" height="480" rx="14" fill="none" stroke="url(#goldNoir)" stroke-width="2" />

        <!-- Top Header -->
        <g transform="translate(${w / 2}, 42)" text-anchor="middle">
          <text font-family="'Cinzel', Georgia, serif" font-size="14" font-weight="700" letter-spacing="6" fill="url(#goldNoir)">
            ✦ THE WEDDING NOIR • 4 CUTS ✦
          </text>
        </g>

        <!-- Bottom Footer -->
        <g transform="translate(${w / 2}, ${h - 170})" text-anchor="middle">
          <text y="-10" font-family="'Great Vibes', 'Playfair Display', cursive, serif" font-size="52" font-style="italic" fill="url(#goldNoir)">
            Forever Begins Today
          </text>

          <text y="42" font-family="'Cinzel', 'Montserrat', serif" font-size="14" font-weight="700" letter-spacing="4" fill="#FDF0A6">
            CELEBRATING OUR SPECIAL DAY
          </text>
          <text y="70" font-family="monospace" font-size="12" letter-spacing="3" fill="#A1A1AA">
            2026.09.14 • PRIVATE EDITION
          </text>
        </g>
      </svg>
    `
  }
];

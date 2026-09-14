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
    description: 'Format 1 foto klasik polaroid dengan washi tape emas, segel lilin wax seal, dan stempel pos',
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
            <stop offset="0%" stop-color="#E11D48" />
            <stop offset="50%" stop-color="#9F1239" />
            <stop offset="100%" stop-color="#3F0414" />
          </radialGradient>
        </defs>

        <!-- Base Paper Card -->
        <rect width="${w}" height="${h}" rx="28" fill="url(#paperGrad1)" />

        <!-- Photo Cutout / Aperture -->
        <rect x="80" y="90" width="1040" height="1040" rx="16" fill="#292524" />
        <rect x="80" y="90" width="1040" height="1040" rx="16" fill="none" stroke="#D7CCC8" stroke-width="3" />

        <!-- Corner Botanical Flourishes -->
        <g stroke="#C59B27" fill="#C59B27">
          <!-- Top-Left -->
          <path d="M 40 70 Q 40 40 70 40" fill="none" stroke-width="3"/>
          <circle cx="50" cy="50" r="5"/>
          <text x="35" y="45" font-size="18">✦</text>
          <!-- Top-Right -->
          <path d="M ${w - 40} 70 Q ${w - 40} 40 ${w - 70} 40" fill="none" stroke-width="3"/>
          <circle cx="${w - 50}" cy="50" r="5"/>
          <text x="${w - 45}" y="45" font-size="18">✦</text>
        </g>

        <!-- Top Washi Tape Sticker (Tilted) -->
        <g transform="translate(${w / 2 - 110}, 24) rotate(-2)">
          <rect width="220" height="34" rx="3" fill="#FEF08A" fill-opacity="0.9" stroke="#FDE047" stroke-width="1.5"/>
          <text x="110" y="22" text-anchor="middle" font-family="monospace" font-size="14" fill="#92400E" letter-spacing="6">✦ ✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header Text -->
        <text x="${w / 2}" y="74" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="16" font-weight="700" letter-spacing="6" fill="#1C1917">
          ✦ THE WEDDING CELEBRATION ✦
        </text>

        <!-- Bottom Polaroid Card Area -->
        <g transform="translate(${w / 2}, 1220)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="54" font-style="italic" fill="#1C1917">
            Together is a Beautiful Place
          </text>
          <text y="36" font-size="20" fill="#E11D48">♥ ♥ ♥</text>
        </g>

        <!-- Bottom Left: Barcode -->
        <g transform="translate(100, 1310)" fill="#292524">
          <rect x="0" y="0" width="4" height="36"/>
          <rect x="8" y="0" width="7" height="36"/>
          <rect x="19" y="0" width="2" height="36"/>
          <rect x="25" y="0" width="9" height="36"/>
          <rect x="38" y="0" width="3" height="36"/>
          <rect x="45" y="0" width="6" height="36"/>
          <rect x="55" y="0" width="3" height="36"/>
          <rect x="62" y="0" width="8" height="36"/>
          <rect x="74" y="0" width="4" height="36"/>
          <rect x="82" y="0" width="2" height="36"/>
          <rect x="88" y="0" width="7" height="36"/>
          <rect x="99" y="0" width="3" height="36"/>
          <rect x="106" y="0" width="8" height="36"/>
          <rect x="118" y="0" width="4" height="36"/>
          <text x="60" y="52" text-anchor="middle" font-family="monospace" font-size="13" fill="#78716C">2026.09.14</text>
        </g>

        <!-- Bottom Right: 3D Wax Seal & Stamp -->
        <!-- Postmark Stamp -->
        <g transform="translate(${w - 240}, 1325)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="34" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="28" fill="none" stroke-width="1" stroke-dasharray="4 2"/>
          <text x="0" y="-8" text-anchor="middle" font-size="14" stroke="none">★</text>
          <text x="0" y="8" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" stroke="none">OFFICIAL</text>
          <text x="0" y="18" text-anchor="middle" font-family="sans-serif" font-size="8" stroke="none">GUEST</text>
        </g>

        <!-- 3D Wax Seal with Rings -->
        <g transform="translate(${w - 140}, 1325)">
          <circle cx="0" cy="0" r="44" fill="url(#waxGrad1)"/>
          <circle cx="0" cy="0" r="32" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>
          <circle cx="-9" cy="0" r="14" fill="none" stroke="#FFE082" stroke-width="4"/>
          <circle cx="9" cy="0" r="14" fill="none" stroke="#FFE082" stroke-width="4"/>
          <circle cx="-9" cy="-14" r="3" fill="#FFFFFF"/>
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
    description: 'Format 2 foto vertikal dengan ornamen botani, washi tape, dan segel lilin',
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
            <stop offset="0%" stop-color="#E11D48" />
            <stop offset="50%" stop-color="#9F1239" />
            <stop offset="100%" stop-color="#3F0414" />
          </radialGradient>
        </defs>

        <rect width="${w}" height="${h}" rx="24" fill="url(#paperGrad2)" />

        <!-- 2 Photo Apertures -->
        <rect x="60" y="90" width="680" height="570" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="60" y="690" width="680" height="570" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />

        <!-- Top Washi Tape -->
        <g transform="translate(${w / 2 - 90}, 18) rotate(-2)">
          <rect width="180" height="30" rx="3" fill="#FEF08A" fill-opacity="0.9" stroke="#FDE047" stroke-width="1.5"/>
          <text x="90" y="20" text-anchor="middle" font-family="monospace" font-size="13" fill="#92400E" letter-spacing="5">✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header -->
        <text x="${w / 2}" y="70" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#1C1917">
          ✦ DUO MEMORIES • CELEBRATION ✦
        </text>

        <!-- Bottom Area -->
        <g transform="translate(${w / 2}, 1320)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="46" font-style="italic" fill="#1C1917">
            Always & Forever
          </text>
          <text y="28" font-size="18" fill="#E11D48">♥ ♥ ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(80, 1380)" fill="#292524">
          <rect x="0" y="0" width="3" height="32"/>
          <rect x="6" y="0" width="6" height="32"/>
          <rect x="15" y="0" width="2" height="32"/>
          <rect x="20" y="0" width="7" height="32"/>
          <rect x="30" y="0" width="3" height="32"/>
          <rect x="36" y="0" width="5" height="32"/>
          <rect x="44" y="0" width="2" height="32"/>
          <rect x="49" y="0" width="7" height="32"/>
          <rect x="59" y="0" width="4" height="32"/>
          <rect x="66" y="0" width="2" height="32"/>
          <rect x="71" y="0" width="6" height="32"/>
          <rect x="80" y="0" width="3" height="32"/>
          <rect x="86" y="0" width="7" height="32"/>
          <text x="48" y="46" text-anchor="middle" font-family="monospace" font-size="11" fill="#78716C">2026.09.14</text>
        </g>

        <!-- Postmark Stamp & Wax Seal on Right -->
        <g transform="translate(${w - 180}, 1400)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="26" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="21" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="4" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" stroke="none">GUEST</text>
        </g>
        <g transform="translate(${w - 100}, 1400)">
          <circle cx="0" cy="0" r="38" fill="url(#waxGrad2)"/>
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="-7" cy="0" r="11" fill="none" stroke="#FFE082" stroke-width="3"/>
          <circle cx="7" cy="0" r="11" fill="none" stroke="#FFE082" stroke-width="3"/>
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
    description: 'Format 3 foto vertikal dengan stiker washi tape, ornamen floral, dan segel wax seal',
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
            <stop offset="0%" stop-color="#E11D48" />
            <stop offset="50%" stop-color="#9F1239" />
            <stop offset="100%" stop-color="#3F0414" />
          </radialGradient>
        </defs>

        <rect width="${w}" height="${h}" rx="24" fill="url(#paperGrad3)" />

        <!-- 3 Photo Apertures -->
        <rect x="60" y="90" width="680" height="490" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="60" y="610" width="680" height="490" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="60" y="1130" width="680" height="490" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />

        <!-- Top Washi Tape -->
        <g transform="translate(${w / 2 - 90}, 18) rotate(-2)">
          <rect width="180" height="30" rx="3" fill="#FEF08A" fill-opacity="0.9" stroke="#FDE047" stroke-width="1.5"/>
          <text x="90" y="20" text-anchor="middle" font-family="monospace" font-size="13" fill="#92400E" letter-spacing="5">✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header -->
        <text x="${w / 2}" y="70" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#1C1917">
          ✦ TRIO CUTS • WEDDING SPECIAL ✦
        </text>

        <!-- Bottom Area -->
        <g transform="translate(${w / 2}, 1690)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="48" font-style="italic" fill="#1C1917">
            The Best Day Ever
          </text>
          <text y="30" font-size="20" fill="#E11D48">♥ ♥ ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(80, 1760)" fill="#292524">
          <rect x="0" y="0" width="3" height="32"/>
          <rect x="6" y="0" width="6" height="32"/>
          <rect x="15" y="0" width="2" height="32"/>
          <rect x="20" y="0" width="7" height="32"/>
          <rect x="30" y="0" width="3" height="32"/>
          <rect x="36" y="0" width="5" height="32"/>
          <rect x="44" y="0" width="2" height="32"/>
          <rect x="49" y="0" width="7" height="32"/>
          <rect x="59" y="0" width="4" height="32"/>
          <rect x="66" y="0" width="2" height="32"/>
          <rect x="71" y="0" width="6" height="32"/>
          <rect x="80" y="0" width="3" height="32"/>
          <rect x="86" y="0" width="7" height="32"/>
          <text x="48" y="46" text-anchor="middle" font-family="monospace" font-size="11" fill="#78716C">2026.09.14</text>
        </g>

        <!-- Postmark Stamp & Wax Seal on Right -->
        <g transform="translate(${w - 180}, 1780)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="26" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="21" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="4" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" stroke="none">GUEST</text>
        </g>
        <g transform="translate(${w - 100}, 1780)">
          <circle cx="0" cy="0" r="38" fill="url(#waxGrad3)"/>
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="-7" cy="0" r="11" fill="none" stroke="#FFE082" stroke-width="3"/>
          <circle cx="7" cy="0" r="11" fill="none" stroke="#FFE082" stroke-width="3"/>
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
    description: 'Format photostrip 4 foto bertingkat ala Korea dengan barcode, washi tape, dan wax seal',
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
            <stop offset="0%" stop-color="#E11D48" />
            <stop offset="50%" stop-color="#9F1239" />
            <stop offset="100%" stop-color="#3F0414" />
          </radialGradient>
        </defs>

        <rect width="${w}" height="${h}" rx="24" fill="url(#paperGrad4)" />

        <!-- 4 Photo Apertures -->
        <rect x="50" y="80" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="50" y="580" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="50" y="1080" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />
        <rect x="50" y="1580" width="700" height="470" rx="14" fill="#292524" stroke="#D7CCC8" stroke-width="2.5" />

        <!-- Top Washi Tape -->
        <g transform="translate(${w / 2 - 95}, 18) rotate(-2)">
          <rect width="190" height="32" rx="3" fill="#FEF08A" fill-opacity="0.9" stroke="#FDE047" stroke-width="1.5"/>
          <text x="95" y="21" text-anchor="middle" font-family="monospace" font-size="13" fill="#92400E" letter-spacing="5">✦ ✦ ✦ ✦</text>
        </g>

        <!-- Top Header -->
        <text x="${w / 2}" y="65" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="5" fill="#1C1917">
          ✦ LIFE 4 CUTS • WEDDING EDITION ✦
        </text>

        <!-- Bottom Area -->
        <g transform="translate(${w / 2}, 2130)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="52" font-style="italic" fill="#1C1917">
            Happy Ever After with You
          </text>
          <text y="32" font-size="20" fill="#E11D48">♥ ♥ ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(70, 2200)" fill="#292524">
          <rect x="0" y="0" width="3" height="34"/>
          <rect x="6" y="0" width="6" height="34"/>
          <rect x="15" y="0" width="2" height="34"/>
          <rect x="20" y="0" width="8" height="34"/>
          <rect x="31" y="0" width="3" height="34"/>
          <rect x="37" y="0" width="6" height="34"/>
          <rect x="46" y="0" width="2" height="34"/>
          <rect x="52" y="0" width="7" height="34"/>
          <rect x="62" y="0" width="4" height="34"/>
          <rect x="70" y="0" width="2" height="34"/>
          <rect x="76" y="0" width="6" height="34"/>
          <rect x="85" y="0" width="3" height="34"/>
          <rect x="92" y="0" width="8" height="34"/>
          <text x="50" y="50" text-anchor="middle" font-family="monospace" font-size="11" fill="#78716C">2026.09.14</text>
        </g>

        <!-- Postmark Stamp & Wax Seal on Right -->
        <g transform="translate(${w - 180}, 2220)" stroke="#9A3412" fill="#9A3412">
          <circle cx="0" cy="0" r="28" fill="none" stroke-width="2"/>
          <circle cx="0" cy="0" r="23" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="4" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" stroke="none">GUEST</text>
        </g>
        <g transform="translate(${w - 100}, 2220)">
          <circle cx="0" cy="0" r="40" fill="url(#waxGrad4)"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="-8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3"/>
          <circle cx="8" cy="0" r="12" fill="none" stroke="#FFE082" stroke-width="3"/>
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
    description: 'Format 4 foto mewah dengan nuansa malam hitam pekat dan ornamen emas berkilau',
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

        <!-- Bottom Area -->
        <g transform="translate(${w / 2}, 2130)" text-anchor="middle">
          <text y="0" font-family="'Great Vibes', cursive, Georgia, serif" font-size="52" font-style="italic" fill="url(#goldNoirGrad)">
            Forever Begins Today
          </text>
          <text y="32" font-size="20" fill="#E11D48">♥ ♥ ♥</text>
        </g>

        <!-- Barcode on Left -->
        <g transform="translate(70, 2200)" fill="#FDF0A6">
          <rect x="0" y="0" width="3" height="34"/>
          <rect x="6" y="0" width="6" height="34"/>
          <rect x="15" y="0" width="2" height="34"/>
          <rect x="20" y="0" width="8" height="34"/>
          <rect x="31" y="0" width="3" height="34"/>
          <rect x="37" y="0" width="6" height="34"/>
          <rect x="46" y="0" width="2" height="34"/>
          <rect x="52" y="0" width="7" height="34"/>
          <rect x="62" y="0" width="4" height="34"/>
          <rect x="70" y="0" width="2" height="34"/>
          <rect x="76" y="0" width="6" height="34"/>
          <rect x="85" y="0" width="3" height="34"/>
          <rect x="92" y="0" width="8" height="34"/>
          <text x="50" y="50" text-anchor="middle" font-family="monospace" font-size="11" fill="#A1A1AA">2026.09.14</text>
        </g>
      </svg>
    `
  }
];

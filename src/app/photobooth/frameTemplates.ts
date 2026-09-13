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
  /* =========================================================================
     1. THE ROYAL BOTANICAL GOLD (3:4)
     Ultra-luxurious gold foil borders, ornate botanical corners, elegant crest
     ========================================================================= */
  {
    id: 'botanical-gold',
    name: 'Botanical Gold',
    aspectRatio: '3:4',
    width: 1200,
    height: 1600,
    description: 'Kemewahan emas klasik dengan ornamen bunga botani dan kaligrafi anggun',
    badge: 'Luxury Gold',
    getSvgContent: (w = 1200, h = 1600) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Rich Multi-Stop Gold Gradient -->
          <linearGradient id="goldLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C59B27" />
            <stop offset="20%" stop-color="#FDF0A6" />
            <stop offset="40%" stop-color="#D4AF37" />
            <stop offset="65%" stop-color="#FFE885" />
            <stop offset="85%" stop-color="#AA771C" />
            <stop offset="100%" stop-color="#6B4706" />
          </linearGradient>

          <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFF8D6" />
            <stop offset="50%" stop-color="#D4AF37" />
            <stop offset="100%" stop-color="#916412" />
          </linearGradient>

          <!-- Drop Shadow Filter for text & flourishes -->
          <filter id="luxeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.85"/>
          </filter>
        </defs>

        <!-- Outer Double Frame Borders -->
        <rect x="36" y="36" width="${w - 72}" height="${h - 72}" fill="none" stroke="url(#goldLuxe)" stroke-width="4" rx="28" />
        <rect x="52" y="52" width="${w - 104}" height="${h - 104}" fill="none" stroke="url(#goldLuxe)" stroke-width="1.5" stroke-dasharray="8 6" rx="20" />
        <rect x="62" y="62" width="${w - 124}" height="${h - 124}" fill="none" stroke="url(#goldLuxe)" stroke-width="0.8" rx="14" opacity="0.7" />

        <!-- CORNER 1: TOP-LEFT BOTANICAL ORNAMENT -->
        <g transform="translate(64, 64)" stroke="url(#goldLuxe)" fill="none" stroke-linecap="round">
          <!-- Swirls & Vines -->
          <path d="M 0 110 C 0 45, 45 0, 110 0" stroke-width="3" />
          <path d="M 12 120 C 12 60, 60 12, 120 12" stroke-width="1.5" />
          <!-- Leaves -->
          <path d="M 50 16 Q 70 8 85 20 Q 65 30 50 16 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 16 50 Q 8 70 20 85 Q 30 65 16 50 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 85 20 Q 105 15 115 32 Q 95 38 85 20 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 20 85 Q 15 105 32 115 Q 38 95 20 85 Z" fill="url(#goldLuxe)" stroke="none" />
          <!-- Central Flower Bud -->
          <circle cx="42" cy="42" r="10" fill="url(#goldLuxe)" stroke="none" filter="url(#luxeShadow)" />
          <circle cx="42" cy="42" r="4" fill="#FFF8D6" stroke="none" />
          <!-- Sparkling Accent -->
          <text x="25" y="28" fill="url(#goldLuxe)" font-size="20" stroke="none">✦</text>
        </g>

        <!-- CORNER 2: TOP-RIGHT BOTANICAL ORNAMENT -->
        <g transform="translate(${w - 64}, 64) scale(-1, 1)" stroke="url(#goldLuxe)" fill="none" stroke-linecap="round">
          <path d="M 0 110 C 0 45, 45 0, 110 0" stroke-width="3" />
          <path d="M 12 120 C 12 60, 60 12, 120 12" stroke-width="1.5" />
          <path d="M 50 16 Q 70 8 85 20 Q 65 30 50 16 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 16 50 Q 8 70 20 85 Q 30 65 16 50 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 85 20 Q 105 15 115 32 Q 95 38 85 20 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 20 85 Q 15 105 32 115 Q 38 95 20 85 Z" fill="url(#goldLuxe)" stroke="none" />
          <circle cx="42" cy="42" r="10" fill="url(#goldLuxe)" stroke="none" filter="url(#luxeShadow)" />
          <circle cx="42" cy="42" r="4" fill="#FFF8D6" stroke="none" />
          <text x="25" y="28" fill="url(#goldLuxe)" font-size="20" stroke="none">✦</text>
        </g>

        <!-- CORNER 3: BOTTOM-LEFT BOTANICAL ORNAMENT -->
        <g transform="translate(64, ${h - 64}) scale(1, -1)" stroke="url(#goldLuxe)" fill="none" stroke-linecap="round">
          <path d="M 0 110 C 0 45, 45 0, 110 0" stroke-width="3" />
          <path d="M 12 120 C 12 60, 60 12, 120 12" stroke-width="1.5" />
          <path d="M 50 16 Q 70 8 85 20 Q 65 30 50 16 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 16 50 Q 8 70 20 85 Q 30 65 16 50 Z" fill="url(#goldLuxe)" stroke="none" />
          <circle cx="42" cy="42" r="10" fill="url(#goldLuxe)" stroke="none" filter="url(#luxeShadow)" />
          <circle cx="42" cy="42" r="4" fill="#FFF8D6" stroke="none" />
        </g>

        <!-- CORNER 4: BOTTOM-RIGHT BOTANICAL ORNAMENT -->
        <g transform="translate(${w - 64}, ${h - 64}) scale(-1, -1)" stroke="url(#goldLuxe)" fill="none" stroke-linecap="round">
          <path d="M 0 110 C 0 45, 45 0, 110 0" stroke-width="3" />
          <path d="M 12 120 C 12 60, 60 12, 120 12" stroke-width="1.5" />
          <path d="M 50 16 Q 70 8 85 20 Q 65 30 50 16 Z" fill="url(#goldLuxe)" stroke="none" />
          <path d="M 16 50 Q 8 70 20 85 Q 30 65 16 50 Z" fill="url(#goldLuxe)" stroke="none" />
          <circle cx="42" cy="42" r="10" fill="url(#goldLuxe)" stroke="none" filter="url(#luxeShadow)" />
          <circle cx="42" cy="42" r="4" fill="#FFF8D6" stroke="none" />
        </g>

        <!-- TOP HEADER CREST & TITLE -->
        <g transform="translate(${w / 2}, 105)" filter="url(#luxeShadow)">
          <!-- Golden Floral Crest Emblem -->
          <circle cx="0" cy="-28" r="18" fill="none" stroke="url(#goldLuxe)" stroke-width="2"/>
          <circle cx="0" cy="-28" r="14" fill="url(#goldLuxe)" fill-opacity="0.2"/>
          <text x="0" y="-22" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="url(#goldLuxe)">✦</text>

          <!-- Arching Divider Lines -->
          <path d="M -300 -28 L -35 -28" stroke="url(#goldLuxe)" stroke-width="1.5" stroke-linecap="round" />
          <path d="M 35 -28 L 300 -28" stroke="url(#goldLuxe)" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="-300" cy="-28" r="3.5" fill="url(#goldLuxe)" />
          <circle cx="300" cy="-28" r="3.5" fill="url(#goldLuxe)" />

          <!-- Main Header Text -->
          <text x="0" y="8" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="30" font-weight="700" letter-spacing="10" fill="url(#goldText)">
            THE WEDDING OF
          </text>
          <text x="0" y="32" text-anchor="middle" font-family="Georgia, serif" font-size="16" letter-spacing="6" fill="#FDF0A6" opacity="0.95">
            CELEBRATING TRUE LOVE & HAPPINESS
          </text>
        </g>

        <!-- BOTTOM FOOTER RIBBON & CALLIGRAPHY -->
        <g transform="translate(${w / 2}, ${h - 110})" filter="url(#luxeShadow)">
          <!-- Top Divider Line with Diamonds -->
          <line x1="-320" y1="-52" x2="320" y2="-52" stroke="url(#goldLuxe)" stroke-width="1.5"/>
          <polygon points="0,-57 6,-52 0,-47 -6,-52" fill="url(#goldLuxe)"/>
          <polygon points="-160,-55 -156,-52 -160,-49 -164,-52" fill="url(#goldLuxe)"/>
          <polygon points="160,-55 164,-52 160,-49 156,-52" fill="url(#goldLuxe)"/>

          <!-- Calligraphy Quote -->
          <text x="0" y="-10" text-anchor="middle" font-family="'Great Vibes', 'Playfair Display', 'Brush Script MT', Georgia, cursive, serif" font-size="54" font-style="italic" fill="url(#goldText)">
            Forever Begins Today
          </text>

          <!-- Bottom Subtitle Banner -->
          <rect x="-240" y="10" width="480" height="34" rx="17" fill="#1C1917" fill-opacity="0.7" stroke="url(#goldLuxe)" stroke-width="1"/>
          <text x="0" y="32" text-anchor="middle" font-family="'Cinzel', 'Montserrat', Georgia, sans-serif" font-size="14" font-weight="600" letter-spacing="5" fill="#FFE885">
            ✦ THANK YOU FOR CELEBRATING WITH US ✦
          </text>
        </g>
      </svg>
    `
  },

  /* =========================================================================
     2. KOREAN PHOTOSTRIP • LIFE4CUTS CHIC (3:4)
     Modern Korean photo-booth style with off-white card border, barcode, date stamp
     ========================================================================= */
  {
    id: 'korean-photostrip',
    name: 'Life4Cuts Chic',
    aspectRatio: '3:4',
    width: 1200,
    height: 1600,
    description: 'Format photostrip Korea modern dengan kartu putih gading, barcode, dan cap tanggal',
    badge: 'Korean Aesthetic',
    getSvgContent: (w = 1200, h = 1600) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Soft Paper Cardstock Gradient -->
          <linearGradient id="koreanPaper" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FDFCF9" />
            <stop offset="100%" stop-color="#F4EFE6" />
          </linearGradient>

          <filter id="koreanShadow" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#1F1D1A" flood-opacity="0.4"/>
          </filter>
        </defs>

        <!-- Solid Outer Card Mask with Rounded Cutout Aperture for Camera Photo -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 54 110
          L ${w - 54} 110
          A 24 24 0 0 1 ${w - 30} 134
          L ${w - 30} ${h - 250}
          A 24 24 0 0 1 ${w - 54} ${h - 226}
          L 54 ${h - 226}
          A 24 24 0 0 1 30 ${h - 250}
          L 30 134
          A 24 24 0 0 1 54 110
          Z
        " fill="url(#koreanPaper)" fill-rule="evenodd" filter="url(#koreanShadow)" />

        <!-- Subtle Hairline Border around Photo Cutout -->
        <rect x="30" y="110" width="${w - 60}" height="${h - 336}" rx="24" fill="none" stroke="#E2DCD5" stroke-width="2" />

        <!-- TOP BAR: Minimalist Korean Header -->
        <g transform="translate(${w / 2}, 62)">
          <!-- Cute 3-Heart Cluster -->
          <g transform="translate(0, -18)" fill="#E11D48">
            <path d="M -22 0 C -22 -6, -14 -6, -14 0 C -14 6, -22 10, -22 10 C -22 10, -30 6, -30 0 C -30 -6, -22 -6, -22 0 Z"/>
            <path d="M 0 -2 C 0 -9, 10 -9, 10 -2 C 10 5, 0 10, 0 10 C 0 10, -10 5, -10 -2 C -10 -9, 0 -9, 0 -2 Z" transform="scale(1.2) translate(0, -1)"/>
            <path d="M 22 0 C 22 -6, 30 -6, 30 0 C 30 6, 22 10, 22 10 C 22 10, 14 6, 14 0 C 14 -6, 22 -6, 22 0 Z"/>
          </g>

          <text x="0" y="18" text-anchor="middle" font-family="'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="700" letter-spacing="8" fill="#292524">
            HARU MEMORIES • WEDDING SPECIAL
          </text>
        </g>

        <!-- BOTTOM CARD: Korean Photostrip Style Footer -->
        <g transform="translate(${w / 2}, ${h - 130})">
          <!-- Main Romantic Script -->
          <text x="0" y="-34" text-anchor="middle" font-family="'Great Vibes', 'Playfair Display', cursive, serif" font-size="50" font-style="italic" fill="#1C1917">
            Happy Ever After with You
          </text>

          <!-- Aesthetic Barcode & Serial Stamp -->
          <g transform="translate(-160, 4)">
            <!-- Barcode Lines -->
            <rect x="0" y="0" width="3" height="32" fill="#292524"/>
            <rect x="5" y="0" width="6" height="32" fill="#292524"/>
            <rect x="15" y="0" width="2" height="32" fill="#292524"/>
            <rect x="20" y="0" width="8" height="32" fill="#292524"/>
            <rect x="32" y="0" width="3" height="32" fill="#292524"/>
            <rect x="38" y="0" width="5" height="32" fill="#292524"/>
            <rect x="47" y="0" width="2" height="32" fill="#292524"/>
            <rect x="53" y="0" width="7" height="32" fill="#292524"/>
            <rect x="64" y="0" width="4" height="32" fill="#292524"/>
            <rect x="72" y="0" width="2" height="32" fill="#292524"/>
            <rect x="78" y="0" width="6" height="32" fill="#292524"/>
            <rect x="88" y="0" width="3" height="32" fill="#292524"/>
            <rect x="94" y="0" width="8" height="32" fill="#292524"/>
            <text x="48" y="44" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="3" fill="#57534E">2026.09.13</text>
          </g>

          <!-- Text Information on Right of Barcode -->
          <g transform="translate(10, 8)">
            <text x="0" y="0" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="#1C1917">
              MR & MRS CELEBRATION
            </text>
            <text x="0" y="18" font-family="'Montserrat', sans-serif" font-size="11" letter-spacing="2" fill="#78716C">
              OFFICIAL PHOTOBOOTH EDITION
            </text>
            <text x="0" y="32" font-family="'Montserrat', sans-serif" font-size="10" letter-spacing="1.5" fill="#A8A29E">
              ♥ STORED IN SWEET MEMORIES ♥
            </text>
          </g>
        </g>
      </svg>
    `
  },

  /* =========================================================================
     3. VINTAGE POLAROID & BURGUNDY WAX SEAL (3:4)
     Retro cream polaroid, luxury wax seal with gold rings, washi tape & romantic quote
     ========================================================================= */
  {
    id: 'vintage-polaroid',
    name: 'Vintage Polaroid',
    aspectRatio: '3:4',
    width: 1200,
    height: 1600,
    description: 'Gaya polaroid vintage otentik dengan segel lilin merah marun dan cincin emas',
    badge: 'Wax Seal',
    getSvgContent: (w = 1200, h = 1600) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Polaroid Warm Linen Texture Gradient -->
          <linearGradient id="polaroidLinen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCFAF6" />
            <stop offset="50%" stop-color="#F7F3EB" />
            <stop offset="100%" stop-color="#EEE7DA" />
          </linearGradient>

          <!-- Wax Seal Rich Burgundy Gradient -->
          <radialGradient id="waxBurgundy" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#E11D48" />
            <stop offset="50%" stop-color="#9F1239" />
            <stop offset="85%" stop-color="#4C0519" />
            <stop offset="100%" stop-color="#2D020E" />
          </radialGradient>

          <linearGradient id="waxGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE082" />
            <stop offset="50%" stop-color="#FFB300" />
            <stop offset="100%" stop-color="#B26A00" />
          </linearGradient>

          <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
          </filter>
        </defs>

        <!-- Polaroid Solid Outer Card with Inner Photo Cutout -->
        <path d="
          M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z
          M 60 70 L ${w - 60} 70 L ${w - 60} ${h - 290} L 60 ${h - 290} Z
        " fill="url(#polaroidLinen)" fill-rule="evenodd" filter="url(#sealShadow)" />

        <!-- Thin Framing Accent around Photo Window -->
        <rect x="60" y="70" width="${w - 120}" height="${h - 360}" fill="none" stroke="#D7CCC8" stroke-width="2" />

        <!-- TOP CENTER: Golden Washi Tape Sticker -->
        <g transform="translate(${w / 2 - 90}, 30)" opacity="0.9">
          <rect x="0" y="0" width="180" height="34" rx="4" fill="#FDE68A" fill-opacity="0.75" stroke="#FCD34D" stroke-width="1.5"/>
          <!-- Little stars on tape -->
          <text x="90" y="22" text-anchor="middle" font-family="monospace" font-size="14" letter-spacing="8" fill="#92400E">✦ ✦ ✦ ✦</text>
        </g>

        <!-- BOTTOM CARD: Calligraphy & Elegant Wax Seal -->
        <g transform="translate(${w / 2}, ${h - 155})">
          <!-- Script Quote -->
          <text x="-40" y="-20" text-anchor="middle" font-family="'Great Vibes', 'Playfair Display', Georgia, cursive, serif" font-size="52" font-style="italic" fill="#2E241E">
            Together is our favorite place to be
          </text>

          <text x="-40" y="24" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="20" font-weight="700" letter-spacing="6" fill="#78350F">
            THE WEDDING CELEBRATION
          </text>

          <text x="-40" y="52" text-anchor="middle" font-family="Georgia, serif" font-size="15" letter-spacing="5" fill="#8C7A6B">
            SWEETEST MEMORIES • FOREVER & ALWAYS
          </text>
        </g>

        <!-- BOTTOM RIGHT: LUXURY 3D WAX SEAL -->
        <g transform="translate(${w - 150}, ${h - 145})" filter="url(#sealShadow)">
          <!-- Wavy Wax Droplets -->
          <path d="M -42 0 C -45 -25, -25 -45, 0 -44 C 25 -45, 45 -25, 43 0 C 45 25, 25 45, 0 43 C -25 45, -45 25, -42 0 Z" fill="url(#waxBurgundy)"/>
          <!-- Inner Rim -->
          <circle cx="0" cy="0" r="32" fill="none" stroke="#BE123C" stroke-width="2.5" stroke-dasharray="3 2"/>
          <circle cx="0" cy="0" r="28" fill="#881337"/>

          <!-- Golden Interlocking Wedding Rings Stamp -->
          <circle cx="-7" cy="0" r="12" fill="none" stroke="url(#waxGoldRing)" stroke-width="3"/>
          <circle cx="7" cy="0" r="12" fill="none" stroke="url(#waxGoldRing)" stroke-width="3"/>
          <polygon points="-7,-15 -3,-11 -7,-8 -11,-11" fill="#FFFFFF"/>
        </g>
      </svg>
    `
  },

  /* =========================================================================
     4. ROYAL ARCHWAY STORY (9:16)
     Full-length 9:16 mobile story with romanesque golden arch and starbursts
     ========================================================================= */
  {
    id: 'royal-arch',
    name: 'Royal Archway',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    description: 'Format Story 9:16 vertikal dengan kubah lengkungan katedral dan butiran kilau emas',
    badge: '9:16 Story',
    getSvgContent: (w = 1080, h = 1920) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="archLuxeGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C59B27" />
            <stop offset="25%" stop-color="#FFE885" />
            <stop offset="50%" stop-color="#D4AF37" />
            <stop offset="75%" stop-color="#FFF2A1" />
            <stop offset="100%" stop-color="#785207" />
          </linearGradient>

          <filter id="archDropShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.75"/>
          </filter>
        </defs>

        <!-- Main Architectural Cathedral Arch -->
        <g stroke="url(#archLuxeGold)" fill="none" stroke-linecap="round">
          <!-- Outer Arch -->
          <path d="
            M 48 ${h - 130}
            L 48 480
            A 492 492 0 0 1 ${w - 48} 480
            L ${w - 48} ${h - 130}
            Z
          " stroke-width="4"/>

          <!-- Inner Fine Arch -->
          <path d="
            M 64 ${h - 146}
            L 64 486
            A 476 476 0 0 1 ${w - 64} 486
            L ${w - 64} ${h - 146}
            Z
          " stroke-width="1.5" stroke-dasharray="8 8"/>
        </g>

        <!-- Arch Apex Floral Topper & Golden Star -->
        <g transform="translate(${w / 2}, 90)" filter="url(#archDropShadow)">
          <!-- Glowing Golden Starburst -->
          <circle cx="0" cy="0" r="16" fill="url(#archLuxeGold)"/>
          <text x="0" y="7" text-anchor="middle" font-size="22" fill="#1C1917">✦</text>

          <!-- Arch Crown Leaves -->
          <path d="M -16 0 Q -45 -20 -70 -5 Q -40 10 -16 0 Z" fill="url(#archLuxeGold)"/>
          <path d="M 16 0 Q 45 -20 70 -5 Q 40 10 16 0 Z" fill="url(#archLuxeGold)"/>

          <!-- Decorative Stars Flanking Apex -->
          <text x="-120" y="8" font-size="24" fill="url(#archLuxeGold)" text-anchor="middle">✦</text>
          <text x="120" y="8" font-size="24" fill="url(#archLuxeGold)" text-anchor="middle">✦</text>
        </g>

        <!-- Top Title Inside Arch Curve -->
        <g transform="translate(${w / 2}, 180)" filter="url(#archDropShadow)">
          <text x="0" y="0" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="26" letter-spacing="8" fill="#FFF2A1" font-weight="700">
            OUR WEDDING DAY
          </text>
          <text x="0" y="44" text-anchor="middle" font-family="'Great Vibes', 'Playfair Display', Georgia, cursive, serif" font-size="56" font-style="italic" fill="url(#archLuxeGold)">
            Best Day Ever
          </text>
        </g>

        <!-- Bottom Story Banner -->
        <g transform="translate(${w / 2}, ${h - 75})" filter="url(#archDropShadow)">
          <rect x="-260" y="-36" width="520" height="54" rx="27" fill="#1C1917" fill-opacity="0.85" stroke="url(#archLuxeGold)" stroke-width="2"/>
          <text x="0" y="-1" text-anchor="middle" font-family="'Cinzel', 'Montserrat', Georgia, sans-serif" font-size="18" font-weight="700" letter-spacing="5" fill="#FFEFA6">
            ✦ CELEBRATING WITH LOVE ✦
          </text>
        </g>
      </svg>
    `
  }
];

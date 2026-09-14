import { FrameTemplate } from "./frameTemplates";

/**
 * Direct Canvas 2D Graphic Elements Renderer.
 * Eliminates browser SVG data-URL rendering failures and ensures 100% reliable,
 * razor-sharp decorative elements on every photostrip.
 */

// Draw Washi Tape Sticker with realistic torn edges and subtle tilt
export function drawWashiTape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  angleDeg: number = -2,
  color: string = "rgba(254, 240, 138, 0.85)"
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Tape body with subtle drop shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = color;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Jagged edges on left and right
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(-w / 2, -h / 2, 4, h);
  ctx.fillRect(w / 2 - 4, -h / 2, 4, h);

  // Gold foil stars on tape
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#92400E";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦  ✦  ✦  ✦  ✦", 0, 0);

  ctx.restore();
}

// Draw 3D Realistic Wax Seal with interlocking wedding rings
export function drawWaxSeal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number = 44
) {
  ctx.save();

  // 1. Outer uneven wax border
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  const waxGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
  waxGrad.addColorStop(0, "#E11D48");
  waxGrad.addColorStop(0.5, "#9F1239");
  waxGrad.addColorStop(0.85, "#4C0519");
  waxGrad.addColorStop(1, "#2D020E");

  ctx.fillStyle = waxGrad;
  ctx.beginPath();
  // Wavy melted edge
  const points = 16;
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const offset = Math.sin(i * 3) * (r * 0.08);
    const currR = r + offset;
    const px = cx + Math.cos(angle) * currR;
    const py = cy + Math.sin(angle) * currR;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // 2. Inner indented rim
  ctx.shadowColor = "transparent";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#881337";
  ctx.fill();

  // 3. Golden Interlocking Wedding Rings Stamp
  const ringR = r * 0.28;
  const goldGrad = ctx.createLinearGradient(cx - ringR, cy - ringR, cx + ringR, cy + ringR);
  goldGrad.addColorStop(0, "#FFF2A1");
  goldGrad.addColorStop(0.5, "#D4AF37");
  goldGrad.addColorStop(1, "#AA771C");

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = goldGrad;

  // Left ring
  ctx.beginPath();
  ctx.arc(cx - ringR * 0.65, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Right ring
  ctx.beginPath();
  ctx.arc(cx + ringR * 0.65, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Little diamond shine
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx - ringR * 0.65, cy - ringR, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Vintage Circular Postmark Stamp
export function drawPostageStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number = 38,
  color: string = "rgba(120, 53, 15, 0.7)"
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // Double circle
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.stroke();

  // Inner star
  ctx.font = "bold 16px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★", cx, cy - 8);

  ctx.font = "bold 9px sans-serif";
  ctx.fillText("WEDDING", cx, cy + 8);
  ctx.font = "8px monospace";
  ctx.fillText("2026.09.14", cx, cy + 18);

  // Wavy lines on the side
  ctx.lineWidth = 1.5;
  for (let dy = -12; dy <= 12; dy += 8) {
    ctx.beginPath();
    ctx.moveTo(cx + r + 8, cy + dy);
    ctx.bezierCurveTo(
      cx + r + 20,
      cy + dy - 4,
      cx + r + 32,
      cy + dy + 4,
      cx + r + 45,
      cy + dy
    );
    ctx.stroke();
  }

  ctx.restore();
}

// Draw Botanical Leaf / Flourish
export function drawBotanicalFlourish(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1,
  angleDeg: number = 0,
  color: string = "#D4AF37"
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.scale(scale, scale);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  // Stem curve
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.bezierCurveTo(0, 10, 15, 0, 40, 0);
  ctx.stroke();

  // Leaves
  const leaves = [
    { px: 12, py: 28, angle: -30, len: 14 },
    { px: 22, py: 16, angle: 30, len: 16 },
    { px: 32, py: 6, angle: -20, len: 14 },
    { px: 40, py: 0, angle: 10, len: 18 },
  ];

  leaves.forEach((l) => {
    ctx.save();
    ctx.translate(l.px, l.py);
    ctx.rotate((l.angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(l.len / 2, -6, l.len, 0);
    ctx.quadraticCurveTo(l.len / 2, 6, 0, 0);
    ctx.fill();
    ctx.restore();
  });

  // Star accent
  ctx.font = "14px serif";
  ctx.fillText("✦", 10, 10);

  ctx.restore();
}

// Draw Aesthetic Barcode
export function drawAestheticBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  totalWidth: number = 180,
  height: number = 32,
  color: string = "#292524",
  dateText: string = "2026.09.14 • PHOTOBOOTH"
) {
  ctx.save();
  ctx.fillStyle = color;

  // Barcode pattern of variable widths scaled to totalWidth
  const pattern = [3, 2, 6, 2, 1, 7, 3, 2, 4, 1, 8, 2, 5, 2, 1, 6, 3, 2, 7, 1, 4, 2, 8];
  const naturalWidth = pattern.reduce((acc, w) => acc + w, 0) + (pattern.length - 1) * 2;
  const scale = totalWidth / naturalWidth;
  let curX = x;
  pattern.forEach((pw, idx) => {
    const barW = Math.max(1, pw * scale);
    if (idx % 2 === 0) {
      ctx.fillRect(curX, y, barW, height);
    }
    curX += barW + 2 * scale;
  });

  // Date and serial label under barcode
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(dateText, x + (curX - x) / 2, y + height + 5);

  ctx.restore();
}

// Master Canvas 2D Photostrip Decorator
export function renderCanvasPhotostripDecorations(
  ctx: CanvasRenderingContext2D,
  template: FrameTemplate
) {
  const w = template.width;
  const h = template.height;
  const isNoir = template.theme === "noir";
  const primaryTextColor = isNoir ? "#FDF0A6" : "#1C1917";
  const secondaryTextColor = isNoir ? "#A1A1AA" : "#78716C";
  const goldColor = isNoir ? "#FDF0A6" : "#C59B27";

  ctx.save();

  // 1. OUTER CARD BORDER
  if (template.theme === "gold") {
    // Luxury double gold border
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 4;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(16, 16, w - 32, h - 32, 24);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(26, 26, w - 52, h - 52, 18);
      ctx.stroke();
    }
  } else if (isNoir) {
    ctx.strokeStyle = "#AA771C";
    ctx.lineWidth = 3;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(16, 16, w - 32, h - 32, 24);
      ctx.stroke();
    }
  }

  // 2. CORNER BOTANICAL FLOURISHES (All 4 corners)
  drawBotanicalFlourish(ctx, 36, 36, 1.1, 0, goldColor);
  drawBotanicalFlourish(ctx, w - 36, 36, 1.1, 90, goldColor);
  drawBotanicalFlourish(ctx, 36, h - 36, 1.1, 270, goldColor);
  drawBotanicalFlourish(ctx, w - 36, h - 36, 1.1, 180, goldColor);

  // 3. TOP WASHI TAPE STICKER (Tilted across the top)
  const tapeColor = isNoir
    ? "rgba(212, 175, 55, 0.4)"
    : template.theme === "gold"
    ? "rgba(253, 230, 138, 0.9)"
    : "rgba(254, 240, 138, 0.85)";
  drawWashiTape(ctx, w / 2 - 95, 20, 190, 32, -1.5, tapeColor);

  // 4. TOP TITLE & RIBBON
  ctx.textAlign = "center";
  ctx.fillStyle = primaryTextColor;
  ctx.font = "bold 15px 'Montserrat', sans-serif";
  ctx.fillText("✦ THE WEDDING CELEBRATION ✦", w / 2, 70);

  // 5. PHOTO SLOT FRAMING LINES
  template.slots.forEach((slot) => {
    ctx.save();
    ctx.strokeStyle = isNoir ? "#AA771C" : "#D7CCC8";
    ctx.lineWidth = 2.5;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(slot.x, slot.y, slot.width, slot.height, slot.rx || 14);
      ctx.stroke();
    } else {
      ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);
    }

    // Cute little star on top-left of each photo
    ctx.fillStyle = goldColor;
    ctx.font = "12px serif";
    ctx.fillText("✦", slot.x + 14, slot.y + 18);

    ctx.restore();
  });

  // 6. BOTTOM DECORATIVE CARD AREA
  const lastSlot = template.slots[template.slots.length - 1];
  const bottomAreaTop = lastSlot.y + lastSlot.height;
  const bottomAreaHeight = h - bottomAreaTop;
  const centerY = bottomAreaTop + bottomAreaHeight * 0.48;

  // Calligraphy Heading
  ctx.textAlign = "center";
  ctx.fillStyle = primaryTextColor;
  ctx.font = "italic 46px 'Great Vibes', 'Playfair Display', Georgia, cursive, serif";
  ctx.fillText("Together is a Beautiful Place", w / 2, centerY - 32);

  // 3 Cute Hearts Row
  ctx.fillStyle = "#E11D48";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("♥  ♥  ♥", w / 2, centerY);

  // Left side: Barcode & Date
  const barcodeX = 60;
  const barcodeY = centerY + 16;
  drawAestheticBarcode(
    ctx,
    barcodeX,
    barcodeY,
    170,
    30,
    isNoir ? "#FDF0A6" : "#292524",
    "2026.09.14 • PHOTOBOOTH"
  );

  // Center-right text details
  ctx.textAlign = "left";
  ctx.fillStyle = primaryTextColor;
  ctx.font = "bold 13px 'Montserrat', sans-serif";
  ctx.fillText("MR & MRS CELEBRATION", barcodeX + 190, barcodeY + 12);
  ctx.fillStyle = secondaryTextColor;
  ctx.font = "11px 'Montserrat', sans-serif";
  ctx.fillText("OFFICIAL PHOTOBOOTH MEMORIES", barcodeX + 190, barcodeY + 28);
  ctx.font = "10px sans-serif";
  ctx.fillText("♥ STORED WITH LOVE ♥", barcodeX + 190, barcodeY + 42);

  // Right side: 3D Burgundy Wax Seal
  const waxSealX = w - 90;
  const waxSealY = centerY + 30;
  drawWaxSeal(ctx, waxSealX, waxSealY, 36);

  // Vintage Postmark Stamp above Wax Seal
  drawPostageStamp(
    ctx,
    waxSealX - 85,
    waxSealY - 20,
    30,
    isNoir ? "rgba(253, 240, 166, 0.8)" : "rgba(120, 53, 15, 0.65)"
  );

  ctx.restore();
}

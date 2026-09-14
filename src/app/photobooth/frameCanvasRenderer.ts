import { FrameTemplate } from "./frameTemplates";

/**
 * Direct Canvas 2D Graphic Elements Renderer.
 * Eliminates browser SVG data-URL rendering failures and ensures 100% reliable,
 * razor-sharp decorative elements on every photostrip.
 *
 * Includes 3D botanical foliage draping over photo corners, diagonal washi tape
 * overlays, vintage embossed photo corners, and authentic overlapping wax seals.
 */

// 1. Draw 3D Botanical Vines / Leaves Draping Over Photo Corners
export function draw3DBotanicalCornerOverhang(
  ctx: CanvasRenderingContext2D,
  cornerX: number,
  cornerY: number,
  orientation: "top-left" | "top-right" | "bottom-left" | "bottom-right",
  theme: "ivory" | "gold" | "noir" = "ivory",
  scale: number = 1
) {
  ctx.save();
  ctx.translate(cornerX, cornerY);

  let angle = 0;
  if (orientation === "top-left") angle = 0;
  else if (orientation === "top-right") angle = 90;
  else if (orientation === "bottom-right") angle = 180;
  else if (orientation === "bottom-left") angle = 270;

  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(scale, scale);

  // Soft 3D drop shadow that falls realistically ONTO the photo underneath
  ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  const isDark = theme === "noir";
  const stemColor = isDark ? "#E5C158" : theme === "gold" ? "#C59B27" : "#35523D";
  const leafBase = isDark ? "#9A6D14" : theme === "gold" ? "#CA8A04" : "#2E4735";
  const leafHighlight = isDark ? "#FFE57F" : theme === "gold" ? "#FEF08A" : "#6E9979";

  // Main branch arching from frame (-32, -28) into the photo (+55, +50)
  ctx.strokeStyle = stemColor;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-34, -30);
  ctx.bezierCurveTo(-12, -12, 12, 16, 56, 48);
  ctx.stroke();

  // Secondary delicate branches
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(6, 10);
  ctx.quadraticCurveTo(24, -2, 48, 8);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(18, 22);
  ctx.quadraticCurveTo(-2, 34, 10, 56);
  ctx.stroke();

  // Leaves along the vine overlapping into the photo
  const leaves = [
    { x: -16, y: -16, rot: -35, length: 22, width: 10 },
    { x: -2, y: -4, rot: 45, length: 24, width: 11 },
    { x: 14, y: 16, rot: -40, length: 26, width: 12 },
    { x: 30, y: 8, rot: 25, length: 20, width: 9 },
    { x: 46, y: 10, rot: -15, length: 18, width: 8 },
    { x: 8, y: 44, rot: 60, length: 20, width: 9 },
    { x: 34, y: 32, rot: -45, length: 24, width: 11 },
    { x: 54, y: 48, rot: 20, length: 28, width: 13 }, // Leaf tip extending deep into photo
  ];

  leaves.forEach((lf) => {
    ctx.save();
    ctx.translate(lf.x, lf.y);
    ctx.rotate((lf.rot * Math.PI) / 180);

    // Leaf body gradient
    const grad = ctx.createLinearGradient(0, -lf.width / 2, lf.length, lf.width / 2);
    grad.addColorStop(0, leafBase);
    grad.addColorStop(0.5, leafHighlight);
    grad.addColorStop(1, leafBase);
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(lf.length * 0.35, -lf.width, lf.length * 0.75, -lf.width * 0.5, lf.length, 0);
    ctx.bezierCurveTo(lf.length * 0.75, lf.width * 0.5, lf.length * 0.35, lf.width, 0, 0);
    ctx.fill();

    // Central leaf spine / vein
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.lineTo(lf.length * 0.85, 0);
    ctx.stroke();

    ctx.restore();
  });

  // Delicate white / golden blossom berries
  const berries = [
    { x: 2, y: -8, r: 3.5 },
    { x: 24, y: 2, r: 3 },
    { x: 6, y: 28, r: 3.5 },
    { x: 42, y: 26, r: 4 },
  ];

  ctx.shadowColor = "transparent";
  berries.forEach((b) => {
    const berryGrad = ctx.createRadialGradient(b.x - 1, b.y - 1, 0.5, b.x, b.y, b.r);
    berryGrad.addColorStop(0, "#FFFFFF");
    berryGrad.addColorStop(0.6, isDark ? "#FFE082" : "#FCE7F3");
    berryGrad.addColorStop(1, isDark ? "#B8860B" : "#E11D48");
    ctx.fillStyle = berryGrad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// 2. Draw 3D Realistic Washi Corner Tape (Diagonally Across Photo Corners)
export function draw3DWashiCornerTape(
  ctx: CanvasRenderingContext2D,
  cornerX: number,
  cornerY: number,
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right",
  theme: "ivory" | "gold" | "noir" = "ivory"
) {
  ctx.save();
  ctx.translate(cornerX, cornerY);

  // Rotate diagonally across corner
  let rot = -38;
  let offsetX = 0;
  let offsetY = 0;
  if (corner === "top-right") {
    rot = -38;
    offsetX = -14;
    offsetY = 14;
  } else if (corner === "top-left") {
    rot = 38;
    offsetX = 14;
    offsetY = 14;
  } else if (corner === "bottom-right") {
    rot = 38;
    offsetX = -14;
    offsetY = -14;
  } else if (corner === "bottom-left") {
    rot = -38;
    offsetX = 14;
    offsetY = -14;
  }

  ctx.translate(offsetX, offsetY);
  ctx.rotate((rot * Math.PI) / 180);

  const w = 115;
  const h = 28;

  // Realistic 3D drop shadow onto photo
  ctx.shadowColor = "rgba(0, 0, 0, 0.32)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  // Translucent tape base
  const isNoir = theme === "noir";
  ctx.fillStyle = isNoir
    ? "rgba(212, 175, 55, 0.65)"
    : "rgba(254, 240, 138, 0.85)";
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Jagged torn fiber ends
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(-w / 2, -h / 2, 4, h);
  ctx.fillRect(w / 2 - 4, -h / 2, 4, h);

  // Semi-transparent center highlight sheen
  const sheenGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0.25)");
  sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
  sheenGrad.addColorStop(1, "rgba(0, 0, 0, 0.1)");
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Gold foil stars and hearts on tape
  ctx.fillStyle = isNoir ? "#FFF2A1" : "#92400E";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦  ♥  ✦  ♥  ✦", 0, 1);

  ctx.restore();
}

// 3. Draw 3D Vintage Embossed Photo Mounting Corners
export function draw3DPhotoMountingCorner(
  ctx: CanvasRenderingContext2D,
  cornerX: number,
  cornerY: number,
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right",
  theme: "ivory" | "gold" | "noir" = "ivory",
  size: number = 44
) {
  ctx.save();
  ctx.translate(cornerX, cornerY);

  let rot = 0;
  if (corner === "top-left") rot = 0;
  else if (corner === "top-right") rot = 90;
  else if (corner === "bottom-right") rot = 180;
  else if (corner === "bottom-left") rot = 270;

  ctx.rotate((rot * Math.PI) / 180);

  // 3D shadow cast on both background and photo
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Gold embossed triangle bracket
  const isNoir = theme === "noir";
  const grad = ctx.createLinearGradient(-4, -4, size, size);
  grad.addColorStop(0, isNoir ? "#FFF2A1" : "#FDE047");
  grad.addColorStop(0.5, isNoir ? "#D4AF37" : "#CA8A04");
  grad.addColorStop(1, isNoir ? "#78350F" : "#854D0E");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-6, -6);
  ctx.lineTo(size, -6);
  ctx.lineTo(-6, size);
  ctx.closePath();
  ctx.fill();

  // Highlight bevel line
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(size - 4, -4);
  ctx.lineTo(-4, size - 4);
  ctx.closePath();
  ctx.stroke();

  // Slit cut where photo is held
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, size - 6);
  ctx.lineTo(size - 6, 8);
  ctx.stroke();

  // Little embossed center dot
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(4, 4, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4. Draw 3D Realistic Wax Seal (Interlocking Wedding Rings & Specular Highlight)
export function drawWaxSeal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number = 42,
  theme: "ivory" | "gold" | "noir" = "ivory"
) {
  ctx.save();

  // 1. Deep 3D drop shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.48)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 5;

  const isGoldOrNoir = theme === "gold" || theme === "noir";

  // Uneven organic melted wax perimeter
  const waxGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.08, cx, cy, r);
  if (isGoldOrNoir) {
    waxGrad.addColorStop(0, "#FFE87C");
    waxGrad.addColorStop(0.4, "#D4AF37");
    waxGrad.addColorStop(0.8, "#996515");
    waxGrad.addColorStop(1, "#4A2E05");
  } else {
    waxGrad.addColorStop(0, "#FB7185");
    waxGrad.addColorStop(0.3, "#E11D48");
    waxGrad.addColorStop(0.7, "#881337");
    waxGrad.addColorStop(1, "#38030F");
  }

  ctx.fillStyle = waxGrad;
  ctx.beginPath();
  const points = 18;
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wave = Math.sin(i * 3.5) * 3 + Math.cos(i * 5) * 2;
    const currR = r + wave;
    const px = cx + Math.cos(angle) * currR;
    const py = cy + Math.sin(angle) * currR;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Specular light reflection on the outer rim
  ctx.shadowColor = "transparent";
  ctx.beginPath();
  ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.65, -Math.PI * 0.7, 0);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 2. Inner indented seal basin
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
  const basinGrad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 0.72);
  if (isGoldOrNoir) {
    basinGrad.addColorStop(0, "#996515");
    basinGrad.addColorStop(1, "#664205");
  } else {
    basinGrad.addColorStop(0, "#9F1239");
    basinGrad.addColorStop(1, "#4C0519");
  }
  ctx.fillStyle = basinGrad;
  ctx.fill();

  ctx.strokeStyle = isGoldOrNoir ? "rgba(255, 235, 130, 0.6)" : "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. Interlocking Wedding Rings Monogram with 3D Emboss
  const ringR = r * 0.26;
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = isGoldOrNoir ? "#FFF0A5" : "#FEE2E2";

  // Left ring
  ctx.beginPath();
  ctx.arc(cx - ringR * 0.6, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Right ring
  ctx.beginPath();
  ctx.arc(cx + ringR * 0.6, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Glistening Diamond Sparkle
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx - ringR * 0.6, cy - ringR, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 5. Draw Vintage Circular Postmark Stamp (Self-Contained Without Spills)
export function drawPostageStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number = 34,
  color: string = "rgba(120, 53, 15, 0.7)"
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // Double circle
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Star & Typography inside stamp
  ctx.font = "bold 14px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★", cx, cy - 10);

  ctx.font = "bold 8px 'Montserrat', sans-serif";
  ctx.fillText("OFFICIAL", cx, cy + 4);
  ctx.font = "7px monospace";
  ctx.fillText("2026.09.14", cx, cy + 14);

  // Wavy cancellation lines tightly contained
  ctx.lineWidth = 1.4;
  for (let dy = -10; dy <= 10; dy += 7) {
    ctx.beginPath();
    ctx.moveTo(cx + r + 4, cy + dy);
    ctx.bezierCurveTo(
      cx + r + 12,
      cy + dy - 3,
      cx + r + 20,
      cy + dy + 3,
      cx + r + 28,
      cy + dy
    );
    ctx.stroke();
  }

  ctx.restore();
}

// 6. Draw Botanical Leaf Flourish for Frame Corners
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

// 7. Draw Aesthetic Barcode
export function drawAestheticBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  totalWidth: number = 150,
  height: number = 28,
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
  ctx.fillText(dateText, x + (curX - x) / 2, y + height + 4);

  ctx.restore();
}

// 8. Draw Horizontal Washi Tape Sticker for the Header
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

  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = color;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(-w / 2, -h / 2, 4, h);
  ctx.fillRect(w / 2 - 4, -h / 2, 4, h);

  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#92400E";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦  ✦  ✦  ✦  ✦", 0, 0);

  ctx.restore();
}

/**
 * Master Canvas 2D Photostrip Decorator.
 * Renders layered 3D corner accents over photos, followed by a clean, spacious,
 * and elegant typography footer without collisions.
 */
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

  // 2. CORNER BOTANICAL ACCENTS ON OUTER FRAME
  drawBotanicalFlourish(ctx, 36, 36, 1.1, 0, goldColor);
  drawBotanicalFlourish(ctx, w - 36, 36, 1.1, 90, goldColor);
  drawBotanicalFlourish(ctx, 36, h - 36, 1.1, 270, goldColor);
  drawBotanicalFlourish(ctx, w - 36, h - 36, 1.1, 180, goldColor);

  // 3. TOP HEADER WASHI TAPE & TITLE
  const headerTapeColor = isNoir
    ? "rgba(212, 175, 55, 0.4)"
    : template.theme === "gold"
    ? "rgba(253, 230, 138, 0.9)"
    : "rgba(254, 240, 138, 0.85)";
  drawWashiTape(ctx, w / 2 - 95, 20, 190, 32, -1.5, headerTapeColor);

  ctx.textAlign = "center";
  ctx.fillStyle = primaryTextColor;
  ctx.font = "bold 14px 'Montserrat', sans-serif";
  ctx.fillText("✦ THE WEDDING CELEBRATION ✦", w / 2, 68);

  // 4. PHOTO SLOTS STROKES & 3D OVERLAPPING ELEMENTS ON PHOTO CORNERS
  const totalSlots = template.slots.length;

  template.slots.forEach((slot, index) => {
    // A. Clean slot outline border
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

    // Photo slot number indicator badge (Life4Cuts aesthetic)
    if (totalSlots > 1) {
      ctx.fillStyle = isNoir ? "#AA771C" : "#A8A29E";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`0${index + 1}`, slot.x + 14, slot.y + 22);
    }
    ctx.restore();

    // B. 3D ELEMENTS DRAPING & OVERLAPPING PHOTO CORNERS
    if (index === 0) {
      // First photo:
      // Top-Left: 3D Botanical foliage branching in from frame and draping OVER photo
      draw3DBotanicalCornerOverhang(
        ctx,
        slot.x,
        slot.y,
        "top-left",
        template.theme,
        1.1
      );

      // Top-Right: 3D Washi Tape pasted diagonally across photo corner
      draw3DWashiCornerTape(
        ctx,
        slot.x + slot.width,
        slot.y,
        "top-right",
        template.theme
      );

      // Bottom-Left: Vintage 3D Photo Mounting Corner
      draw3DPhotoMountingCorner(
        ctx,
        slot.x,
        slot.y + slot.height,
        "bottom-left",
        template.theme,
        42
      );
    } else if (index === totalSlots - 1) {
      // Last photo:
      // Top-Right: Photo corner bracket
      draw3DPhotoMountingCorner(
        ctx,
        slot.x + slot.width,
        slot.y,
        "top-right",
        template.theme,
        38
      );

      // Bottom-Left: 3D Botanical foliage draping OVER photo corner
      draw3DBotanicalCornerOverhang(
        ctx,
        slot.x,
        slot.y + slot.height,
        "bottom-left",
        template.theme,
        1.1
      );

      // Bottom-Right: AUTHENTIC 3D WAX SEAL OVERLAPPING PHOTO CORNER & FRAME!
      // This directly fulfills: "elemen 3d kaya dari ujung frame terus agak menutupi sudut foto"
      drawWaxSeal(
        ctx,
        slot.x + slot.width - 16,
        slot.y + slot.height - 16,
        42,
        template.theme
      );
    } else {
      // Intermediate photos (in 3-cut / 4-cut):
      draw3DPhotoMountingCorner(
        ctx,
        slot.x,
        slot.y,
        "top-left",
        template.theme,
        36
      );
      draw3DPhotoMountingCorner(
        ctx,
        slot.x + slot.width,
        slot.y + slot.height,
        "bottom-right",
        template.theme,
        36
      );
    }
  });

  // 5. CLEAN, SPACIOUS & BALANCED FOOTER LAYOUT (No Collisions!)
  const lastSlot = template.slots[totalSlots - 1];
  const footerTop = lastSlot.y + lastSlot.height;
  const footerHeight = h - footerTop;

  // A. Calligraphy Heading (Prominent, Elegant, Generously Spaced)
  ctx.textAlign = "center";
  ctx.fillStyle = primaryTextColor;
  ctx.font = "italic 44px 'Great Vibes', 'Playfair Display', Georgia, cursive, serif";
  const titleY = footerTop + Math.max(55, footerHeight * 0.28);
  ctx.fillText("Together is a Beautiful Place", w / 2, titleY);

  // B. Subtitle & Monogram with Balanced Spacing
  ctx.font = "bold 13px 'Montserrat', sans-serif";
  const subtitleY = titleY + 36;
  ctx.fillText("✦ MR & MRS CELEBRATION ✦", w / 2, subtitleY);

  // C. Date & Venue
  ctx.fillStyle = secondaryTextColor;
  ctx.font = "11px 'Montserrat', sans-serif";
  const dateY = subtitleY + 22;
  ctx.fillText("14 SEPTEMBER 2026 • JAKARTA, INDONESIA", w / 2, dateY);

  // D. 3 Cute Delicate Hearts Divider
  ctx.fillStyle = "#E11D48";
  ctx.font = "14px sans-serif";
  const heartsY = dateY + 24;
  ctx.fillText("♥   ♥   ♥", w / 2, heartsY);

  // E. Bottom Row: Barcode on Far-Left, Vintage Postmark Stamp on Far-Right
  const bottomRowY = Math.max(heartsY + 24, footerTop + footerHeight * 0.72);

  // Far-Left: Aesthetic Barcode (with dedicated padding)
  const barcodeX = Math.max(55, w * 0.08);
  drawAestheticBarcode(
    ctx,
    barcodeX,
    bottomRowY,
    145,
    28,
    isNoir ? "#FDF0A6" : "#292524",
    "2026.09.14 • PHOTOBOOTH #0914"
  );

  // Far-Right: Vintage Postmark Stamp (with dedicated padding, NO overlap with wax seal)
  const stampX = w - Math.max(85, w * 0.12);
  const stampY = bottomRowY + 14;
  drawPostageStamp(
    ctx,
    stampX,
    stampY,
    32,
    isNoir ? "rgba(253, 240, 166, 0.85)" : "rgba(120, 53, 15, 0.7)"
  );

  ctx.restore();
}

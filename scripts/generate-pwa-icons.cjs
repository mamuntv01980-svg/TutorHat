const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, drawFn) {
  const rowBytes = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = Math.max(0, Math.min(255, Math.round(r)));
      rawData[pixelOffset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      rawData[pixelOffset + 2] = Math.max(0, Math.min(255, Math.round(b)));
      rawData[pixelOffset + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'binary');
    const combined = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, combined, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Generate TutorHat app icon: Navy blue (#1e3a8a) background, graduation cap, gold tassel/star
function tutorHatPainter(isMaskable) {
  return function(x, y, w, h) {
    // Normalized coordinates -1 to 1
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    const r = Math.sqrt(nx * nx + ny * ny);

    // If not maskable, round corners with smooth antialiasing
    let alpha = 255;
    if (!isMaskable) {
      // Rounded rect: corners at +/- 0.72 with radius 0.28
      const cornerRadius = 0.28;
      const qx = Math.max(0, Math.abs(nx) - (1 - cornerRadius));
      const qy = Math.max(0, Math.abs(ny) - (1 - cornerRadius));
      const dist = Math.sqrt(qx * qx + qy * qy);
      if (dist > cornerRadius) {
        return [0, 0, 0, 0];
      }
      if (dist > cornerRadius - 0.02) {
        alpha = Math.round(255 * (1 - (dist - (cornerRadius - 0.02)) / 0.02));
      }
    }

    // Background gradient: Navy to Deep Blue
    let bgR = 30 + (ny * 10);
    let bgG = 58 + (ny * 12);
    let bgB = 138 + (ny * 15);

    // Base colors
    let cr = bgR;
    let cg = bgG;
    let cb = bgB;

    // Scale for safe zone: maskable keeps graphic in 80% circle
    const scale = isMaskable ? 0.72 : 0.85;
    const sx = nx / scale;
    const sy = ny / scale;

    // Mortarboard diamond top:
    // Top diamond vertices: (0, -0.6), (0.75, -0.2), (0, 0.2), (-0.75, -0.2)
    // Implicit equation: |sx / 0.75| + |(sy + 0.2) / 0.4| <= 1
    const diamondDist = Math.abs(sx / 0.75) + Math.abs((sy + 0.2) / 0.4);
    if (diamondDist <= 1.0) {
      // Inside mortarboard
      if (diamondDist > 0.88) {
        // Cyan / Sky highlight border (#38bdf8)
        cr = 56; cg = 189; cb = 248;
      } else {
        // Navy blue top (#1e3a8a)
        cr = 28; cg = 60; cb = 145;
      }
    }

    // Mortarboard cap base (skull cap under the diamond):
    if (sy >= -0.2 && sy <= 0.22 && Math.abs(sx) <= 0.45) {
      const capCurve = (sx * sx) * 0.8;
      if (sy >= -0.15 + capCurve && sy <= 0.18) {
        cr = 20; cg = 45; cb = 115;
      }
    }

    // Gold Button on center: (0, -0.2)
    const btnDist = Math.sqrt(sx * sx + Math.pow(sy + 0.2, 2));
    if (btnDist <= 0.08) {
      cr = 245; cg = 158; cb = 11; // Gold #f59e0b
    }

    // Gold Tassel hanging to right: from (0, -0.2) to (0.5, 0.2)
    // Simple line segment check
    const dx = 0.5 - 0;
    const dy = 0.2 - (-0.2);
    const lineLenSq = dx * dx + dy * dy;
    let t = ((sx - 0) * dx + (sy - (-0.2)) * dy) / lineLenSq;
    t = Math.max(0, Math.min(1, t));
    const nearX = 0 + t * dx;
    const nearY = -0.2 + t * dy;
    const tasselDist = Math.sqrt(Math.pow(sx - nearX, 2) + Math.pow(sy - nearY, 2));
    if (tasselDist < 0.035 && t > 0.1) {
      cr = 245; cg = 158; cb = 11;
    }
    // Tassel bobble at (0.5, 0.2)
    const bobbleDist = Math.sqrt(Math.pow(sx - 0.5, 2) + Math.pow(sy - 0.2, 2));
    if (bobbleDist <= 0.065) {
      cr = 217; cg = 119; cb = 6; // Deep amber #d97706
    }

    // Open Book / Smile Wings at bottom: y around 0.35 to 0.55
    if (sy >= 0.28 && sy <= 0.58 && Math.abs(sx) <= 0.55) {
      // Arc formula for open book base
      const bookCurve = 0.35 + (sx * sx) * 0.6;
      const distFromBookCurve = Math.abs(sy - bookCurve);
      if (distFromBookCurve <= 0.045 && Math.abs(sx) >= 0.08) {
        // Crisp white book lines
        cr = 255; cg = 255; cb = 255;
      }
    }

    // Center Gold Star:
    const starDist = Math.sqrt(sx * sx + Math.pow(sy - 0.42, 2));
    if (starDist <= 0.07) {
      cr = 251; cg = 191; cb = 36; // Amber #fbbf24
    }

    return [cr, cg, cb, alpha];
  };
}

const publicDir = path.resolve(__dirname, '../public');

// 1. Generate pwa-192x192.png
const png192 = createPng(192, 192, tutorHatPainter(false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
console.log('Generated public/pwa-192x192.png, size:', png192.length);

// 2. Generate pwa-512x512.png
const png512 = createPng(512, 512, tutorHatPainter(false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
console.log('Generated public/pwa-512x512.png, size:', png512.length);

// 3. Generate pwa-maskable-512x512.png (full bleed for Android adaptive icons)
const pngMaskable512 = createPng(512, 512, tutorHatPainter(true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable512);
console.log('Generated public/pwa-maskable-512x512.png, size:', pngMaskable512.length);

// 4. Generate apple-touch-icon.png (180x180)
const appleIcon = createPng(180, 180, tutorHatPainter(false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
console.log('Generated public/apple-touch-icon.png, size:', appleIcon.length);

// 5. Generate favicon-32x32.png
const favicon = createPng(32, 32, tutorHatPainter(false));
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), favicon);
console.log('Generated public/favicon-32x32.png, size:', favicon.length);

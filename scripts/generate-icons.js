import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);

  // Background deep dark slate/indigo #0f172a / #1e1b4b
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Normalized coords from -1 to 1
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Rounded rectangle mask (radius ~ 25%)
      const cornerR = 0.25;
      const qx = Math.abs(nx) - (1 - cornerR);
      const qy = Math.abs(ny) - (1 - cornerR);
      const isCorner = qx > 0 && qy > 0;
      const cornerDist = Math.sqrt(Math.max(0, qx) ** 2 + Math.max(0, qy) ** 2);

      if (isCorner && cornerDist > cornerR) {
        // Transparent outside rounded corner
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Base background gradient: #0f172a to #1e1b4b
      let r = 15 + Math.floor((x / width) * 25);
      let g = 23 + Math.floor((y / height) * 15);
      let b = 42 + Math.floor(((x + y) / (width + height)) * 50);

      // Pulse rhythm wave in center
      // Function of x: wave shape
      const waveX = nx;
      // Define a pulse beat around center y: 0.1
      let waveY = 0.1;
      if (waveX > -0.6 && waveX < -0.4) waveY += Math.sin((waveX + 0.5) * Math.PI * 10) * 0.1;
      else if (waveX >= -0.4 && waveX < -0.1) waveY -= (waveX + 0.25) * 2.5;
      else if (waveX >= -0.1 && waveX < 0.2) waveY += (waveX) * 3.0;
      else if (waveX >= 0.2 && waveX < 0.5) waveY -= (waveX - 0.35) * 1.8;

      const dWave = Math.abs(ny - waveY);
      if (dWave < 0.05) {
        // Indigo / Cyan gradient
        const t = (nx + 1) / 2;
        r = Math.floor(99 * (1 - t) + 6 * t);
        g = Math.floor(102 * (1 - t) + 182 * t);
        b = Math.floor(241 * (1 - t) + 212 * t);
      } else if (dWave < 0.12) {
        // Glow
        const glow = 1 - (dWave - 0.05) / 0.07;
        r = Math.min(255, r + Math.floor(80 * glow));
        g = Math.min(255, g + Math.floor(90 * glow));
        b = Math.min(255, b + Math.floor(180 * glow));
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = 255;
    }
  }

  // Encode as PNG
  // Raw scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    scanlines[rowOffset] = 0; // Filter None
    buffer.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(scanlines);

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function createChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([typeBuf, data]);
    const crc = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([lenBuf, typeAndData, crcBuf]);
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180));
fs.writeFileSync('public/favicon.ico', createPNG(48, 48));

console.log('PWA PNG and icon assets generated successfully in public/');

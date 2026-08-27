import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const NAVY = { r: 6, g: 27, b: 54, alpha: 1 };

export type BrandAssetSet = {
  logo: { buffer: Buffer; width: number; height: number; bytes: number };
  icon512: Buffer;
  icon192: Buffer;
  appleIcon: Buffer;
  icon32: Buffer;
  faviconIco: Buffer;
};

function pngToIco(images: { buffer: Buffer; width: number; height: number }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries: Buffer[] = [];
  for (const image of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(image.width >= 256 ? 0 : image.width, 0);
    entry.writeUInt8(image.height >= 256 ? 0 : image.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += image.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)]);
}

async function squarePng(input: Buffer, size: number) {
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(size, size, {
      fit: "contain",
      background: NAVY,
      kernel: sharp.kernel.lanczos3,
    })
    .flatten({ background: NAVY })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

/**
 * One uploaded lockup → display logo plus square tab / PWA / Apple icons.
 * Square variants pad (never crop) so wide or tall artwork stays fully visible.
 */
export async function generateBrandAssets(input: Buffer): Promise<BrandAssetSet> {
  const logoBuffer = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 90, effort: 4, alphaQuality: 100 })
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();
  const [icon512, icon192, appleIcon, icon48, icon32] = await Promise.all([
    squarePng(input, 512),
    squarePng(input, 192),
    squarePng(input, 180),
    squarePng(input, 48),
    squarePng(input, 32),
  ]);

  return {
    logo: {
      buffer: logoBuffer,
      width: logoMeta.width || 1200,
      height: logoMeta.height || 1200,
      bytes: logoBuffer.byteLength,
    },
    icon512,
    icon192,
    appleIcon,
    icon32,
    faviconIco: pngToIco([
      { buffer: icon32, width: 32, height: 32 },
      { buffer: icon48, width: 48, height: 48 },
    ]),
  };
}

export async function loadBrandImageBuffer(src: string): Promise<Buffer> {
  if (/^https?:\/\//i.test(src)) {
    const response = await fetch(src, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load brand image (${response.status}).`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  const relative = src.replace(/^\//, "").split("?")[0];
  return fs.readFile(path.join(process.cwd(), "public", relative));
}

export async function renderSquareBrandPng(src: string, size: number) {
  const input = await loadBrandImageBuffer(src);
  return squarePng(input, size);
}


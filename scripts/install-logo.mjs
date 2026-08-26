import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SRC_FULL = path.join(root, "assets/arohan-logo-full-hd.png");
const SRC_HEADER = path.join(root, "assets/arohan-logo-header-hd.png");
const SRC_ICON = path.join(root, "assets/arohan-logo-icon-hd.png");
const SRC_ORIGINAL = path.join(root, "assets/logo-source.png");

const NAVY = { r: 6, g: 27, b: 54, alpha: 1 };

async function snapNavyBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isDark = max < 72;
    const isBlueish = b >= g && b >= r && b - r >= 8;
    const lowChroma = max - min < 55;
    if (isDark && (isBlueish || lowChroma)) {
      data[i] = NAVY.r;
      data[i + 1] = NAVY.g;
      data[i + 2] = NAVY.b;
      data[i + 3] = 255;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

async function writePng(pipeline, dest, width, height, fit = "contain") {
  await pipeline
    .clone()
    .resize(width, height, {
      fit,
      background: NAVY,
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(dest);
}

async function main() {
  for (const src of [SRC_FULL, SRC_HEADER, SRC_ICON, SRC_ORIGINAL]) {
    if (!fs.existsSync(src)) {
      throw new Error(`Missing logo source at ${src}`);
    }
  }

  const brandDir = path.join(root, "public/images/brand");
  fs.mkdirSync(brandDir, { recursive: true });
  fs.mkdirSync(path.join(root, "public/images"), { recursive: true });

  const full = await snapNavyBackground(SRC_FULL);
  const header = await snapNavyBackground(SRC_HEADER);
  const icon = await snapNavyBackground(SRC_ICON);

  await header
    .clone()
    .resize(1200, 800, {
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(brandDir, "logo-header.png"));

  await full
    .clone()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(root, "public/images/logo.png"));

  await full
    .clone()
    .resize(800, null, { fit: "inside", kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, "public/images/logo-transparent.png"));

  await header
    .clone()
    .resize(960, null, { fit: "inside", kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, "logo-full-sm.png"));

  await icon
    .clone()
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, "logo-mark.png"));

  const squareJobs = [
    [path.join(brandDir, "logo-mark-square.png"), 512],
    [path.join(brandDir, "logo-mark-sq.png"), 256],
    [path.join(brandDir, "logo-mark-256.png"), 256],
    [path.join(brandDir, "logo-header-mark.png"), 512],
    [path.join(brandDir, "logo-badge.png"), 256],
    [path.join(brandDir, "logo-emblem.png"), 512],
    [path.join(root, "public/images/icon-512.png"), 512],
    [path.join(root, "public/images/icon-192.png"), 192],
    [path.join(root, "public/images/apple-touch-icon.png"), 180],
    [path.join(root, "app/icon.png"), 512],
    [path.join(root, "app/apple-icon.png"), 180],
  ];

  for (const [dest, size] of squareJobs) {
    await writePng(icon, dest, size, size, "contain");
  }

  console.log("Aamantran / Arohan Travels HD logo assets installed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

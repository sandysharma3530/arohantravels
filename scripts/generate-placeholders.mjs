/**
 * Generates premium-looking placeholder JPEGs for development.
 * Replace files in public/images/ with real photos before launch.
 * Run: node scripts/generate-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "images");

const navy = { r: 6, g: 27, b: 54 };
const teal = { r: 0, g: 184, b: 196 };

async function ensureDir(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function placeholder(relPath, label, w = 1600, h = 1000, tone = "navy") {
  const file = path.join(root, relPath);
  await ensureDir(file);
  const base = tone === "teal" ? teal : navy;
  const safeLabel = escapeXml(label);
  const svg = `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgb(${base.r},${base.g},${base.b})"/>
        <stop offset="100%" stop-color="rgb(${Math.min(base.r + 40, 255)},${Math.min(base.g + 50, 255)},${Math.min(base.b + 60, 255)})"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${w * 0.8}" cy="${h * 0.2}" r="${Math.min(w, h) * 0.18}" fill="rgba(0,184,196,0.25)"/>
    <circle cx="${w * 0.15}" cy="${h * 0.75}" r="${Math.min(w, h) * 0.12}" fill="rgba(255,255,255,0.08)"/>
    <text x="50%" y="48%" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="${Math.floor(w / 28)}" font-weight="700">${safeLabel}</text>
    <text x="50%" y="56%" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-family="Arial,sans-serif" font-size="${Math.floor(w / 45)}">Smart Squad Travels - replace with real photo</text>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer();
  await writeFile(file, buf);
  console.log("wrote", relPath);
}

const files = [
  ["hero/slide-1.jpg", "Hero — Force Traveller", 1920, 1080, "navy"],
  ["hero/slide-2.jpg", "Hero — Travel Together", 1920, 1080, "navy"],
  ["hero/slide-3.jpg", "Hero — Explore North India", 1920, 1080, "teal"],
  ["og-default.jpg", "Smart Squad Travels", 1200, 630, "navy"],
  ["logo.png", "S", 512, 512, "teal"],
  ["fleet/traveller/cover.jpg", "Force Traveller", 1400, 900, "navy"],
  ["fleet/traveller/front-exterior.jpg", "Front Exterior", 1400, 900, "navy"],
  ["fleet/traveller/side-exterior.jpg", "Side Exterior", 1400, 900, "navy"],
  ["fleet/traveller/rear-exterior.jpg", "Rear Exterior", 1400, 900, "navy"],
  ["fleet/traveller/interior-seating.jpg", "Interior Seating", 1400, 900, "teal"],
  ["fleet/traveller/driver-cabin.jpg", "Driver Cabin", 1400, 900, "navy"],
  ["fleet/traveller/ac-vents.jpg", "AC Vents", 1400, 900, "teal"],
  ["fleet/traveller/charging-points.jpg", "Charging Points", 1400, 900, "teal"],
  ["fleet/traveller/luggage-space.jpg", "Luggage Space", 1400, 900, "navy"],
  ["fleet/traveller/gps-cctv.jpg", "GPS & CCTV", 1400, 900, "navy"],
  ["fleet/urbania/cover.jpg", "Force Urbania", 1400, 900, "navy"],
  ["fleet/urbania/front-exterior.jpg", "Urbania Front", 1400, 900, "navy"],
  ["fleet/urbania/side-exterior.jpg", "Urbania Side", 1400, 900, "navy"],
  ["fleet/urbania/rear-exterior.jpg", "Urbania Rear", 1400, 900, "navy"],
  ["fleet/urbania/interior-seating.jpg", "Urbania Interior", 1400, 900, "teal"],
  ["fleet/urbania/driver-cabin.jpg", "Urbania Cabin", 1400, 900, "navy"],
  ["fleet/urbania/ac-vents.jpg", "Individual AC", 1400, 900, "teal"],
  ["fleet/urbania/charging-points.jpg", "USB Charging", 1400, 900, "teal"],
  ["fleet/urbania/luggage-space.jpg", "Luggage Area", 1400, 900, "navy"],
  ["fleet/urbania/gps-cctv.jpg", "Safety Features", 1400, 900, "navy"],
  ["destinations/tungnath-chopta.jpg", "Tungnath & Chopta", 1200, 800, "teal"],
  ["destinations/nainital.jpg", "Nainital", 1200, 800, "navy"],
  ["destinations/mussoorie.jpg", "Mussoorie", 1200, 800, "teal"],
  ["destinations/kedarnath.jpg", "Kedarnath", 1200, 800, "navy"],
  ["destinations/haridwar-rishikesh.jpg", "Haridwar & Rishikesh", 1200, 800, "teal"],
  ["destinations/manali.jpg", "Manali", 1200, 800, "navy"],
  ["destinations/shimla.jpg", "Shimla", 1200, 800, "teal"],
  ["destinations/jaipur.jpg", "Jaipur", 1200, 800, "navy"],
  ["destinations/jammu-kashmir.jpg", "Jammu & Kashmir", 1200, 800, "teal"],
  ["destinations/ayodhya.jpg", "Ayodhya", 1200, 800, "navy"],
  ["destinations/mathura-vrindavan.jpg", "Mathura & Vrindavan", 1200, 800, "teal"],
  ["destinations/jim-corbett.jpg", "Jim Corbett", 1200, 800, "navy"],
  ["blog/choose-traveller.jpg", "Choose Traveller", 1200, 700, "navy"],
  ["blog/hill-safety.jpg", "Hill Safety", 1200, 700, "teal"],
  ["blog/chopta-guide.jpg", "Chopta Guide", 1200, 700, "navy"],
  ["blog/delhi-ncr-planning.jpg", "Delhi NCR Planning", 1200, 700, "teal"],
  ["blog/wedding-transport.jpg", "Wedding Transport", 1200, 700, "navy"],
];

for (const [rel, label, w, h, tone] of files) {
  await placeholder(rel, label, w, h, tone);
}

// logo as png
const logoSvg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#061B36"/>
  <circle cx="256" cy="256" r="160" fill="#00B8C4"/>
  <text x="256" y="290" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="180" font-weight="700">S</text>
</svg>`;
await writeFile(
  path.join(root, "logo.png"),
  await sharp(Buffer.from(logoSvg)).png().toBuffer(),
);
console.log("done");

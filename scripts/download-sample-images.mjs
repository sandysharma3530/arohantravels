#!/usr/bin/env node
/**
 * Downloads realistic sample photos for fleet, destinations, hero, and blog.
 *
 * Sources (development samples — replace with your own photos before launch):
 * - Wikimedia Commons: real Force Traveller + North India destinations
 * - Pexels / Unsplash: supporting detail shots
 *
 * Run: npm run download:samples
 */
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "images");
const UA = "SmartSquadTravels/1.0 (sample image fetch for local website mockup)";

async function download(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function wikiFile(title, width = 1600) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("titles", title);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("iiurlwidth", String(width));
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status} for ${title}`);
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url && !info?.thumburl) {
    throw new Error(`No imageinfo for ${title}`);
  }
  return info.thumburl || info.url;
}

async function saveJpeg(relPath, url, width, height) {
  const file = path.join(root, relPath);
  await mkdir(path.dirname(file), { recursive: true });
  const input = await download(url);
  await sharp(input)
    .rotate()
    .resize(width, height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(file);
  console.log("✓", relPath);
}

const pexels = (id, w = 1400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const unsplash = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const jobs = [
  // Force Traveller (Wikimedia — real vehicle)
  ["fleet/traveller/cover.jpg", { wiki: "File:Force Traveller, Leh-Manali Highway.jpg" }, 1400, 900],
  ["fleet/traveller/front-exterior.jpg", { wiki: "File:Force Traveller Luxury.jpg" }, 1400, 900],
  ["fleet/traveller/side-exterior.jpg", { wiki: "File:Force Traveller Luxury.jpg" }, 1400, 900],
  ["fleet/traveller/rear-exterior.jpg", { wiki: "File:Tempo-Shuttl.jpg" }, 1400, 900],
  ["fleet/traveller/interior-seating.jpg", { wiki: "File:In a minibus in Goa, India.jpg" }, 1400, 900],
  [
    "fleet/traveller/driver-cabin.jpg",
    {
      wiki: "File:Decorative Brocade in Minibus with Dalai Lama Button - En Route from Manali to McLeod Ganj - Himachal Pradesh - India (26493062120).jpg",
    },
    1400,
    900,
  ],
  ["fleet/traveller/ac-vents.jpg", { url: pexels(3807517) }, 1400, 900],
  ["fleet/traveller/charging-points.jpg", { url: pexels(1118448) }, 1400, 900],
  ["fleet/traveller/luggage-space.jpg", { url: pexels(1335077) }, 1400, 900],
  ["fleet/traveller/gps-cctv.jpg", { url: pexels(1592384) }, 1400, 900],

  // Urbania stand-ins (premium van form factor)
  [
    "fleet/urbania/cover.jpg",
    {
      wiki: "File:DSC05464 Mercedes-Benz Sprinter, Logistical Vehicle, Johanniter Vienna, 2023-10.jpg",
    },
    1400,
    900,
  ],
  [
    "fleet/urbania/front-exterior.jpg",
    {
      wiki: "File:DSC07725 Mercedes-Benz Sprinter, Wiener Stadtgärten, Front, 2025-07.jpg",
    },
    1400,
    900,
  ],
  [
    "fleet/urbania/side-exterior.jpg",
    {
      wiki: "File:Premier Padmini (Fiat 1100) & Maruti Minibus (both built in India) (16952338817).jpg",
    },
    1400,
    900,
  ],
  [
    "fleet/urbania/rear-exterior.jpg",
    {
      wiki: "File:DSC05464 Mercedes-Benz Sprinter, Logistical Vehicle, Johanniter Vienna, 2023-10.jpg",
    },
    1400,
    900,
  ],
  ["fleet/urbania/interior-seating.jpg", { url: pexels(2533092) }, 1400, 900],
  ["fleet/urbania/driver-cabin.jpg", { url: pexels(3807517) }, 1400, 900],
  ["fleet/urbania/ac-vents.jpg", { url: pexels(244206) }, 1400, 900],
  ["fleet/urbania/charging-points.jpg", { url: pexels(1118448) }, 1400, 900],
  ["fleet/urbania/luggage-space.jpg", { url: pexels(1335077) }, 1400, 900],
  ["fleet/urbania/gps-cctv.jpg", { url: pexels(1592384) }, 1400, 900],

  // Destinations
  ["destinations/tungnath-chopta.jpg", { wiki: "File:Tungnath temple.jpg" }, 1400, 900],
  [
    "destinations/nainital.jpg",
    { wiki: "File:Naini Lake, Nainital, Uttarakhand, India.jpg" },
    1400,
    900,
  ],
  ["destinations/mussoorie.jpg", { wiki: "File:Mussoorie hill station.jpg" }, 1400, 900],
  ["destinations/kedarnath.jpg", { wiki: "File:Kedarnath Temple.jpg" }, 1400, 900],
  ["destinations/haridwar-rishikesh.jpg", { wiki: "File:Har Ki Pauri, Haridwar.jpg" }, 1400, 900],
  [
    "destinations/manali.jpg",
    { wiki: "File:Darcha Padum Road Below Shinku La Lahaul Oct22 A7C 03533.jpg" },
    1400,
    900,
  ],
  ["destinations/shimla.jpg", { wiki: "File:Shimla Mall Road.jpg" }, 1400, 900],
  ["destinations/jaipur.jpg", { wiki: "File:Jaipur 03-2016 02 Amber Fort.jpg" }, 1400, 900],
  [
    "destinations/jammu-kashmir.jpg",
    { wiki: "File:Shila Tsarap Mountains Zanskar Oct22 A7C 04113.jpg" },
    1400,
    900,
  ],
  ["destinations/ayodhya.jpg", { wiki: "File:Ram Janmbhoomi Mandir, Ayodhya Dham.jpg" }, 1400, 900],
  [
    "destinations/mathura-vrindavan.jpg",
    { wiki: "File:Radhavallabh Lal ju Maharaj Temple Vrindavan 2022 17.jpg" },
    1400,
    900,
  ],
  [
    "destinations/jim-corbett.jpg",
    {
      wiki: "File:023 Indian peafowl in Jim Corbett National Park Photo by Giles Laurent.jpg",
    },
    1400,
    900,
  ],

  // Hero / OG / blog
  ["hero/slide-1.jpg", { wiki: "File:Force Traveller, Leh-Manali Highway.jpg" }, 1920, 1080],
  ["hero/slide-2.jpg", { url: unsplash("photo-1506905925346-21bda4d32df4", 2000) }, 1920, 1080],
  ["hero/slide-3.jpg", { wiki: "File:Jaipur 03-2016 02 Amber Fort.jpg" }, 1920, 1080],
  ["og-default.jpg", { wiki: "File:Force Traveller, Leh-Manali Highway.jpg" }, 1200, 630],
  ["blog/choose-traveller.jpg", { wiki: "File:Force Traveller Luxury.jpg" }, 1200, 700],
  ["blog/hill-safety.jpg", { url: unsplash("photo-1464822759023-fed622ff2c3b") }, 1200, 700],
  ["blog/chopta-guide.jpg", { wiki: "File:Tungnath temple.jpg" }, 1200, 700],
  ["blog/delhi-ncr-planning.jpg", { url: unsplash("photo-1469854523086-cc02fe5d8800") }, 1200, 700],
  ["blog/wedding-transport.jpg", { url: unsplash("photo-1511285560929-80b456fea0bc") }, 1200, 700],
];

let ok = 0;
let fail = 0;

for (const [rel, source, w, h] of jobs) {
  try {
    const url = source.wiki ? await wikiFile(source.wiki, Math.max(w, 1400)) : source.url;
    await saveJpeg(rel, url, w, h);
    ok += 1;
    await new Promise((r) => setTimeout(r, 400));
  } catch (err) {
    console.error("✗", rel, err.message);
    fail += 1;
  }
}

console.log(`\nFinished: ${ok} saved, ${fail} failed.`);
console.log(
  "Sample images only. Replace with your own Force Traveller / Urbania / destination photos before launch.",
);

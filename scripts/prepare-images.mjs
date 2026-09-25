/**
 * prepare-images.mjs
 * 1) Crops clean ambience photos out of the store reel screenshots.
 * 2) Generates elegant SVG product cards for every product in src/lib/catalog.ts.
 * Run: node scripts/prepare-images.mjs
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = "C:/Users/DELL/Downloads";
const PUB = path.join(ROOT, "public");

fs.mkdirSync(path.join(PUB, "brand"), { recursive: true });
fs.mkdirSync(path.join(PUB, "images"), { recursive: true });
fs.mkdirSync(path.join(PUB, "products"), { recursive: true });

const FILES = {
  logo: "5886699605334889221.jpg", // violet logo (purple circle)
  hero: "5886699605334889227.jpg", // shelves with Parfumes/YSL/D&G labels
  store1: "5886699605334889226.jpg", // shelves Chanel/Elie Saab
  store2: "5886699605334889223.jpg", // Narciso / D&G shelf
};

async function crop(src, { xf0 = 0, xf1 = 0.82, yf0 = 0.1, yf1 = 0.45 }, out, width = 1100) {
  const img = sharp(path.join(SRC, src));
  const meta = await img.metadata();
  const left = Math.round(meta.width * xf0);
  const top = Math.round(meta.height * yf0);
  const w = Math.round(meta.width * (xf1 - xf0));
  const h = Math.round(meta.height * (yf1 - yf0));
  await img
    .extract({ left, top, width: w, height: h })
    .resize({ width, withoutEnlargement: false })
    .jpeg({ quality: 86 })
    .toFile(path.join(PUB, "images", out));
  console.log("cropped", out, `${w}x${h} -> ${width}px wide`);
}

async function logo() {
  // The purple circle sits centered; crop tight to it so rounded-full is clean.
  const img = sharp(path.join(SRC, FILES.logo));
  const meta = await img.metadata();
  const size = Math.min(meta.width, meta.height);
  const inset = Math.round(size * 0.085);
  await img
    .extract({
      left: Math.round((meta.width - size) / 2) + inset,
      top: Math.round((meta.height - size) / 2) + inset,
      width: size - inset * 2,
      height: size - inset * 2,
    })
    .resize(512, 512)
    .jpeg({ quality: 92 })
    .toFile(path.join(PUB, "brand", "logo.jpg"));
  console.log("logo.jpg done");
}

// ---------------- SVG product cards ----------------

const PALETTES = {
  lavender: { bg1: "#F2ECFB", bg2: "#DFCEF4", glass1: "#FFFFFF", glass2: "#CDB4E8", cap: "#3E2A5C", tint: "#7B3FBE" },
  blush: { bg1: "#FBF0F4", bg2: "#F3D9E3", glass1: "#FFFFFF", glass2: "#E9BFD0", cap: "#8C3A54", tint: "#B4486E" },
  cream: { bg1: "#FBF5EA", bg2: "#F1E3C8", glass1: "#FFFFFF", glass2: "#E5CFA0", cap: "#5C4A2A", tint: "#8C6B2F" },
  sky: { bg1: "#EDF3FB", bg2: "#D3E2F2", glass1: "#FFFFFF", glass2: "#B2CBE6", cap: "#1F3A5C", tint: "#3B6291" },
  night: { bg1: "#ECEAF6", bg2: "#C9C4E4", glass1: "#FFFFFF", glass2: "#8F86BD", cap: "#241C3E", tint: "#4B3E86" },
  mint: { bg1: "#ECF6F0", bg2: "#CFE9DC", glass1: "#FFFFFF", glass2: "#A9D4C0", cap: "#274C3A", tint: "#3F7A5F" },
};

const CATEGORY_PALETTES = {
  women: ["lavender", "blush", "night", "lavender", "blush"],
  men: ["sky", "night", "sky", "night"],
  unisex: ["cream", "mint", "lavender"],
  gift: ["blush", "cream", "blush"],
};

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
  );
}

function productSvg({ brand, palette, shape }) {
  const p = palette;
  const fsSize = brand.length <= 4 ? 34 : brand.length <= 8 ? 26 : brand.length <= 12 ? 21 : 17;
  const letters = brand.length <= 4 ? 5 : 1.5;

  // Bottle geometry variants
  const geo =
    shape === "round"
      ? { body: `<circle cx="400" cy="465" r="165" fill="url(#glass)" stroke="${p.tint}" stroke-opacity=".35" stroke-width="4"/>`, labelY: 445 }
      : shape === "tall"
        ? { body: `<rect x="315" y="255" width="170" height="370" rx="26" fill="url(#glass)" stroke="${p.tint}" stroke-opacity=".35" stroke-width="4"/>`, labelY: 420 }
        : { body: `<rect x="295" y="300" width="210" height="330" rx="30" fill="url(#glass)" stroke="${p.tint}" stroke-opacity=".35" stroke-width="4"/>`, labelY: 440 };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" font-family="Georgia, 'Times New Roman', serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.bg1}"/>
      <stop offset="1" stop-color="${p.bg2}"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.glass1}" stop-opacity=".95"/>
      <stop offset=".55" stop-color="${p.glass1}" stop-opacity=".65"/>
      <stop offset="1" stop-color="${p.glass2}"/>
    </linearGradient>
    <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.cap}"/>
      <stop offset="1" stop-color="${p.cap}" stop-opacity=".75"/>
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="400" r="290" fill="#ffffff" opacity=".38"/>
  <circle cx="400" cy="400" r="218" fill="#ffffff" opacity=".4"/>

  <!-- sparkles -->
  <g fill="${p.tint}" opacity=".5">
    <circle cx="235" cy="245" r="7"/><circle cx="585" cy="205" r="5"/>
    <circle cx="620" cy="560" r="6"/><circle cx="190" cy="540" r="5"/>
  </g>
  <g stroke="#C9A227" stroke-width="2.5" stroke-linecap="round" opacity=".8">
    <path d="M560 300v28M546 314h28"/>
    <path d="M215 380v22M204 391h22"/>
  </g>

  <!-- podium -->
  <ellipse cx="400" cy="668" rx="228" ry="34" fill="${p.cap}" opacity=".12"/>

  <!-- bottle -->
  <rect x="372" y="238" width="56" height="72" fill="url(#glass)" stroke="${p.tint}" stroke-opacity=".25" stroke-width="3"/>
  <rect x="352" y="168" width="96" height="82" rx="16" fill="url(#cap)"/>
  <rect x="368" y="184" width="64" height="12" rx="6" fill="#ffffff" opacity=".28"/>
  ${geo.body}
  <!-- glass highlight -->
  <rect x="318" y="330" width="24" height="255" rx="12" fill="#ffffff" opacity=".6"/>
  <circle cx="345" cy="315" r="10" fill="#ffffff" opacity=".55"/>

  <!-- label -->
  <rect x="310" y="${geo.labelY}" width="180" height="86" rx="12" fill="#ffffff" opacity=".9"/>
  <rect x="310" y="${geo.labelY}" width="180" height="86" rx="12" fill="none" stroke="${p.tint}" stroke-opacity=".3" stroke-width="2"/>
  <text x="400" y="${geo.labelY + 54}" font-size="${fsSize}" letter-spacing="${letters}" fill="${p.cap}" text-anchor="middle" font-weight="600">${escapeXml(brand)}</text>
  <text x="400" y="${geo.labelY + 74}" font-size="11" letter-spacing="3" fill="${p.tint}" text-anchor="middle" opacity=".8">EAU DE PARFUM</text>

  <!-- brand footer -->
  <text x="400" y="745" font-size="20" letter-spacing="8" fill="${p.cap}" text-anchor="middle" opacity=".65">VIOLET</text>
</svg>`;
}

function placeholderSvg() {
  return productSvg({ brand: "VIOLET", palette: PALETTES.lavender, shape: "square" });
}

function run() {
  const catalogSrc = fs.readFileSync(
    path.join(ROOT, "src", "lib", "catalog.ts"),
    "utf8"
  );
  const re = /slug:\s*"([^"]+)",\s*name:\s*"[^"]*",\s*brand:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
  let m;
  let count = 0;
  const counter = {};
  while ((m = re.exec(catalogSrc))) {
    const [, slug, brand, category] = m;
    const list = CATEGORY_PALETTES[category] || CATEGORY_PALETTES.women;
    const idx = counter[category] || 0;
    counter[category] = idx + 1;
    const palette = PALETTES[list[idx % list.length]];
    const shape = category === "men" ? "tall" : idx % 3 === 1 ? "round" : "square";
    fs.writeFileSync(path.join(PUB, "products", `${slug}.svg`), productSvg({ brand, palette, shape }));
    count++;
  }
  fs.writeFileSync(path.join(PUB, "products", "placeholder.svg"), placeholderSvg());
  console.log(`generated ${count} product SVGs + placeholder`);
}

await logo();
await crop(FILES.hero, { yf0: 0.105, yf1: 0.425 }, "hero.jpg", 1200);
await crop(FILES.store1, { yf0: 0.09, yf1: 0.415 }, "store-1.jpg", 1000);
await crop(FILES.store2, { yf0: 0.1, yf1: 0.42 }, "store-2.jpg", 1000);
run();
console.log("all images ready");

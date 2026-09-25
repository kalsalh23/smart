/**
 * prepare-images.mjs
 * 1) Crops clean ambience photos out of the store reel screenshots.
 * 2) Renders studio-style product images (SVG) for every product in catalog.ts.
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
  logo: "5886699605334889221.jpg",
  hero: "5886699605334889227.jpg",
  store1: "5886699605334889226.jpg",
  store2: "5886699605334889223.jpg",
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
  console.log("cropped", out, `${w}x${h}`);
}

async function logo() {
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

/* ---------------- Studio product renders ---------------- */

const PALETTES = {
  lavender: { wall1: "#F8F3FD", wall2: "#E9DDF7", liquid1: "#D3B2F2", liquid2: "#8E5BC8", tint: "#6C31A8", cap: "gold" },
  blush:    { wall1: "#FCF4F6", wall2: "#F3DFE6", liquid1: "#F2BCCA", liquid2: "#C96A8B", tint: "#8C3A54", cap: "gold" },
  amber:    { wall1: "#FAF6EE", wall2: "#EBDFC7", liquid1: "#EAC671", liquid2: "#96681C", tint: "#6B4A12", cap: "dark" },
  ink:      { wall1: "#F2EFF8", wall2: "#D9D3E9", liquid1: "#9188C0", liquid2: "#463A7C", tint: "#372C61", cap: "dark" },
  sky:      { wall1: "#F1F5FB", wall2: "#DBE6F1", liquid1: "#B3CDEA", liquid2: "#4C7BB4", tint: "#2F5680", cap: "dark" },
  mint:     { wall1: "#F1F8F4", wall2: "#DDEEE5", liquid1: "#BADFCB", liquid2: "#5F9C7C", tint: "#3F7A5F", cap: "gold" },
  rosegold: { wall1: "#FCF4F0", wall2: "#F2DFD4", liquid1: "#ECC4A6", liquid2: "#B87A4F", tint: "#96603B", cap: "gold" },
};

const CATEGORY_PALETTES = {
  women: ["lavender", "blush", "ink", "rosegold", "lavender"],
  men: ["amber", "sky", "ink", "amber"],
  unisex: ["mint", "amber", "lavender"],
  gift: ["blush", "rosegold", "blush"],
};

const GOLD_CAP = { hi: "#F4E2AE", mid: "#C9A84E", low: "#8A6414" };
const DARK_CAP = { hi: "#565664", mid: "#2B2B36", low: "#121218" };

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
  );
}

function bottleBody(shape) {
  // returns { body: outer glass path attrs, inner: liquid rect, labelY, topY }
  if (shape === "round") {
    return {
      body: `<circle cx="400" cy="465" r="168" fill="url(#liquid)" stroke="rgba(255,255,255,.9)" stroke-width="6"/>`,
      shoulder: `<ellipse cx="400" cy="392" rx="150" ry="34" fill="#ffffff" opacity=".14"/>`,
      labelY: 470,
      bodyTop: 297,
      bodyH: 336,
    };
  }
  if (shape === "tall") {
    return {
      body: `<rect x="318" y="252" width="164" height="386" rx="20" fill="url(#liquid)" stroke="rgba(255,255,255,.9)" stroke-width="6"/>`,
      shoulder: "",
      labelY: 420,
      bodyTop: 252,
      bodyH: 386,
    };
  }
  return {
    body: `<rect x="292" y="298" width="216" height="340" rx="24" fill="url(#liquid)" stroke="rgba(255,255,255,.9)" stroke-width="6"/>`,
    shoulder: "",
    labelY: 440,
    bodyTop: 298,
    bodyH: 340,
  };
}

function productSvg({ brand, p, shape }) {
  const cap = p.cap === "gold" ? GOLD_CAP : DARK_CAP;
  const geo = bottleBody(shape);
  const brandSize =
    brand.length <= 4 ? 30 : brand.length <= 8 ? 23 : brand.length <= 12 ? 19 : 15;
  const letters = brand.length <= 4 ? 5 : 1.2;

  // liquid fill sits inside the glass, leaving a glass margin
  const liquidX = shape === "tall" ? 330 : 306;
  const liquidW = shape === "tall" ? 140 : 188;
  const liquidY = geo.bodyTop + 26;
  const liquidH = geo.bodyH - 44;
  const liquidRx = shape === "tall" ? 14 : 18;
  const surfaceY = liquidY + 26;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" font-family="Georgia, 'Times New Roman', serif">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.wall1}"/>
      <stop offset="1" stop-color="${p.wall2}"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.wall2}"/>
      <stop offset="1" stop-color="${p.tint}" stop-opacity=".18"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".45" r=".55">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".85"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.liquid1}"/>
      <stop offset="1" stop-color="${p.liquid2}"/>
    </linearGradient>
    <linearGradient id="capg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${cap.hi}"/>
      <stop offset=".45" stop-color="${cap.mid}"/>
      <stop offset="1" stop-color="${cap.low}"/>
    </linearGradient>
    <linearGradient id="glassSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/>
      <stop offset=".12" stop-color="#ffffff" stop-opacity=".05"/>
      <stop offset=".88" stop-color="#ffffff" stop-opacity=".05"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity=".45"/>
    </linearGradient>
    <filter id="blur10" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="blur5" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="blur2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>

  <!-- studio room -->
  <rect width="800" height="800" fill="url(#wall)"/>
  <rect y="612" width="800" height="188" fill="url(#floor)"/>
  <rect y="610" width="800" height="4" fill="#ffffff" opacity=".35"/>
  <ellipse cx="400" cy="352" rx="300" ry="260" fill="url(#glow)"/>

  <!-- ground shadow + reflection -->
  <ellipse cx="400" cy="668" rx="185" ry="26" fill="${p.tint}" opacity=".3" filter="url(#blur10)"/>
  <g transform="translate(0 1336) scale(1 -1)" opacity=".14" filter="url(#blur5)">
    ${shape === "round"
      ? `<circle cx="400" cy="465" r="150" fill="url(#liquid)"/>`
      : `<rect x="${shape === "tall" ? 330 : 306}" y="${geo.bodyTop + 40}" width="${liquidW}" height="${geo.bodyH - 120}" rx="${liquidRx}" fill="url(#liquid)"/>`}
  </g>

  <!-- cap -->
  <rect x="352" y="158" width="96" height="92" rx="14" fill="url(#capg)"/>
  <rect x="366" y="170" width="18" height="64" rx="8" fill="#ffffff" opacity=".45"/>
  <path d="M398 164v80M418 164v80" stroke="#ffffff" opacity=".18" stroke-width="3"/>
  <!-- collar -->
  <rect x="366" y="252" width="68" height="16" rx="5" fill="url(#capg)"/>
  <rect x="366" y="252" width="68" height="16" rx="5" fill="#ffffff" opacity=".18"/>

  <!-- neck -->
  <rect x="372" y="264" width="56" height="${shape === "tall" ? 0 : 42}" fill="${p.liquid1}" opacity=".55" stroke="rgba(255,255,255,.7)" stroke-width="3"/>
  ${shape === "tall" ? "" : `<rect x="372" y="264" width="56" height="42" fill="url(#liquid)" opacity=".4"/>`}

  <!-- bottle glass + liquid -->
  ${geo.body}
  <rect x="${liquidX}" y="${liquidY}" width="${liquidW}" height="${liquidH}" rx="${liquidRx}" fill="url(#liquid)"/>
  <ellipse cx="400" cy="${surfaceY}" rx="${liquidW / 2 - 14}" ry="12" fill="#ffffff" opacity=".3"/>
  ${geo.shoulder}

  <!-- glass vertical light -->
  <rect x="${shape === "tall" ? 322 : 296}" y="${geo.bodyTop + 8}" width="${shape === "tall" ? 156 : 208}" height="${geo.bodyH - 16}" rx="${liquidRx + 6}" fill="url(#glassSide)"/>
  <!-- highlights -->
  <rect x="${shape === "tall" ? 338 : 314}" y="${geo.bodyTop + 30}" width="16" height="${geo.bodyH - 110}" rx="8" fill="#ffffff" opacity=".55" filter="url(#blur2)"/>
  <circle cx="${shape === "tall" ? 350 : 328}" cy="${geo.bodyTop + 46}" r="9" fill="#ffffff" opacity=".7" filter="url(#blur2)"/>

  <!-- label -->
  <rect x="312" y="${geo.labelY + 4}" width="176" height="92" rx="10" fill="#000000" opacity=".12" filter="url(#blur5)"/>
  <rect x="312" y="${geo.labelY}" width="176" height="92" rx="10" fill="#FDFCF8"/>
  <rect x="312" y="${geo.labelY}" width="176" height="92" rx="10" fill="none" stroke="${p.tint}" stroke-opacity=".25" stroke-width="1.5"/>
  <line x1="336" y1="${geo.labelY + 20}" x2="464" y2="${geo.labelY + 20}" stroke="#C9A227" stroke-opacity=".65" stroke-width="1.5"/>
  <text x="400" y="${geo.labelY + 52}" font-size="${brandSize}" letter-spacing="${letters}" fill="${p.tint}" text-anchor="middle" font-weight="600">${escapeXml(brand)}</text>
  <text x="400" y="${geo.labelY + 74}" font-size="10" letter-spacing="2.5" fill="#7d7668" text-anchor="middle">EAU DE PARFUM</text>
  <line x1="336" y1="${geo.labelY + 84}" x2="464" y2="${geo.labelY + 84}" stroke="#C9A227" stroke-opacity=".65" stroke-width="1.5"/>

  <!-- gold dust accents -->
  <g fill="#C9A227" opacity=".55">
    <circle cx="212" cy="228" r="5"/><circle cx="602" cy="196" r="4"/>
    <circle cx="632" cy="540" r="5"/><circle cx="176" cy="520" r="4"/>
  </g>
  <g stroke="#C9A227" stroke-width="2" stroke-linecap="round" opacity=".7">
    <path d="M564 268v24M552 280h24"/>
    <path d="M212 356v20M202 366h20"/>
  </g>
</svg>`;
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
    const p = PALETTES[list[idx % list.length]];
    const shape = idx % 3 === 1 ? "round" : idx % 3 === 2 ? "tall" : "square";
    fs.writeFileSync(
      path.join(PUB, "products", `${slug}.svg`),
      productSvg({ brand, p, shape })
    );
    count++;
  }
  fs.writeFileSync(
    path.join(PUB, "products", "placeholder.svg"),
    productSvg({ brand: "VIOLET", p: PALETTES.lavender, shape: "square" })
  );
  console.log(`generated ${count} product renders + placeholder`);
}

await logo();
await crop(FILES.hero, { yf0: 0.105, yf1: 0.425 }, "hero.jpg", 1200);
await crop(FILES.store1, { yf0: 0.09, yf1: 0.415 }, "store-1.jpg", 1000);
await crop(FILES.store2, { yf0: 0.1, yf1: 0.42 }, "store-2.jpg", 1000);
run();
console.log("all images ready");

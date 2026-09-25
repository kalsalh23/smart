const sharp = require("sharp");
const fs = require("fs");
fs.mkdirSync("screenshots", { recursive: true });
async function main() {
  const files = [
    "ysl-libre.svg",
    "chanel-bleu.svg",
    "narciso-for-her.svg",
    "juicy-viva-la-juicy-set.svg",
    "paco-1-million.svg",
    "elie-saab-le-parfum.svg",
    "marc-jacobs-daisy.svg",
    "dg-devotion.svg",
  ];
  const bufs = [];
  for (const f of files) {
    bufs.push(await sharp("public/products/" + f, { density: 96 }).resize(260, 260).png().toBuffer());
  }
  const comps = bufs.map((b, i) => ({
    input: b,
    left: (i % 4) * 260,
    top: Math.floor(i / 4) * 260,
  }));
  await sharp({ create: { width: 1040, height: 520, channels: 4, background: "#ffffff" } })
    .composite(comps)
    .png()
    .toFile("screenshots/svg-preview.png");
  console.log("written");
}
main().catch((e) => console.log("ERR", e.message));

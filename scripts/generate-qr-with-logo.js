import QRCode from "qrcode";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    const m = arg.match(/^--([^=]+)=(.*)$/);
    if (m) args[m[1]] = m[2];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  const text = args.url ?? "https://pedrodapps.com/#links";
  const logoPath = args.logo ?? path.join("src", "assets", "pedrodapps_icon.png");
  const outPath = args.out ?? path.join("public", "qr-links.png");
  const size = Number(args.size ?? 512);
  const margin = Number(args.margin ?? 2);
  const logoScale = Number(args.logoScale ?? 0.22); // fração do tamanho do QR
  const logoRadius = Number(args.logoRadius ?? 12);
  const logoBorder = Number(args.logoBorder ?? 10); // padding branco em volta do logo

  // Gera o QR base em PNG
  const qrBuffer = await QRCode.toBuffer(text, {
    type: "png",
    width: size,
    margin,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  // Prepara o logo
  const logoWidth = Math.round(size * logoScale);
  const logoPng = await sharp(logoPath)
    .resize(logoWidth, logoWidth, { fit: "contain" })
    .png()
    .toBuffer();

  // Fundo branco arredondado para melhorar a legibilidade do QR
  const backdropSize = logoWidth + logoBorder * 2;
  const backdropSvg =
    `<svg width="${backdropSize}" height="${backdropSize}" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="0" y="0" width="${backdropSize}" height="${backdropSize}" rx="${logoRadius}" ry="${logoRadius}" fill="#ffffff"/>` +
    `</svg>`;
  const backdropPng = await sharp(Buffer.from(backdropSvg)).png().toBuffer();

  const logoWithBackdrop = await sharp(backdropPng)
    .composite([{ input: logoPng, gravity: "center" }])
    .png()
    .toBuffer();

  // Composição final: logo central sobre o QR
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });

  await sharp(qrBuffer)
    .composite([{ input: logoWithBackdrop, gravity: "center" }])
    .png()
    .toFile(outPath);

  console.log(`QR gerado com sucesso: ${outPath}`);
}

main().catch((err) => {
  console.error("Falha ao gerar QR:", err);
  process.exit(1);
});

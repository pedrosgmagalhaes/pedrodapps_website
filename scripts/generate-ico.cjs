/*
 * Gera public/favicon.ico a partir de múltiplos PNGs
 */
const fs = require('fs');
const path = require('path');
const pngToIcoModule = require('png-to-ico');
const pngToIco = pngToIcoModule.default || pngToIcoModule;

const ICONS_DIR = path.resolve(__dirname, '../public/icons');
const OUT_ICO = path.resolve(__dirname, '../public/favicon.ico');

async function main() {
  const sources = [
    path.join(ICONS_DIR, 'favicon-16x16.png'),
    path.join(ICONS_DIR, 'favicon-32x32.png'),
    path.join(ICONS_DIR, 'favicon-48x48.png'),
    path.join(ICONS_DIR, 'favicon-64x64.png'),
  ];

  for (const src of sources) {
    if (!fs.existsSync(src)) {
      console.error('PNG não encontrado:', src);
      process.exit(1);
    }
  }

  const buf = await pngToIco(sources);
  await fs.promises.writeFile(OUT_ICO, buf);
  console.log('Gerado favicon.ico em:', OUT_ICO);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/*
 * Gera variações de ícones a partir de public/icon.png
 * Tamanhos: 16, 32, 144, 180, 192, 512
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.resolve(__dirname, '../public/icon.png');
const OUT_DIR = path.resolve(__dirname, '../public/icons');

const targets = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-64x64.png', size: 64 },
  { name: 'mstile-144x144.png', size: 144 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function ensureOutDir() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
}

async function generate() {
  if (!fs.existsSync(SRC)) {
    console.error('Arquivo de origem não encontrado:', SRC);
    process.exit(1);
  }
  await ensureOutDir();

  const input = sharp(SRC);
  const metadata = await input.metadata();
  console.log('Imagem de origem:', SRC, metadata.width + 'x' + metadata.height);

  for (const target of targets) {
    const outPath = path.join(OUT_DIR, target.name);
    await sharp(SRC)
      .resize(target.size, target.size, {
        fit: 'contain',
        withoutEnlargement: false,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outPath);
    console.log('Gerado:', outPath);
  }

  console.log('Concluído. Ícones gerados em:', OUT_DIR);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

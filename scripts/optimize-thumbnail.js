// Optimize src/assets/thumbnail.png for social sharing (ESM)
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    // Fonte do thumbnail social: usar builderselite.png fornecido
    const input = path.resolve(__dirname, "../src/assets/builderselite.png");
    const outDir = path.resolve(__dirname, "../public");
    const outWebp = path.join(outDir, "thumbnail-social.webp");
    const outJpg = path.join(outDir, "thumbnail-social.jpg");

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Process WEBP
    await sharp(input)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toFile(outWebp);

    // Process JPEG
    await sharp(input)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, chromaSubsampling: "4:4:4" })
      .toFile(outJpg);

    console.log("Social thumbnails generated at:", outWebp, "and", outJpg);
  } catch (err) {
    console.error("Failed to optimize thumbnail:", err);
    process.exit(1);
  }
})();

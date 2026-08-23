const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'public', 'Skills', 'Carousel'),
  path.join(__dirname, '..', 'public', 'Skills', 'PostDesigns')
];

async function compressHighRes() {
  for (const dir of targets) {
    const compressedDir = path.join(dir, 'compressedImages');
    if (!fs.existsSync(compressedDir)) {
      fs.mkdirSync(compressedDir, { recursive: true });
      console.log(`📁 Created: ${compressedDir}`);
    }

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      // Only process files larger than 1MB and not already in compressedImages
      if (stat.isFile() && stat.size > 1024 * 1024 && file.match(/\.(jpg|jpeg|png)$/i)) {
        const outputPath = path.join(compressedDir, file);
        
        console.log(`⏳ Compressing large file: ${file} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)...`);
        try {
          let pipeline = sharp(fullPath);
          
          // Resize if too large for web
          pipeline = pipeline.resize(2560, 2560, {
            fit: 'inside',
            withoutEnlargement: true
          });

          if (file.endsWith('.png')) {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
          } else {
            pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
          }

          await pipeline.toFile(outputPath);
          
          const newSize = fs.statSync(outputPath).size / (1024 * 1024);
          console.log(`✅ Optimized ${file}: ${(stat.size / (1024 * 1024)).toFixed(2)}MB -> ${newSize.toFixed(2)}MB`);
        } catch (err) {
          console.error(`❌ Error optimizing ${file}:`, err.message);
        }
      }
    }
  }
}

compressHighRes();

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const menuDir = path.join(__dirname, '..', 'public', 'Skills', 'Menu');

async function compress() {
  const files = fs.readdirSync(menuDir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(menuDir, file);
      const outputPath = path.join(menuDir, file.replace('.png', '.jpg'));
      
      console.log(`⏳ Compressing: ${file} -> ${path.basename(outputPath)}`);
      try {
        await sharp(inputPath)
          .jpeg({ quality: 60 })
          .toFile(outputPath);
        
        const oldSize = fs.statSync(inputPath).size / (1024 * 1024);
        const newSize = fs.statSync(outputPath).size / (1024 * 1024);
        console.log(`✅ Success: ${oldSize.toFixed(2)}MB -> ${newSize.toFixed(2)}MB`);
        
        fs.unlinkSync(inputPath); // Remove original PNG
      } catch (err) {
        console.error(`❌ Error compressing ${file}:`, err.message);
      }
    }
  }
}

compress();

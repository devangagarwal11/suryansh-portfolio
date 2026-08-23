const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const file = path.join(__dirname, '..', 'public', 'Skills', 'Carousel', 'AA-3.jpg');
const rel = '/Skills/Carousel/AA-3.jpg';

async function upload() {
  console.log(`⏳ Uploading ${rel}...`);
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'skills/Carousel',
      use_filename: true,
      unique_filename: false
    });
    console.log(`✅ Success: ${result.secure_url}`);
    
    const mappingFile = path.join(__dirname, '..', 'cloudinary-mapping.json');
    const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
    mapping[rel] = result.secure_url;
    fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
    console.log(`📝 Updated mapping.`);
  } catch (err) {
    console.error(`❌ Error:`, err.message);
  }
}

upload();

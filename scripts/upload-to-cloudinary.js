const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
// Priority: Environment Variables > Manual Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'daeio5gbf',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const skillsDir = path.join(__dirname, '..', 'public', 'Skills');
const mappingFile = path.join(__dirname, '..', 'cloudinary-mapping.json');

const mapping = {};

async function uploadFile(filePath, remotePath) {
  try {
    console.log(`⏳ Uploading: ${remotePath}...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'skills/' + path.dirname(remotePath).replace(/\\/g, '/'),
      use_filename: true,
      unique_filename: false,
      resource_type: 'auto'
    });
    console.log(`✅ Uploaded: ${remotePath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${remotePath}:`, error.message);
    return null;
  }
}

async function walk(dir, relativePath = '') {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const rel = path.join(relativePath, file).replace(/\\/g, '/');
    
    if (fs.statSync(fullPath).isDirectory()) {
      await walk(fullPath, rel);
    } else {
      // Only upload images
      if (file.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
        if (mapping['/Skills/' + rel]) {
          console.log(`⏩ Skipping (already mapped): ${rel}`);
          continue;
        }
        const url = await uploadFile(fullPath, rel);
        if (url) mapping['/Skills/' + rel] = url;
      }
    }
  }
}

async function run() {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Error: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables are required.');
    console.log('\nUsage:');
    console.log('$env:CLOUDINARY_API_KEY="your_key"; $env:CLOUDINARY_API_SECRET="your_secret"; node scripts/upload-to-cloudinary.js');
    return;
  }

  // Load existing mapping if it exists
  if (fs.existsSync(mappingFile)) {
    const existing = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
    Object.assign(mapping, existing);
    console.log(`📂 Loaded ${Object.keys(existing).length} existing mappings.`);
  }

  console.log('🚀 Starting Cloudinary upload for Skills images...');
  await walk(skillsDir);
  console.log('\n✨ Upload complete.');
  
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
  console.log(`📄 Mapping saved to: ${mappingFile}`);
}

run();

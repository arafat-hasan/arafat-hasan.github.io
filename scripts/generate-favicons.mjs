import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Generate favicon variants
async function generateFavicons() {
    console.log('🎨 Generating favicon variants...\n');

    // 1. favicon.ico (32x32)
    await sharp(svgBuffer)
        .resize(32, 32)
        .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✅ Generated favicon.ico (32x32)');

    // 2. favicon-16x16.png
    await sharp(svgBuffer)
        .resize(16, 16)
        .png()
        .toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('✅ Generated favicon-16x16.png');

    // 3. favicon-32x32.png
    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✅ Generated favicon-32x32.png');

    // 4. favicon-192x192.png (Android)
    await sharp(svgBuffer)
        .resize(192, 192)
        .png()
        .toFile(path.join(publicDir, 'favicon-192x192.png'));
    console.log('✅ Generated favicon-192x192.png (Android)');

    // 5. favicon-512x512.png (Android)
    await sharp(svgBuffer)
        .resize(512, 512)
        .png()
        .toFile(path.join(publicDir, 'favicon-512x512.png'));
    console.log('✅ Generated favicon-512x512.png (Android)');

    // 6. apple-touch-icon.png (180x180)
    await sharp(svgBuffer)
        .resize(180, 180)
        .png()
        .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png (iOS)');

    console.log('\n🎉 All favicon variants generated successfully!');
}

generateFavicons().catch(err => {
    console.error('❌ Error generating favicons:', err);
    process.exit(1);
});

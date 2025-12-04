#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes images by:
 * 1. Resizing large images to max dimensions
 * 2. Compressing JPEGs and PNGs
 * 3. Generating WebP versions
 * 
 * Usage: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { readdir, stat, unlink, rename, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exiftool } from 'exiftool-vendored';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
    maxWidth: 1920,
    maxHeight: 1920,
    jpegQuality: 75,
    pngQuality: 75,
    webpQuality: 75,
    imagesDir: join(__dirname, '../public/images'),
    extensions: ['.jpg', '.jpeg', '.png', '.heif', '.heic'],
};

// Statistics
const stats = {
    processed: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    optimizedSize: 0,
};

/**
 * Get all image files recursively
 */
async function getImageFiles(dir) {
    const files = [];

    try {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory()) {
                const subFiles = await getImageFiles(fullPath);
                files.push(...subFiles);
            } else if (entry.isFile()) {
                const ext = extname(entry.name).toLowerCase();
                if (CONFIG.extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }

    return files;
}

/**
 * Get file size in bytes
 */
async function getFileSize(filePath) {
    try {
        const stats = await stat(filePath);
        return stats.size;
    } catch {
        return 0;
    }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Copy metadata from source to destination file
 */
async function copyMetadata(sourcePath, destPath) {
    try {
        // Read metadata from source
        const tags = await exiftool.read(sourcePath);

        // Write important metadata to destination
        // Preserve: Date/Time, GPS, Camera info, Orientation
        const metadataToPreserve = {
            DateTimeOriginal: tags.DateTimeOriginal,
            CreateDate: tags.CreateDate,
            ModifyDate: tags.ModifyDate,
            GPSLatitude: tags.GPSLatitude,
            GPSLongitude: tags.GPSLongitude,
            GPSAltitude: tags.GPSAltitude,
            GPSDateStamp: tags.GPSDateStamp,
            GPSTimeStamp: tags.GPSTimeStamp,
            Make: tags.Make,
            Model: tags.Model,
            LensModel: tags.LensModel,
            FocalLength: tags.FocalLength,
            FNumber: tags.FNumber,
            ISO: tags.ISO,
            ExposureTime: tags.ExposureTime,
            // Note: Orientation is NOT preserved because .rotate() already applies it to pixels
            Artist: tags.Artist,
            Copyright: tags.Copyright,
        };

        // Filter out undefined values
        const filteredMetadata = Object.fromEntries(
            Object.entries(metadataToPreserve).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(filteredMetadata).length > 0) {
            await exiftool.write(destPath, filteredMetadata, ['-overwrite_original']);
        }
    } catch (error) {
        // Metadata copy is non-critical, just log the error
        console.warn(`  Warning: Could not copy metadata: ${error.message}`);
    }
}

/**
 * Optimize a single image
 */
async function optimizeImage(filePath) {
    // Check for 0-byte files first and delete them
    try {
        const stats = await stat(filePath);
        if (stats.size === 0) {
            await unlink(filePath);
            console.log(`🗑️  Deleted 0-byte file: ${filePath.replace(CONFIG.imagesDir, '')}`);
            return;
        }
    } catch {
        return; // File might not exist
    }

    const ext = extname(filePath).toLowerCase();
    const basename = filePath.substring(0, filePath.lastIndexOf('.'));
    const webpPath = `${basename}.webp`;
    const isHeif = ext === '.heif' || ext === '.heic';

    try {
        // Get original stats
        const originalStats = await stat(filePath);
        const originalSize = originalStats.size;
        stats.originalSize += originalSize;

        let image;

        if (isHeif) {
            // Convert HEIF to JPEG buffer using heic-convert
            const inputBuffer = await readFile(filePath);
            const outputBuffer = await heicConvert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1, // High quality intermediate
            });
            // Load with Sharp and apply orientation transformation
            // .rotate() without arguments auto-rotates based on EXIF orientation
            image = sharp(outputBuffer).rotate();
        } else {
            // Load image normally and apply orientation transformation
            image = sharp(filePath).rotate();
        }

        const metadata = await image.metadata();

        // Check if image needs resizing
        const needsResize = metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight;

        // Optimize original format
        // Note: withMetadata() preserves ICC profile and basic metadata
        // We'll use exiftool to copy comprehensive EXIF/XMP data after saving
        let pipeline = image.clone().withMetadata();

        if (needsResize) {
            pipeline = pipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        if (isHeif) {
            // Convert HEIF to JPG
            const jpgPath = `${basename}.jpg`;
            await pipeline.jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true }).toFile(jpgPath);

            // Copy metadata from original HEIF to JPG
            await copyMetadata(filePath, jpgPath);

            // Generate WebP
            let webpInstance = image.clone().withMetadata();
            if (needsResize) {
                webpInstance = webpInstance.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                });
            }
            await webpInstance.webp({ quality: CONFIG.webpQuality }).toFile(webpPath);

            // Copy metadata from original HEIF to WebP
            await copyMetadata(filePath, webpPath);

            // Get new sizes
            const jpgSize = await getFileSize(jpgPath);
            const webpSize = await getFileSize(webpPath);

            // Delete original HEIF
            await unlink(filePath);
            stats.optimizedSize += jpgSize;

            console.log(
                `✓ ${filePath.replace(CONFIG.imagesDir, '')} (Converted to JPG)\n` +
                `  Original: ${formatBytes(originalSize)} → JPG: ${formatBytes(jpgSize)}\n` +
                `  WebP: ${formatBytes(webpSize)}\n` +
                `  Original HEIF deleted`
            );

            stats.processed++;
            return; // Done with HEIF
        }

        if (ext === '.jpg' || ext === '.jpeg') {
            await pipeline.jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true }).toFile(`${filePath}.tmp`);
        } else if (ext === '.png') {
            await pipeline.png({ quality: CONFIG.pngQuality, compressionLevel: 9 }).toFile(`${filePath}.tmp`);
        }

        // Check results
        const tmpStats = await stat(`${filePath}.tmp`);
        const tmpSize = tmpStats.size;
        const savings = originalSize - tmpSize;
        const savingsPercent = (savings / originalSize) * 100;

        // Only replace if savings are significant (>5%) to prevent quality degradation loops
        if (savingsPercent > 5) {
            // Before replacing, save original for metadata extraction
            const originalPath = `${filePath}.original`;
            await rename(filePath, originalPath);
            await rename(`${filePath}.tmp`, filePath);

            // Copy metadata from original to optimized file
            await copyMetadata(originalPath, filePath);
            await unlink(originalPath);

            stats.optimizedSize += tmpSize;

            // Generate WebP version
            let webpPipeline = sharp(filePath).withMetadata();
            if (needsResize) {
                webpPipeline = webpPipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                });
            }
            await webpPipeline.webp({ quality: CONFIG.webpQuality }).toFile(webpPath);

            // Copy metadata to WebP
            await copyMetadata(filePath, webpPath);

            const webpSize = await getFileSize(webpPath);

            console.log(
                `✓ ${filePath.replace(CONFIG.imagesDir, '')}\n` +
                `  Original: ${formatBytes(originalSize)} → Optimized: ${formatBytes(tmpSize)} ` +
                `(${Math.round(savingsPercent)}% reduction)\n` +
                `  WebP: ${formatBytes(webpSize)}`
            );

            stats.processed++;
        } else {
            // Savings too small, keep original
            await unlink(`${filePath}.tmp`);
            stats.optimizedSize += originalSize;

            // Check if WebP needs update
            let needsWebP = true;
            try {
                const webpStats = await stat(webpPath);
                // If WebP exists and is newer than original, skip
                if (webpStats.mtime >= originalStats.mtime) {
                    needsWebP = false;
                }
            } catch {
                // WebP doesn't exist
            }

            if (needsWebP) {
                // Generate WebP version from original
                let webpPipeline = sharp(filePath).withMetadata();
                if (needsResize) {
                    webpPipeline = webpPipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                        fit: 'inside',
                        withoutEnlargement: true,
                    });
                }
                await webpPipeline.webp({ quality: CONFIG.webpQuality }).toFile(webpPath);

                // Copy metadata to WebP
                await copyMetadata(filePath, webpPath);

                const webpSize = await getFileSize(webpPath);
                console.log(
                    `✓ ${filePath.replace(CONFIG.imagesDir, '')} (WebP updated)\n` +
                    `  Original kept (savings < 5%)\n` +
                    `  WebP: ${formatBytes(webpSize)}`
                );
                stats.processed++;
            } else {
                console.log(
                    `⊘ ${filePath.replace(CONFIG.imagesDir, '')}\n` +
                    `  Skipped: Already optimized`
                );
                stats.skipped++;
            }
        }
    } catch (error) {
        console.error(`✗ Error optimizing ${filePath}:`, error.message);
        if (error.message.includes('No decoding plugin installed')) {
            console.error('  Hint: Your environment might lack HEVC support for HEIF/HEIC files.');
        }
        stats.errors++;
        // Clean up tmp file if it exists
        try {
            await unlink(`${filePath}.tmp`);
        } catch { }
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🖼️  Image Optimization Starting...\n');
    console.log(`Directory: ${CONFIG.imagesDir}`);
    console.log(`Max dimensions: ${CONFIG.maxWidth}x${CONFIG.maxHeight}`);
    console.log(`Quality: JPEG ${CONFIG.jpegQuality}%, PNG ${CONFIG.pngQuality}%, WebP ${CONFIG.webpQuality}%\n`);

    const imageFiles = await getImageFiles(CONFIG.imagesDir);

    if (imageFiles.length === 0) {
        console.log('No images found to optimize.');
        return;
    }

    console.log(`Found ${imageFiles.length} images to process\n`);

    // Process images sequentially to avoid memory issues
    for (const file of imageFiles) {
        await optimizeImage(file);
    }

    // Print summary
    const totalSavings = stats.originalSize - stats.optimizedSize;
    const savingsPercent = stats.originalSize > 0
        ? Math.round((totalSavings / stats.originalSize) * 100)
        : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 Optimization Summary');
    console.log('='.repeat(60));
    console.log(`Processed: ${stats.processed} images`);
    console.log(`Skipped: ${stats.skipped} images (already optimized)`);
    console.log(`Errors: ${stats.errors} images`);
    console.log(`Original size: ${formatBytes(stats.originalSize)}`);
    console.log(`Optimized size: ${formatBytes(stats.optimizedSize)}`);
    console.log(`Total savings: ${formatBytes(totalSavings)} (${savingsPercent}%)`);
    console.log('='.repeat(60));

    if (stats.errors > 0) {
        await exiftool.end();
        process.exit(1);
    }

    // Clean up exiftool process
    await exiftool.end();
}

main().catch(async (error) => {
    console.error(error);
    await exiftool.end();
    process.exit(1);
});

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
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
    maxWidth: 1920,
    maxHeight: 1920,
    jpegQuality: 85,
    pngQuality: 85,
    webpQuality: 85,
    imagesDir: join(__dirname, '../public/images'),
    extensions: ['.jpg', '.jpeg', '.png'],
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
 * Optimize a single image
 */
async function optimizeImage(filePath) {
    const ext = extname(filePath).toLowerCase();
    const basename = filePath.substring(0, filePath.lastIndexOf('.'));
    const webpPath = `${basename}.webp`;

    try {
        // Get original size
        const originalSize = await getFileSize(filePath);
        stats.originalSize += originalSize;

        // Load image
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Check if image needs resizing
        const needsResize = metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight;

        // Optimize original format
        let pipeline = image.clone();

        if (needsResize) {
            pipeline = pipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        if (ext === '.jpg' || ext === '.jpeg') {
            await pipeline.jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true }).toFile(`${filePath}.tmp`);
        } else if (ext === '.png') {
            await pipeline.png({ quality: CONFIG.pngQuality, compressionLevel: 9 }).toFile(`${filePath}.tmp`);
        }

        // Replace original with optimized
        const { rename, unlink } = await import('fs/promises');
        const tmpSize = await getFileSize(`${filePath}.tmp`);

        // Only replace if optimized version is smaller
        if (tmpSize < originalSize) {
            await unlink(filePath);
            await rename(`${filePath}.tmp`, filePath);
            stats.optimizedSize += tmpSize;

            // Generate WebP version
            let webpPipeline = sharp(filePath);
            if (needsResize) {
                webpPipeline = webpPipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                });
            }
            await webpPipeline.webp({ quality: CONFIG.webpQuality }).toFile(webpPath);

            const webpSize = await getFileSize(webpPath);
            const savings = originalSize - tmpSize;
            const savingsPercent = Math.round((savings / originalSize) * 100);

            console.log(
                `✓ ${filePath.replace(CONFIG.imagesDir, '')}\n` +
                `  Original: ${formatBytes(originalSize)} → Optimized: ${formatBytes(tmpSize)} ` +
                `(${savingsPercent}% reduction)\n` +
                `  WebP: ${formatBytes(webpSize)}`
            );

            stats.processed++;
        } else {
            // Optimized version is larger, keep original but still create WebP
            await unlink(`${filePath}.tmp`);
            stats.optimizedSize += originalSize;

            // Generate WebP version from original
            let webpPipeline = sharp(filePath);
            if (needsResize) {
                webpPipeline = webpPipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                });
            }
            await webpPipeline.webp({ quality: CONFIG.webpQuality }).toFile(webpPath);

            const webpSize = await getFileSize(webpPath);
            console.log(
                `⊘ ${filePath.replace(CONFIG.imagesDir, '')}\n` +
                `  Already optimized: ${formatBytes(originalSize)}\n` +
                `  WebP: ${formatBytes(webpSize)}`
            );

            stats.skipped++;
        }
    } catch (error) {
        console.error(`✗ Error optimizing ${filePath}:`, error.message);
        stats.errors++;
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
        process.exit(1);
    }
}

main().catch(console.error);

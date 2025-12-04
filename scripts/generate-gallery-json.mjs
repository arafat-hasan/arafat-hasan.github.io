#!/usr/bin/env node

/**
 * Gallery JSON Generator Script
 * 
 * Usage: node scripts/generate-gallery-json.mjs <input-dir> <output-dir>
 * Example: node scripts/generate-gallery-json.mjs public/images/gallery/nijhum-dwip src/content/gallery/nijhum-dwip
 */

import { ExifTool } from 'exiftool-vendored';
import { readdir, writeFile, mkdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const exiftool = new ExifTool();

// Template from examples/gallery.json
const TEMPLATE = {
    title: "",
    description: "",
    date: "",
    location: "",
    collection: "",
    image: "",
    camera: "",
    alt: "",
    featured: false
};

async function getExifData(filePath) {
    try {
        return await exiftool.read(filePath);
    } catch (error) {
        console.warn(`Warning: Could not read EXIF from ${filePath}: ${error.message}`);
        return {};
    }
}

async function getPlaceNameFromGPS(lat, lon) {
    try {
        const url = "https://nominatim.openstreetmap.org/reverse";
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            format: "jsonv2"
        });

        const response = await fetch(`${url}?${params}`, {
            headers: {
                "User-Agent": "Arafat-GalleryScript/1.0"
            }
        });

        if (!response.ok) {
            console.warn(`Warning: Nominatim API returned status ${response.status}`);
            return "";
        }

        const data = await response.json();

        // Extract: place name + city + state + country
        const parts = [];

        // Place name (could be in name, railway, tourism, etc.)
        if (data.name) {
            parts.push(data.name);
        }

        // City (could be in city, town, village, etc.)
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.municipality;
        if (city && city !== data.name) {
            parts.push(city);
        }

        // State
        if (address.state) {
            parts.push(address.state);
        }

        // Country
        if (address.country) {
            parts.push(address.country);
        }

        return parts.length > 0 ? parts.join(", ") : "";
    } catch (error) {
        console.warn(`Warning: Could not fetch place name for ${lat}, ${lon}: ${error.message}`);
        return "";
    }
}

function formatDate(date) {
    if (!date) return "";
    // exiftool returns ExifDateTime object or string
    try {
        if (typeof date === 'string') return date.split(' ')[0].replace(/:/g, '-');
        if (date.year && date.month && date.day) {
            return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        }
        return date.toISOString().split('T')[0];
    } catch {
        return "";
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error('Usage: node scripts/generate-gallery-json.mjs <input-dir> <output-dir>');
        process.exit(1);
    }

    const inputDir = args[0];
    const outputDir = args[1];

    // Get collection name from input dir path (last folder name)
    // Remove trailing slash if present
    const cleanInputDir = inputDir.replace(/\/$/, '');
    const collectionName = basename(cleanInputDir)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    console.log(`Input Directory: ${inputDir}`);
    console.log(`Output Directory: ${outputDir}`);
    console.log(`Collection Name: ${collectionName}\n`);

    try {
        // Ensure output directory exists
        await mkdir(outputDir, { recursive: true });

        const files = await readdir(inputDir);
        const imageFiles = files.filter(file => {
            const ext = extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
        });

        console.log(`Found ${imageFiles.length} images.`);

        for (const file of imageFiles) {
            const filePath = join(inputDir, file);
            const fileBasename = basename(file, extname(file));
            const jsonPath = join(outputDir, `${fileBasename}.json`);

            // Check if JSON already exists
            try {
                await stat(jsonPath);
                console.log(`Skipping ${file} (JSON already exists)`);
                continue;
            } catch {
                // File doesn't exist, proceed
            }

            const tags = await getExifData(filePath);

            // Extract data
            let date = TEMPLATE.date;
            let camera = TEMPLATE.camera;
            let location = TEMPLATE.location;

            // Camera
            if (tags.Make || tags.Model) {
                camera = `${tags.Make || ''} ${tags.Model || ''}`.trim();
            }

            // Date
            // Prefer DateTimeOriginal, then CreateDate, then ModifyDate
            const dateTag = tags.DateTimeOriginal || tags.CreateDate || tags.ModifyDate;
            if (dateTag) {
                date = formatDate(dateTag);
            }

            // Location
            if (tags.GPSLatitude && tags.GPSLongitude) {
                location = await getPlaceNameFromGPS(tags.GPSLatitude, tags.GPSLongitude);
            }

            // Construct JSON
            // Path should be relative to public/ or root? 
            // Usually in Astro public/images/... is referenced as /images/...
            // We'll assume inputDir is relative to project root or absolute, 
            // but for the 'image' field we want the web path.
            // Heuristic: if inputDir contains 'public', strip everything up to 'public'

            let webPath = filePath;
            if (filePath.includes('public/')) {
                webPath = filePath.substring(filePath.indexOf('public/') + 6); // +6 for 'public' length, keep leading /
            } else if (!webPath.startsWith('/')) {
                webPath = '/' + webPath;
            }

            const jsonContent = {
                ...TEMPLATE,
                title: fileBasename.replace(/[-_]/g, ' '), // Simple title from filename
                date: date,
                location: location,
                collection: collectionName,
                image: webPath,
                camera: camera,
                alt: `${collectionName} - ${fileBasename}`
            };

            await writeFile(jsonPath, JSON.stringify(jsonContent, null, 4) + "\n");
            console.log(`Generated ${jsonPath}`);
        }

        console.log('\nDone!');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await exiftool.end();
    }
}

main();

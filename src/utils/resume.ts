import fs from 'fs';
import path from 'path';

/**
 * Automatically detects the resume PDF filename from the public directory
 * Looks for files matching the pattern: arafat-hasan-resume-*.pdf
 * Falls back to 'resume.pdf' if no versioned file is found
 * 
 * @returns The resume filename (e.g., 'arafat-hasan-resume-v2.0.0.pdf' or 'resume.pdf')
 */
export function getResumeFilename(): string {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const files = fs.readdirSync(publicDir);

        // Look for files matching the pattern: arafat-hasan-resume-*.pdf
        const resumePattern = /^arafat-hasan-resume-.*\.pdf$/;
        const versionedResume = files.find(file => resumePattern.test(file));

        if (versionedResume) {
            return versionedResume;
        }

        // Fallback to resume.pdf if versioned file not found
        if (files.includes('resume.pdf')) {
            return 'resume.pdf';
        }

        // If no resume file found, return default
        console.warn('No resume PDF found in public directory');
        return 'resume.pdf';
    } catch (error) {
        console.error('Error detecting resume filename:', error);
        return 'resume.pdf';
    }
}

/**
 * Extracts the version from a resume filename
 * 
 * @param filename - The resume filename (e.g., 'arafat-hasan-resume-v2.0.0.pdf')
 * @returns The version string (e.g., 'v2.0.0') or null if not found
 */
export function getResumeVersion(filename: string): string | null {
    const versionMatch = filename.match(/arafat-hasan-resume-(v[\d.]+)\.pdf/);
    return versionMatch ? versionMatch[1] : null;
}

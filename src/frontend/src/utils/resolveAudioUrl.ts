/**
 * Audio URL resolution utility.
 * Supports both relative asset paths (resolved via getAssetUrl) and absolute http(s) URLs.
 */

import { getAssetUrl } from './assetBase';

/**
 * Resolves an audio source to a usable URL.
 * - Absolute URLs (http:// or https://) are passed through as-is
 * - Relative paths are resolved via getAssetUrl() for proper asset bundling
 * 
 * @param source - Either a relative asset path (e.g., 'audio/music.mp3') or an absolute URL
 * @returns Resolved audio URL ready for use with Audio() constructor
 */
export function resolveAudioUrl(source: string): string {
  // Normalize the source
  const trimmedSource = source.trim();
  
  // Check if it's an absolute URL
  if (trimmedSource.startsWith('http://') || trimmedSource.startsWith('https://')) {
    console.log('[resolveAudioUrl] External URL detected:', trimmedSource);
    return trimmedSource;
  }
  
  // Check for malformed concatenation patterns (defensive validation)
  if (trimmedSource.includes('audio/http://') || trimmedSource.includes('audio/https://')) {
    console.error('[resolveAudioUrl] CRITICAL: Malformed URL detected!', {
      source: trimmedSource,
      hint: 'This appears to be an incorrectly concatenated URL. Use either a relative path OR an absolute URL, not both.'
    });
    throw new Error('Invalid audio URL: malformed concatenation detected');
  }
  
  // It's a relative path - resolve via getAssetUrl
  const resolved = getAssetUrl(trimmedSource);
  console.log('[resolveAudioUrl] Relative path resolved:', {
    source: trimmedSource,
    resolved
  });
  
  return resolved;
}

/**
 * Checks if a source is an external URL.
 */
export function isExternalUrl(source: string): boolean {
  const trimmed = source.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

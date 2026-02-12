/**
 * Asset base path helper for SPA deployment under non-root paths.
 * Uses Vite's BASE_URL to construct correct asset URLs regardless of deployment location.
 */

/**
 * Constructs an asset URL using the runtime build base path.
 * @param path - Relative asset path (e.g., 'generated/image.png')
 * @returns Full asset URL with correct base path
 */
export function getAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure base ends with slash
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`;
  return `${baseWithSlash}assets/${cleanPath}`;
}

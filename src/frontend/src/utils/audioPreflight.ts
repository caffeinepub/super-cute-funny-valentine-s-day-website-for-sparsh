/**
 * Audio asset preflight validation utility.
 * Validates that resolved audio URLs return actual audio content (not HTML/SPA fallback).
 * Supports both local assets and external streaming URLs.
 */

export interface AudioPreflightResult {
  success: boolean;
  url: string;
  status?: number;
  contentType?: string;
  errorType?: 'network' | 'html-fallback' | 'non-audio' | 'cors' | 'unknown';
  errorMessage?: string;
}

/**
 * Performs a preflight check on an audio URL to validate it returns audio content.
 * Checks HTTP status, content-type header, and optionally validates MP3 signature.
 * Handles external URLs with CORS/HEAD restrictions gracefully.
 */
export async function checkAudioAsset(url: string): Promise<AudioPreflightResult> {
  try {
    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    console.log(`[AudioPreflight] Checking ${isExternal ? 'external' : 'local'} audio asset:`, url);

    // First, try a HEAD request to check headers
    let response: Response;
    let headFailed = false;
    
    try {
      response = await fetch(url, { method: 'HEAD' });
    } catch (headError) {
      headFailed = true;
      console.log('[AudioPreflight] HEAD request failed, trying GET with range:', headError);
      
      // If HEAD fails, try GET with a small range
      try {
        response = await fetch(url, {
          headers: { Range: 'bytes=0-1023' }
        });
      } catch (getError) {
        // Both HEAD and GET failed - likely CORS or network issue
        console.error('[AudioPreflight] Both HEAD and GET requests failed:', getError);
        
        return {
          success: false,
          url,
          errorType: isExternal ? 'cors' : 'network',
          errorMessage: isExternal 
            ? 'External URL is not accessible (CORS or network error)'
            : 'Network error while accessing audio file'
        };
      }
    }

    const status = response.status;
    const contentType = response.headers.get('content-type') || '';

    console.log('[AudioPreflight] Response received:', {
      url,
      status,
      contentType,
      ok: response.ok,
      headFailed,
      isExternal
    });

    // Check if response is successful
    if (!response.ok) {
      return {
        success: false,
        url,
        status,
        contentType,
        errorType: 'network',
        errorMessage: `HTTP ${status}: Asset not found or unreachable`
      };
    }

    // Check for HTML content-type (common SPA fallback indicator)
    if (contentType.includes('text/html')) {
      console.error('[AudioPreflight] HTML fallback detected - asset likely missing:', {
        url,
        status,
        contentType,
        hint: isExternal 
          ? 'The external URL returned HTML instead of audio. Verify the URL points directly to an audio file.'
          : 'The server returned HTML instead of audio. This usually means the audio file does not exist at the expected path and the SPA fallback route was served instead.'
      });

      return {
        success: false,
        url,
        status,
        contentType,
        errorType: 'html-fallback',
        errorMessage: 'Audio file not found (HTML fallback detected)'
      };
    }

    // Check for audio content-type
    if (contentType.includes('audio/')) {
      console.log('[AudioPreflight] Valid audio content-type detected:', contentType);
      return {
        success: true,
        url,
        status,
        contentType
      };
    }

    // If content-type is missing or ambiguous, try to fetch a small chunk and check for MP3 signature
    if (!contentType || contentType.includes('application/octet-stream') || contentType.includes('binary/octet-stream')) {
      console.log('[AudioPreflight] Ambiguous content-type, checking MP3 signature');
      
      try {
        const rangeResponse = await fetch(url, {
          headers: { Range: 'bytes=0-10' }
        });

        if (rangeResponse.ok) {
          const buffer = await rangeResponse.arrayBuffer();
          const bytes = new Uint8Array(buffer);

          // Check for MP3 signatures:
          // ID3v2: starts with "ID3" (0x49 0x44 0x33)
          // MP3 frame sync: 0xFF 0xFB or 0xFF 0xFA
          const hasID3 = bytes.length >= 3 && 
                        bytes[0] === 0x49 && 
                        bytes[1] === 0x44 && 
                        bytes[2] === 0x33;
          
          const hasFrameSync = bytes.length >= 2 && 
                              bytes[0] === 0xFF && 
                              (bytes[1] === 0xFB || bytes[1] === 0xFA);

          if (hasID3 || hasFrameSync) {
            console.log('[AudioPreflight] Valid MP3 signature detected');
            return {
              success: true,
              url,
              status,
              contentType: contentType || 'audio/mpeg (detected)'
            };
          }
        }
      } catch (signatureError) {
        console.warn('[AudioPreflight] Could not verify MP3 signature:', signatureError);
        
        // For external URLs with ambiguous content-type, be more lenient
        if (isExternal && !contentType) {
          console.log('[AudioPreflight] External URL with no content-type - assuming valid (will fail at playback if not)');
          return {
            success: true,
            url,
            status,
            contentType: 'unknown (external URL)'
          };
        }
      }
    }

    // Content-type doesn't indicate audio and no MP3 signature found
    console.error('[AudioPreflight] Non-audio content detected:', {
      url,
      status,
      contentType,
      isExternal,
      hint: 'The response does not appear to be audio content'
    });

    return {
      success: false,
      url,
      status,
      contentType,
      errorType: 'non-audio',
      errorMessage: `Invalid content-type: ${contentType || 'unknown'}`
    };

  } catch (error) {
    console.error('[AudioPreflight] Preflight check failed:', {
      url,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });

    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    
    return {
      success: false,
      url,
      errorType: isExternal ? 'cors' : 'network',
      errorMessage: error instanceof Error ? error.message : 'Network error'
    };
  }
}

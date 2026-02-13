/**
 * Deployment diagnostics module.
 * Logs startup information and captures runtime errors for troubleshooting deployment issues.
 * Enhanced to capture actionable root-cause details including resource load failures,
 * environment context, comprehensive error serialization, and media-related failures.
 */

export function initDeployDiagnostics(): void {
  // Log build configuration and environment
  console.log('[Deploy Diagnostics] ========================================');
  console.log('[Deploy Diagnostics] App starting...');
  console.log('[Deploy Diagnostics] Timestamp:', new Date().toISOString());
  console.log('[Deploy Diagnostics] Base URL:', import.meta.env.BASE_URL || '/');
  console.log('[Deploy Diagnostics] Mode:', import.meta.env.MODE);
  console.log('[Deploy Diagnostics] Location:', window.location.href);
  console.log('[Deploy Diagnostics] User Agent:', navigator.userAgent);
  console.log('[Deploy Diagnostics] Viewport:', `${window.innerWidth}x${window.innerHeight}`);
  console.log('[Deploy Diagnostics] ========================================');

  // Track resource load failures (scripts, stylesheets, images, audio, etc.)
  window.addEventListener('error', (event) => {
    // Check if this is a resource loading error
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement;
      const tagName = target.tagName?.toLowerCase();
      
      if (tagName === 'script' || tagName === 'link' || tagName === 'img' || tagName === 'audio' || tagName === 'video') {
        const resourceInfo: any = {
          type: 'ResourceLoadError',
          tagName: tagName,
          src: (target as HTMLScriptElement | HTMLImageElement | HTMLAudioElement).src || (target as HTMLLinkElement).href,
          currentSrc: (target as HTMLImageElement | HTMLAudioElement).currentSrc,
          baseURI: target.baseURI,
          timestamp: new Date().toISOString()
        };

        // Add media-specific diagnostics for audio/video elements
        if (tagName === 'audio' || tagName === 'video') {
          const mediaElement = target as HTMLAudioElement | HTMLVideoElement;
          resourceInfo.mediaDetails = {
            networkState: mediaElement.networkState,
            readyState: mediaElement.readyState,
            error: mediaElement.error ? {
              code: mediaElement.error.code,
              message: mediaElement.error.message
            } : null,
            hint: 'Media load failure - check if asset exists and returns correct content-type (not HTML)'
          };
        }

        console.error('[Deploy Diagnostics] Resource load failure:', resourceInfo);
        return;
      }
    }

    // Global JavaScript error
    console.error('[Deploy Diagnostics] Global JavaScript error:', {
      type: 'JavaScriptError',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error ? {
        name: event.error.name,
        message: event.error.message,
        stack: event.error.stack
      } : null,
      timestamp: new Date().toISOString()
    });
  }, true); // Use capture phase to catch resource errors

  // Unhandled promise rejection handler with enhanced serialization
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    
    // Serialize the rejection reason comprehensively
    let serializedReason: any;
    let failureCategory: string | undefined;
    
    if (reason instanceof Error) {
      serializedReason = {
        name: reason.name,
        message: reason.message,
        stack: reason.stack,
        cause: reason.cause
      };

      // Categorize common media/asset failures
      if (reason.name === 'NotAllowedError') {
        failureCategory = 'autoplay-restriction';
      } else if (reason.name === 'NotSupportedError') {
        failureCategory = 'codec-support';
      } else if (reason.name === 'AbortError') {
        failureCategory = 'operation-aborted';
      } else if (reason.message?.includes('fetch') || reason.message?.includes('network')) {
        failureCategory = 'network-failure';
      } else if (reason.message?.includes('HTML') || reason.message?.includes('text/html')) {
        failureCategory = 'asset-load-html-fallback';
      }
    } else if (typeof reason === 'object' && reason !== null) {
      try {
        serializedReason = JSON.parse(JSON.stringify(reason));
      } catch {
        serializedReason = String(reason);
      }
    } else {
      serializedReason = reason;
    }

    console.error('[Deploy Diagnostics] Unhandled promise rejection:', {
      type: 'UnhandledPromiseRejection',
      reason: serializedReason,
      reasonType: typeof reason,
      reasonConstructor: reason?.constructor?.name,
      failureCategory,
      timestamp: new Date().toISOString(),
      hint: failureCategory === 'asset-load-html-fallback' 
        ? 'Asset likely missing - server returned HTML instead of expected resource'
        : undefined
    });
  });

  // Log when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Deploy Diagnostics] DOM ready');
    });
  } else {
    console.log('[Deploy Diagnostics] DOM already ready');
  }

  // Log when all resources are loaded
  window.addEventListener('load', () => {
    console.log('[Deploy Diagnostics] All resources loaded');
    console.log('[Deploy Diagnostics] Performance:', {
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domInteractive: performance.timing.domInteractive - performance.timing.navigationStart
    });
  });

  console.log('[Deploy Diagnostics] Error handlers and resource monitors registered');
}

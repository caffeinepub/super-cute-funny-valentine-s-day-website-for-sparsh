import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveAudioUrl, isExternalUrl } from '../../utils/resolveAudioUrl';
import { checkAudioAsset, type AudioPreflightResult } from '../../utils/audioPreflight';

interface ValentineBackgroundMusicProps {
  isActive: boolean;
  musicSource?: string;
}

export default function ValentineBackgroundMusic({ 
  isActive, 
  musicSource = 'audio/i-wanna-be-yours.mp3' 
}: ValentineBackgroundMusicProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [preflightResult, setPreflightResult] = useState<AudioPreflightResult | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string>('');

  // Enhanced preflight reachability check
  useEffect(() => {
    if (!isActive) return;

    try {
      const audioUrl = resolveAudioUrl(musicSource);
      audioUrlRef.current = audioUrl;

      const sourceType = isExternalUrl(musicSource) ? 'external URL' : 'local asset';
      console.log(`[BackgroundMusic] Starting preflight check for ${sourceType}:`, audioUrl);

      // Non-blocking preflight check with content validation
      checkAudioAsset(audioUrl).then((result) => {
        setPreflightResult(result);
        
        if (result.success) {
          console.log('[BackgroundMusic] Preflight check passed:', {
            url: result.url,
            status: result.status,
            contentType: result.contentType,
            sourceType
          });
        } else {
          console.error('[BackgroundMusic] Preflight check failed:', {
            url: result.url,
            status: result.status,
            contentType: result.contentType,
            errorType: result.errorType,
            errorMessage: result.errorMessage,
            sourceType,
            hint: result.errorType === 'html-fallback' 
              ? 'The audio file does not exist at the expected path. For local assets, verify that the file exists in frontend/public/assets/audio/. For external URLs, verify the URL is correct and publicly accessible.'
              : result.errorType === 'cors'
              ? 'The external URL is blocking cross-origin requests. Ensure the server allows CORS or use a different hosting service.'
              : 'The audio asset could not be loaded or validated.'
          });
        }
      });
    } catch (error) {
      console.error('[BackgroundMusic] Error resolving audio URL:', error);
      setErrorMessage('Configuration error: Invalid audio source.');
    }
  }, [isActive, musicSource]);

  useEffect(() => {
    try {
      // Initialize audio element with resolved URL
      const audioUrl = resolveAudioUrl(musicSource);
      audioUrlRef.current = audioUrl;
      
      const sourceType = isExternalUrl(musicSource) ? 'external URL' : 'local asset';
      console.log(`[BackgroundMusic] Initializing audio element with ${sourceType}:`, audioUrl);
      
      audioRef.current = new Audio(audioUrl);
      
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        audioRef.current.preload = 'auto';

        // Enhanced error event listener for load failures
        const handleError = (event: ErrorEvent | Event) => {
          const audio = audioRef.current;
          
          console.error('[BackgroundMusic] Audio error event:', {
            url: audioUrlRef.current,
            sourceType,
            currentSrc: audio?.currentSrc,
            networkState: audio?.networkState,
            networkStateText: audio ? getNetworkStateText(audio.networkState) : 'unknown',
            readyState: audio?.readyState,
            readyStateText: audio ? getReadyStateText(audio.readyState) : 'unknown',
            error: audio?.error ? {
              code: audio.error.code,
              message: audio.error.message,
              codeText: getMediaErrorText(audio.error.code)
            } : null,
            preflightResult: preflightResult
          });
        };

        audioRef.current.addEventListener('error', handleError);

        // Cleanup handler to fully stop audio on page leave
        const handlePageHide = () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = '';
          }
        };

        const handleBeforeUnload = () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        };

        window.addEventListener('pagehide', handlePageHide);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('error', handleError);
          }
          window.removeEventListener('pagehide', handlePageHide);
          window.removeEventListener('beforeunload', handleBeforeUnload);
          
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = '';
            audioRef.current = null;
          }
        };
      }
    } catch (error) {
      console.error('[BackgroundMusic] Error initializing audio:', error);
      setErrorMessage('Configuration error: Invalid audio source.');
    }
  }, [musicSource, preflightResult]);

  // Stop playback when component becomes inactive
  useEffect(() => {
    if (!isActive && audioRef.current) {
      console.log('[BackgroundMusic] Component inactive, stopping playback');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isActive]);

  const toggleMute = () => {
    if (!audioRef.current || !isActive) return;

    const willUnmute = isMuted;

    if (willUnmute) {
      // User is unmuting - attempt playback directly in gesture context
      console.log('[BackgroundMusic] User unmuting, attempting playback...', {
        url: audioUrlRef.current,
        preflightSuccess: preflightResult?.success,
        currentSrc: audioRef.current.currentSrc,
        networkState: audioRef.current.networkState,
        readyState: audioRef.current.readyState
      });
      
      audioRef.current
        .play()
        .then(() => {
          console.log('[BackgroundMusic] Playback started successfully');
          setIsMuted(false);
          setErrorMessage(null); // Clear any previous error
        })
        .catch((error) => {
          console.error('[BackgroundMusic] Playback failed:', {
            url: audioUrlRef.current,
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack,
            currentSrc: audioRef.current?.currentSrc,
            networkState: audioRef.current?.networkState,
            networkStateText: audioRef.current ? getNetworkStateText(audioRef.current.networkState) : 'unknown',
            readyState: audioRef.current?.readyState,
            readyStateText: audioRef.current ? getReadyStateText(audioRef.current.readyState) : 'unknown',
            mediaError: audioRef.current?.error ? {
              code: audioRef.current.error.code,
              message: audioRef.current.error.message,
              codeText: getMediaErrorText(audioRef.current.error.code)
            } : null,
            preflightResult: preflightResult
          });
          
          // Determine specific error message based on error type and preflight result
          let message = 'Unable to play background music. ';
          
          // Check preflight result first
          if (preflightResult && !preflightResult.success) {
            if (preflightResult.errorType === 'html-fallback') {
              message += 'The audio file could not be found.';
            } else if (preflightResult.errorType === 'network') {
              message += 'The audio file could not be loaded.';
            } else if (preflightResult.errorType === 'non-audio') {
              message += 'The audio file format is invalid.';
            } else if (preflightResult.errorType === 'cors') {
              message += 'The audio source is blocking cross-origin access.';
            } else {
              message += 'The audio file could not be loaded.';
            }
          }
          // Check play() error type
          else if (error.name === 'NotAllowedError') {
            message += 'Please check your browser settings or try interacting with the page first.';
          } else if (error.name === 'NotSupportedError') {
            message += 'Your browser does not support this audio format.';
          } else if (error.name === 'AbortError') {
            message += 'Playback was interrupted. Please try again.';
          }
          // Check media error codes
          else if (audioRef.current?.error) {
            const mediaError = audioRef.current.error;
            if (mediaError.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
              message += 'Your browser does not support this audio format.';
            } else if (mediaError.code === MediaError.MEDIA_ERR_NETWORK) {
              message += 'Network error while loading audio.';
            } else if (mediaError.code === MediaError.MEDIA_ERR_DECODE) {
              message += 'Error decoding audio file.';
            } else {
              message += 'Please try again.';
            }
          } else {
            message += 'Please try again.';
          }
          
          setErrorMessage(message);
          
          // Auto-hide error after 10 seconds
          setTimeout(() => {
            setErrorMessage(null);
          }, 10000);
        });
    } else {
      // User is muting - pause immediately
      console.log('[BackgroundMusic] User muting, pausing playback');
      audioRef.current.pause();
      setIsMuted(true);
      setErrorMessage(null); // Clear error when muting
    }
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-destructive/90 text-destructive-foreground px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm max-w-xs flex items-start gap-2 animate-in slide-in-from-bottom-2"
        >
          <p className="text-sm flex-1">{errorMessage}</p>
          <Button
            onClick={dismissError}
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 hover:bg-destructive-foreground/20"
            aria-label="Dismiss error message"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Button
        onClick={toggleMute}
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm border-valentine-primary/20 shadow-valentine hover:shadow-valentine-lg hover:scale-110 transition-all duration-300"
        aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-valentine-primary" />
        ) : (
          <Volume2 className="h-5 w-5 text-valentine-primary" />
        )}
      </Button>
    </div>
  );
}

// Helper functions for diagnostic logging
function getNetworkStateText(state: number): string {
  const states = ['NETWORK_EMPTY', 'NETWORK_IDLE', 'NETWORK_LOADING', 'NETWORK_NO_SOURCE'];
  return states[state] || `UNKNOWN(${state})`;
}

function getReadyStateText(state: number): string {
  const states = ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'];
  return states[state] || `UNKNOWN(${state})`;
}

function getMediaErrorText(code: number): string {
  const errors: Record<number, string> = {
    1: 'MEDIA_ERR_ABORTED',
    2: 'MEDIA_ERR_NETWORK',
    3: 'MEDIA_ERR_DECODE',
    4: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
  };
  return errors[code] || `UNKNOWN(${code})`;
}

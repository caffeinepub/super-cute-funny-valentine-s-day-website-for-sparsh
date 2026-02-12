import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '../../utils/assetBase';

interface ValentineBackgroundMusicProps {
  isActive: boolean;
}

export default function ValentineBackgroundMusic({ isActive }: ValentineBackgroundMusicProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element with user-provided MP3 using BASE_URL-safe path
    audioRef.current = new Audio(getAssetUrl('audio/i-wanna-be-yours.mp3'));
    
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

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
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Handle playback when active and unmuted
  useEffect(() => {
    if (!audioRef.current || !isActive) {
      // Stop playback when component becomes inactive
      if (audioRef.current && !isActive) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (!isMuted && hasInteracted) {
      audioRef.current.play().catch(() => {
        // Silently handle autoplay restrictions
      });
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isActive, isMuted, hasInteracted]);

  const toggleMute = () => {
    // First interaction unlocks audio
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    setIsMuted((prev) => {
      const newMuted = !prev;
      
      if (audioRef.current && isActive) {
        if (newMuted) {
          audioRef.current.pause();
        } else if (hasInteracted || !prev) {
          // Play if we've interacted or this is the first unmute
          audioRef.current.play().catch(() => {
            // Silently handle autoplay restrictions
          });
        }
      }
      
      return newMuted;
    });
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
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

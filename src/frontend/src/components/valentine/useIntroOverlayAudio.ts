import { useEffect, useRef, useState } from 'react';

export function useIntroOverlayAudio() {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const confirmAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    ambientAudioRef.current = new Audio('/assets/audio/valentine-ambient.mp3');
    confirmAudioRef.current = new Audio('/assets/audio/valentine-confirm.mp3');

    if (ambientAudioRef.current) {
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.3;
    }

    if (confirmAudioRef.current) {
      confirmAudioRef.current.volume = 0.5;
    }

    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
      if (confirmAudioRef.current) {
        confirmAudioRef.current.pause();
        confirmAudioRef.current = null;
      }
    };
  }, []);

  // Handle first user interaction to unlock audio
  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (!isMuted && ambientAudioRef.current) {
        ambientAudioRef.current.play().catch(() => {
          // Silently handle autoplay restrictions
        });
      }
    }
  };

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      
      if (ambientAudioRef.current) {
        if (newMuted) {
          ambientAudioRef.current.pause();
        } else if (hasInteracted) {
          ambientAudioRef.current.play().catch(() => {
            // Silently handle autoplay restrictions
          });
        }
      }
      
      return newMuted;
    });
  };

  // Play ambient audio when overlay is visible
  useEffect(() => {
    if (!isMuted && hasInteracted && ambientAudioRef.current) {
      ambientAudioRef.current.play().catch(() => {
        // Silently handle autoplay restrictions
      });
    }

    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    };
  }, [isMuted, hasInteracted]);

  // Play confirmation sound
  const playConfirmSound = () => {
    if (!isMuted && confirmAudioRef.current) {
      confirmAudioRef.current.currentTime = 0;
      confirmAudioRef.current.play().catch(() => {
        // Silently handle playback errors
      });
    }
  };

  return {
    isMuted,
    toggleMute,
    handleFirstInteraction,
    playConfirmSound,
  };
}

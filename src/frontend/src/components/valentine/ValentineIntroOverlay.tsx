import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import RosePetalOverlay from './RosePetalOverlay';
import { useIntroOverlayAudio } from './useIntroOverlayAudio';

interface ValentineIntroOverlayProps {
  onAccept: () => void;
}

export default function ValentineIntroOverlay({ onAccept }: ValentineIntroOverlayProps) {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isNoButtonEvading, setIsNoButtonEvading] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isMuted, toggleMute, handleFirstInteraction, playConfirmSound } = useIntroOverlayAudio();

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    // Initialize button position to center
    if (noButtonRef.current && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const button = noButtonRef.current.getBoundingClientRect();
      
      setNoButtonPosition({
        x: (container.width - button.width) / 2,
        y: 0
      });
    }
  }, []);

  const moveNoButton = (event: React.MouseEvent | React.TouchEvent) => {
    handleFirstInteraction();
    
    if (prefersReducedMotion || !noButtonRef.current || !containerRef.current) {
      return;
    }

    const container = containerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();

    // Get pointer position
    let clientX: number, clientY: number;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Calculate distance from pointer to button center
    const buttonCenterX = button.left + button.width / 2;
    const buttonCenterY = button.top + button.height / 2;
    const distance = Math.sqrt(
      Math.pow(clientX - buttonCenterX, 2) + Math.pow(clientY - buttonCenterY, 2)
    );

    // If pointer is close enough, move the button away
    const threshold = 100;
    if (distance < threshold) {
      setIsNoButtonEvading(true);

      // Calculate new position away from pointer
      const angle = Math.atan2(buttonCenterY - clientY, buttonCenterX - clientX);
      const moveDistance = 150;
      
      let newX = noButtonPosition.x + Math.cos(angle) * moveDistance;
      let newY = noButtonPosition.y + Math.sin(angle) * moveDistance;

      // Clamp to container bounds with padding
      const padding = 20;
      const maxX = container.width - button.width - padding;
      const maxY = container.height - button.height - padding;
      
      newX = Math.max(padding, Math.min(newX, maxX));
      newY = Math.max(padding, Math.min(newY, maxY));

      setNoButtonPosition({ x: newX, y: newY });

      setTimeout(() => setIsNoButtonEvading(false), 300);
    }
  };

  const handleAccept = () => {
    playConfirmSound();
    // Small delay to let the sound start playing before transition
    setTimeout(() => {
      onAccept();
    }, 100);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-valentine-light"
      role="dialog"
      aria-modal="true"
      aria-labelledby="valentine-question"
      onClick={handleFirstInteraction}
    >
      <RosePetalOverlay />
      
      {/* Mute/Unmute Control */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-valentine-dark hover:text-valentine-primary hover:bg-valentine-primary/10"
        aria-pressed={!isMuted}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </Button>

      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl mx-4 p-8 md:p-12"
        onMouseMove={moveNoButton}
        onTouchMove={moveNoButton}
      >
        <div className="text-center mb-12">
          <h1 
            id="valentine-question"
            className="text-4xl md:text-6xl font-bold text-valentine-dark mb-6 leading-tight animate-fade-in"
          >
            Will you be my Valentine? 💕
          </h1>
          <p className="text-lg md:text-xl text-valentine-muted animate-fade-in">
            Choose wisely... 😊
          </p>
        </div>

        <div className="relative h-32 flex items-center justify-center gap-6">
          <Button
            onClick={handleAccept}
            size="lg"
            className="bg-valentine-primary hover:bg-valentine-accent text-white font-semibold text-lg px-8 py-6 rounded-full shadow-valentine hover:shadow-valentine-lg hover:scale-105 transition-all duration-300 animate-fade-in"
          >
            Yes! 💖
          </Button>

          <button
            ref={noButtonRef}
            className="absolute bg-gray-400 hover:bg-gray-500 text-white font-semibold text-lg px-8 py-6 rounded-full shadow-valentine transition-all duration-300 animate-fade-in"
            style={{
              transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
              transition: isNoButtonEvading && !prefersReducedMotion ? 'transform 0.3s ease-out' : 'none',
              pointerEvents: prefersReducedMotion ? 'auto' : 'none'
            }}
            disabled={!prefersReducedMotion}
            aria-label="No button (playfully evades clicks)"
          >
            No 😢
          </button>
        </div>

        {prefersReducedMotion && (
          <p className="text-center text-sm text-valentine-muted mt-8">
            (The "No" button is disabled for accessibility)
          </p>
        )}
      </div>
    </div>
  );
}

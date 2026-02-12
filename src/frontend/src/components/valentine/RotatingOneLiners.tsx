import { useEffect, useState } from 'react';

const oneLiners = [
  "You're my favorite notification 📱",
  "I like you more than free WiFi 📶",
  "You're the reason I smile at my phone 😊",
  "Netflix asked if we're still watching... always! 🎬",
  "You're my favorite weirdo 🤪",
  "I'd share my fries with you 🍟",
  "You're better than chai (almost) ☕",
  "My heart does the thing when I see you 💓"
];

export default function RotatingOneLiners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % oneLiners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="inline-block"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="valentine-badge">
        <span className="animate-fade-in" key={currentIndex}>
          {oneLiners[currentIndex]}
        </span>
      </div>
    </div>
  );
}

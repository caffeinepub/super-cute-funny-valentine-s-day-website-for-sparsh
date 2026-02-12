import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  drift: number;
}

export default function RosePetalOverlay() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return;
    }

    // Generate rose petals
    const initialPetals: Petal[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 5,
      size: 15 + Math.random() * 25,
      rotation: Math.random() * 360,
      drift: -20 + Math.random() * 40
    }));

    setPetals(initialPetals);
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-4xl text-valentine-primary mx-2">
              🌹
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="rose-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            '--drift': `${petal.drift}px`,
            '--rotation': `${petal.rotation}deg`
          } as React.CSSProperties}
        >
          🌹
        </div>
      ))}
    </div>
  );
}

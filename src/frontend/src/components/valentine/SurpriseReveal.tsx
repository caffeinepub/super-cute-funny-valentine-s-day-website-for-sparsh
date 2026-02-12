import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface SurpriseRevealProps {
  isRevealed: boolean;
  onReveal: () => void;
}

export default function SurpriseReveal({ isRevealed, onReveal }: SurpriseRevealProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleReveal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onReveal();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="text-center">
      {!isRevealed ? (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-valentine-dark">
            I Have a Surprise for You! 🎁
          </h2>
          <p className="text-valentine-muted">
            Click the gift to reveal your special Valentine's message...
          </p>
          <button
            onClick={handleReveal}
            disabled={isAnimating}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-valentine-primary text-white rounded-full font-semibold text-lg shadow-valentine hover:shadow-valentine-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-valentine-primary/30 disabled:opacity-50"
            aria-label="Open your Valentine's surprise"
          >
            <Gift className={`w-6 h-6 ${isAnimating ? 'animate-spin' : 'group-hover:animate-bounce'}`} />
            <span>Open Your Valentine!</span>
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          </button>
        </div>
      ) : (
        <div className="valentine-card p-8 md:p-12 animate-fade-in">
          <div className="mb-6">
            <Sparkles className="w-12 h-12 mx-auto text-valentine-accent animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-valentine-dark mb-6">
            Your Valentine's Coupon Book! 🎟️
          </h2>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="coupon-item">
              <span className="coupon-emoji">🍿</span>
              <span className="coupon-text">One movie night with snacks of YOUR choice (yes, even the weird ones)</span>
            </div>
            <div className="coupon-item">
              <span className="coupon-emoji">🛋️</span>
              <span className="coupon-text">One "you pick what we watch" pass (I promise not to fall asleep)</span>
            </div>
            <div className="coupon-item">
              <span className="coupon-emoji">🍔</span>
              <span className="coupon-text">One fancy dinner date OR five casual food adventures (your call!)</span>
            </div>
            <div className="coupon-item">
              <span className="coupon-emoji">🎮</span>
              <span className="coupon-text">One "I'll let you win" gaming session (just kidding, I'll try my best)</span>
            </div>
            <div className="coupon-item">
              <span className="coupon-emoji">🤗</span>
              <span className="coupon-text">Unlimited hugs (redeemable anytime, anywhere, forever)</span>
            </div>
          </div>
          <p className="text-valentine-primary font-semibold mt-6">
            Valid forever because you're stuck with me! 💕
          </p>
        </div>
      )}
    </div>
  );
}

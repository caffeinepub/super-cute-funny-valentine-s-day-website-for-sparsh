import { useState } from 'react';
import SurpriseReveal from './components/valentine/SurpriseReveal';
import RotatingOneLiners from './components/valentine/RotatingOneLiners';
import FloatingHearts from './components/valentine/FloatingHearts';
import ValentineIntroOverlay from './components/valentine/ValentineIntroOverlay';
import { Heart } from 'lucide-react';

function App() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [hasAcceptedValentine, setHasAcceptedValentine] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingHearts />
      
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none pattern-bg" />

      {/* Valentine Intro Overlay */}
      {!hasAcceptedValentine && (
        <ValentineIntroOverlay onAccept={() => setHasAcceptedValentine(true)} />
      )}

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-valentine-primary fill-valentine-primary animate-pulse" />
            <span className="text-sm font-medium text-valentine-dark">Happy Valentine's Day 2026</span>
            <Heart className="w-6 h-6 text-valentine-primary fill-valentine-primary animate-pulse" />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <section className="text-center mb-12 md:mb-20">
            <div className="relative inline-block mb-8">
              <img
                src="/assets/generated/valentine-mascot.dim_1024x1024.png"
                alt="Cute Valentine mascot"
                className="w-32 h-32 md:w-48 md:h-48 mx-auto animate-bounce-slow"
              />
              <img
                src="/assets/generated/heart-doodles.dim_1024x1024.png"
                alt="Heart doodles decoration"
                className="absolute -top-4 -right-4 w-24 h-24 md:w-32 md:h-32 opacity-80 animate-spin-slow"
              />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-valentine-dark mb-6 leading-tight">
              Hey Sparsh! 💕
              <br />
              <span className="text-valentine-primary">Happy Valentine's Day!</span>
            </h1>

            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-lg md:text-xl text-valentine-muted leading-relaxed mb-4">
                You're the peanut butter to my jelly, the WiFi to my internet, and the charger to my phone at 1%. 
                Basically, you're essential to my survival! 🥜📱
              </p>
              <p className="text-base md:text-lg text-valentine-muted/80">
                I like you more than I like hitting snooze on Monday mornings (and that's saying A LOT).
              </p>
            </div>

            <RotatingOneLiners />
          </section>

          {/* Cupid Arrow Divider */}
          <div className="flex justify-center mb-12 md:mb-16">
            <img
              src="/assets/generated/cupid-arrow.dim_1024x1024.png"
              alt="Cupid's arrow"
              className="w-48 md:w-64 opacity-90 arrow-float"
            />
          </div>

          {/* Surprise Section */}
          <section className="max-w-3xl mx-auto mb-16">
            <SurpriseReveal 
              isRevealed={showSurprise}
              onReveal={() => setShowSurprise(true)}
            />
          </section>

          {/* Fun Facts Section */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-valentine-dark mb-8">
              Why You're the Best 🌟
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="valentine-card p-6 text-center">
                <div className="text-4xl mb-3">😂</div>
                <h3 className="font-semibold text-valentine-dark mb-2">You Make Me Laugh</h3>
                <p className="text-sm text-valentine-muted">
                  Even when you're not trying to be funny (especially then)
                </p>
              </div>
              <div className="valentine-card p-6 text-center">
                <div className="text-4xl mb-3">🍕</div>
                <h3 className="font-semibold text-valentine-dark mb-2">Perfect Pizza Partner</h3>
                <p className="text-sm text-valentine-muted">
                  You never judge my topping choices (much appreciated)
                </p>
              </div>
              <div className="valentine-card p-6 text-center">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="font-semibold text-valentine-dark mb-2">Best Teammate</h3>
                <p className="text-sm text-valentine-muted">
                  In games and in life (but mostly in games)
                </p>
              </div>
            </div>
          </section>

          {/* Final Message */}
          <section className="text-center max-w-2xl mx-auto mb-12">
            <div className="valentine-card p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-valentine-dark mb-4">
                The Real Talk 💖
              </h2>
              <p className="text-base md:text-lg text-valentine-muted leading-relaxed mb-4">
                Behind all the jokes and memes, I just want you to know that you mean the world to me. 
                You make every day brighter, every laugh louder, and every moment more special.
              </p>
              <p className="text-base md:text-lg text-valentine-primary font-semibold">
                I'm so lucky to have you, Sparsh. Happy Valentine's Day! 💕
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center">
          <div className="flex flex-col items-center gap-2 text-sm text-valentine-muted">
            <p>
              © {currentYear} · Made with{' '}
              <Heart className="inline w-4 h-4 text-valentine-primary fill-valentine-primary" />{' '}
              for Sparsh
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

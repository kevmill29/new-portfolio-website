import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import MagneticButton from './MagneticButton';

export default function Hero() {
  const [booted, setBooted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setBooted(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useGSAP(() => {
    if (booted) {
      // Animate in the hero content
      gsap.fromTo('.hero-text-reveal', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out', delay: 0.2 }
      );
    } else {
      // Glitch animation on the boot sequence
      gsap.to('.boot-logo', {
        x: 'random(-3, 3)',
        y: 'random(-3, 3)',
        duration: 0.1,
        repeat: -1,
        repeatRefresh: true,
        ease: 'none',
      });
    }
  }, { scope: heroRef, dependencies: [booted] });

  return (
    <section ref={heroRef} className="hero-section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {!booted ? (
        <div className="boot-sequence" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          <h1 className="boot-logo text-accent font-mono" style={{ fontSize: '3rem', letterSpacing: '4px', textShadow: '0 0 20px var(--accent-glow)' }}>
            KEVIN_EMILE // SYSTEM
          </h1>
          <MagneticButton onClick={() => setBooted(true)}>
            PRESS ENTER TO INITIATE
          </MagneticButton>
        </div>
      ) : (
        <div className="hero-content" style={{ opacity: 1 }}>
          <h1 className="hero-text-reveal" style={{ fontSize: '8vw', lineHeight: 1, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            KEVIN EMILE
          </h1>
          <h2 className="hero-text-reveal text-accent" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
            // CYBERSECURITY_ENGINEER
          </h2>
          <p className="hero-text-reveal" style={{ marginTop: '2rem', maxWidth: '800px', color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }}>
            Uptime isn't a goal, it's the baseline. Security isn't a feature, it's the foundation. I engineer the infrastructure people only notice when it isn't there — and make sure they never have to.
          </p>
        </div>
      )}
    </section>
  );
}

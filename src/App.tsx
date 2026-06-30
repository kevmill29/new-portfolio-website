import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero';
import Sandbox from './components/Sandbox';
import Writeups from './components/Writeups';
import Career from './components/Career';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="app-container" style={{ position: 'relative' }}>
      {/* Background Grid */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundImage: 'linear-gradient(rgba(28, 28, 28, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(28, 28, 28, 0.4) 1px, transparent 1px)', 
        backgroundSize: '40px 40px', zIndex: -1, pointerEvents: 'none' 
      }}></div>

      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Hero />
        <Sandbox />
        <Writeups />
        <Career />
      </main>
      
      <footer style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
        <p>SEC-OPS // Portfolio & Security Sandbox. © 2026 Kevin Emile.</p>
      </footer>
    </div>
  );
}

export default App;

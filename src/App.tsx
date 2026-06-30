import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero';
import About from './components/About';
import Sandbox from './components/Sandbox';
import Writeups from './components/Writeups';
import Career from './components/Career';
import StarsBackground from './components/StarsBackground';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return; // Do not initialize Lenis or GSAP if user prefers reduced motion
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="app-container" style={{ position: 'relative' }}>
      <StarsBackground />
      {/* Background Grid Overlay */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundImage: 'linear-gradient(rgba(28, 28, 28, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(28, 28, 28, 0.4) 1px, transparent 1px)', 
        backgroundSize: '40px 40px', zIndex: -1, pointerEvents: 'none' 
      }}></div>

      <main style={{ overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Hero />
          <About />
          <Writeups />
          <Career />
          <Sandbox />
        </div>
      </main>
      
      <footer style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
        <p>Kevin Emile // Infrastructure & Security Portfolio. © 2026.</p>
      </footer>
    </div>
  );
}

export default App;

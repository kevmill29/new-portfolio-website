import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize smooth scrolling
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
    <div ref={containerRef} className="app-container">
      <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Kevin Emile <span className="text-accent">// SEC_OPS</span>
        </h1>
      </section>
      
      <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="glass-panel">
        <h2 style={{ fontSize: '2rem' }}>Phase 1 Setup Complete</h2>
      </section>
    </div>
  );
}

export default App;

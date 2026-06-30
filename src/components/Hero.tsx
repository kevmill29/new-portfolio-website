import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setBooted(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="hero-section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {!booted ? (
        <div className="boot-sequence" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          <h1 className="text-accent font-mono" style={{ fontSize: '3rem', letterSpacing: '4px', textShadow: '0 0 20px var(--accent-glow)' }}>
            SEC_OPS // TERMINAL
          </h1>
          <button className="magnetic-btn" onClick={() => setBooted(true)}>
            PRESS ENTER TO INITIATE
          </button>
        </div>
      ) : (
        <div className="hero-content" style={{ opacity: 1, transition: 'opacity 1s var(--ease-out-expo)' }}>
          <h1 style={{ fontSize: '8vw', lineHeight: 1, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            KEVIN EMILE
          </h1>
          <h2 className="text-accent" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
            // CYBERSECURITY_ENGINEER
          </h2>
          <p style={{ marginTop: '2rem', maxWidth: '600px', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            Forward-thinking security analyst specializing in threat reconnaissance, automated remediation, and zero-trust architectures.
          </p>
        </div>
      )}
    </section>
  );
}

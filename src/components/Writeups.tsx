import React from 'react';
import { WRITEUPS_DATA } from '../data/portfolioData';

export default function Writeups() {
  return (
    <section className="writeups-section" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px' }}>02 // INTEL WRITEUPS</h2>
      
      <div className="writeups-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {WRITEUPS_DATA.map((writeup: any) => (
          <div key={writeup.id} className="glass-panel writeup-card" style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{writeup.title}</h3>
              <span className="font-mono text-accent" style={{ whiteSpace: 'nowrap', marginLeft: '2rem' }}>{writeup.date}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
              {writeup.summary}
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              {writeup.tags.map((tag: string) => (
                <span key={tag} className="font-mono" style={{ background: 'var(--surface-200)', border: '1px solid var(--surface-300)', padding: '6px 14px', fontSize: '12px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

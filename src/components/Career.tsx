import React from 'react';
import { CERTIFICATIONS } from '../data/portfolioData';

export default function Career() {
  return (
    <section className="career-section" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px' }}>03 // CREDENTIALS</h2>
      
      <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Experience Box */}
        <div className="glass-panel bento-box" style={{ padding: '3rem' }}>
          <h3 className="text-accent font-mono" style={{ marginBottom: '2rem', fontSize: '14px', letterSpacing: '2px' }}>EXPERIENCE</h3>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Cencora</h4>
            <p className="text-secondary font-mono" style={{ fontSize: '14px' }}>Cybersecurity Analyst | 2023 - Present</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Allied Universal</h4>
            <p className="text-secondary font-mono" style={{ fontSize: '14px' }}>Security Professional | 2021 - 2023</p>
          </div>
        </div>

        {/* Education Box */}
        <div className="glass-panel bento-box" style={{ padding: '3rem' }}>
          <h3 className="text-accent font-mono" style={{ marginBottom: '2rem', fontSize: '14px', letterSpacing: '2px' }}>EDUCATION</h3>
          <div>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>Western Governors University</h4>
            <p className="text-secondary font-mono" style={{ fontSize: '14px', marginBottom: '0.2rem' }}>BS Cybersecurity and Information Assurance</p>
            <p className="text-secondary font-mono" style={{ fontSize: '14px' }}>2022 - 2025</p>
          </div>
        </div>

        {/* Certs Box */}
        <div className="glass-panel bento-box" style={{ padding: '3rem' }}>
          <h3 className="text-accent font-mono" style={{ marginBottom: '2rem', fontSize: '14px', letterSpacing: '2px' }}>CERTIFICATIONS</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {CERTIFICATIONS.map((cert: any) => (
              <li key={cert.name}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{cert.name}</h4>
                <p className="text-secondary font-mono" style={{ fontSize: '14px' }}>{cert.provider} | {cert.status}</p>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </section>
  );
}

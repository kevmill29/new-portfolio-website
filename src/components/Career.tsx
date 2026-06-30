import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Career() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.bento-box', 
      { y: 100, opacity: 0, scale: 0.95 },
      { 
        y: 0, opacity: 1, scale: 1, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="career-section" style={{ minHeight: '100vh', padding: '8rem 2rem' }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px' }}>03 // CREDENTIALS</h2>
      
      <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Experience Box */}
        <div className="glass-panel bento-box" style={{ padding: '3rem' }}>
          <h3 className="text-accent font-mono" style={{ marginBottom: '2rem', fontSize: '14px', letterSpacing: '2px' }}>EXPERIENCE</h3>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Cencora</h4>
            <p className="text-secondary font-mono" style={{ fontSize: '14px' }}>Computer Operator | 2023 - Present</p>
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

        </div>
        
      </div>
    </section>
  );
}

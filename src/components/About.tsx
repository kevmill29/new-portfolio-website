import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.about-box', 
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
    <section ref={sectionRef} id="about" className="about-section" style={{ padding: '8rem 2rem', position: 'relative', zIndex: 10 }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px' }}>01 // EXECUTIVE SUMMARY</h2>
      
      <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Short Version Box */}
        <div className="glass-panel about-box" style={{ padding: '3rem', gridColumn: '1 / -1' }}>
          <h3 className="text-accent font-mono" style={{ marginBottom: '1.5rem', fontSize: '14px', letterSpacing: '2px' }}>WHO I AM</h3>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
            I'm an IT Professional and Computer Operator pursuing a BS in Computer Science. I specialize in building, securing, and maintaining the infrastructure that keeps businesses running smoothly. I bridge the gap between high-level security theory and day-to-day operational reality.
          </p>
        </div>

        {/* Competencies Box */}
        <div className="glass-panel about-box" style={{ padding: '3rem' }}>
          <h3 className="text-accent font-mono" style={{ marginBottom: '2rem', fontSize: '14px', letterSpacing: '2px' }}>CORE COMPETENCIES</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <li>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Systems Administration</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Keeping critical servers and systems online and optimized.</span>
            </li>
            <li>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Network Security</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Designing defenses that protect data without frustrating users.</span>
            </li>
            <li>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Automation (Python/PowerShell)</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Writing scripts that eliminate manual IT busywork.</span>
            </li>
            <li>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Incident Response</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Diagnosing and resolving complex operational failures quickly.</span>
            </li>
          </ul>
        </div>

        {/* Objective Box */}
        <div className="glass-panel about-box" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 className="text-accent font-mono" style={{ marginBottom: '1.5rem', fontSize: '14px', letterSpacing: '2px' }}>CURRENT OBJECTIVE</h3>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
            Seeking a role as a <strong>Network Engineer</strong>, <strong>Systems Administrator</strong>, or <strong>Cybersecurity Analyst</strong> where I can leverage my operational experience to build and defend resilient infrastructure.
          </p>
        </div>

      </div>
    </section>
  );
}

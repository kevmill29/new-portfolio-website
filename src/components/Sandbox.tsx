import React, { useState, useRef } from 'react';
import { SCRIPTS_DATA } from '../data/portfolioData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Sandbox() {
  const [activeScript, setActiveScript] = useState('keylogger_script.py');
  const scripts = Object.values(SCRIPTS_DATA);
  
  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !scrollWrapperRef.current) return;

    const scrollWidth = scrollWrapperRef.current.scrollWidth - window.innerWidth + 100;

    gsap.to(scrollWrapperRef.current, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="sandbox-section" style={{ height: '100vh', overflow: 'hidden', padding: '4rem 0', background: 'var(--bg-black)' }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px', paddingLeft: '2rem' }}>01 // THE SANDBOX</h2>
      
      <div 
        ref={scrollWrapperRef}
        className="sandbox-horizontal-wrapper" 
        style={{ display: 'flex', gap: '4rem', height: '60vh', padding: '0 2rem', width: '200vw' }}
      >
        <div className="glass-panel" style={{ padding: '2rem', width: '350px', flexShrink: 0, height: '100%' }}>
          <h3 className="text-accent" style={{ marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '2px' }}>EXPLORER</h3>
          <ul style={{ listStyle: 'none' }}>
            {scripts.map((script: any) => (
              <li key={script.name} style={{ marginBottom: '1rem' }}>
                <button 
                  onClick={() => setActiveScript(script.name)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: activeScript === script.name ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'color 0.2s ease',
                    fontSize: '14px'
                  }}
                >
                  {script.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', overflowY: 'auto', width: '800px', flexShrink: 0, height: '100%' }}>
          <h3 className="text-secondary" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px' }}>CODE VIEWER</h3>
          <pre className="font-mono" style={{ color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {SCRIPTS_DATA[activeScript as keyof typeof SCRIPTS_DATA]?.code || '// Select a script'}
          </pre>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: '#030303', border: '1px solid var(--surface-300)', width: '600px', flexShrink: 0, height: '100%' }}>
          <h3 className="text-accent" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px' }}>TERMINAL</h3>
          <div className="terminal-output font-mono" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            $ root@sec-ops:~# ./run {activeScript} <br/>
            [~] Standby... executing simulation. <br/>
            {SCRIPTS_DATA[activeScript as keyof typeof SCRIPTS_DATA]?.simulation.map((line: any, i: number) => (
               <span key={i} style={{ color: line.type === 'success' ? '#00ff88' : line.type === 'warning' ? '#FFE600' : 'inherit' }}><br/>{line.text}</span>
            ))}
          </div>
        </div>

        <div style={{ width: '100px', flexShrink: 0 }}></div>
      </div>
    </section>
  );
}

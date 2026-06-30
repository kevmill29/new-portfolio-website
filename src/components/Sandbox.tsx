import { useState, useRef } from 'react';
import { SCRIPTS_DATA } from '../data/portfolioData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Sandbox() {
  const [activeScript, setActiveScript] = useState('keylogger_script.py');
  const [typedLines, setTypedLines] = useState<any[]>([]);
  const scripts = Object.values(SCRIPTS_DATA);
  
  useEffect(() => {
    const simulation = SCRIPTS_DATA[activeScript as keyof typeof SCRIPTS_DATA]?.simulation || [];
    setTypedLines([]);
    
    let lineIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const printNextLine = () => {
      if (lineIndex < simulation.length) {
        setTypedLines(prev => [...prev, simulation[lineIndex]]);
        lineIndex++;
        timeout = setTimeout(printNextLine, Math.random() * 300 + 100);
      }
    };
    
    timeout = setTimeout(printNextLine, 500);

    return () => clearTimeout(timeout);
  }, [activeScript]);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!sectionRef.current || !scrollWrapperRef.current || !isDesktop) return;

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
    <section ref={sectionRef} className="sandbox-section" style={{ minHeight: '100vh', overflow: 'hidden', padding: '4rem 0', background: 'var(--bg-black)' }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px', paddingLeft: '2rem' }}>01 // THE SANDBOX</h2>
      
      <div 
        ref={scrollWrapperRef}
        className="sandbox-horizontal-wrapper" 
        style={{ 
          display: 'flex', 
          flexDirection: window.matchMedia("(min-width: 1024px)").matches ? 'row' : 'column',
          gap: '4rem', 
          height: window.matchMedia("(min-width: 1024px)").matches ? '60vh' : 'auto', 
          padding: '0 2rem', 
          width: window.matchMedia("(min-width: 1024px)").matches ? '200vw' : '100%' 
        }}
      >
        <div className="glass-panel" style={{ padding: '2rem', width: window.matchMedia("(min-width: 1024px)").matches ? '350px' : '100%', flexShrink: 0, height: window.matchMedia("(min-width: 1024px)").matches ? '100%' : 'auto' }}>
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

        <div className="glass-panel" style={{ padding: '2rem', overflowY: 'auto', width: window.matchMedia("(min-width: 1024px)").matches ? '800px' : '100%', flexShrink: 0, height: window.matchMedia("(min-width: 1024px)").matches ? '100%' : '500px' }}>
          <h3 className="text-secondary" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px' }}>CODE VIEWER</h3>
          <pre className="font-mono" style={{ color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {SCRIPTS_DATA[activeScript as keyof typeof SCRIPTS_DATA]?.code || '// Select a script'}
          </pre>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: '#030303', border: '1px solid var(--surface-300)', width: window.matchMedia("(min-width: 1024px)").matches ? '600px' : '100%', flexShrink: 0, height: window.matchMedia("(min-width: 1024px)").matches ? '100%' : 'auto' }}>
          <h3 className="text-accent" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px' }}>TERMINAL</h3>
          <div className="terminal-output font-mono" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            $ system@kevin-emile:~# ./run {activeScript} <br/>
            [~] Standby... executing simulation. <br/>
            {typedLines.map((line: any, i: number) => (
               <span key={i} style={{ color: line.type === 'success' ? '#00ff88' : line.type === 'warning' ? '#FFE600' : 'inherit' }}><br/>{line.text}</span>
            ))}
            <span className="blinking-cursor" style={{ opacity: 1, animation: 'blink 1s step-end infinite', marginLeft: '4px' }}>_</span>
          </div>
        </div>

        <div style={{ width: '100px', flexShrink: 0 }}></div>
      </div>
    </section>
  );
}

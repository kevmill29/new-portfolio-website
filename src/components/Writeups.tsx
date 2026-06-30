import { useRef, useState, useEffect } from 'react';
import { WRITEUPS_DATA } from '../data/portfolioData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Writeups() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [activeWriteup, setActiveWriteup] = useState<any>(null);

  useGSAP(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    cardsRef.current.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 20%',
        endTrigger: containerRef.current,
        end: 'bottom 80%',
        pin: true,
        pinSpacing: false,
        id: `card-${i}`,
        invalidateOnRefresh: true,
      });

      if (i < cardsRef.current.length - 1) {
        gsap.to(card, {
          scale: 0.95 - (0.05 * (cardsRef.current.length - 1 - i)),
          filter: 'brightness(0.3)',
          ease: 'none',
          scrollTrigger: {
            trigger: cardsRef.current[i + 1],
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          }
        });
      }
    });
  }, { scope: containerRef });

  useEffect(() => {
    if (activeWriteup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeWriteup]);

  return (
    <>
      <section ref={containerRef} className="writeups-section" style={{ padding: '8rem 2rem', position: 'relative' }}>
        <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px', position: 'sticky', top: '5%', zIndex: 10 }}>02 // INTEL WRITEUPS</h2>
        
        <div className="writeups-container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '1000px', margin: '0 auto', paddingBottom: '20vh' }}>
          {WRITEUPS_DATA.map((writeup: any, i: number) => (
            <div 
              key={writeup.id} 
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className="glass-panel writeup-card" 
              style={{ 
                padding: '3rem', 
                background: '#0a0a0a', 
                borderTop: '2px solid var(--accent-primary)',
                boxShadow: '0 -20px 40px rgba(0,0,0,0.8)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => setActiveWriteup(writeup)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{writeup.title}</h3>
                <span className="font-mono text-accent" style={{ whiteSpace: 'nowrap', marginLeft: '2rem' }}>{writeup.date}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                {writeup.summary}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {writeup.tags.map((tag: string) => (
                    <span key={tag} className="font-mono" style={{ background: 'var(--surface-200)', border: '1px solid var(--surface-300)', padding: '6px 14px', fontSize: '12px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="text-accent font-mono" style={{ background: 'none', border: '1px solid var(--accent-primary)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = 'black'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                >
                  READ REPORT
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Modal */}
      {activeWriteup && (
        <div 
          onClick={() => setActiveWriteup(null)}
          style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', 
          zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '2rem'
        }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel" style={{ 
            background: '#050505', width: '100%', maxWidth: '900px', maxHeight: '90vh', 
            overflowY: 'auto', padding: '3rem', position: 'relative', border: '1px solid var(--surface-300)'
          }}>
            <button 
              onClick={() => setActiveWriteup(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '2.5rem', cursor: 'pointer', zIndex: 10 }}
            >
              &times;
            </button>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{activeWriteup.title}</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <span className="font-mono text-secondary">{activeWriteup.date}</span>
              <span className="font-mono text-secondary">|</span>
              <span className="font-mono text-secondary">{activeWriteup.category}</span>
            </div>
            
            <div 
              className="writeup-html-content"
              style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '1.1rem' }}
              dangerouslySetInnerHTML={{ __html: activeWriteup.content }} 
            />
          </div>
        </div>
      )}
    </>
  );
}

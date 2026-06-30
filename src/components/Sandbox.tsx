import React, { useState } from 'react';
import { SCRIPTS_DATA } from '../data/portfolioData';

export default function Sandbox() {
  const [activeScript, setActiveScript] = useState('keylogger_script.py');
  const scripts = Object.values(SCRIPTS_DATA);

  return (
    <section className="sandbox-section" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '3rem', letterSpacing: '-1px' }}>01 // THE SANDBOX</h2>
      
      <div className="sandbox-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', height: '70vh' }}>
        {/* File Tree */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 className="text-accent" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '2px' }}>EXPLORER</h3>
          <ul style={{ listStyle: 'none' }}>
            {scripts.map((script: any) => (
              <li key={script.name} style={{ marginBottom: '0.8rem' }}>
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
                    fontSize: '13px'
                  }}
                >
                  {script.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Code & Terminal */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', overflowY: 'auto' }}>
            <h3 className="text-secondary" style={{ marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px' }}>CODE VIEWER</h3>
            <pre className="font-mono" style={{ color: 'var(--text-primary)', fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {SCRIPTS_DATA[activeScript as keyof typeof SCRIPTS_DATA]?.code || '// Select a script'}
            </pre>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', background: '#030303', border: '1px solid var(--surface-300)' }}>
            <h3 className="text-accent" style={{ marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px' }}>TERMINAL</h3>
            <div className="terminal-output font-mono" style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              $ root@sec-ops:~# ./run {activeScript} <br/>
              [~] Standby... executing simulation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

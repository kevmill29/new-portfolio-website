import { useState, useEffect, useRef } from 'react';
import { SCRIPTS_DATA } from '../data/portfolioData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Sandbox() {
  const [activeScript, setActiveScript] = useState('keylogger_script.py');
  const [terminalHistory, setTerminalHistory] = useState<any[]>([
    { text: "VIRTUAL LINUX SYSTEM SHADOW-SANDBOX EXECUTABLE SHELL", type: "system" },
    { text: "Copyright (c) 2026 Sandbox Operations Group. All rights reserved.", type: "text" },
    { text: "Type 'help' to review directory of diagnostic execution commands.", type: "info" },
    { text: "Click a script in the Explorer and type 'run <script_name>' to test.", type: "info" },
    { text: "", type: "text" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  
  const scripts = Object.values(SCRIPTS_DATA);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const printLine = (text: string, type: string = "text") => {
    setTerminalHistory(prev => [...prev, { text, type }]);
  };

  const runSimulation = async (scriptName: string) => {
    if (isBusy) return;
    const script = SCRIPTS_DATA[scriptName as keyof typeof SCRIPTS_DATA];
    if (!script) {
      printLine(`[-] Script "${scriptName}" not found.`, "danger");
      return;
    }

    setIsBusy(true);
    let commandString = `python3 ${script.name}`;
    if (script.name.endsWith('.ps1')) commandString = `powershell.exe -ExecutionPolicy Bypass -File .\\${script.name}`;
    
    printLine(`user@sandbox:~$ ${commandString}`, "system");

    for (let i = 0; i < script.simulation.length; i++) {
      const step = script.simulation[i];
      await new Promise(r => setTimeout(r, step.delay || 200));
      printLine(step.text, step.type || "text");
    }
    
    setIsBusy(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    
    printLine(`user@sandbox:~$ ${trimmed}`, "system");
    const args = trimmed.split(" ");
    const baseCmd = args[0].toLowerCase();

    switch (baseCmd) {
      case "help":
        printLine("Available Terminal Sandbox commands:", "info");
        printLine("  help               - Display command directory overview", "text");
        printLine("  clear              - Wipe terminal logs screen", "text");
        printLine("  ls                 - List available security tool scripts", "text");
        printLine("  cat [filename]     - Dump file code contents to stdout", "text");
        printLine("  run [filename]     - Initiate simulated execution sequence", "text");
        break;
      case "clear":
        setTerminalHistory([]);
        break;
      case "ls":
        printLine("Drwx------  sandbox-root  sandbox-root  4.0K  scripts/", "info");
        Object.keys(SCRIPTS_DATA).forEach(key => {
            const meta = SCRIPTS_DATA[key as keyof typeof SCRIPTS_DATA];
            printLine(`-rwxr-xr-x  sandbox-root  sandbox-root  1.8K  ${meta.name}`, "success");
        });
        break;
      case "cat":
        if (!args[1]) printLine("Usage: cat <script-name>", "warning");
        else {
            const data = SCRIPTS_DATA[args[1] as keyof typeof SCRIPTS_DATA];
            if (data) {
                printLine(`--- Code File Dump: ${data.name} ---`, "info");
                printLine(data.code, "text");
            } else {
                printLine(`cat: ${args[1]}: No such script or resource.`, "danger");
            }
        }
        break;
      case "run":
        if (!args[1]) printLine("Usage: run <script-name>", "warning");
        else {
            if (SCRIPTS_DATA[args[1] as keyof typeof SCRIPTS_DATA]) runSimulation(args[1]);
            else printLine(`run: ${args[1]}: target executable not found.`, "danger");
        }
        break;
      default:
        if (SCRIPTS_DATA[trimmed as keyof typeof SCRIPTS_DATA]) {
            runSimulation(trimmed);
        } else {
            printLine(`sh: command not found: ${baseCmd}. Type 'help' for directory.`, "danger");
        }
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
      setInputValue('');
    }
  };

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
                    background: 'none', border: 'none', 
                    color: activeScript === script.name ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'color 0.2s ease', fontSize: '14px'
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

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '2rem', background: '#030303', border: '1px solid var(--surface-300)', width: window.matchMedia("(min-width: 1024px)").matches ? '600px' : '100%', flexShrink: 0, height: window.matchMedia("(min-width: 1024px)").matches ? '100%' : '500px' }}>
          <h3 className="text-accent" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px' }}>TERMINAL</h3>
          
          <div ref={terminalRef} className="terminal-output font-mono" style={{ flexGrow: 1, overflowY: 'auto', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1rem' }}>
            {terminalHistory.map((line: any, i: number) => (
               <div key={i} style={{ color: line.type === 'success' ? '#00ff88' : line.type === 'warning' ? '#FFE600' : line.type === 'danger' ? '#ff3366' : line.type === 'info' ? '#00ccff' : 'inherit', whiteSpace: 'pre-wrap' }}>
                 {line.text}
               </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <span style={{ marginRight: '8px', color: '#00ff88' }}>user@sandbox:~$</span>
            <input 
              ref={inputRef}
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBusy}
              style={{ flexGrow: 1, background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', outline: 'none' }}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        <div style={{ width: '100px', flexShrink: 0 }}></div>
      </div>
    </section>
  );
}

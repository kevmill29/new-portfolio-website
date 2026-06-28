// app.js - Cybersecurity Portfolio Interface Logic

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. Core State & Data Initialization
    // -------------------------------------------------------------
    let currentTab = "sandbox";
    let activeScript = "subnet-recon.py";
    let activeWriteupId = null;
    let terminalBusy = false;
    let systemStatsInterval = null;
    let consoleLogInterval = null;
    
    // Command History
    const commandHistory = [];
    let historyIndex = -1;

    // Elements
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-content-panel");
    const treeNodes = document.querySelectorAll(".tree-node");
    const codeContainer = document.querySelector("#code-viewer");
    const scriptLangTag = document.querySelector(".editor-lang-tag");
    const scriptNameLabel = document.querySelector(".editor-script-name");
    const terminalScreen = document.querySelector("#terminal-screen");
    const terminalInput = document.querySelector("#terminal-input");
    const runBtn = document.querySelector("#btn-run-script");
    const clearBtn = document.querySelector("#btn-clear-terminal");
    const searchInput = document.querySelector("#writeup-search");
    const writeupsList = document.querySelector("#writeups-list");
    const writeupViewer = document.querySelector("#writeup-viewer");
    
    // Telemetry Elements
    const uptimeCounter = document.querySelector("#uptime-counter");
    const cpuBar = document.querySelector("#cpu-bar");
    const cpuVal = document.querySelector("#cpu-value");
    const ramBar = document.querySelector("#ram-bar");
    const ramVal = document.querySelector("#ram-value");
    const telemetryConsole = document.querySelector("#telemetry-console");

    // Initialize Uptime Clock
    let uptimeSeconds = 124530;
    setInterval(() => {
        uptimeSeconds++;
        const hrs = Math.floor(uptimeSeconds / 3600);
        const mins = Math.floor((uptimeSeconds % 3600) / 60);
        const secs = uptimeSeconds % 60;
        uptimeCounter.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);

    // Initialize System Telemetry Bars
    function updateSystemTelemetry() {
        const cpu = Math.floor(Math.random() * 25) + 12; // 12-37% fluctuation
        const ram = Math.floor(Math.random() * 5) + 54;   // 54-59% fluctuation
        
        cpuBar.style.width = `${cpu}%`;
        cpuVal.textContent = `${cpu}%`;
        ramBar.style.width = `${ram}%`;
        ramVal.textContent = `${ram}%`;
    }
    updateSystemTelemetry();
    systemStatsInterval = setInterval(updateSystemTelemetry, 3000);

    // Dynamic Left Log Console Simulation
    const telemetryMessages = [
        { text: "INBOUND CHECK: 147.28.9.15 -> TCP 443 [PASS]", type: "info" },
        { text: "INTEGRITY DAEMON: hash verify check OK", type: "success" },
        { text: "FIREWALL ALERT: Port Sweep target block (10.0.1.18)", type: "warning" },
        { text: "SYS LOG: auditd rotated success", type: "text" },
        { text: "VULN SCAN: service sync query complete", type: "success" },
        { text: "MITIGATION ALERT: threat block database refreshed", type: "info" },
        { text: "IDM: Kerberos authentication challenge for 'devops_eng'", type: "text" },
        { text: "API AUDIT: POST /v2/telemetry payload status 200", type: "success" },
        { text: "SYSTEM WARN: high entropy key detected in backup/tmp", type: "danger" }
    ];

    function appendTelemetryLog() {
        const item = telemetryMessages[Math.floor(Math.random() * telemetryMessages.length)];
        const dateStr = new Date().toISOString().slice(11, 19);
        const line = document.createElement("div");
        line.className = `console-log-line ${item.type || 'text'}`;
        line.innerHTML = `<span style="color:#475569;">[${dateStr}]</span> ${item.text}`;
        telemetryConsole.appendChild(line);
        
        // Scroll to bottom
        telemetryConsole.scrollTop = telemetryConsole.scrollHeight;
        
        // Cap lines at 30
        while (telemetryConsole.children.length > 30) {
            telemetryConsole.removeChild(telemetryConsole.firstChild);
        }
    }
    // Populate some initial logs
    for (let i = 0; i < 8; i++) appendTelemetryLog();
    consoleLogInterval = setInterval(appendTelemetryLog, 4500);

    // Scramble Text Scrambler Effect Utility
    const scrambleCharset = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=?";
    function scrambleText(element, finalString, duration = 800) {
        let start = null;
        const length = finalString.length;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Build current string
            let current = "";
            for (let i = 0; i < length; i++) {
                if (finalString[i] === " " || finalString[i] === "/" || finalString[i] === "." || finalString[i] === "-" || finalString[i] === ":" || finalString[i] === "_" || finalString[i] === "[" || finalString[i] === "]" || finalString[i] === ">") {
                    current += finalString[i];
                    continue;
                }
                const revealThreshold = percentage * length;
                if (i < revealThreshold) {
                    current += finalString[i];
                } else {
                    current += scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)];
                }
            }
            element.textContent = current;
            
            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = finalString;
            }
        }
        requestAnimationFrame(animate);
    }

    // Apply initial scramble hover listeners to header title and alias
    const nameHeader = document.querySelector(".profile-name");
    if (nameHeader) {
        nameHeader.addEventListener("mouseenter", () => {
            scrambleText(nameHeader, "CANDIDATE PROFILE");
        });
        nameHeader.addEventListener("mouseleave", () => {
            scrambleText(nameHeader, "KEVIN EMILE");
        });
    }

    // Scramble decrypt effect on initial tabs
    document.querySelectorAll(".panel-title").forEach(title => {
        const orig = title.textContent;
        title.addEventListener("mouseenter", () => scrambleText(title, orig, 600));
    });

    // -------------------------------------------------------------
    // 2. Navigation Control (Tabs)
    // -------------------------------------------------------------
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;
            if (currentTab === target) return;
            
            // Switch tabs
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            tabPanels.forEach(p => p.classList.remove("active"));
            const targetPanel = document.querySelector(`#panel-${target}`);
            if (targetPanel) targetPanel.classList.add("active");
            
            currentTab = target;
        });
    });

    // -------------------------------------------------------------
    // 3. Signature Element: The Sandbox (Terminal & Inspector)
    // -------------------------------------------------------------
    
    // Token-based robust code highlighter to prevent HTML tag collisions
    function highlightCode(code, lang) {
        // Escape HTML
        let escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
            
        let regex;
        if (lang === "python") {
            regex = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|#.*)/g;
        } else { // javascript
            regex = /(\/\*[\s\S]*?\*\/|\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
        }

        let parts = [];
        let lastIndex = 0;
        let match;

        regex.lastIndex = 0;

        while ((match = regex.exec(escaped)) !== null) {
            let before = escaped.substring(lastIndex, match.index);
            parts.push(highlightKeywordsAndSymbols(before, lang));

            let token = match[0];
            if (token.startsWith("#") || token.startsWith("//") || token.startsWith("/*")) {
                parts.push(`<span class="hljs-comment">${token}</span>`);
            } else {
                parts.push(`<span class="hljs-string">${token}</span>`);
            }
            lastIndex = regex.lastIndex;
        }
        
        let remaining = escaped.substring(lastIndex);
        parts.push(highlightKeywordsAndSymbols(remaining, lang));

        return parts.join("");
    }

    function highlightKeywordsAndSymbols(text, lang) {
        if (lang === "python") {
            text = text
                .replace(/\b(def|class|import|from|as|if|elif|else|for|while|try|except|return|async|await|with|None|True|False)\b/g, '<span class="hljs-keyword">$1</span>')
                .replace(/\b(print|len|range|int|str|asyncio|run|gather|socket|argparse|sys)\b/g, '<span class="hljs-function">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="hljs-number">$1</span>');
        } else if (lang === "javascript") {
            text = text
                .replace(/\b(const|let|var|function|return|if|else|for|while|try|catch|require|import|export|from|new|class|await|async)\b/g, '<span class="hljs-keyword">$1</span>')
                .replace(/\b(console\.log|console\.error|console\.warn|exec|parseLogLine|handleFailure|blockIp)\b/g, '<span class="hljs-function">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="hljs-number">$1</span>');
        }
        return text;
    }

    function loadScript(scriptName) {
        activeScript = scriptName;
        const script = SCRIPTS_DATA[scriptName];
        if (!script) return;
        
        scriptLangTag.textContent = script.lang;
        scriptNameLabel.textContent = `./${script.name}`;
        
        // Highlight code
        const highlighted = highlightCode(script.code, script.lang);
        codeContainer.querySelector("code").innerHTML = highlighted;
        
        // Update tree node state
        treeNodes.forEach(node => {
            if (node.dataset.script === scriptName) {
                node.classList.add("active");
            } else {
                node.classList.remove("active");
            }
        });
    }

    // Click handlers for tree explorer nodes
    treeNodes.forEach(node => {
        node.addEventListener("click", () => {
            const sn = node.dataset.script;
            if (sn) loadScript(sn);
        });
    });

    // Terminal Emulator Output helper
    function printTermLine(text, type = "text") {
        const line = document.createElement("div");
        line.className = `terminal-line ${type}`;
        
        // Parse simulated line spacing / tabs
        line.innerHTML = text.replace(/ /g, "&nbsp;").replace(/\n/g, "<br>");
        terminalScreen.appendChild(line);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    // Run Script Simulation Flow
    async function runScriptSimulation(scriptName) {
        if (terminalBusy) return;
        terminalBusy = true;
        
        const script = SCRIPTS_DATA[scriptName];
        if (!script) {
            printTermLine(`[-] Script "${scriptName}" not found.`, "danger");
            terminalBusy = false;
            return;
        }

        // Disable input
        terminalInput.disabled = true;
        runBtn.disabled = true;
        runBtn.textContent = "Executing...";

        printTermLine(`user@sandbox:~$ python3 ${script.name} --target 192.168.8.1 --verbose`, "system");
        
        // Iterate through simulation steps
        for (let i = 0; i < script.simulation.length; i++) {
            const step = script.simulation[i];
            const delay = step.delay !== undefined ? step.delay : 200;
            await new Promise(resolve => setTimeout(resolve, delay));
            printTermLine(step.text, step.type || "text");
        }

        // Re-enable interface
        terminalInput.disabled = false;
        runBtn.disabled = false;
        runBtn.textContent = "Run Script";
        terminalBusy = false;
        
        // Scroll
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
        terminalInput.focus();
    }

    // Shell command controller
    function executeShellCommand(cmdText) {
        const trimmed = cmdText.trim();
        if (!trimmed) return;
        
        // Record history
        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        printTermLine(`user@sandbox:~$ ${trimmed}`, "system");

        const args = trimmed.split(" ");
        const baseCmd = args[0].toLowerCase();

        switch (baseCmd) {
            case "help":
                printTermLine("Available Terminal Sandbox commands:", "info");
                printTermLine("  help               - Display command directory overview", "text");
                printTermLine("  clear              - Wipe terminal logs screen", "text");
                printTermLine("  ls                 - List available security tool scripts", "text");
                printTermLine("  cat [filename]     - Dump file code contents to stdout", "text");
                printTermLine("  run [filename]     - Initiate simulated execution sequence", "text");
                printTermLine("  sysinfo            - Output sandbox virtual machine status metrics", "text");
                break;
            case "clear":
                terminalScreen.innerHTML = "";
                break;
            case "ls":
                printTermLine("Drwx------  sandbox-root  sandbox-root  4.0K  scripts/", "info");
                Object.keys(SCRIPTS_DATA).forEach(key => {
                    const meta = SCRIPTS_DATA[key];
                    printTermLine(`-rwxr-xr-x  sandbox-root  sandbox-root  1.8K  ${meta.name}   [${meta.version}]`, "success");
                });
                break;
            case "cat":
                if (!args[1]) {
                    printTermLine("Usage: cat <script-name>", "warning");
                } else {
                    const targetFile = args[1];
                    const data = SCRIPTS_DATA[targetFile];
                    if (data) {
                        printTermLine(`--- Code File Dump: ${data.name} ---`, "info");
                        printTermLine(data.code, "text");
                    } else {
                        printTermLine(`cat: ${targetFile}: No such script or resource.`, "danger");
                    }
                }
                break;
            case "run":
                if (!args[1]) {
                    printTermLine("Usage: run <script-name>", "warning");
                } else {
                    const targetFile = args[1];
                    if (SCRIPTS_DATA[targetFile]) {
                        runScriptSimulation(targetFile);
                    } else {
                        printTermLine(`run: ${targetFile}: target executable script matching name not found.`, "danger");
                    }
                }
                break;
            case "sysinfo":
                printTermLine("--- VM HARDWARE SANDBOX DOSSIER ---", "info");
                printTermLine("OS Kernel:  Linux 5.15.0-89-generic x86_64", "text");
                printTermLine(`VM Uptime:  ${uptimeCounter.textContent}`, "text");
                printTermLine(`Alloc CPU:  Virtual Core 4-vCPU [${cpuVal.textContent}]`, "text");
                printTermLine(`Alloc Memory: ${ramVal.textContent} of 8.00GB`, "text");
                printTermLine("Network Interface: sand0 [10.10.14.93/24]", "text");
                break;
            default:
                // Check if they just typed the script name
                if (SCRIPTS_DATA[trimmed]) {
                    runScriptSimulation(trimmed);
                } else {
                    printTermLine(`sh: command not found: ${baseCmd}. Type 'help' for active command set directory.`, "danger");
                }
                break;
        }

        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    // Terminal Input events
    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = terminalInput.value;
            executeShellCommand(cmd);
            terminalInput.value = "";
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = "";
            }
        }
    });

    // Run Button click
    runBtn.addEventListener("click", () => {
        runScriptSimulation(activeScript);
    });

    // Clear Button click
    clearBtn.addEventListener("click", () => {
        terminalScreen.innerHTML = "";
        printTermLine("[*] Terminal logs buffer purged.", "info");
    });

    // -------------------------------------------------------------
    // 4. Research Writeups Tab Functions
    // -------------------------------------------------------------
    function renderWriteupsList(filterText = "") {
        writeupsList.innerHTML = "";
        const lowerFilter = filterText.toLowerCase();

        const filtered = WRITEUPS_DATA.filter(w => {
            return w.title.toLowerCase().includes(lowerFilter) ||
                   w.summary.toLowerCase().includes(lowerFilter) ||
                   w.tags.some(t => t.toLowerCase().includes(lowerFilter)) ||
                   w.category.toLowerCase().includes(lowerFilter);
        });

        if (filtered.length === 0) {
            writeupsList.innerHTML = `<div class="writeup-placeholder"><p style="color:var(--text-muted);">No research writeups match target search query.</p></div>`;
            return;
        }

        filtered.forEach(w => {
            const card = document.createElement("div");
            card.className = `glass-panel writeup-card ${w.id === activeWriteupId ? 'active' : ''}`;
            card.style.padding = "16px";
            card.style.cursor = "pointer";
            
            // Build tag HTML
            const tagsHtml = w.tags.map(t => `<span class="tag-badge">${t}</span>`).join("");

            card.innerHTML = `
                <div class="writeup-card-header">
                    <div class="writeup-title">${w.title}</div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                    <span class="tag-badge category">${w.category}</span>
                    <span class="writeup-date">${w.date}</span>
                </div>
                <div class="writeup-summary">${w.summary}</div>
                <div class="tag-list" style="margin-top: 10px;">${tagsHtml}</div>
            `;

            card.addEventListener("click", () => {
                selectWriteup(w.id);
            });

            writeupsList.appendChild(card);
        });
    }

    function selectWriteup(writeupId) {
        activeWriteupId = writeupId;
        const writeup = WRITEUPS_DATA.find(w => w.id === writeupId);
        
        // Highlight active card in left list
        document.querySelectorAll(".writeup-card").forEach(c => c.classList.remove("active"));
        
        if (!writeup) {
            writeupViewer.innerHTML = `
                <div class="writeup-placeholder">
                    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                    <div>SELECT AN INTEL DOSSIER FROM THE LIST TO READ FULL REPORT ANALYSIS</div>
                </div>
            `;
            return;
        }

        const tagsHtml = writeup.tags.map(t => `<span class="tag-badge">${t}</span>`).join("");

        writeupViewer.innerHTML = `
            <div class="writeup-detail-container">
                <div class="writeup-detail-header">
                    <div class="writeup-detail-title">${writeup.title}</div>
                    <div class="writeup-detail-meta">
                        <div>CATEGORY: <span style="color:var(--accent-cyan); font-weight:bold;">${writeup.category}</span></div>
                        <div>PUBLISHED: <span style="color:var(--accent-cyan); font-weight:bold;">${writeup.date}</span></div>
                    </div>
                    <div class="tag-list" style="margin-top: 12px;">${tagsHtml}</div>
                </div>
                <div class="writeup-detail-body">
                    ${writeup.content}
                </div>
            </div>
        `;
        
        // Scroll writeup detail to top
        writeupViewer.querySelector(".writeup-detail-container").scrollTop = 0;
        
        // Render writeups list again to refresh active highlights
        renderWriteupsList(searchInput.value);
    }

    // Search input listener
    searchInput.addEventListener("input", (e) => {
        renderWriteupsList(e.target.value);
    });

    // -------------------------------------------------------------
    // 5. Initial App Triggers
    // -------------------------------------------------------------
    // Load default script on startup
    loadScript(activeScript);
    
    // Print initial help lines in Terminal sandbox
    printTermLine("VIRTUAL LINUX SYSTEM SHADOW-SANDBOX EXECUTABLE SHELL", "system");
    printTermLine("Copyright (c) 2026 Sandbox Operations Group. All rights reserved.", "text");
    printTermLine("Type 'help' to review directory of diagnostic execution commands.", "info");
    printTermLine("Click 'RUN SCRIPT' above or double-click nodes in file tree to test.", "info");
    printTermLine("", "text");
    
    // Render default writeups data
    renderWriteupsList();
    if (WRITEUPS_DATA.length > 0) {
        selectWriteup(WRITEUPS_DATA[0].id);
    }
});

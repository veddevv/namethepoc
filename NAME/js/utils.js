// Windows 3.1 Utilities

// System Beep (simulated)
function systemBeep() {
    // Create a short beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('Beep!'); // Fallback for browsers without Web Audio API
    }
}

// Dialog Box Creation
function createDialog(title, message, buttons = ['OK']) {
    const dialog = document.createElement('div');
    dialog.className = 'window';
    dialog.style.position = 'fixed';
    dialog.style.left = '50%';
    dialog.style.top = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.zIndex = '1000';
    dialog.style.width = '300px';
    dialog.style.height = '150px';
    
    let buttonHTML = '';
    buttons.forEach((buttonText, index) => {
        buttonHTML += `<button onclick="closeDialog(this)" style="margin: 0 4px; padding: 4px 12px; border: 1px outset #c0c0c0; background: #c0c0c0;">${buttonText}</button>`;
    });
    
    dialog.innerHTML = `
        <div class="window-titlebar">
            <span class="window-title">${title}</span>
            <div class="window-controls">
                <button class="window-close" onclick="closeDialog(this)">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 16px; text-align: center;">
            <p style="margin: 16px 0;">${message}</p>
            <div style="margin-top: 24px;">
                ${buttonHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    return dialog;
}

function closeDialog(button) {
    const dialog = button.closest('.window');
    if (dialog) {
        dialog.remove();
    }
}

// File System Simulation
const FileSystem = {
    files: {
        'README.TXT': 'Welcome to Windows 3.1!\n\nThis is a simple recreation of the classic Windows 3.1 interface.\n\nDouble-click on program icons to launch applications.\n\nEnjoy your nostalgic journey!',
        'AUTOEXEC.BAT': '@ECHO OFF\nPATH C:\\WINDOWS;C:\\DOS\nSET TEMP=C:\\TEMP\nWIN',
        'CONFIG.SYS': 'FILES=30\nBUFFERS=20\nDEVICE=C:\\WINDOWS\\HIMEM.SYS'
    },
    
    readFile(filename) {
        return this.files[filename] || `File ${filename} not found.`;
    },
    
    writeFile(filename, content) {
        this.files[filename] = content;
    },
    
    listFiles() {
        return Object.keys(this.files);
    }
};

// Registry Simulation (for storing settings)
const Registry = {
    settings: {
        'Desktop\\Wallpaper': 'none',
        'Desktop\\Pattern': 'none',
        'Sound\\SystemBeep': 'enabled',
        'Mouse\\DoubleClickSpeed': '500'
    },
    
    getValue(key) {
        return this.settings[key] || null;
    },
    
    setValue(key, value) {
        this.settings[key] = value;
    }
};

// Windows 3.1 specific helpers
function getSystemInfo() {
    return {
        version: 'Microsoft Windows 3.1',
        memory: '4,096 KB available',
        resources: '87% free',
        dosVersion: 'MS-DOS 6.22'
    };
}

function formatTime(date) {
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    });
}

// Simulate Windows 3.1 program launching delay
function simulateLoading(callback, delay = 1000) {
    const loadingDialog = createDialog('Please Wait', 'Loading application...', []);
    
    setTimeout(() => {
        loadingDialog.remove();
        callback();
    }, delay);
}

// Random Windows 3.1 tips
function getRandomTip() {
    const tips = [
        "Tip: Double-click on the Control Panel to change system settings.",
        "Tip: Use Alt+Tab to switch between open applications.",
        "Tip: Press F1 for help in most applications.",
        "Tip: Right-click on the desktop to access system menus.",
        "Tip: Use the File Manager to organize your documents.",
        "Tip: The Recycle Bin stores deleted files until you empty it.",
        "Tip: Save your work frequently to prevent data loss."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
}

// Easter eggs
function konami() {
    let sequence = [];
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        sequence.push(e.code);
        if (sequence.length > konamiCode.length) {
            sequence.shift();
        }
        
        if (sequence.join(',') === konamiCode.join(',')) {
            createDialog('Easter Egg!', 'Congratulations! You found the Konami Code!\n\n30 extra lives granted... just kidding, this is Windows 3.1!', ['Awesome!']);
            sequence = [];
        }
    });
}

// Initialize easter eggs
konami();
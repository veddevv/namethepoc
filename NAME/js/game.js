// Windows 3.1 Window Manager and Applications
const WindowManager = {
    openWindows: [],
    zIndex: 100,
    
    init() {
        this.setupWindowControls();
        this.makeWindowsDraggable();
    },
    
    openApp(appName) {
        if (this.isAppOpen(appName)) {
            this.focusWindow(appName);
            return;
        }
        
        const windowElement = this.createAppWindow(appName);
        document.getElementById('desktop').appendChild(windowElement);
        
        this.openWindows.push({
            id: appName,
            element: windowElement,
            title: this.getAppTitle(appName)
        });
        
        this.addToTaskbar(appName);
        this.focusWindow(appName);
    },
    
    createAppWindow(appName) {
        const window = document.createElement('div');
        window.className = 'window app-window active';
        window.id = `${appName}-window`;
        window.style.zIndex = ++this.zIndex;
        
        const title = this.getAppTitle(appName);
        const content = this.getAppContent(appName);
        
        window.innerHTML = `
            <div class="window-titlebar">
                <span class="window-title">${title}</span>
                <div class="window-controls">
                    <button class="window-minimize">_</button>
                    <button class="window-maximize">□</button>
                    <button class="window-close" onclick="WindowManager.closeApp('${appName}')">×</button>
                </div>
            </div>
            <div class="window-menubar">
                ${this.getAppMenuBar(appName)}
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;
        
        // Position window
        const offset = this.openWindows.length * 30;
        window.style.left = (150 + offset) + 'px';
        window.style.top = (80 + offset) + 'px';
        
        return window;
    },
    
    getAppTitle(appName) {
        const titles = {
            'notepad': 'Notepad - Untitled',
            'calculator': 'Calculator',
            'minesweeper': 'Minesweeper'
        };
        return titles[appName] || 'Application';
    },
    
    getAppMenuBar(appName) {
        const menuBars = {
            'notepad': '<span class="menu-item">File</span><span class="menu-item">Edit</span><span class="menu-item">Search</span><span class="menu-item">Help</span>',
            'calculator': '<span class="menu-item">View</span><span class="menu-item">Help</span>',
            'minesweeper': '<span class="menu-item">Game</span><span class="menu-item">Help</span>'
        };
        return menuBars[appName] || '';
    },
    
    getAppContent(appName) {
        switch(appName) {
            case 'notepad':
                return '<textarea class="notepad-content" placeholder="Enter your text here..."></textarea>';
            
            case 'calculator':
                return `
                    <div class="calculator-content">
                        <input type="text" class="calculator-display" readonly value="0">
                        <div class="calculator-buttons">
                            <button class="calc-button" onclick="Calculator.clear()">C</button>
                            <button class="calc-button" onclick="Calculator.clearEntry()">CE</button>
                            <button class="calc-button" onclick="Calculator.backspace()">←</button>
                            <button class="calc-button" onclick="Calculator.operation('/')">/</button>
                            <button class="calc-button" onclick="Calculator.number('7')">7</button>
                            <button class="calc-button" onclick="Calculator.number('8')">8</button>
                            <button class="calc-button" onclick="Calculator.number('9')">9</button>
                            <button class="calc-button" onclick="Calculator.operation('*')">*</button>
                            <button class="calc-button" onclick="Calculator.number('4')">4</button>
                            <button class="calc-button" onclick="Calculator.number('5')">5</button>
                            <button class="calc-button" onclick="Calculator.number('6')">6</button>
                            <button class="calc-button" onclick="Calculator.operation('-')">-</button>
                            <button class="calc-button" onclick="Calculator.number('1')">1</button>
                            <button class="calc-button" onclick="Calculator.number('2')">2</button>
                            <button class="calc-button" onclick="Calculator.number('3')">3</button>
                            <button class="calc-button" onclick="Calculator.operation('+')">+</button>
                            <button class="calc-button" onclick="Calculator.number('0')" style="grid-column: span 2;">0</button>
                            <button class="calc-button" onclick="Calculator.decimal()">.</button>
                            <button class="calc-button" onclick="Calculator.equals()">=</button>
                        </div>
                    </div>
                `;
            
            case 'minesweeper':
                return `
                    <div class="minesweeper-content">
                        <div style="text-align: center; margin-bottom: 8px;">
                            <button onclick="Minesweeper.newGame()" style="border: 1px outset #c0c0c0; background: #c0c0c0; padding: 4px 8px;">New Game</button>
                        </div>
                        <div class="mine-field" id="mine-field">
                            ${this.createMineField()}
                        </div>
                    </div>
                `;
            
            default:
                return '<p>Application content would go here.</p>';
        }
    },
    
    createMineField() {
        let field = '';
        for (let i = 0; i < 64; i++) {
            field += `<div class="mine-cell" onclick="Minesweeper.clickCell(${i})" oncontextmenu="Minesweeper.rightClick(${i}); return false;"></div>`;
        }
        return field;
    },
    
    closeApp(appName) {
        const windowIndex = this.openWindows.findIndex(w => w.id === appName);
        if (windowIndex !== -1) {
            const window = this.openWindows[windowIndex];
            window.element.remove();
            this.openWindows.splice(windowIndex, 1);
            this.removeFromTaskbar(appName);
        }
    },
    
    isAppOpen(appName) {
        return this.openWindows.some(w => w.id === appName);
    },
    
    focusWindow(appName) {
        const window = this.openWindows.find(w => w.id === appName);
        if (window) {
            window.element.style.zIndex = ++this.zIndex;
            this.updateTaskbarActive(appName);
        }
    },
    
    setupWindowControls() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('window-minimize')) {
                // Minimize functionality would go here
                console.log('Minimize clicked');
            }
            if (e.target.classList.contains('window-maximize')) {
                // Maximize functionality would go here
                console.log('Maximize clicked');
            }
        });
    },
    
    makeWindowsDraggable() {
        let isDragging = false;
        let currentWindow = null;
        let offset = { x: 0, y: 0 };
        
        document.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-titlebar') || e.target.classList.contains('window-title')) {
                isDragging = true;
                currentWindow = e.target.closest('.window');
                const rect = currentWindow.getBoundingClientRect();
                offset.x = e.clientX - rect.left;
                offset.y = e.clientY - rect.top;
                currentWindow.style.zIndex = ++this.zIndex;
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging && currentWindow) {
                currentWindow.style.left = (e.clientX - offset.x) + 'px';
                currentWindow.style.top = (e.clientY - offset.y) + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            currentWindow = null;
        });
    },
    
    openProgramGroup(groupName) {
        // For now, just show an alert - could be expanded to show group windows
        alert(`Opening ${groupName} program group...`);
    }
};

const Taskbar = {
    init() {
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', this.showStartMenu);
    },
    
    showStartMenu() {
        alert('Start Menu functionality would be implemented here!');
    }
};

// Calculator Application
const Calculator = {
    display: null,
    currentValue: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
    
    init() {
        this.display = document.querySelector('.calculator-display');
    },
    
    number(digit) {
        if (!this.display) this.init();
        
        if (this.waitingForOperand) {
            this.currentValue = digit;
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? digit : this.currentValue + digit;
        }
        this.updateDisplay();
    },
    
    operation(nextOperation) {
        if (!this.display) this.init();
        
        const inputValue = parseFloat(this.currentValue);
        
        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operation) {
            const currentValue = this.previousValue || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operation);
            
            this.currentValue = String(newValue);
            this.previousValue = newValue;
        }
        
        this.waitingForOperand = true;
        this.operation = nextOperation;
        this.updateDisplay();
    },
    
    calculate(firstOperand, secondOperand, operation) {
        switch (operation) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    },
    
    equals() {
        if (!this.display) this.init();
        
        const inputValue = parseFloat(this.currentValue);
        
        if (this.previousValue !== null && this.operation) {
            const newValue = this.calculate(this.previousValue, inputValue, this.operation);
            this.currentValue = String(newValue);
            this.previousValue = null;
            this.operation = null;
            this.waitingForOperand = true;
            this.updateDisplay();
        }
    },
    
    decimal() {
        if (!this.display) this.init();
        
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    },
    
    clear() {
        if (!this.display) this.init();
        
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    },
    
    clearEntry() {
        if (!this.display) this.init();
        
        this.currentValue = '0';
        this.updateDisplay();
    },
    
    backspace() {
        if (!this.display) this.init();
        
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    },
    
    updateDisplay() {
        this.display.value = this.currentValue;
    }
};

// Minesweeper Game
const Minesweeper = {
    board: [],
    mineCount: 10,
    cellCount: 64,
    gameOver: false,
    
    newGame() {
        this.board = new Array(this.cellCount).fill(0);
        this.gameOver = false;
        this.placeMines();
        this.calculateNumbers();
        this.renderBoard();
    },
    
    placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            const position = Math.floor(Math.random() * this.cellCount);
            if (this.board[position] !== -1) {
                this.board[position] = -1;
                minesPlaced++;
            }
        }
    },
    
    calculateNumbers() {
        for (let i = 0; i < this.cellCount; i++) {
            if (this.board[i] !== -1) {
                this.board[i] = this.countAdjacentMines(i);
            }
        }
    },
    
    countAdjacentMines(position) {
        const row = Math.floor(position / 8);
        const col = position % 8;
        let count = 0;
        
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                    const pos = r * 8 + c;
                    if (this.board[pos] === -1) count++;
                }
            }
        }
        return count;
    },
    
    clickCell(position) {
        if (this.gameOver) return;
        
        const cell = document.querySelectorAll('.mine-cell')[position];
        if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) return;
        
        if (this.board[position] === -1) {
            cell.classList.add('mine');
            cell.textContent = '💣';
            this.gameOver = true;
            alert('Game Over!');
        } else {
            this.revealCell(position);
        }
    },
    
    rightClick(position) {
        if (this.gameOver) return;
        
        const cell = document.querySelectorAll('.mine-cell')[position];
        if (cell.classList.contains('revealed')) return;
        
        cell.classList.toggle('flagged');
        cell.textContent = cell.classList.contains('flagged') ? '🚩' : '';
    },
    
    revealCell(position) {
        const cell = document.querySelectorAll('.mine-cell')[position];
        if (cell.classList.contains('revealed')) return;
        
        cell.classList.add('revealed');
        const value = this.board[position];
        
        if (value > 0) {
            cell.textContent = value;
        } else if (value === 0) {
            // Auto-reveal adjacent cells
            const row = Math.floor(position / 8);
            const col = position % 8;
            
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        const pos = r * 8 + c;
                        this.revealCell(pos);
                    }
                }
            }
        }
    },
    
    renderBoard() {
        const cells = document.querySelectorAll('.mine-cell');
        cells.forEach((cell, index) => {
            cell.className = 'mine-cell';
            cell.textContent = '';
        });
    }
};

// Taskbar Management
WindowManager.addToTaskbar = function(appName) {
    const taskbarPrograms = document.getElementById('taskbar-programs');
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item active';
    taskbarItem.id = `taskbar-${appName}`;
    taskbarItem.textContent = this.getAppTitle(appName);
    taskbarItem.onclick = () => this.focusWindow(appName);
    taskbarPrograms.appendChild(taskbarItem);
};

WindowManager.removeFromTaskbar = function(appName) {
    const taskbarItem = document.getElementById(`taskbar-${appName}`);
    if (taskbarItem) {
        taskbarItem.remove();
    }
};

WindowManager.updateTaskbarActive = function(appName) {
    const allItems = document.querySelectorAll('.taskbar-item');
    allItems.forEach(item => item.classList.remove('active'));
    
    const activeItem = document.getElementById(`taskbar-${appName}`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
};
// Windows 3.1 Application Manager
document.addEventListener('DOMContentLoaded', () => {
    initWindows31();
});

function initWindows31() {
    console.log("Windows 3.1 Experience initialized.");
    
    // Initialize window management
    WindowManager.init();
    
    // Initialize taskbar
    Taskbar.init();
    
    // Set up desktop icons
    setupDesktopIcons();
    
    // Start system clock
    startSystemClock();
    
    // Set up program groups
    setupProgramGroups();
}

function setupDesktopIcons() {
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    
    desktopIcons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appName = icon.getAttribute('data-app');
            WindowManager.openApp(appName);
        });
    });
}

function setupProgramGroups() {
    const programGroups = document.querySelectorAll('.program-group');
    
    programGroups.forEach(group => {
        group.addEventListener('dblclick', () => {
            const groupName = group.getAttribute('data-group');
            WindowManager.openProgramGroup(groupName);
        });
    });
}

function startSystemClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('system-clock').textContent = timeString;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}
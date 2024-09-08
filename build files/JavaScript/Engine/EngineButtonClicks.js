// Layout switching functions
function ScriptEditorClicked() {
    document.getElementById('layout-1').style.display = 'none';
    document.getElementById('layout-2').style.display = 'block';
    initializeEditor(); // Initialize the CodeMirror editor
}

function SceneEditorClicked() {
    document.getElementById('layout-2').style.display = 'none';
    document.getElementById('layout-1').style.display = 'block';
}

function newProject() {
    window.location.href = "Engine.html";
}

// Ensure the Scene Editor is visible on page load
document.getElementById('layout-1').style.display = 'block';
document.getElementById('layout-2').style.display = 'none';

// Menu Sidebar switching

function MenuButtonClicked() {
    const menu = document.querySelector('.menuSlide');
    if (menu) {
        console.log('Menu found');
        if (menu.style.transform === 'translateX(0px)') {
            menu.style.transform = 'translateX(-300px)';
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        } else {
            menu.style.transform = 'translateX(0px)';
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
        }
    } else {
        console.error('Menu element not found');
    }
}

// Quitting the engine
function QuitButtonClicked() {
    window.location.href = '/build files/html/mainMenu.html';
}

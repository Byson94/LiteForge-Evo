// Layout switching functions
function ScriptEditorClicked() {
    document.getElementById('layout-1').style.display = 'none';
    document.getElementById('layout-3').style.display = 'none';
    document.getElementById('layout-2').style.display = 'block';
    initializeEditor();
}

function SceneEditorClicked() {
    document.getElementById('layout-2').style.display = 'none';
    document.getElementById('layout-3').style.display = 'none';
    document.getElementById('layout-1').style.display = 'block';
}

function VisualScriptEditorClicked() {
    document.getElementById('layout-1').style.display = 'none';
    document.getElementById('layout-2').style.display = 'none';
    document.getElementById('layout-3').style.display = 'block';
    // window.location.href="../../html/Engine/BlockyEditor.html"
    initializeBlockyEditor();
}

function SpriteEditorClicked() {
    if (document.getElementById('EditSprites').style.display === 'none') {
        updateAllValues()
        document.getElementById('EditSprites').style.display = 'block';
    } else {
        updateAllValues()
        document.getElementById('EditSprites').style.display = 'none';
    }
}

function SpritePropertiesClicked() {
    if (selectedId) {
    document.getElementById('SpriteManagementPanel').style.display = 'block';
    }
}

function CloseSpriteManagementPanel() {
    document.getElementById('SpriteManagementPanel').style.display = 'none'
}

function CloseObjectEditPanel() {
    document.getElementById('EditSprites').style.display = 'none';
}

function NewObjectButtonClicked() {
    document.getElementById('NewObjectPanel_1').style.display = 'block';
}

function CloseNewObjectPanel() {
    document.getElementById('NewObjectPanel_1').style.display = 'none';
}



function newProject() {
    window.location.href = "Engine.html";
}

// Ensure the Scene Editor is visible on page load
document.getElementById('layout-1').style.display = 'block';
document.getElementById('layout-2', 'layout-3').style.display = 'none';

// Menu Sidebar switching

function MenuButtonClicked() {
    menu = document.querySelector('.menuSlide');
    if (menu) {
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
    window.location.href = '../../html/mainMenu.html';
}

// Clicked export button
function MenuExportButtonClicked() {
    exportButton = document.querySelector('.ExportingTheGame')
    if (exportButton) {
        if (exportButton.style.display === 'none') {
            exportButton.style.display = 'block';
        } else {
            exportButton.style.display = 'none';
        }
    } else {
        console.error('ExportButton element in Menu Bar is not found')
    }
}

// Exporting the game to the users computer
function ExportToPCButtonClicked() {
    VisualScriptEditorClicked()
    SaveToLocalStorage()
    SceneEditorClicked()
    ExportTheGame()
}

// Exporting the game to HTML
function ExportToHTMLButtonClicked() {
    ExportAsHTML()
}

// Importing the game from the users computer
function MenuImportButtonClicked() {
    ImportTheGameClicked()
}
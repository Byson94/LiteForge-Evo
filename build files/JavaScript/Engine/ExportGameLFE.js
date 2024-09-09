// ImportTheGameClicked function
function ImportTheGameClicked() {
    ScriptEditorClicked(); 
    SceneEditorClicked(); 
    if (typeof window.require !== 'undefined') {
        // Running in Electron
        const { dialog } = require('@electron/remote'); // Use @electron/remote for newer Electron versions

        dialog.showOpenDialog({
            filters: [
                { name: 'LFE Files', extensions: ['LFE'] }
            ],
            properties: ['openFile']
        }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
                const filePath = result.filePaths[0];
                console.log('Selected file in Electron:', filePath);
                initializeEditor(); // Ensure CodeMirror is initialized
                processLFEFile(filePath);
            } else {
                console.log('No file selected or cancelled in Electron.');
            }
        }).catch(err => {
            console.error('Error opening file in Electron:', err);
        });
    } else {
        // Running in a web browser
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.LFE';
        
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.name.endsWith('.LFE')) {
                initializeEditor(); // Ensure CodeMirror is initialized
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileContent = e.target.result;
                    processLFEFileContent(fileContent); // Call the function here
                };
                reader.readAsArrayBuffer(file); // Read as ArrayBuffer for ZIP extraction
            } else {
                alert('Please select a .LFE file.');
            }
        });

        fileInput.click();
    }
}

// Function to process LFE file content
async function processLFEFileContent(fileContent) {
    try {
        // Parse LFE content to JSON
        const zip = await JSZip.loadAsync(fileContent);

        // Extract gameData.json and script.js
        const gameDataFile = zip.file('gameData.json');
        const scriptFile = zip.file('script.js');

        if (!gameDataFile || !scriptFile) {
            throw new Error('Missing gameData.json or script.js in the ZIP file.');
        }

        const gameData = JSON.parse(await gameDataFile.async('text'));
        const jsCode = await scriptFile.async('text');

        // Set CodeMirror content
        setEditorContent(jsCode);

        // Create images on the canvas and rectangles in the sidebar
        if (Array.isArray(gameData.images)) {
            await createImagesFromJSON(zip, gameData.images); // Pass the zip object
        } else {
            console.error('Invalid images array in JSON data.');
        }
    } catch (error) {
        console.error('Error processing LFE file:', error);
    }
}

// Function to process LFE file path (for Electron)
function processLFEFile(filePath) {
    const fs = require('fs');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        processLFEFileContent(data);
    });
}

// Function to set CodeMirror editor content
function setEditorContent(jsCode) {
    if (codeMirrorEditor) {
        if (typeof jsCode === 'string') {
            codeMirrorEditor.setValue(jsCode);
        } else {
            console.error('Invalid code content for CodeMirror.');
        }
    } else {
        console.error('CodeMirror editor instance is not initialized.');
    }
}

// Function to create images from JSON and rectangles in the sidebar
async function createImagesFromJSON(zip, images) {
    const canvas = document.querySelector('.gameCanvas');
    const objectPanel = document.querySelector('.slide');
    if (canvas && objectPanel) {
        for (const image of images) {
            if (image.id) {
                try {
                    const imageFile = zip.file(`sprites/${image.id}.png`);
                    if (imageFile) {
                        const blob = await imageFile.async('blob');
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(blob); // Use URL.createObjectURL for image blob
                        img.id = image.id; // Set image ID from gameData
                        img.style.width = `${image.width}px`;
                        img.style.height = `${image.height}px`;
                        img.style.position = 'absolute';
                        img.style.left = `${image.left}px`;
                        img.style.top = `${image.top}px`;
                        img.style.transform = 'translate(-50%, -50%)';
                        img.style.outline = 'none';
                        
                        canvas.appendChild(img);
                        
                        img.addEventListener('dragstart', (e) => e.preventDefault());
                        img.addEventListener('mousedown', onMouseDown);
                        
                        // Create and add a rectangle box to the sidebar
                        addRectangleBox(image.id);
                    } else {
                        console.error(`Image file for ID ${image.id} not found in ZIP.`);
                    }
                } catch (error) {
                    console.error(`Error processing image with ID ${image.id}:`, error);
                }
            } else {
                console.error('Invalid image data in JSON.');
            }
        }
    } else {
        console.error('Canvas or object panel element not found.');
    }
}

// Function to create and add a rectangle box to the sidebar
function addRectangleBox(name) {
    const objectPanel = document.querySelector('.slide');
    
    // Create a new div element for the rectangle box
    const box = document.createElement('div');
    box.classList.add('rectangle-box');
    
    // Add the name of the sprite as text
    const label = document.createElement('span');
    label.textContent = name;
    box.appendChild(label);
    
    // Append the rectangle box to the object panel
    objectPanel.appendChild(box);
}

// Initialize CodeMirror editor only when Script Editor is clicked
let codeMirrorEditor = null;
let editorInitialized = false;

function initializeEditor() {
    if (!editorInitialized) {
        codeMirrorEditor = CodeMirror(document.getElementById('editor'), {
            mode: 'javascript',
            lineNumbers: true,
            theme: '3024-night',
            indentUnit: 4,
            tabSize: 4,
            autofocus: true
        });

        // Set the height dynamically
        codeMirrorEditor.getWrapperElement().style.height = '550px'; // Set desired height here

        // Optionally, set some default content
        codeMirrorEditor.setValue(`// Write your JavaScript code here\nconsole.log('Hello, world!');`);
        editorInitialized = true;
    }
}

// Variables for dragging
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Event handler for mouse down
function onMouseDown(e) {
    draggedElement = e.target;
    const rect = draggedElement.getBoundingClientRect();
    
    // Calculate the offset from the center of the image to the cursor
    offsetX = e.clientX - (rect.left + rect.width / 2);
    offsetY = e.clientY - (rect.top + rect.height / 2);
    
    // Change cursor style
    document.body.style.cursor = 'move';
    
    // Add mousemove and mouseup event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

// Event handler for mouse move
function onMouseMove(e) {
    if (draggedElement) {
        const canvas = document.querySelector('.gameCanvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        // Calculate new position
        let newLeft = e.clientX - canvasRect.left - offsetX;
        let newTop = e.clientY - canvasRect.top - offsetY;

        // Constrain the new position within the canvas boundaries
        newLeft = Math.max(25, Math.min(newLeft, canvasRect.width - draggedElement.offsetWidth));
        newTop = Math.max(25, Math.min(newTop, canvasRect.height - draggedElement.offsetHeight));

        // Update image position
        draggedElement.style.left = `${newLeft}px`;
        draggedElement.style.top = `${newTop}px`;
    }
}

// Event handler for mouse up
function onMouseUp() {
    draggedElement = null;
    offsetX = 0;
    offsetY = 0;
    
    // Reset cursor style
    document.body.style.cursor = 'auto';
    
    // Remove mousemove and mouseup event listeners
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

// Initialize the resizer functionality
const resizer = document.querySelector(".resizer");
const sidebar = document.querySelector(".slide");
const button = document.querySelector("button");

function initResizer() {
    let startX, startWidth;

    function onMouseDown(e) {
        startX = e.clientX;
        startWidth = sidebar.offsetWidth;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
        const newWidth = startWidth - (e.clientX - startX);
        if (newWidth > 100 && newWidth < 500) {
            sidebar.style.width = `${newWidth}px`;
            button.style.width = `calc(${newWidth}px - 18px)`; // Adjust button width to reach till the drag bar
        }
    }

    function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    resizer.addEventListener("mousedown", onMouseDown);
}

initResizer();

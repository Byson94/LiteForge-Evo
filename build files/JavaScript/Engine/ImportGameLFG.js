// ImportTheGameClicked function
function ImportTheGameClicked() {
    ScriptEditorClicked() 
    SceneEditorClicked()
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
                reader.readAsText(file);
            } else {
                alert('Please select a .LFE file.');
            }
        });

        fileInput.click();
    }
}

// Function to process LFE file content
function processLFEFileContent(fileContent) {
    try {
        // Parse LFE content to JSON
        const jsonData = parseLFEToJSON(fileContent);

        // Debugging: Check the parsed JSON data
        console.log('Parsed JSON Data:', jsonData);

        // Check if jsCode is defined and a string
        if (typeof jsonData.jsCode === 'string') {
            // Set CodeMirror content
            setEditorContent(jsonData.jsCode);
        } else {
            console.error('Invalid JavaScript code content in JSON data.');
        }

        // Create images on the canvas
        if (Array.isArray(jsonData.images)) {
            createImagesFromJSON(jsonData.images);
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
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        processLFEFileContent(data);
    });
}

// Function to parse LFE content to JSON
function parseLFEToJSON(lfeContent) {
    try {
        return JSON.parse(lfeContent);
    } catch (error) {
        throw new Error('Failed to parse LFE content to JSON.');
    }
}

// Function to set CodeMirror editor content
function setEditorContent(jsCode) {
    if (codeMirrorEditor) {
        // Check if jsCode is a string
        if (typeof jsCode === 'string') {
            codeMirrorEditor.setValue(jsCode);
        } else {
            console.error('Invalid code content for CodeMirror.');
        }
    } else {
        console.error('CodeMirror editor instance is not initialized.');
    }
}

// Function to create images from JSON
function createImagesFromJSON(images) {
    const canvas = document.querySelector('.gameCanvas');
    if (canvas) {
        images.forEach(image => {
            if (image.dataURL) {
                const img = document.createElement('img');
                img.src = image.dataURL; // Assuming the image data is a Data URL
                img.id = image.name;
                img.style.width = '50px'; // Adjust size as needed
                img.style.height = '50px'; // Adjust size as needed
                img.style.position = 'absolute';
                img.style.left = `${image.x}px`;
                img.style.top = `${image.y}px`;
                img.style.transform = 'translate(-50%, -50%)';
                img.style.outline = 'none';
                
                canvas.appendChild(img);
                
                img.addEventListener('dragstart', (e) => e.preventDefault());
                img.addEventListener('mousedown', onMouseDown);
            } else {
                console.error('Invalid image data in JSON.');
            }
        });
    } else {
        console.error('Canvas element not found.');
    }
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

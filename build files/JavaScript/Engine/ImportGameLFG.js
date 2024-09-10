// ImportTheGameClicked function
function ImportTheGameClicked() {
    ScriptEditorClicked(); 
    SceneEditorClicked(); 
    if (typeof window.require !== 'undefined') {
        // Running in Electron
        const { dialog } = require('@electron/remote'); // Use @electron/remote for newer Electron versions

        dialog.showOpenDialog({
            filters: [
                { name: 'LFE or ZIP Files', extensions: ['LFE', 'zip'] }
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
        fileInput.accept = '.LFE, .zip';
        
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && (file.name.endsWith('.LFE') || file.name.endsWith('.zip'))) {
                initializeEditor(); // Ensure CodeMirror is initialized
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileContent = e.target.result;
                    processLFEFileContent(fileContent); // Call the function here
                };
                reader.readAsArrayBuffer(file); // Read as ArrayBuffer for ZIP extraction
            } else {
                alert('Please select a .LFE or a .zip file.');
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

        // Create images and rectangle boxes on the canvas
        if (Array.isArray(gameData.images)) {
            await createImagesFromJSON(zip, gameData.images); // Pass the zip object
            createRectangleBoxes(gameData.images); // Create rectangle boxes
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

// Function to create images and add rectangle boxes from JSON
async function createImagesFromJSON(zip, images) {
    const canvas = document.querySelector('.gameCanvas');
    if (canvas) {
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
        console.error('Canvas element not found.');
    }
}

// Function to create rectangle boxes from image data
function createRectangleBoxes(images) {
    const objectPanel = document.querySelector('.slide');
    if (objectPanel) {
        for (const image of images) {
            if (image.id) {
                const box = document.createElement('div');
                box.classList.add('rectangle-box');
                
                const label = document.createElement('span');
                label.textContent = image.id;
                box.appendChild(label);
                
                // Add event listener to link box to corresponding image
                box.addEventListener('click', () => {
                    selectImageById(image.id);
                });
                
                objectPanel.appendChild(box);
            } else {
                console.error('Invalid image data in JSON.');
            }
        }
    } else {
        console.error('Object panel element not found.');
    }
}

// Function to select an image by ID
function selectImageById(imageId) {
    const canvas = document.querySelector('.gameCanvas');
    if (canvas) {
        const img = document.getElementById(imageId);
        if (img) {
            img.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.error(`Image with ID ${imageId} not found.`);
        }
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

// Function to handle importing game data
function ImportTheGameClicked() {
    openScriptEditor(); 
    openSceneEditor(); 

    if (typeof window.require !== 'undefined') {
        // Running in Electron
        const { dialog } = require('@electron/remote');

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

        // Extract gameData.json, script.js, and blocklyWorkspace.xml
        const gameDataFile = zip.file('gameData.json');
        const scriptFile = zip.file('script.js');
        const blocklyFile = zip.file('blocklyWorkspace.xml');

        if (!gameDataFile || !scriptFile || !blocklyFile) {
            throw new Error('Missing gameData.json, script.js, or blocklyWorkspace.xml in the ZIP file.');
        }

        const gameData = JSON.parse(await gameDataFile.async('text'));
        const jsCode = await scriptFile.async('text');
        const blocklyXml = await blocklyFile.async('text');

        // Store the blocklyWorkspace XML to localStorage
        localStorage.setItem('blocklyWorkspace', blocklyXml);
        console.log('Blockly workspace loaded and saved to localStorage.');

        // Call VisualScriptEditorClicked and then load from localStorage
        loadFromLocalStorage();
        openSceneEditor();

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
                        const imgElement = document.createElement('img');
                        imgElement.src = URL.createObjectURL(blob);
                        imgElement.id = image.id;
                        imgElement.style.width = `${image.width}px`;
                        imgElement.style.height = `${image.height}px`;
                        imgElement.style.position = 'absolute';
                        imgElement.style.left = `${image.left}px`;
                        imgElement.style.top = `${image.top}px`;
                        imgElement.style.transform = 'translate(-50%, -50%)';
                        imgElement.style.outline = 'none';
                        
                        canvas.appendChild(imgElement);
                        
                        // Add dragging functionality to the image
                        addDraggableFunctionality(imgElement);
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

// Function to add draggable functionality to an image
function addDraggableFunctionality(imgElement) {
    // Prevent default drag behavior for images
    imgElement.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Make the image draggable
    imgElement.addEventListener('mousedown', onElementMouseDown);
    imgElement.addEventListener('touchstart', onElementTouchStart);
}

// Function to remove image from parent
function removeImage(imageIDrecieved) {
    const parentElement = document.querySelector('.gameCanvas');
    const object = imageIDrecieved.replace(/\.[^/.]+$/, "");

    if (!parentElement) {
        console.error('Canvas element not found.');
        return;
    }
        const imgElement = document.getElementById(object);

        if (imgElement) {
            imgElement.remove();
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

                // Create and add the delete button
                const deleteButton = document.createElement('span');
                deleteButton.textContent = "x";
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this sprite?')) {
                        box.remove();
                        removeImage(image.id);
                    }
                });

                box.appendChild(label);
                box.appendChild(deleteButton);
                
                objectPanel.appendChild(box);
            } else {
                console.error('Invalid image data in JSON.');
            }
        }
    } else {
        console.error('Object panel element not found.');
    }
}

// Variables for dragging
let currentlyDraggedElement = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Event handler for mouse down
function onElementMouseDown(e) {
    e.preventDefault();
    
    currentlyDraggedElement = e.target;
    const rect = currentlyDraggedElement.getBoundingClientRect();
    
    dragOffsetX = e.clientX - (rect.left + rect.width / 2);
    dragOffsetY = e.clientY - (rect.top + rect.height / 2);
    
    document.body.style.cursor = 'move';
    
    document.addEventListener('mousemove', onElementMouseMove);
    document.addEventListener('mouseup', onElementMouseUp);
    document.addEventListener('touchmove', onElementTouchMove);
    document.addEventListener('touchend', onElementTouchEnd);
}

// Event handler for mouse move
function onElementMouseMove(e) {
    if (currentlyDraggedElement) {
        const canvas = document.querySelector('.gameCanvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        const clientX = e.clientX;
        const clientY = e.clientY;
        let newLeft = clientX - canvasRect.left - dragOffsetX;
        let newTop = clientY - canvasRect.top - dragOffsetY;

        newLeft = Math.max(25, Math.min(newLeft, canvasRect.width - currentlyDraggedElement.offsetWidth));
        newTop = Math.max(25, Math.min(newTop, canvasRect.height - currentlyDraggedElement.offsetHeight));

        currentlyDraggedElement.style.left = `${newLeft}px`;
        currentlyDraggedElement.style.top = `${newTop}px`;
    }
}

// Event handler for mouse up
function onElementMouseUp(e) {
    if (currentlyDraggedElement) {
        document.body.style.cursor = 'default';
        currentlyDraggedElement = null;
        document.removeEventListener('mousemove', onElementMouseMove);
        document.removeEventListener('mouseup', onElementMouseUp);
        document.removeEventListener('touchmove', onElementTouchMove);
        document.removeEventListener('touchend', onElementTouchEnd);
    }
}

// Event handler for touch start
function onElementTouchStart(e) {
    e.preventDefault();
    
    // Use the first touch point for positioning
    const touch = e.touches[0];
    currentlyDraggedElement = touch.target;
    const rect = currentlyDraggedElement.getBoundingClientRect();
    
    dragOffsetX = touch.clientX - (rect.left + rect.width / 2);
    dragOffsetY = touch.clientY - (rect.top + rect.height / 2);
    
    document.body.style.cursor = 'move';
    
    document.addEventListener('touchmove', onElementTouchMove);
    document.addEventListener('touchend', onElementTouchEnd);
}

// Event handler for touch move
function onElementTouchMove(e) {
    if (currentlyDraggedElement) {
        const touch = e.touches[0];
        const canvas = document.querySelector('.gameCanvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        const clientX = touch.clientX;
        const clientY = touch.clientY;
        let newLeft = clientX - canvasRect.left - dragOffsetX;
        let newTop = clientY - canvasRect.top - dragOffsetY;

        newLeft = Math.max(25, Math.min(newLeft, canvasRect.width - currentlyDraggedElement.offsetWidth));
        newTop = Math.max(25, Math.min(newTop, canvasRect.height - currentlyDraggedElement.offsetHeight));

        currentlyDraggedElement.style.left = `${newLeft}px`;
        currentlyDraggedElement.style.top = `${newTop}px`;
    }
}

// Event handler for touch end
function onElementTouchEnd(e) {
    if (currentlyDraggedElement) {
        document.body.style.cursor = 'default';
        currentlyDraggedElement = null;
        document.removeEventListener('touchmove', onElementTouchMove);
        document.removeEventListener('touchend', onElementTouchEnd);
    }
}

// Placeholder functions
function openScriptEditor() {
    // Your implementation here
}

function openSceneEditor() {
    // Your implementation here
}

function initializeEditor() {
    // Your implementation here
}

function loadFromLocalStorage() {
    // Your implementation here
}

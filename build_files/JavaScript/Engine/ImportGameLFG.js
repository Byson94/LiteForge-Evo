let selectedImageId = null; // Variable to store the ID of the currently selected image

// Function to handle importing game data
async function ImportTheGameClicked() {
    ScriptEditorClicked(); 

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
        // Clear Konva canvas and associated rectangle boxes
        clearKonvaCanvas();

        // Clear Blockly workspace before loading new content
        clearBlocklyWorkspace();

        // Clear CodeMirror content before setting new content
        clearCodeMirror();

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

        // Load Blockly workspace from localStorage
        loadFromLocalStorage();

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

// Function to clear Konva canvas and associated rectangle boxes
function clearKonvaCanvas() {
    // Clear Konva canvas
    const stage = document.querySelector('.gameCanvas').__konvaStage;
    if (stage) {
        const layer = stage.findOne('Layer');
        if (layer) {
            layer.destroyChildren(); // Remove all children from the layer
            layer.draw(); // Redraw the layer
        } else {
            console.error('Konva layer not found.');
        }
    } else {
        console.error('Konva stage not found.');
    }

    // Clear rectangle boxes while preserving the "Object Panel" heading
    const objectPanel = document.querySelector('.slide');
    if (objectPanel) {
        const rectangleBoxes = objectPanel.querySelectorAll('.rectangle-box');
        rectangleBoxes.forEach(box => box.remove()); // Remove only the rectangle boxes
    } else {
        console.error('Object panel element not found.');
    }
}

// Function to clear Blockly workspace
function clearBlocklyWorkspace() {
    if (Blockly && Blockly.getMainWorkspace) {
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
            workspace.clear(); // Clear the Blockly workspace
        } else {
            console.error('Blockly workspace not found.');
        }
    } else {
        console.error('Blockly not defined or getMainWorkspace not available.');
    }
}

// Function to clear CodeMirror content
function clearCodeMirror() {
    if (codeMirrorEditor) {
        codeMirrorEditor.setValue(''); // Clear the CodeMirror content
    } else {
        console.error('CodeMirror editor instance is not initialized.');
    }
}

// Function to set CodeMirror editor content
function setEditorContent(jsCode) {
    if (codeMirrorEditor) {
        if (typeof jsCode === 'string') {
            clearCodeMirror(); // Clear CodeMirror content before setting new content
            codeMirrorEditor.setValue(jsCode);
            SceneEditorClicked();
        } else {
            console.error('Invalid code content for CodeMirror.');
        }
    } else {
        console.error('CodeMirror editor instance is not initialized.');
    }
}

// Function to create images and add rectangle boxes from JSON
async function createImagesFromJSON(zip, images) {
    changeSelectedObjectText()
    const stage = document.querySelector('.gameCanvas').__konvaStage;
    const layer = stage.findOne('Layer');

    if (stage && layer) {
        for (const image of images) {
            if (image.id) {
                try {
                    const imageFile = zip.file(`sprites/${image.id}.png`);
                    if (imageFile) {
                        const blob = await imageFile.async('blob');
                        const imgElement = new Image();
                        imgElement.src = URL.createObjectURL(blob);

                        imgElement.onload = function() {
                            const konvaImage = new Konva.Image({
                                image: imgElement,
                                id: image.id,
                                x: image.left,
                                y: image.top,
                                width: image.width,
                                height: image.height,
                                offsetX: image.width / 2,
                                offsetY: image.height / 2,
                                draggable: true // Make draggable
                            });

                            // Add event listeners to the konvaImage
                            konvaImage.on('mouseover', function() {
                                if (selectedImageId === null || selectedImageId === konvaImage.id()) {
                                    document.body.style.cursor = 'grab'; // Change cursor to 'grab' when hovering over the image
                                    changeSelectedObjectText()
                                }
                            });

                            konvaImage.on('mouseout', function() {
                                if (selectedImageId !== konvaImage.id()) {
                                    changeSelectedObjectText()
                                    document.body.style.cursor = 'auto'; // Reset cursor to default when not hovering
                                    changeSelectedObjectText()
                                }
                            });

                            konvaImage.on('dragmove', function() {
                                document.body.style.cursor = 'grabbing'; // Change cursor to 'grabbing' during drag
                                changeSelectedObjectText()
                            });

                            konvaImage.on('dragend', function() {
                                document.body.style.cursor = 'auto'; // Reset cursor to default when dragging ends
                                changeSelectedObjectText()
                            });

                            // Handle click event to select the image
                            konvaImage.on('click', function(e) {
                                e.cancelBubble = true; // Prevent click event from propagating to the stage

                                // Deselect previous selection
                                deselectImage();

                                // Select the clicked image
                                selectedId = konvaImage.id(); // Save the selected image's ID
                                konvaImage.stroke('red'); // Highlight the selected image with red outline
                                konvaImage.strokeWidth(5); // Adjust outline thickness
                                konvaImage.getLayer().batchDraw(); // Redraw the layer to apply changes
                                changeSelectedObjectText()
                                updateAllValues()
                            });

                            layer.add(konvaImage);
                            layer.draw();
                        };
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
        console.error('Konva stage or layer not found.');
    }
    changeSelectedObjectText()
    updateAllValues()
}

// Function to remove sprite by ID
function removeSpriteById(spriteId) {
    const stage = document.querySelector('.gameCanvas').__konvaStage;
    const layer = stage.findOne('Layer');

    if (stage && layer) {
        const sprite = layer.findOne(`#${spriteId}`);
        if (sprite) {
            sprite.destroy(); // Remove the Konva image
            layer.draw(); // Update the layer
        } else {
            console.error(`Sprite with ID ${spriteId} not found.`);
        }
    } else {
        console.error('Konva stage or layer not found.');
    }
    changeSelectedObjectText()
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

                const deleteButton = document.createElement('span');
                deleteButton.textContent = 'x';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this sprite?')) {
                        // Remove from Konva
                        removeSpriteById(image.id);

                        // Remove from UI
                        box.remove();
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
    changeSelectedObjectText()
    updateAllValues()
}

// Function to deselect the currently selected image
function deselectImage() {
    const stage = document.querySelector('.gameCanvas').__konvaStage;
    const layer = stage.findOne('Layer');

    if (stage && layer) {
        if (selectedId) {
            const selectedImage = layer.findOne(`#${selectedId}`);
            if (selectedImage) {
                selectedImage.stroke(null); // Remove the outline
                selectedImage.strokeWidth(0); // Reset outline thickness
                layer.batchDraw(); // Redraw the layer to apply changes
                selectedImageId = null; // Clear the selected image ID
            }
        }
    } else {
        console.error('Konva stage or layer not found.');
    }
    changeSelectedObjectText()
    updateAllValues()
}

function NewSpritebuttonclicked() {
    if (typeof window.require !== 'undefined') {
        // Electron environment
        const { dialog } = require('@electron/remote');

        dialog.showOpenDialog({
            filters: [
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] }
            ],
            properties: ['openFile']
        }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
                const filePath = result.filePaths[0];
                // You may want to handle filePath here if needed
            } else {
                console.log('No file selected or cancelled in Electron.');
            }
        }).catch(err => {
            console.error('Error opening file in Electron:', err);
        });
    } else {
        // Web environment
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Accept only image files
        fileInput.style.display = 'none'; // Hide the file input

        // Append the file input to the body
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', function(event) {
            const fileInput = event.target;
            const files = fileInput.files;
            if (files.length > 0) {
                for (const file of files) {
                    if (file.type.startsWith('image/')) {
                        // Get the file name and remove the extension
                        const fileName = file.name.replace(/\.[^/.]+$/, "");

                        // Generate a unique name
                        const uniqueName = getUniqueName(fileName);

                        // Create and add the sprite to the game canvas
                        addSpriteToCanvas(file, uniqueName);
                    }
                }
            }

            // Remove the file input element after use
            fileInput.remove();
        });

        // Trigger a click on the file input to open the file dialog
        fileInput.click();
    }
}

// Counter to handle unique name generation
let nameCounter = 1;

// Function to generate a unique name for new objects
function getUniqueName(baseName) {
    const objectPanel = document.querySelector('.slide');
    let newName = baseName;

    // Function to check if the name already exists
    function nameExists(name) {
        const existingBoxes = objectPanel.querySelectorAll('.rectangle-box span');
        for (const span of existingBoxes) {
            if (span.textContent === name) {
                return true;
            }
        }
        return false;
    }

    // Check if the name already exists and append a number if it does
    while (nameExists(newName)) {
        newName = `${baseName}_${nameCounter}`; // Append counter
        nameCounter++;
    }

    return newName;
}

// Function to create and add a rectangle box to the sidebar
function addRectangleBox(name, spriteId) {
    const objectPanel = document.querySelector('.slide');

    // Create a new div element for the rectangle box
    const box = document.createElement('div');
    box.classList.add('rectangle-box');
    box.dataset.spriteId = `${spriteId}.`; // Append a dot to the sprite ID

    // Create and add the name of the sprite
    const label = document.createElement('span');
    label.textContent = name;

    // Create and add the delete button
    const deleteButton = document.createElement('span');
    deleteButton.textContent = 'x';
    deleteButton.classList.add('delete-button'); // Add a class for styling
    deleteButton.addEventListener('click', () => {
        // Show a confirmation dialog
        if (confirm('Are you sure you want to delete this sprite?')) {
            // Remove the box
            box.remove();

            // Remove the associated sprite from the canvas
            removeSpriteById(spriteId);
        }
    });

    // Append the label and delete button to the box
    box.appendChild(label);
    box.appendChild(deleteButton);

    // Append the rectangle box to the object panel
    objectPanel.appendChild(box);
}

// Function to update cursor styles and outline
function updateCursorAndOutline(image, isDragging) {
    if (isDragging) {
        document.body.style.cursor = 'grabbing'; // Change cursor to 'grabbing' during drag
    } else if (selectedId === image.id()) {
        document.body.style.cursor = 'auto'; // Change cursor to 'auto' when hovering over selected image
    } else {
        document.body.style.cursor = 'grab'; // Change cursor to 'grab' when hovering over unselected image
    }

    // Update outline for the selected image
    if (selectedId === image.id()) {
        image.stroke('red');
        image.strokeWidth(5); // Adjust the thickness of the outline here
    } else {
        image.stroke(null); // Remove outline from other images
    }
    image.getLayer().batchDraw(); // Redraw the layer to apply changes
    changeSelectedObjectText()
    updateAllValues()
}

// Function to reset cursor style
function resetCursor() {
    document.body.style.cursor = 'auto'; // Reset cursor to default
}

// Function to handle deselection of an image
function deselectImage() {
    changeSelectedObjectText()
    if (selectedId) {
        const stage = document.querySelector('.gameCanvas').__konvaStage;
        const layer = stage.findOne('Layer');
        if (layer) {
            const selectedImage = layer.findOne(`#${selectedId}`);
            if (selectedImage) {
                selectedImage.stroke(null); // Remove the red outline
                selectedImage.getLayer().batchDraw(); // Redraw the layer to apply changes
            }
        }
        selectedId = null; // Clear the selected ID
        resetCursor(); // Reset cursor when deselecting
    }
    changeSelectedObjectText()
    updateAllValues()
}

// Function to create and add a sprite to the game canvas
function addSpriteToCanvas(file, name) {
    changeSelectedObjectText()
    const canvas = document.querySelector('.gameCanvas');
    const stage = canvas.__konvaStage; // Retrieve the Konva stage from the canvas element

    if (!stage) {
        console.error('Konva stage not found.');
        return;
    }

    const layer = stage.findOne('Layer');
    if (!layer) {
        console.error('Konva layer not found.');
        return;
    }

    // Generate a unique name for the sprite
    const spriteId = getUniqueName(name.replace(/\.[^/.]+$/, "").trim().replace(/\s+/g, '_'));

    // Create a new Konva Image node
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = function() {
        const konvaImage = new Konva.Image({
            image: image,
            id: spriteId, // Use sanitized ID
            x: stage.width() / 2,
            y: stage.height() / 2,
            width: 50,
            height: 50,
            offsetX: 25,
            offsetY: 25,
            draggable: true
        });

        // Add the Konva image to the layer
        layer.add(konvaImage);
        layer.draw();

        // Handle click or touch event to select the image
        konvaImage.on('click touchstart', function(e) {
            // Prevent the event from propagating to the stage
            e.cancelBubble = true;

            // Deselect previous selection
            deselectImage();

            // Select the clicked image
            selectedId = konvaImage.id(); // Save the selected item's ID
            updateCursorAndOutline(konvaImage, false); // Update the outline
            changeSelectedObjectText();
            updateAllValues();
        });

        // Handle mouseover
        konvaImage.on('mouseover', function() {
            if (selectedId === null || selectedId === konvaImage.id()) {
                updateCursorAndOutline(konvaImage, false);
                changeSelectedObjectText()
                updateAllValues()
            }
        });

        // Handle mouseout
        konvaImage.on('mouseout', function() {
            if (selectedId !== konvaImage.id()) {
                resetCursor();
                changeSelectedObjectText()
                updateAllValues()
            }
        });

        // Handle dragstart
        konvaImage.on('dragstart', function() {
            updateCursorAndOutline(konvaImage, true);
            changeSelectedObjectText()
        });

        // Handle dragend
        konvaImage.on('dragend', function() {
            resetCursor();
            updateCursorAndOutline(konvaImage, false);
            changeSelectedObjectText()
        });

        // Handle click event to select the image
        konvaImage.on('click', function(e) {
            // Prevent the click event from propagating to the stage
            e.cancelBubble = true;

            // Deselect previous selection
            deselectImage();

            // Select the clicked image
            selectedId = konvaImage.id(); // Save the selected item's ID
            updateCursorAndOutline(konvaImage, false); // Update the outline
            changeSelectedObjectText()
            updateAllValues()
        });
    };

    // Add the rectangle box with the unique name to the sidebar
    addRectangleBox(spriteId, spriteId);
}

// Initialize Konva on page load
document.addEventListener('DOMContentLoaded', () => {
    changeSelectedObjectText()
    initializeKonva();

    // Add a click listener to the stage to handle clicks on empty space
    const canvas = document.querySelector('.gameCanvas');
    const stage = canvas.__konvaStage;
    if (stage) {
        stage.on('click', function(e) {
            // Deselect if the click was on empty space
            if (e.target === stage) {
                deselectImage();
            }
        });
    }
});

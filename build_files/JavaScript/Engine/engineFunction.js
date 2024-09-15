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
                        
                        // Create and add a rectangle box with the unique name
                        addRectangleBox(uniqueName, file.name);
                        
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

// Function to generate a unique name for new objects
function getUniqueName(baseName) {
    const objectPanel = document.querySelector('.slide');
    let newName = baseName;
    let counter = 1;

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
        newName = `${baseName}${counter}`; // Append counter
        counter++;
    }

    return newName;
}

// Function to remove a sprite from the canvas by its ID
function removeSpriteById(spriteId) {
    const canvas = document.querySelector('.gameCanvas');
    const image = spriteId.replace(/\.[^/.]+$/, "");
    
    if (!canvas) {
        console.error('Canvas element not found.');
        return;
    }
    
    // Find the image with the matching ID and remove it
    const sprite = document.getElementById(image);
    if (sprite) {
        sprite.remove();
    }
}


// IMPORTANT (FOR ME) (ABOVE AND BELOW)
// Function to create and add a rectangle box to the sidebar
function addRectangleBox(name, spriteId) {
    const objectPanel = document.querySelector('.slide');
    
    // Create a new div element for the rectangle box
    const box = document.createElement('div');
    box.classList.add('rectangle-box');
    box.dataset.spriteId = spriteId; // Store the sprite ID in a data attribute
    
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

// Function to create and add a sprite to the game canvas
function addSpriteToCanvas(file, name) {
    const canvas = document.querySelector('.gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found.');
        return;
    }
    
    // Create an image element
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file); // Set the image source to the file
    img.id = name;
    objectArray.push([name, name + arraycounter]);
    arraycounter++
    img.style.width = '50px'; // Set the width to 50px
    img.style.height = '50px'; // Set the height to 50px
    img.style.position = 'absolute'; // Position it absolutely for centering
    img.style.left = '50%'; // Center horizontally
    img.style.top = '50%'; // Center vertically
    img.style.transform = 'translate(-50%, -50%)'; // Center the image based on its own size
    img.style.outline = 'none'; // Remove default outline
    
    // Append the image to the canvas
    canvas.appendChild(img);
    
    // Enable the default drag behavior for images
    img.addEventListener('dragstart', (e) => e.preventDefault(),); // Prevent default image dragging behavior
    
    // Make the image draggable with custom functionality
    img.addEventListener('mousedown', onStart,);
    img.addEventListener('touchstart', onStart,);
}

// Variables for dragging
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Event handler for mouse down and touch start
function onStart(e) {
    e.preventDefault(); // Prevent the default action (e.g., scrolling on touch devices)
    
    draggedElement = e.target;
    const rect = draggedElement.getBoundingClientRect();
    
    // Calculate the offset from the center of the image to the cursor or touch point
    offsetX = (e.type === 'mousedown' ? e.clientX : e.touches[0].clientX) - (rect.left + rect.width / 2);
    offsetY = (e.type === 'mousedown' ? e.clientY : e.touches[0].clientY) - (rect.top + rect.height / 2);
    
    // Change cursor style
    document.body.style.cursor = 'move';
    
    // Add mousemove and mouseup/touchmove and touchend event listeners
    document.addEventListener('mousemove', onMove,);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove,);
    document.addEventListener('touchend', onEnd);
}


// Event handler for mouse move and touch move
function onMove(e) {
    if (draggedElement) {
        const canvas = document.querySelector('.gameCanvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        // Calculate new position
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        let newLeft = clientX - canvasRect.left - offsetX;
        let newTop = clientY - canvasRect.top - offsetY;

        // Constrain the new position within the canvas boundaries
        newLeft = Math.max(25, Math.min(newLeft, canvasRect.width - draggedElement.offsetWidth));
        newTop = Math.max(25, Math.min(newTop, canvasRect.height - draggedElement.offsetHeight));

        // Update image position
        draggedElement.style.left = `${newLeft}px`;
        draggedElement.style.top = `${newTop}px`;
    }
}

// Event handler for mouse up and touch end
function onEnd() {
    draggedElement = null;
    offsetX = 0;
    offsetY = 0;
    
    // Reset cursor style
    document.body.style.cursor = 'auto';
    
    // Remove mousemove, mouseup, touchmove, and touchend event listeners
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
}

// Initialize draggable images
document.addEventListener('DOMContentLoaded', () => {
    // No additional initialization needed here unless there are other setup tasks
});
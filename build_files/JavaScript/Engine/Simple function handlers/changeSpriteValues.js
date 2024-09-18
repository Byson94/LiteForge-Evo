// Attach input event listeners
document.getElementById('spriteXInput').addEventListener('input', updateSpriteX);
document.getElementById('spriteYInput').addEventListener('input', updateSpriteY);
document.getElementById('spriteWidthInput').addEventListener('input', updateSpriteWidth);
document.getElementById('spriteHeightInput').addEventListener('input', updateSpriteHeight);

function updateSpriteX() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            const newX = parseFloat(document.getElementById('spriteXInput').value);
            sprite.x(newX);
            sprite.getLayer().draw();
        }
    }
}

function updateSpriteY() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            const newY = parseFloat(document.getElementById('spriteYInput').value);
            sprite.y(newY);
            sprite.getLayer().draw();
        }
    }
}

function updateSpriteWidth() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            const newWidth = parseFloat(document.getElementById('spriteWidthInput').value);
            sprite.width(newWidth);
            sprite.offsetX(newWidth / 2); 
            sprite.getLayer().batchDraw();
        }
    }
}

function updateSpriteHeight() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            const newHeight = parseFloat(document.getElementById('spriteHeightInput').value);
            sprite.height(newHeight);
            sprite.offsetY(newHeight / 2);
            sprite.getLayer().batchDraw();
        }
    }
}

function moveSpriteUp() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            const layer = sprite.getLayer();
            if (layer) {
                const children = layer.getChildren();
                const currentZIndex = sprite.zIndex();
                if (currentZIndex < children.length - 1) {
                    sprite.zIndex(currentZIndex + 1); // Move up
                    layer.batchDraw(); // Redraw the layer
                }
            }
        }
    }
}

function moveSpriteDown() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            const layer = sprite.getLayer();
            if (layer) {
                const currentZIndex = sprite.zIndex();
                if (currentZIndex > 0) {
                    sprite.zIndex(currentZIndex - 1); // Move down
                    layer.batchDraw(); // Redraw the layer
                }
            }
        }
    }
}

document.getElementById('moveSpriteUp').addEventListener('click', moveSpriteUp);
document.getElementById('moveSpriteDown').addEventListener('click', moveSpriteDown);

// Function to change X value input to sprite's X position
function changeXvalueInputToSprite() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            document.getElementById('spriteXInput').value = sprite.x();
        }
    }
}

// Function to change Y value input to sprite's Y position
function changeYvalueInputToSprite() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            document.getElementById('spriteYInput').value = sprite.y();
        }
    }
}

// Function to change width and height inputs to sprite's current width and height
function changeSizeInputsToSprite() {
    if (selectedId) {
        const sprite = stage.findOne(`#${selectedId}`);
        if (sprite) {
            document.getElementById('spriteWidthInput').value = sprite.width();
            document.getElementById('spriteHeightInput').value = sprite.height();
        }
    }
}

// Update all input values to reflect current sprite properties
function updateAllValues() {
    if (selectedId !== null) {
        changeSelectedObjectText();
        changeXvalueInputToSprite();
        changeYvalueInputToSprite();
        changeSizeInputsToSprite(); // Include size updates
    } else {
        // If no sprite is selected, set all inputs to 0
        document.getElementById('spriteXInput').value = 0;
        document.getElementById('spriteYInput').value = 0;
        document.getElementById('spriteWidthInput').value = 0;
        document.getElementById('spriteHeightInput').value = 0;

        changeSelectedObjectText(); // Update the text for no selection case
    }
}

// Function to change selected object text
function changeSelectedObjectText() {
    const selectedImageShowerText = document.getElementById('selectedSpriteShower');
    if (selectedId !== null) {
        selectedImageShowerText.style.color = 'green';
        selectedImageShowerText.textContent = 'An Object Selected!';
    } else {
        selectedImageShowerText.style.color = 'red';
        selectedImageShowerText.textContent = 'No Object Selected!';
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    changeSelectedObjectText();
    initializeKonva(); // Assume this initializes your Konva stage and layers

    // Add a click listener to the stage to handle clicks on empty space
    const canvas = document.querySelector('.gameCanvas');
    stage = canvas.__konvaStage; // Ensure 'stage' is properly assigned
    if (stage) {
        stage.on('click', function(e) {
            // Deselect if the click was on empty space
            if (e.target === stage) {
                deselectImage();
            }
        });
    }
});

// Define the function to open a new window
function openInNewWindow(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

function previewGameClicked() {
    // Initialize CodeMirror editor if not already initialized
    ScriptEditorClicked();

    // Function to gather all images on the canvas and store their data in an array
    function getAllImagesData() {
        const canvas = document.querySelector('.gameCanvas');
        const images = canvas.querySelectorAll('img'); // Select all img elements within the canvas
        const imageDataArray = [];

        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            // Calculate image position relative to the canvas
            const left = rect.left - canvasRect.left;
            const top = rect.top - canvasRect.top;
            
            imageDataArray.push({
                id: img.id,
                src: img.src, // Store the image source
                left: left,
                top: top,
                width: img.offsetWidth,
                height: img.offsetHeight
            });
        });

        return imageDataArray;
    }

    // Function to get JavaScript code from CodeMirror
    function getEditorCode() {
        if (codeMirrorEditor) {
            return codeMirrorEditor.getValue();
        } else {
            console.error('CodeMirror editor instance is not initialized.');
            return '';
        }
    }

    // Function to save image data and editor code to local storage
    function saveToLocalStorage() {
        VisualScriptEditorClicked();
        const imageData = getAllImagesData();
        const editorCode = getEditorCode();

        const data = {
            imageData: imageData,
            jsCode: editorCode,
            blocklyCode: currentCode // Include Blocky code
        };

        localStorage.setItem('gameData', JSON.stringify(data));
        console.log('Game data saved to local storage.');
    }

    // Save the data
    saveToLocalStorage();

    // Open the specified HTML file in a new window
    openInNewWindow('../../html/Engine/PreviewGame.html');
    SceneEditorClicked()
}

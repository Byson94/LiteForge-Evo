function ExportTheGame() {
    // Initialize CodeMirror editor if not already initialized
    initializeEditor();

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

    // Function to create a downloadable file with the game data
    function createDownloadableFile() {
        const imageData = getAllImagesData();
        const editorCode = getEditorCode();

        const gameData = {
            images: imageData,
            jsCode: editorCode
        };

        // Create a string representation of the game data
        const gameDataString = JSON.stringify(gameData, null, 2);

        // Convert the game data string into a Blob
        const blob = new Blob([gameDataString], { type: 'application/octet-stream' });

        // Create a downloadable link and trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'Game.LFE'; // Rename file to Game.LFE
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('Game data exported as Game.LFE.');
    }

    // Function to show the loading indicator
    function showLoadingIndicator() {
        const exportingElement = document.querySelector('.ExportingTheGame');
        if (exportingElement) {
            exportingElement.style.display = 'block';
        }
    }

    // Function to hide the loading indicator
    function hideLoadingIndicator() {
        const exportingElement = document.querySelector('.ExportingTheGame');
        if (exportingElement) {
            exportingElement.style.display = 'none';
        }
    }

    // Show the loading indicator before starting the packaging process
    showLoadingIndicator();

    // Trigger the file creation and download
    createDownloadableFile();

    // Hide the loading indicator after a short delay
    // This allows the browser time to initiate the download
    setTimeout(hideLoadingIndicator, 500); // Adjust the delay as needed
}

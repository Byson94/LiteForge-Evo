async function ExportTheGame(previousUIState) {
    // Initialize CodeMirror editor if not already initialized
    ScriptEditorClicked();

    function getAllKonvaObjectsData() {
        const canvas = document.querySelector('.gameCanvas');
        const stage = canvas.__konvaStage; // Retrieve the Konva stage from the canvas element
        if (!stage) {
            console.error('Konva stage not found.');
            return [];
        }

        const layers = stage.find('Layer');
        const imageDataArray = [];

        layers.forEach(layer => {
            layer.find('Image').forEach(image => {
                const id = image.id();
                const src = image.image().src;
                const pos = image.position();
                const size = image.size();
                
                imageDataArray.push({
                    id: id,
                    src: src,
                    left: pos.x,
                    top: pos.y,
                    width: size.width,
                    height: size.height
                });
            });
        });

        return imageDataArray;
    }

    function getEditorCode() {
        if (codeMirrorEditor) {
            return codeMirrorEditor.getValue();
        } else {
            console.error('CodeMirror editor instance is not initialized.');
            return '';
        }
    }

    async function createDownloadableFile() {
        const zip = new JSZip();
        const imageData = getAllKonvaObjectsData();
        const editorCode = getEditorCode();

        // Add JavaScript code to the ZIP
        zip.file("script.js", editorCode);

        // Create a folder for sprites
        const spritesFolder = zip.folder("sprites");

        // Fetch and add images to the ZIP
        const promises = imageData.map(async (data) => {
            try {
                const response = await fetch(data.src);
                const blob = await response.blob();
                // Ensure the filename is derived from the image ID, with a .png extension
                const filename = `${data.id}.png`;
                spritesFolder.file(filename, blob);
            } catch (error) {
                console.error(`Error fetching image with ID ${data.id}:`, error);
            }
        });

        // Wait for all image promises to resolve
        await Promise.all(promises);

        // Prepare game data including image metadata
        const gameData = {
            images: imageData,
            jsCode: "Stored in script.js"
        };

        // Add game data JSON to the ZIP
        zip.file("gameData.json", JSON.stringify(gameData, null, 2));

        // Retrieve Blockly workspace XML from local storage
        const blocklyXml = localStorage.getItem('blocklyWorkspace');
        if (blocklyXml) {
            zip.file("blocklyWorkspace.xml", blocklyXml);
            localStorage.removeItem('blocklyWorkspace');
        } else {
            console.warn('No Blockly workspace data found in local storage.');
        }

        // Generate the ZIP file and trigger download
        zip.generateAsync({ type: "blob" }).then(function(content) {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = 'Game.LFE';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }).catch(function(err) {
            console.error('Error generating ZIP file:', err);
        });

        console.log('Game data exported as Game.LFE.');
    }

    // Trigger the file creation and download
    await createDownloadableFile();
    if (previousUIState === "sceneEditor") {
        SceneEditorClicked();
    } else if (previousUIState === "scriptEditor") {
        ScriptEditorClicked();
    } else if (previousUIState === "visualEditor") {
        VisualScriptEditorClicked();
    }
}
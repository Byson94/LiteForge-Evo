// Define the function to open a new window
function openInNewWindow(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

function previewGameClicked() {
        let previousUIState = currentUIState();
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

        const data = {
            spriteData: getAllKonvaObjectsData(),
            JsCode: getEditorCode(),
            blocklyCode: currentCode,
        };

        localStorage.setItem('gameData', JSON.stringify(data));

        if (previousUIState === "sceneEditor") {
            SceneEditorClicked();
        } else if (previousUIState === "scriptEditor") {
            ScriptEditorClicked();
        } else if (previousUIState === "visualEditor") {
            VisualScriptEditorClicked();
        }
    
    // Open the specified HTML file in a new window
    openInNewWindow('../../html/Engine/PreviewGame.html');

}
async function ExportAsHTML() {
    VisualScriptEditorClicked();

    function isElectron() {
        // Checks for Electron's presence
        return navigator.userAgent.toLowerCase().includes('electron');
    }
    // Function to extract Konva sprite data from the canvas
    function getAllKonvaObjectsData() {
        const canvas = document.querySelector('.gameCanvas');
        const stage = canvas.__konvaStage; // Access Konva stage from canvas
        if (!stage) {
            console.error('Konva stage not found.');
            return [];
        }

        const layers = stage.find('Layer');
        const spriteDataArray = [];

        layers.forEach(layer => {
            layer.find('Image').forEach(image => {
                const id = image.id();
                const src = image.image().src;
                const pos = image.position();
                const size = image.size();
                
                spriteDataArray.push({
                    id: id,
                    src: src,
                    left: pos.x,
                    top: pos.y,
                    width: size.width,
                    height: size.height
                });
            });
        });

        return spriteDataArray;
    }

    function getEditorCode() {
        if (codeMirrorEditor) {
            return codeMirrorEditor.getValue();
        } else {
            console.error('CodeMirror editor instance is not initialized.');
            return '';
        }
    }

    const zip = new JSZip();

    const spriteData = getAllKonvaObjectsData(); // Extract Konva sprite data
    const editorCode = getEditorCode(); // Extract editor code

    // Add script.js
    zip.file("script.js", editorCode);

    // Add scriptBlockly.js with the current code from Blockly
    zip.file("scriptBlockly.js", currentCode);

    const gameData = {
        sprites: spriteData,
        jsCode: "Stored in script.js and scriptBlockly.js"
    };
    zip.file("gameData.json", JSON.stringify(gameData, null, 2));

    // HTML content with Konva canvas and sprites
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Game</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #000;
        }
        .gameCanvas {
            width: 550px;
            height: 550px;
            border: 1px solid black;
            background-color: rgb(194, 194, 194);
        }
    </style>
</head>
<body>
    <!-- Ensure the ID is set to 'container' -->
    <div class="gameCanvas" id="gameCanvas"></div>
    <script src="Konva.min.js"></script>
    <script>
        const stage = new Konva.Stage({
            container: '.gameCanvas',
            width: 550,
            height: 550,
        });

        fetch('gameData.json')
            .then(response => response.json())
            .then(data => {

                const layer = new Konva.Layer();
                stage.add(layer);

                data.sprites.forEach(spriteData => {
                    const img = new Image();
                    img.src = 'sprites/' + spriteData.id + '.png';
                    img.onload = () => {
                        const konvaImg = new Konva.Image({
                            id: spriteData.id,
                            image: img,
                            x: spriteData.left,
                            y: spriteData.top,
                            width: spriteData.width,
                            height: spriteData.height
                        });
                        layer.add(konvaImg);
                        layer.draw();
                    };
                });

                stage.draw();
            })
            .catch(error => console.error('Error loading game data:', error));
    </script>
    <script src="script.js"></script>
    <script src="scriptBlockly.js"></script>
</body>
</html>
    `;

    zip.file("index.html", htmlContent);

    // Add Konva.min.js to the ZIP depending on the environment
    let konvaPath = isElectron() ? '../../../libraries/konva/Konva.min.js' : '/libraries/konva/Konva.min.js';
    
    try {
        const response = await fetch(konvaPath);
        const blob = await response.blob();
        zip.file("Konva.min.js", blob);
    } catch (error) {
        console.error(`Error fetching Konva.min.js:`, error);
    }

    // Add sprites to sprites folder
    const spritesFolder = zip.folder("sprites");
    const promises = spriteData.map(async (data) => {
        try {
            const response = await fetch(data.src);
            const blob = await response.blob();
            const filename = `${data.id}.png`;
            spritesFolder.file(filename, blob);
        } catch (error) {
            console.error(`Error fetching sprite with ID ${data.id}:`, error);
        }
    });

    await Promise.all(promises);

    // Add LICENSE file
    const licenseContent = `
    MIT License

    Copyright (c) 2024 LiteForge Evo

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    `;
    zip.file("LICENSE.txt", licenseContent);

    // Generate and download ZIP
    zip.generateAsync({ type: "blob" }).then(function(content) {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.download = 'GameHTML.zip';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }).catch(function(err) {
        console.error('Error generating ZIP file:', err);
    });

    console.log('Game exported as GameHTML.zip.');
    SceneEditorClicked();
}

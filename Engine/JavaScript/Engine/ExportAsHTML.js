async function ExportAsHTML(previousUIState) {
    VisualScriptEditorClicked();

    function isElectron() {
        return navigator.userAgent.toLowerCase().includes('electron');
    }

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

    const spriteData = getAllKonvaObjectsData();
    const editorCode = getEditorCode();

    // Add script.js
    zip.file("script.js", editorCode);

    // Add scriptBlockly.js with the current code from Blockly
    zip.file("scriptBlockly.js", currentCode);

    const gameData = {
        sprites: spriteData,
        jsCode: "Stored in script.js and scriptBlockly.js"
    };
    zip.file("gameData.json", JSON.stringify(gameData, null, 2));

    // HTML content with Konva canvas, SAT.js, and sprites
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
    <div class="gameCanvas"></div>
    <script src="Konva.min.js"></script>
    <script src="SAT.js"></script> <!-- Include SAT.js -->
    <script>
        import * as lfjs from './lfjs/api.js'

        const stage = new Konva.Stage({
            container: document.querySelector('.gameCanvas'),
            width: 550,
            height: 550,
        });

        fetch('gameData.json')
            .then(response => response.json())
            .then(data => {
                const layer = new Konva.Layer();
                stage.add(layer);

                const sprites = {};

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

                        // Save the sprite reference for collision detection
                        sprites[spriteData.id] = konvaImg;
                    };
                });

                stage.draw();

                // Collision detection logic using SAT.js
                function detectCollisions() {
                    const colliders = Object.values(sprites).map(sprite => {
                        return new SAT.Box(new SAT.Vector(sprite.x(), sprite.y()), sprite.width(), sprite.height()).toPolygon();
                    });

                    for (let i = 0; i < colliders.length; i++) {
                        for (let j = i + 1; j < colliders.length; j++) {
                            if (SAT.testPolygonPolygon(colliders[i], colliders[j])) {
                                console.log('Collision detected between:', colliders[i], colliders[j]);
                                alert('success!');
                            }
                        }
                    }
                }

                // Check collisions every second
                setInterval(detectCollisions, 1000);

            })
            .catch(error => console.error('Error loading game data:', error));
    </script>
    <script src="script.js"></script>
    <script src="scriptBlockly.js"></script>
</body>
</html>
    `;

    zip.file("index.html", htmlContent);

    // Add Konva.min.js to the ZIP
    let konvaPath = isElectron() ? '../../../libraries/konva/konva.min.js' : '../../../libraries/konva/konva.min.js';
    
    try {
        const response = await fetch(konvaPath);
        const blob = await response.blob();
        zip.file("Konva.min.js", blob);
    } catch (error) {
        console.error(`Error fetching Konva.min.js:`, error);
    }

    // Add SAT.js to the ZIP
    let satPath = isElectron() ? '../../../libraries/Sat/SAT.js' : '../../../libraries/Sat/SAT.js';
    
    try {
        const response = await fetch(satPath);
        const blob = await response.blob();
        zip.file("SAT.js", blob);
    } catch (error) {
        console.error(`Error fetching SAT.js:`, error);
    }

    // Add lfjs api to the ZIP
    let lfjsPath = isElectron ? '../../../lfjs/api.js' : '../../../lfjs/api.js';

    try {
        const response = await fetch(lfjsPath);
        const blob = await response.blob();
        zip.file("lfjs/api.js", blob);
    } catch (error) {
        console.error(`Error fetching LFJS:`, error);
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
    if (previousUIState === "sceneEditor") {
        SceneEditorClicked();
    } else if (previousUIState === "scriptEditor") {
        ScriptEditorClicked();
    } else if (previousUIState === "visualEditor") {
        VisualScriptEditorClicked();
    }
}
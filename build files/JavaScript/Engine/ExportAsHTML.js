async function ExportAsHTML() {
    // Function to extract image data from the canvas
    function getAllImagesData() {
        const canvas = document.querySelector('.gameCanvas');
        const images = canvas.querySelectorAll('img');
        const imageDataArray = [];

        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const left = rect.left - canvasRect.left;
            const top = rect.top - canvasRect.top;
            
            imageDataArray.push({
                id: img.id,
                src: img.src,  // This will be used to fetch the image data
                left: left,
                top: top,
                width: img.offsetWidth,
                height: img.offsetHeight
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

    const zip = new JSZip();
    
    const imageData = getAllImagesData(); // Extract image data
    const editorCode = getEditorCode(); // Extract editor code

    // Add script.js and gameData.json
    zip.file("script.js", editorCode);

    const gameData = {
        images: imageData,
        jsCode: "Stored in script.js"
    };
    zip.file("gameData.json", JSON.stringify(gameData, null, 2));

    // HTML content
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
                position: relative;
                background-color: rgb(194, 194, 194);
            }
            img {
                position: absolute;
            }
        </style>
    </head>
    <body>
        <div class="gameCanvas"></div>
        <script src="script.js"></script>
        <script>
            fetch('gameData.json')
                .then(response => response.json())
                .then(data => {
                    const canvas = document.querySelector('.gameCanvas');
                    data.images.forEach(imgData => {
                        const img = document.createElement('img');
                        img.id = imgData.id;
                        img.src = 'sprites/' + imgData.id + '.png'; // Path to the images in the sprites folder
                        img.style.left = imgData.left + 'px';
                        img.style.top = imgData.top + 'px';
                        img.style.width = imgData.width + 'px';
                        img.style.height = imgData.height + 'px';
                        canvas.appendChild(img);
                    });
                })
                .catch(error => console.error('Error loading game data:', error));
        </script>
    </body>
    </html>
    `;
    
    zip.file("index.html", htmlContent);

    // Add images to sprites folder
    const spritesFolder = zip.folder("sprites");
    const promises = imageData.map(async (data) => {
        try {
            const response = await fetch(data.src);
            const blob = await response.blob();
            const filename = `${data.id}.png`;
            spritesFolder.file(filename, blob);
        } catch (error) {
            console.error(`Error fetching image with ID ${data.id}:`, error);
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
}

// build/JavaScript/renderer.js
document.addEventListener('DOMContentLoaded', () => {
    // Example: Create and append a canvas element to the #canvasArea
    const canvasArea = document.getElementById('canvasArea');
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasArea.appendChild(canvas);

    // Example: Initialize a basic drawing context
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Example: Basic animation loop
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Your drawing code here
        requestAnimationFrame(draw);
    }
    draw();

    // Example: Send a message to the main process and listen for a reply
    document.getElementById('sendButton').addEventListener('click', () => {
        window.myApi.sendMessage('Hello from renderer');
    });

    window.myApi.onMessage((response) => {
        console.log('Received reply:', response);
    });
});

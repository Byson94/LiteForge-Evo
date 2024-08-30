// This is a template for renderer.js file, this should be changed

// Wait until the DOM is fully loaded before running the script
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
});

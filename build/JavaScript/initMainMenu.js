document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Load mainMenu.html and mainMenu.js dynamically
    fetch('build/html/mainMenu.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('mainMenu.html loaded');
            const mainMenu = document.getElementById('mainMenu');
            mainMenu.innerHTML = data;
            mainMenu.style.display = 'block';

            // Load the mainMenu.js script
            const script = document.createElement('script');
            script.src = 'build/JavaScript/mainMenu.js';
            script.onload = () => {
                console.log('mainMenu.js loaded');
                // Add a timeout to ensure everything is set up
                setTimeout(() => {
                    console.log('mainMenu.js is running');
                }, 0);
            };
            script.onerror = () => console.error('Error loading mainMenu.js');
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading mainMenu.html:', error));
});

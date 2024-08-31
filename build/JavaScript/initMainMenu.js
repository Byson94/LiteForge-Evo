document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed in initMainMenu.js');

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
            if (mainMenu) {
                mainMenu.innerHTML = data;
                mainMenu.style.display = 'block';

                // Load the mainMenu.js script
                const script = document.createElement('script');
                script.src = 'build/JavaScript/mainMenu.js';
                script.onload = () => {
                    console.log('mainMenu.js loaded and executed');
                };
                script.onerror = () => console.error('Error loading mainMenu.js');
                document.body.appendChild(script);
            } else {
                console.error('mainMenu element not found');
            }
        })
        .catch(error => console.error('Error loading mainMenu.html:', error));
});

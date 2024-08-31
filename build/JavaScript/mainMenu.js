document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const createBtn = document.getElementById('create-btn');
    const createTab = document.getElementById('create-tab');
    const newProjectBtn = document.getElementById('new-project-btn');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-btn');
    const arrowIcon = document.getElementById('arrow-icon');

    // Log elements to verify they exist
    console.log('createBtn:', createBtn);
    console.log('createTab:', createTab);
    console.log('newProjectBtn:', newProjectBtn);
    console.log('sidebar:', sidebar);
    console.log('toggleBtn:', toggleBtn);
    console.log('arrowIcon:', arrowIcon);

    if (!createBtn || !createTab || !newProjectBtn || !sidebar || !toggleBtn || !arrowIcon) {
        console.error('One or more elements are missing from the DOM.');
        if (!createBtn) console.error('createBtn is missing!');
        if (!createTab) console.error('createTab is missing!');
        if (!newProjectBtn) console.error('newProjectBtn is missing!');
        if (!sidebar) console.error('sidebar is missing!');
        if (!toggleBtn) console.error('toggleBtn is missing!');
        if (!arrowIcon) console.error('arrowIcon is missing!');
        return;
    }

    console.log('All elements are present.');

    // Toggle create tab visibility
    createBtn.addEventListener('click', () => {
        console.log('Create button clicked');
        createTab.style.display = createTab.style.display === 'block' ? 'none' : 'block';
    });

    // Create new project
    newProjectBtn.addEventListener('click', () => {
        console.log('New Project button clicked');
        const projectName = prompt('Enter project name:');
        if (projectName) {
            const projectData = {
                name: projectName,
                dateCreated: new Date().toISOString()
            };
            localStorage.setItem('project-' + Date.now(), JSON.stringify(projectData));
            alert('New project created and stored!');
        }
    });

    // Toggle sidebar and update arrow icon
    arrowIcon.addEventListener('click', () => {
        console.log('Arrow icon clicked');
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            arrowIcon.src = 'build/icon/left-arrow.png'; // Change to left arrow
        } else {
            arrowIcon.src = 'build/icon/right-arrow.png'; // Change to right arrow
        }
        console.log('Sidebar classes:', sidebar.classList);
        console.log('Arrow icon src set to:', arrowIcon.src);
    });
});

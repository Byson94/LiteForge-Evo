document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-btn');
    const createTab = document.getElementById('create-tab');
    const newProjectBtn = document.getElementById('new-project-btn');

    createBtn.addEventListener('click', () => {
        createTab.style.display = createTab.style.display === 'block' ? 'none' : 'block';
    });

    newProjectBtn.addEventListener('click', () => {
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
});

// Code for the sidebar toggle feature
document.getElementById('toggle-arrow').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const arrow = document.getElementById('toggle-arrow');

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        arrow.classList.remove('arrow-left');
        arrow.classList.add('arrow-right');
    } else {
        sidebar.classList.add('hidden');
        arrow.classList.remove('arrow-right');
        arrow.classList.add('arrow-left');
    }
});

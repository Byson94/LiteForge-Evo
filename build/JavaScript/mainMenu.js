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

document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-btn');
    const createTab = document.getElementById('create-tab');
    const newProjectBtn = document.getElementById('new-project-btn');
    const toggleArrow = document.getElementById('toggle-arrow');
    const sidebar = document.getElementById('sidebar');

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

    toggleArrow.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        toggleArrow.classList.toggle('arrow-left');
    });
});

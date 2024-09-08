        // Layout switching functions
        function ScriptEditorClicked() {
            document.getElementById('layout-1').style.display = 'none';
            document.getElementById('layout-2').style.display = 'block';
            initializeEditor(); // Initialize the CodeMirror editor
        }

        function SceneEditorClicked() {
            document.getElementById('layout-2').style.display = 'none';
            document.getElementById('layout-1').style.display = 'block';
        }

        function newProject() {
            window.location.href = "Engine.html";
        }

        // Ensure the Scene Editor is visible on page load
        document.getElementById('layout-1').style.display = 'block';
        document.getElementById('layout-2').style.display = 'none';
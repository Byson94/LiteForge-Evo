let savedData = localStorage.getItem("EngineDATA");

if (savedData) {
    let data = JSON.parse(savedData);
    let loadURL = data.EngineURL;

    // Create an iframe element
    let iframe = document.createElement("iframe");
    iframe.style.display = "none"; // Hide the iframe
    iframe.src = loadURL;
    
    iframe.onload = function() {
        try {
            // When the iframe has loaded, get its content
            let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            // Extract all scripts in the iframe
            let scripts = iframeDocument.getElementsByTagName('script');
            let jsCode = '';

            for (let script of scripts) {
                if (script.src) {
                    // If it's an external script, you can get the URL
                    console.log(`External script: ${script.src}`);
                } else {
                    // Inline script: Extract the content
                    jsCode += script.innerText || script.textContent;
                }
            }

            // Now jsCode holds the JS code of the iframe
            console.log("Extracted JS code:", jsCode);
        } catch (error) {
            console.error("Error accessing iframe content:", error);
        }
    };

    // Append the iframe to the body
    document.body.appendChild(iframe);
}

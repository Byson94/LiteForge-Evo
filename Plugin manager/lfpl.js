// LiteForge package loader

function ssload(value) {
    if (value === true) {
        let existingData = localStorage.getItem("engine-plugin-DAT");
        existingData = existingData ? JSON.parse(existingData) : {};
        existingData.ssload = true;
        localStorage.setItem("engine-plugin-DAT", JSON.stringify(existingData));
    } else {
        return;
    }
}

function loadAsset(code, language) {
    if (language === "css") {
        try {
            const styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.textContent = code;
            document.head.appendChild(styleElement);
            console.log("CSS asset injected successfully.");
        } catch (error) {
            console.error("Error injecting CSS:", error);
        }
    } else if (language === "html") {
        try {
            const container = document.createElement('div');
            container.innerHTML = code;
            document.body.appendChild(container);
            console.log("HTML asset injected successfully.");
        } catch (error) {
            console.error("Error injecting HTML:", error);
        }
    } else {
        console.error(`Unsupported language: ${language}`);
    }
}


export { ssload, loadAsset };
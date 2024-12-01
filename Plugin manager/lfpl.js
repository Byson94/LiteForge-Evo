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

let injectedAssets = {
    css: null,
    html: null
};

function loadAsset(code, language) {
    if (language === "css") {
        try {
            const styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.textContent = code;
            document.head.appendChild(styleElement);
            
            // Store the reference to the injected CSS
            injectedAssets.css = styleElement;
            console.log("CSS asset injected successfully.");
        } catch (error) {
            console.error("Error injecting CSS:", error);
        }
    } else if (language === "html") {
        try {
            const container = document.createElement('div');
            container.innerHTML = code;
            document.body.appendChild(container);
            
            // Store the reference to the injected HTML container
            injectedAssets.html = container;
            console.log("HTML asset injected successfully.");
        } catch (error) {
            console.error("Error injecting HTML:", error);
        }
    } else {
        console.error(`Unsupported language: ${language}`);
    }
}

function removePreviousAsset(language) {
    if (language === "css" && injectedAssets.css) {
        document.head.removeChild(injectedAssets.css);
        console.log("Previous CSS asset removed.");
        injectedAssets.css = null; 
    } else if (language === "html" && injectedAssets.html) {
        document.body.removeChild(injectedAssets.html);
        console.log("Previous HTML asset removed.");
        injectedAssets.html = null; 
    } else {
        console.log(`No previous ${language} asset to remove.`);
    }
}

function version() {
    return "1.2.0";
}

function engineVersion() {
    return "v0.2.0 alpha"
}

export { ssload, loadAsset, version, engineVersion, removePreviousAsset };
// LiteForge package loader API
const lfpl = {
    // Handles session-storage-like flagging
    ssload(value) {
        if (value) { // Checks if value is truthy
            let existingData = localStorage.getItem("engine-plugin-DAT");
            const parsedData = existingData ? JSON.parse(existingData) : {};
            parsedData.ssload = true; 
            localStorage.setItem("engine-plugin-DAT", JSON.stringify(parsedData));
            console.log("ssload flag stored.");
        } else {
            console.log("No change for ssload.");
        }
    },

    injectedAssets: { // Ensure assets are scoped properly
        css: null,
        html: null
    },


    // Allows to load custom html or css code to the extension
    loadAsset(code, language) {
        if (language === "css") {
            try {
                const styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.textContent = code;
                document.head.appendChild(styleElement);
                // Save to scoped assets
                lfpl.injectedAssets.css = styleElement;
                console.log("CSS asset injected.");
            } catch (error) {
                console.error("Error injecting CSS:", error);
            }
        } else if (language === "html") {
            try {
                const container = document.createElement('div');
                container.innerHTML = code;
                document.body.appendChild(container);
                lfpl.injectedAssets.html = container;
                console.log("HTML asset injected.");
            } catch (error) {
                console.error("Error injecting HTML:", error);
            }
        } else {
            console.error(`Unsupported language type: ${language}`);
        }
    },

    removePreviousAsset(language) {
        if (language === "css" && lfpl.injectedAssets.css) {
            document.head.removeChild(lfpl.injectedAssets.css);
            console.log("Removed CSS.");
            lfpl.injectedAssets.css = null;
        } else if (language === "html" && lfpl.injectedAssets.html) {
            document.body.removeChild(lfpl.injectedAssets.html);
            console.log("Removed HTML.");
            lfpl.injectedAssets.html = null;
        } else {
            console.log(`No previous ${language} asset found.`);
        }
    },

    version() {
        return "1.2.0";
    },

    engineVersion() {
        return "v0.2.0 alpha";
    },

    // Since an extension accessing the localstorage and sessionstorage is too risk, we have API for that.
    localStorageAPI: {
        save(dat) {
            if (typeof dat === "object") {
                try {
                    const existingData = localStorage.getItem('LFPL DATA');
                    const parsedData = existingData ? JSON.parse(existingData) : {};
                    localStorage.setItem('LFPL DATA', JSON.stringify({ ...parsedData, ...dat }));
                    console.log("Data saved to localStorage.");
                } catch (error) {
                    console.error("LocalStorage save failed", error);
                }
            }
        },
        remove(key) {
            try {
                const existingData = localStorage.getItem('LFPL DATA');
                if (existingData) {
                    const parsedData = JSON.parse(existingData);
                    delete parsedData[key];
                    localStorage.setItem('LFPL DATA', JSON.stringify(parsedData));
                    console.log("Key removed from localStorage.");
                }
            } catch (error) {
                console.error("LocalStorage remove failed", error);
            }
        },
        get(key) {
            try {
                const existingData = localStorage.getItem('LFPL DATA');
                return existingData ? JSON.parse(existingData)[key] : null;
            } catch (error) {
                console.error("LocalStorage fetch failed", error);
                return null;
            }
        },
        clear() {
            localStorage.clear();
            console.log("LocalStorage cleared.");
        }
    },

    sessionStorageAPI: {
        save(dat) {
            if (typeof dat === "object") {
                try {
                    const existingData = sessionStorage.getItem('LFPL DATA');
                    const parsedData = existingData ? JSON.parse(existingData) : {};
                    sessionStorage.setItem('LFPL DATA', JSON.stringify({ ...parsedData, ...dat }));
                    console.log("Data saved to sessionStorage.");
                } catch (error) {
                    console.error("SessionStorage save failed", error);
                }
            }
        },
        remove(key) {
            try {
                const existingData = sessionStorage.getItem('LFPL DATA');
                if (existingData) {
                    const parsedData = JSON.parse(existingData);
                    delete parsedData[key];
                    sessionStorage.setItem('LFPL DATA', JSON.stringify(parsedData));
                    console.log("Key removed from sessionStorage.");
                }
            } catch (error) {
                console.error("SessionStorage remove failed", error);
            }
        },
        get(key) {
            try {
                const existingData = sessionStorage.getItem('LFPL DATA');
                return existingData ? JSON.parse(existingData)[key] : null;
            } catch (error) {
                console.error("SessionStorage fetch failed", error);
                return null;
            }
        },
        clear() {
            sessionStorage.clear();
            console.log("SessionStorage cleared.");
        }
    }
};

export { lfpl };

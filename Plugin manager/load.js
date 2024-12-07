import { checkIfSafe } from "./sanitizer.js";
import { lfpl } from "./lfpl.js";
window.lfpl = lfpl;

function loadFromIndexedDB(dbName, storeName, key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const getRequest = store.get(key);

            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    resolve(getRequest.result.content);
                } else {
                    reject(`No record found for key: ${key}`);
                }
            };

            getRequest.onerror = () => {
                reject(`Error reading key: ${key}`);
            };
        };

        request.onerror = (event) => {
            reject(`Error opening IndexedDB: ${event.target.error}`);
        };
    });
}

function injectScript(content) {
    try {
        // Validate the content is valid JavaScript
        new Function(content);

        const result = checkIfSafe(content);
        if (result === false) {
            console.error("Aborted loading the plugin due to suspicious code");
            return;
        }

        // Inject script safely
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.textContent = content;
        document.head.appendChild(scriptElement);
        console.log("Plugin script injected successfully.");
    } catch (error) {
        console.error("Error validating or injecting script:", error);
    }
}

async function loadPlugin() {
    try {
        // Check the theme setting in localStorage right when the page loads
        const lfplDat = JSON.parse(localStorage.getItem('engine-plugin-DAT') || '{}');
        let pluginContent = null;

        if (lfplDat.ssload === true) {
            // Check sessionStorage for cached plugin content
            pluginContent = sessionStorage.getItem('pluginjs');

            if (!pluginContent) {
                // If not found in sessionStorage, fetch it from IndexedDB
                try {
                    pluginContent = await loadFromIndexedDB('LiteForgeDB', 'plugins', 'pluginjs');

                    if (pluginContent) {
                        // Store the fetched plugin content in sessionStorage
                        sessionStorage.setItem('pluginjs', pluginContent);
                        console.log("Plugin loaded from IndexedDB and cached in sessionStorage.");
                    } else {
                        console.log("Plugin not found in IndexedDB.");
                        return;
                    }
                } catch (error) {
                    console.error("Error loading plugin from IndexedDB:", error);
                    return;
                }
            } else {
                console.log("Plugin found in sessionStorage.");
            }
        } else {
            // Fetch the plugin content directly from IndexedDB if theme is not true
            try {
                pluginContent = await loadFromIndexedDB('LiteForgeDB', 'plugins', 'pluginjs');
                if (!pluginContent) {
                    console.log("Plugin not found in IndexedDB.");
                    return;
                }
                console.log("Plugin loaded directly from IndexedDB.");
            } catch (error) {
                console.error("Error loading plugin from IndexedDB:", error);
                return;
            }
        }

        // Inject the plugin (theme) script
        injectScript(pluginContent);
    } catch (error) {
        console.error("Error loading plugin:", error);
    }
}

// Ensure DOM is fully loaded before executing
document.addEventListener('DOMContentLoaded', () => {
    if (!document.head) {
        console.error("No <head> element found for script injection.");
        return;
    }
    loadPlugin();
});

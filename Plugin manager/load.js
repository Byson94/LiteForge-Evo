import { checkIfSafe } from "./sanitizer.js";

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
                    resolve(getRequest.result.content); // Return the plugin content
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
    let result = checkIfSafe(content);
    if (result === false) {
        console.error("Aborted loading the plugin due to suspicious code");
        return;
    }
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.textContent = content;
    document.head.appendChild(scriptElement);
}

async function loadPlugin() {
    try {
        const pluginContent = await loadFromIndexedDB('LiteForgeDB', 'plugins', 'pluginjs');
        if (pluginContent) {
            injectScript(pluginContent);
            console.log("Script injected successfully.");
        } else {
            console.log("Plugin not found in IndexedDB.");
        }
    } catch (error) {
        console.error("Error loading plugin:", error);
    }
}

// Call the function to load and inject the plugin
loadPlugin();

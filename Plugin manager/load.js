import { checkIfSafe } from "./sanitizer.js";
import * as lfpl from "./lfpl.js";
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
    // Check the theme setting in localStorage right when the page loads
    const themeData = JSON.parse(localStorage.getItem('engine-plugin-DAT') || '{}');
    
    if (themeData.theme === true) {
        // Check sessionStorage for cached plugin content
        let pluginContent = sessionStorage.getItem('pluginjs');
        
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
                console.error("Error loading plugin:", error);
                return;
            }
        } else {
            console.log("Plugin found in sessionStorage.");
        }

        // Inject the plugin (theme) script from the cached content
        injectScript(pluginContent);
        console.log("Plugin theme script injected successfully.");
    }
}

// Load the plugin (theme) immediately after checking localStorage for the theme setting
document.addEventListener('DOMContentLoaded', loadPlugin);

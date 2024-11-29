import { checkIfSafe } from "./sanitizer.js"; 

function getCookie(name) {
    const nameEq = name + "=";  
    const cookies = document.cookie.split(';');  
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();  
        if (cookie.indexOf(nameEq) === 0) {
            return decodeURIComponent(cookie.substring(nameEq.length));  
        }
    }
    
    return null;  
}

function injectScript(content) {
    let result = checkIfSafe(content)
    if (result === false) {
        console.error("Aborted loading the plugin due to suspicious code")
        return
    }
    const scriptElement = document.createElement('script');  
    scriptElement.type = 'text/javascript';  
    scriptElement.textContent = content;  
    document.head.appendChild(scriptElement);  
}

let cookieValue = getCookie('engine_plugin');

if (cookieValue) {
    injectScript(cookieValue);
    console.log("Script injected successfully.");
} else {
    console.log("Cookie not found.");
}
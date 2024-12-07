const unsafePatterns = [
    { pattern: /import\s+[^\n]*/, replacement: '' }, 
    { pattern: /export\s+[^\n]*/, replacement: '' },
    { pattern: /fetch\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /XMLHttpRequest\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /eval\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /new\s+Function\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /window\.location\s*=\s*[^\n]*/, replacement: '' }, 
    { pattern: /window\.open\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /document\.write\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /document\.cookie\s*=\s*[^\n]*/, replacement: '' }, 
    { pattern: /localStorage\s*\.[a-zA-Z0-9]+\s*=\s*[^\n]*/, replacement: '' }, 
    { pattern: /sessionStorage\s*\.[a-zA-Z0-9]+\s*=\s*[^\n]*/, replacement: '' }, 
    { pattern: /FileReader\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /WebSocket\s*\([^\)]*\)/, replacement: '' }, 
    { pattern: /localStorage\.setItem\s*\([^\)]*\)/, replacement: '' }, 
];

function checkIfSafe(code) {
    for (let { pattern } of unsafePatterns) {
        if (pattern.test(code)) {
            console.error("PLUGIN is SUS");
            return false;
        }
    }

    console.log("Plugin seems safe (not 100% accurate)");
    return true; 
}

export { checkIfSafe }
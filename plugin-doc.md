### **How to Create a Plugin for LiteForge-Evo (JS File Only)**

**Overview:**
A plugin in LiteForge-Evo is just a JavaScript file that adds functionality to the engine. This file can interact with the engine's API, but you must ensure that it doesn't use any malicious or unsafe code patterns (as listed in the flagged patterns). Here’s a step-by-step guide on how to structure and write your plugin.

---

### **1. Plugin Setup**

Each plugin is just a JavaScript file. You need to follow the engine’s guidelines for loading and managing plugins. Typically, the plugin file is just a JavaScript file with a `.js` extension and it will be uploaded to the engine using the settings.

---

### **2. Writing the Plugin Code**

The plugin file should define its own functionality while ensuring it doesn’t use any dangerous or prohibited operations. For example:

#### **Safe Plugin Example**

Let’s say you want to create a simple plugin that updates an object’s position based on keyboard input. This plugin could interact with the engine’s input system, but we must avoid using any of the flagged patterns (like `eval`, `fetch`, etc.).

```js
// plugin.js

// hello world
console.log("Hello, from plugin");

// the canvas
const canvas = document.getElementById('canvas');

// a text object
const impText = document.getElementById('just-a-text');
impText.textContent = "Hello, this is a plugin."
```

#### **Key Points:**
- The plugin should be written in pure vanilla javascript:
  - You can use almost all JavaScript features, but things like import/export which can be used for malicous purposes are not allowed and the engine will refuse to load the plugin.
---

### **3. Avoiding Malicious Patterns**

When writing your plugin, make sure **none of the following patterns** appear in your code:

- **Imports and Exports**: Do not use dynamic `import` or `export` statements.
  - **Example of unsafe code**: `import { something } from 'module'`
  - **Safe practice**: Ensure all dependencies are available globally or use a pre-bundled approach if needed.
  
- **Network Requests**: Do not use `fetch()`, `XMLHttpRequest`, or WebSockets.
  - **Example of unsafe code**: `fetch('https://example.com')`
  - **Safe practice**: If network functionality is needed, make sure it's handled externally and avoid calling these methods directly in plugins.

- **Dangerous DOM Manipulations**: Avoid methods like `eval()`, `document.write()`, `window.open()`, or `localStorage`.
  - **Example of unsafe code**: `eval('console.log("hello")')`
  - **Safe practice**: Stick to the engine’s API and avoid manipulating the DOM directly in plugins.

- **Avoid Global State Modifications**: Don't directly manipulate global state (like `window.location`, `document.cookie`, etc.).
  - **Example of unsafe code**: `document.cookie = "user=admin"`
  - **Safe practice**: Use the engine’s secure APIs for managing state.

---

### **4. Registering the Plugin**

Once your plugin code is written, you need to register it with the engine. You can just go to the engine settings and then import your plugin. But make sure that the plugin is safe and follows the guidelines.

---

### **5. Testing the Plugin**

Before releasing or sharing your plugin:
- **Test for security**: Ensure that none of the flagged patterns are used. You can write unit tests or use static code analysis tools to detect unsafe code.
- **Test for functionality**: Ensure the plugin behaves as expected (e.g., input handling works smoothly, objects move as expected).
- **Test for compatibility**: Ensure that the plugin works well with other parts of the engine and doesn’t introduce any conflicts or bugs.

---

### **6. Example Directory Structure**

There is no directory structure needed for the plugins as it works unpon a single js file. But if you want to organize your code, you can use the following structure:

```
plugins/
│
├── position-update-plugin/
│   ├── plugin.js        # Your main plugin code
│   └── test.html    	 # Example file
│
└── physics-plugin/
    ├── plugin.js        # Another plugin
    └── docs.md          # Example file
```
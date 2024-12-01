# LFPL Documentation

## Introduction

LFPL (LiteForge Plugin Language) is the plugin API for LiteForge-Evo, designed to provide a simple configuration for interacting with the engine. The API allows plugin developers to write clean and efficient code that interacts seamlessly with the LiteForge-Evo engine. The documentation provides an overview of the key functions in LFPL.

## Table of Contents
1. [lfpl.ssload](#lfplssload)
2. [lfpl.loadAsset](#lfplloadasset)

## Content

### **lfpl.ssload**:
The `lfpl.ssload` function directs the plugin loader to store the plugin code in **session storage**, enabling faster loading times. This is particularly useful for plugins that need to be loaded quickly, such as themes or frequently used scripts.

- **Usage**:
  - `lfpl.ssload(true)` enables storing the plugin code in session storage for faster future access.
  - `lfpl.ssload(false)` disables storing in session storage, causing the plugin to load normally from the source. Even if you don't define `ssload` in your code, the default value will be set to `false`.

- **Parameters**:
  - `boolean` (true/false): A flag indicating whether to store the plugin code in session storage.
    - **Default**: `false`

- **Example**:
```js
// Store the plugin code in session storage for faster access
lfpl.ssload(true);

// Disable session storage for the plugin code
lfpl.ssload(false); // Explicitly disabling is not required, as this is the default behaviour.
```

### **lfpl.loadAsset**:
The `lfpl.loadAsset` function is used to load assets (such as HTML, CSS, or JavaScript) into the page dynamically using JavaScript. This allows for injecting custom content or styles into the page without reloading.

- **Usage**:
  - `lfpl.loadAsset(code, language)` allows you to inject code (HTML, CSS, or JavaScript) into the page.
  - `code` refers to the code to be injected (as a string).
  - `language` specifies the type of asset being loaded, e.g., `html` or `css`.

- **Parameters**:
  - `code` (string): The code to be injected into the page.
  - `language` (string): The type of asset to inject (e.g., "html" or "css").

- **Example**:
```js
// Inject CSS to change background color to red
const cssCode = `
body {
	background: red;
}
`;
lfpl.loadAsset(cssCode, "css");

// Inject HTML content to display a header
const htmlCode = `
<h1>Hello, world!</h1>
`;
lfpl.loadAsset(htmlCode, "html");
```
This code block demonstrates how to use `lfpl.loadAsset` to inject both CSS and HTML into a webpage.

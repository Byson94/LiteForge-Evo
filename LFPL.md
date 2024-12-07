# LFPL Documentation

## Introduction

LFPL (LiteForge Plugin Loader) is the plugin API for LiteForge-Evo, designed to provide a simple configuration for interacting with the engine. The API allows plugin developers to write clean and efficient code that interacts seamlessly with the LiteForge-Evo engine. The documentation provides an overview of the key functions in LFPL.

## Table of Contents
1. [Lfpl SSload](#lfplssload)
2. [Lfpl loadAsset](#lfplloadasset)
3. [Lfpl Version](#lfplversion)
4. [Lfpl Engine Version](#lfplengineversion)
5. [Lfpl Remove Previous Asset](#lfplremovepreviousasset)
6. [Lfpl data storing](#lfpl-data-storing)
    - [Lfpl localStorageAPI](#lfpllocalStorageAPI)
    - [Lfpl sessionStorageAPI](#lfplsessionStorageAPI)

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
The `lfpl.loadAsset` function is used to load assets (such as HTML or CSS) into the page dynamically using JavaScript. This allows for injecting custom content or styles into the page without reloading.

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

### **lfpl.version**:
The `lfpl.version()` property provides information about the current version of LiteForge Plugin Loader (LFPL).

- **Uses**:
  - `lfpl.version` returns the version number of the LFPL as a string so it can be used to tell the user that the supported version is this and your lfpl version is this.

**Example**:
```js
let lfplVersion = lfpl.version();
```

### **lfpl.engineVersion**:
The `lfpl.engineVersion()` property provides information about the current version of the game engine.

- **Uses**:
  - `lfpl.engineVersion` returns the version number of the game engine as a string so it can be used to know if the current engine version is the desired one.

**Example**:
```js
let engineVersion = lfpl.engineVersion();
```

### **lfpl.removePreviousAsset**:
The `lfpl.removePreviousAsset()` function removes the previously loaded asset (HTML or CSS) from the page. This function is useful when dynamically injecting assets and ensuring that only the most recent assets are present, avoiding duplicates.

- **Usage**:
  - `lfpl.removePreviousAsset(language)` removes the previously injected asset based on the provided language (`css` or `html`).
  - This function **does not automatically** remove previous assets when injecting new content. You must explicitly call `removePreviousAsset()` to clean up the old asset before injecting new ones.
  - This function is useful when switching themes or dynamically loading different content, ensuring only one asset of the same type (CSS or HTML) is present at a time.

- **Parameters**:
  - `language` (string): The type of asset to remove (`css` or `html`). If no asset is found for the specified language, the function will log a message stating that no asset is available to remove.
    - **Valid Values**: `css`, `html`

- **Example**:
```js
// Inject CSS, then remove the previous one before injecting a new CSS asset
const cssCode1 = `
body {
  background-color: blue;
}
`;
lfpl.loadAsset(cssCode1, "css");

lfpl.removePreviousAsset("css"); // Remove the previously loaded CSS asset

// Inject a new CSS, remove the previous one
const cssCode2 = `
body {
  background-color: green;
}
`;
lfpl.loadAsset(cssCode2, "css");

// Inject HTML, then remove the previous one before injecting new HTML content
const htmlCode1 = `
<div>Old HTML content</div>
`;
lfpl.loadAsset(htmlCode1, "html");

// Here, we remove the previously injected HTML content before injecting the new one
lfpl.removePreviousAsset("html");

// Inject new HTML, removing the old content
const htmlCode2 = `
<div>New HTML content</div>
`;
lfpl.loadAsset(htmlCode2, "html");

// After this, if you call removePreviousAsset("html") again, it will log:
// "No previous html asset to remove." as htmlCode2 is the last injected HTML.
```

### LFPL data storing
For security lfpl offers a custom storage api to save data to localStorage and sessionStorage.

#### **lfpl.localStorageAPI**
This provides 4 tools to save data to localStorage. They are *save*, *remove*, *get*, and *clear*.

**Example**:
```js
const data = {
  val1 = "Important-Value",
  val2 = "Another-value"
} // data object to save NOTEL ONLY OBJECTS CAN BE SAVED TO LOCALSTORAGE API

lfpl.localStorageAPI.save(data);

let savedDat = lfpl.localStorageAPI.get(); // gets all data
let specificKey = lfpl.localStorageAPI.get(val1); // gets only specific data

lfpl.localStorageAPI.remove(val1); // removes val1
lfpl.localStorageAPI.clear(); // clears all data
```

#### **lfpl.sessionStorageAPI**
This also provides 4 tools to save data to sessionStorage. They are *save*, *remove*, *get*, and *clear*.

**Example**:
```js
const data = {
  val1 = "Important-Value",
  val2 = "Another-value"
} // data object to save NOTEL ONLY OBJECTS CAN BE SAVED TO SESSIONSTORAGE API

lfpl.sessionStorageAPI.save(data);

let savedDat = lfpl.sessionStorageAPI.get(); // gets all data
let specificKey = lfpl.sessionStorageAPI.get(val1); // gets only specific data

lfpl.sessionStorageAPI.remove(val1); // removes val1
lfpl.sessionStorageAPI.clear(); // clears all data
```
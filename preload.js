// build/JavaScript/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myApi', {
  sendMessage: (message) => ipcRenderer.send('message-channel', message),
  onMessage: (callback) => ipcRenderer.on('message-channel-reply', (event, ...args) => callback(...args))
});

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Disable nodeIntegration
      contextIsolation: true, // Enable contextIsolation
      enableRemoteModule: false // Disable the remote module
    }
  });

  mainWindow.loadFile('index.html');

  // Optional: Open DevTools for debugging
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle messages from the renderer process
ipcMain.on('message-channel', (event, message) => {
  console.log('Message from renderer:', message);
  // Send a reply to the renderer process
  event.reply('message-channel-reply', `Received your message: ${message}`);
});

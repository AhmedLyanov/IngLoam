const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setTitle('Текстовый редактор');
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Text Files', extensions: ['txt', 'js', 'html', 'css', 'py', 'java', 'c', 'cpp', 'json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    return result.filePaths[0];
  });

  ipcMain.handle('save-file-dialog', async (_, defaultPath) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultPath,
      filters: [
        { name: 'Text Files', extensions: ['txt', 'js', 'html', 'css', 'py', 'java', 'c', 'cpp', 'json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    return result.filePath;
  });

  ipcMain.handle('read-file', (_, filePath) => {
    return fs.readFileSync(filePath, 'utf8');
  });

  ipcMain.handle('write-file', (_, filePath, content) => {
    fs.writeFileSync(filePath, content);
  });

  ipcMain.handle('delete-file', (_, filePath) => {
    fs.unlinkSync(filePath);
  });

ipcMain.handle('check-file-exists', (_, filePath) => {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());
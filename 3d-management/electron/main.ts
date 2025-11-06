/// <reference types="node" />

import { app, BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron';
import path from 'path';
import fs from 'fs';

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const isDev = !!VITE_DEV_SERVER_URL;
const DIST_PATH = isDev
  ? path.join(__dirname, '../dist')
  : path.join(process.resourcesPath, 'dist');
const PUBLIC_PATH = isDev
  ? path.join(__dirname, '../public')
  : DIST_PATH;
const ICON_PATH = (() => {
  const candidate = path.join(PUBLIC_PATH, 'vite.svg');
  return fs.existsSync(candidate) ? candidate : undefined;
})();

function createWindow() {
  const windowOptions: BrowserWindowConstructorOptions = {
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  };

  if (ICON_PATH) {
    windowOptions.icon = ICON_PATH;
  }

  const win = new BrowserWindow(windowOptions);

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('main-process-message', (new Date).toLocaleString())
  });
  
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(DIST_PATH, 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

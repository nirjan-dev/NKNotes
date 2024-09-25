import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import {
  CreateNote,
  createNote,
  DeleteNote,
  deleteNote,
  GetNotes,
  getNotes,
  ReadNote,
  readNote,
  writeNote,
  WriteNote,
} from 'app/src-electron/services/fileManager';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    center: true,
    title: 'Markdown Notes',
    frame: false,
    vibrancy: 'under-window',
    titleBarStyle: 'hidden',
    trafficLightPosition: {
      x: 15,
      y: 15,
    },
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(() => {
  ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) =>
    getNotes(...args)
  );

  ipcMain.handle('readNote', (_, ...args: Parameters<ReadNote>) =>
    readNote(...args)
  );

  ipcMain.handle('writeNote', (_, ...args: Parameters<WriteNote>) =>
    writeNote(...args)
  );

  ipcMain.handle('createNote', (_, ...args: Parameters<CreateNote>) =>
    createNote(...args)
  );

  ipcMain.handle('deleteNote', (_, ...args: Parameters<DeleteNote>) =>
    deleteNote(...args)
  );

  createWindow();
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

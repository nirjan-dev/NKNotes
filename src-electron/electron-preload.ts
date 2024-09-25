/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import {
  CreateNote,
  DeleteNote,
  GetNotes,
  ReadNote,
  WriteNote,
} from 'app/src-electron/services/fileManager';
import { contextBridge, ipcRenderer } from 'electron';

if (!process.contextIsolated) {
  throw new Error('contextIsolated must be enabled in the BrowserWindow');
}

export const context = {
  locale: navigator.language,
  getNotes: ((...args: Parameters<GetNotes>) =>
    ipcRenderer.invoke('getNotes', ...args)) as unknown as GetNotes,
  readNote: ((...args: Parameters<ReadNote>) =>
    ipcRenderer.invoke('readNote', ...args)) as unknown as ReadNote,
  writeNote: ((...args: Parameters<WriteNote>) =>
    ipcRenderer.invoke('writeNote', ...args)) as unknown as WriteNote,
  createNote: ((...args: Parameters<CreateNote>) =>
    ipcRenderer.invoke('createNote', ...args)) as unknown as CreateNote,
  deleteNote: ((...args: Parameters<DeleteNote>) =>
    ipcRenderer.invoke('deleteNote', ...args)) as unknown as DeleteNote,
};

try {
  contextBridge.exposeInMainWorld('context', context);
} catch (error) {
  console.error('Failed to expose context in main world', error);
}

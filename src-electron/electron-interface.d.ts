import { context } from 'app/src-electron/electron-preload';

export type ElectronContext = typeof context;

declare global {
  interface Window {
    context: ElectronContext;
  }
}

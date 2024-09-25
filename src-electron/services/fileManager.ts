import { dialog } from 'electron';
import {
  access,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'fs/promises';
import { homedir } from 'os';
import path from 'path';
import { NoteContent, NoteInfo } from 'src/types/models';

const appDirectoryName = 'NKNotes';
const fileEncoding = 'utf-8';

export type GetNotes = () => Promise<NoteInfo[]>;

export function getRootDir() {
  return `${homedir()}/${appDirectoryName}`;
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir();

  try {
    await access(rootDir);
  } catch (error) {
    await mkdir(rootDir);

    console.info(__dirname, 'directoryyyyyyyyy');
    const WELCOME_NOTE_NAME = 'welcomeNote';
    const welcomeNotePath = path.resolve(
      __dirname,
      process.env.QUASAR_PUBLIC_FOLDER,
      'assets'
    );
    const contents = await readFile(
      `${welcomeNotePath}/${WELCOME_NOTE_NAME}.md`,
      fileEncoding
    );

    await writeFile(
      `${rootDir}/${WELCOME_NOTE_NAME}.md`,
      contents,
      fileEncoding
    );
  }

  const fileNames = await readdir(rootDir);

  const notes = fileNames.filter((fileName) => fileName.endsWith('.md'));

  return Promise.all(notes.map(getNoteInfoFromFilename));
};

async function getNoteInfoFromFilename(filename: string): Promise<NoteInfo> {
  const fileStats = await stat(`${getRootDir()}/${filename}`);

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs,
  };
}

export type ReadNote = (title: NoteInfo['title']) => Promise<NoteContent>;
export const readNote: ReadNote = async (title) => {
  const rootDir = getRootDir();

  return readFile(`${rootDir}/${title}.md`, fileEncoding);
};

export type WriteNote = (
  title: NoteInfo['title'],
  content: NoteContent
) => Promise<void>;

export const writeNote: WriteNote = async (title, content) => {
  const rootDir = getRootDir();
  const filePath = `${rootDir}/${title}.md`;

  return writeFile(filePath, content, fileEncoding);
};

export type CreateNote = () => Promise<NoteInfo['title'] | false>;

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir();

  try {
    await access(rootDir);

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Create Note',
      defaultPath: `${rootDir}/Untitled.md`,
      properties: ['showOverwriteConfirmation'],
      showsTagField: false,
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });

    if (canceled) {
      console.log('Notes creation cancelled');

      return false;
    }

    const { name: filename, dir: parentDir } = path.parse(filePath);

    if (parentDir !== rootDir) {
      await dialog.showMessageBox({
        type: 'error',
        title: 'Invalid path',
        message: `Note can only be created in the ${rootDir} directory`,
      });

      return false;
    }

    console.info(`Creating new note: ${filePath}`);

    await writeFile(filePath, '', fileEncoding);

    return filename.replace(/\.md$/, '');
  } catch (error) {
    console.error(error);

    return false;
  }
};

export type DeleteNote = (title: NoteInfo['title']) => Promise<boolean>;

export const deleteNote: DeleteNote = async (title) => {
  const rootDir = getRootDir();

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: 'Are you sure you want to delete this note?',
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
  });

  if (response === 1) {
    console.info(`Note deletion cancelled: ${title}`);
    return false;
  }

  console.info(`Deleting note: ${title}`);
  try {
    await rm(`${rootDir}/${title}.md`);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

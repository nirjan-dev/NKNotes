import { dialog } from 'electron';
import { access, readdir, readFile, stat, writeFile } from 'fs/promises';
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

    const fileNames = await readdir(rootDir);

    const notes = fileNames.filter((fileName) => fileName.endsWith('.md'));

    return Promise.all(notes.map(getNoteInfoFromFilename));
  } catch (error) {
    console.error(error);
    return [];
  }
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

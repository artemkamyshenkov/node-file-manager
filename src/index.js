import readline from 'node:readline';
import path from 'path';
import os from 'os';
import {
  printCurrentDirectory,
  getUsername,
  greetMessage,
  byeMessage,
} from './messages/index.js';
import { promises as fsPromises, constants } from 'fs';

const homeDirectory = os.homedir();
let currentDirectory = homeDirectory;
console.log(greetMessage(getUsername()));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const navigateUp = () => {
  const parentDirectory = path.resolve(currentDirectory, '..');
  if (currentDirectory !== parentDirectory) {
    process.chdir(parentDirectory);
    currentDirectory = parentDirectory;
  }
};
async function navigateToDirectory(directory) {
  try {
    const targetDirectory = path.resolve(currentDirectory, directory);
    await fsPromises.access(targetDirectory, constants.F_OK);
    process.chdir(targetDirectory);
    currentDirectory = targetDirectory;
  } catch (error) {
    console.log('Operation failed');
  } finally {
    printCurrentDirectory(currentDirectory);
  }
}

// TODO: Сортировка + индексы + подпись файл или папка в заголовке
async function printFilesAndFolders() {
  const files = await fsPromises.readdir(currentDirectory, {
    withFileTypes: true,
  });
  const folders = files
    ?.filter((file) => file.isDirectory())
    .sort((a, b) => a?.name.localeCompare(b?.name))
    .map((file, idx) => `${idx + 1}. ${file.name} | Type: directory`);

  const filesInFolder = files
    ?.filter((file) => file.isFile())
    .sort((a, b) => a?.name.localeCompare(b?.name))
    .map((file, idx) => `${idx + 1}. ${file.name} | Type: file`);

  console.log('Folders:');
  folders.forEach((folder) => console.log(folder));
  console.log('Files: ');
  filesInFolder.forEach((file) => console.log(file));
}

const handleCommand = (command) => {
  if (command === '.exit') {
    rl.close();
  } else if (command === 'up') {
    navigateUp();
    printCurrentDirectory(currentDirectory);
  } else if (command.startsWith('cd')) {
    const dir = command.slice(3).trim();
    navigateToDirectory(dir);
  } else if (command === 'ls') {
    printFilesAndFolders();
  } else {
    console.log('Invalid input');
  }
};

rl.on('line', (data) => {
  handleCommand(data.trim());
});

rl.on('close', () => {
  console.log(byeMessage(getUsername()));
  process.exit(0);
});

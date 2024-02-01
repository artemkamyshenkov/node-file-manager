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
import { readFileByPath } from './files/read.js';
import { createFile } from './files/create.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const homeDirectory = os.homedir();
// TODO: вынести в глобальную переменную
let currentDirectory = homeDirectory;

console.log(greetMessage(getUsername()));

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
  } else if (command.startsWith('cat')) {
    const pathToFile = command.slice(3).trim();
    readFileByPath(currentDirectory, pathToFile, printCurrentDirectory);
  } else if (command.startsWith('add')) {
    const fileName = command.slice(3).trim();
    createFile(currentDirectory, fileName, printCurrentDirectory);
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

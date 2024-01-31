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

const handleCommand = (command) => {
  if (command === '.exit') {
    rl.close();
  } else if (command === 'up') {
    navigateUp();
    printCurrentDirectory(currentDirectory);
  } else if (command.startsWith('cd')) {
    const dir = command.slice(3).trim();
    navigateToDirectory(dir);
  }
};

rl.on('line', (data) => {
  handleCommand(data.trim());
});

rl.on('close', () => {
  console.log(byeMessage(getUsername()));
  process.exit(0);
});

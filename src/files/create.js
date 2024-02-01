import { promises as fsPromises, constants } from 'fs';
import path from 'path';

export const createFile = async (currentDirectory, targetFilePath, cb) => {
  const newFilePath = path.join(currentDirectory, targetFilePath);
  try {
    await fsPromises.access(currentDirectory, constants.F_OK);
    await fsPromises.access(newFilePath, constants.W_OK);
    console.log('Operation failed');
  } catch (error) {
    await fsPromises.writeFile(newFilePath, '');
  } finally {
    cb(currentDirectory);
  }
};

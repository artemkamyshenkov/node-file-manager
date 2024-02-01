import { promises as fsPromises, constants } from 'fs';
import path from 'path';

export const readFileByPath = async (currentDirectory, targetFilePath, cb) => {
  try {
    const filePath = path.join(currentDirectory, targetFilePath);
    console.log('read', filePath);
    await fsPromises.access(filePath, constants.F_OK);
    const read = await fsPromises.readFile(filePath, 'utf-8');
    console.log(read);
  } catch (error) {
    console.log('Operation failed');
  } finally {
    cb(currentDirectory);
  }
};

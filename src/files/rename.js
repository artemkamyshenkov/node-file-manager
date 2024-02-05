import { promises as fsPromises, constants } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const renameFile = async (
  currentDirectory,
  pathToFile,
  newFileName,
  cb,
) => {
  const isRenameFileWithExt = newFileName.split('.').length > 1;
  const extension = pathToFile.split('.').pop();
  const newFileNameWithExt = isRenameFileWithExt
    ? newFileName
    : `${newFileName}.${extension}`;
  const originFilePath = path.join(currentDirectory, pathToFile);
  const renameFilePath = path.join(currentDirectory, newFileNameWithExt);

  try {
    await fsPromises.access(originFilePath, constants.F_OK);
    try {
      await fsPromises.access(renameFilePath, constants.F_OK);
      throw new Error();
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fsPromises.rename(originFilePath, renameFilePath);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log('Operation failed');
  } finally {
    cb(currentDirectory);
  }
};

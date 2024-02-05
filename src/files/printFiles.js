import { promises as fsPromises } from 'fs';

export async function printFilesAndFolders(currentDirectory) {
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

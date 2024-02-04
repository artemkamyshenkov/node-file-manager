export const getOsArgs = (command) => {
  return command?.split('--')[1];
};

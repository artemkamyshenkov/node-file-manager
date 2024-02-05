export const getCommandArgs = (command) => {
  if (!command) {
    return '';
  }
  const commandArr = command.split(' ');
  return {
    action: commandArr[0],
    pathFrom: commandArr[1],
    pathTo: commandArr[2],
  };
};

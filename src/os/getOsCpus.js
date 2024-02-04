import os from 'os';

export const getOsCpus = () => {
  const cpus = os.cpus();
  console.log(`Total: ${cpus?.length}`);

  cpus.forEach((cpu, idx) => {
    console.log(`${idx + 1}. ${cpu.model}, ${cpu.speed} GHz`);
  });
};

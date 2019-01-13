import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import requireFromString from 'require-from-string';

const exec = promisify(execCB);

export default {
  executeCommand: async (command, value) => {
    switch (command.type) {
      case 'string':
        return command.value.replace('%v', value);
      case 'command':
        return (await exec(command.value.replace('%v', value))).stdout.trim();
      case 'javascript':
        return requireFromString(command.value)(value);
      default:
        return '';
    }
  },
};

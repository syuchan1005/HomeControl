import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import requireFromString from 'require-from-string';

const exec = promisify(execCB);

export default {
  executeCommand: async (command, value) => {
    switch (command.type) {
      case 'string':
        return this.replaceString(command.value, value);
      case 'command':
        return (await exec(this.replaceString(command.value, value))).stdout.trim();
      case 'javascript':
        return requireFromString(command.value)(value);
      default:
        return '';
    }
  },
  replaceString: (str, value) => {
    if (typeof value === 'string') return str.replace('%v', value);
    return Object.keys(value).reduce((s, k) => s.replace(`%${k}`, s[k]), str);
  },
};

import { execSync } from 'child_process';

class Brightness {
  static get key() {
    return 'action.devices.traits.Brightness';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [Brightness.key],
    };
  }

  query() {
    return {
      brightness: parseInt(execSync(this.info.getCommand).toString(), 10),
    };
  }

  execute(execution) {
    execSync(this.info.setCommand.replace('%v', execution.params.brightness));
    return execution.params;
  }
}

export default Brightness;

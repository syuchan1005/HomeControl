import { execSync } from 'child_process';

class OnOff {
  static get key() {
    return 'action.devices.traits.OnOff';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [OnOff.key],
    };
  }

  query() {
    return {
      on: execSync(this.info.getCommand).toString().trim().toLowerCase() === 'true',
    };
  }

  execute(execution) {
    execSync(this.info.setCommand.replace('%v', execution.params.on));
    return execution.params;
  }
}

export default OnOff;

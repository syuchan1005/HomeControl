import { execSync } from 'child_process';

class Modes {
  static get key() {
    return 'action.devices.traits.Modes';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [Modes.key],
      availableModes: this.info.modes.map(m => Object.assign(m, { ordered: false })),
    };
  }

  query() {
    return {
      currentModeSettings: execSync(this.info.getCommand).toString(),
    };
  }

  execute(execution) {
    execSync(this.info.setCommand.replace('%v', execution.params.updateModeSettings));
    return {
      currentModeSettings: execSync(this.info.getCommand).toString(),
    };
  }
}

export default Modes;

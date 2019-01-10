import { execSync } from 'child_process';

class Toggles {
  static get key() {
    return 'action.devices.traits.Toggles';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [Toggles.key],
      attributes: {
        availableToggles: this.info.toggles,
      },
    };
  }

  query() {
    return {
      currentToggleSettings: JSON.parse(execSync(this.info.getCommand).toString()),
    };
  }

  execute(execution) {
    Object.keys(execution.params.updateToggleSettings).forEach((key) => {
      execSync(this.info.setCommand.replace('%toggle', key).replace('%value', execution.params.updateToggleSettings[key]));
    });
    return execution.params;
  }
}

export default Toggles;

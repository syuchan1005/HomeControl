import Util from '../../../Util';

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
      currentToggleSettings: JSON.parse(Util.executeCommand(this.info.getCommand)),
    };
  }

  execute(execution) {
    Object.keys(execution.params.updateToggleSettings).forEach((key) => {
      Util.executeCommand(this.info.setCommand, {
        key,
        value: execution.params.updateToggleSettings[key],
      });
    });
    return execution.params;
  }
}

export default Toggles;

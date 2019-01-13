import Util from '../../../Util';

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

  async query() {
    return {
      on: (await Util.executeCommand(this.info.getCommand)).trim().toLowerCase() === 'true',
    };
  }

  execute(execution) {
    Util.executeCommand(this.info.setCommand, execution.params.on);
    return execution.params;
  }
}

export default OnOff;

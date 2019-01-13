import Util from '../../../Util';

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

  async query() {
    return {
      brightness: parseInt(await Util.executeCommand(this.info.getCommand), 10),
    };
  }

  execute(execution) {
    Util.executeCommand(this.info.setCommand, execution.params.brightness);
    return execution.params;
  }
}

export default Brightness;

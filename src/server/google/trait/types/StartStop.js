import { execSync } from 'child_process';

class StartStop {
  static get key() {
    return 'action.devices.traits.StartStop';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [StartStop.key],
      attributes: {
        pausable: true,
        availableZones: ['kitchen'],
      },
    };
  }

  query() {
    return JSON.parse(execSync(this.info.getCommand).toString());
  }

  execute(execution) {
    switch (execution.command) {
      case 'action.devices.commands.StartStop':
        if (execution.params.start) execSync(this.info.startCommand.replace('%v', execution.params.on));
        else execSync(this.info.stopCommand.replace('%v', execution.params.on));
        break;
      case 'action.devices.commands.PauseUnpause':
        if (execution.params.pause) execSync(this.info.pauseCommand.replace('%v', execution.params.on));
        else execSync(this.info.unPauseCommand.replace('%v', execution.params.on));
        break;
      default:
        return {};
    }
    return this.query();
  }
}

export default StartStop;

import { execSync } from 'child_process';

class FanSpeed {
  static get key() {
    return 'action.devices.traits.FanSpeed';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [FanSpeed.key],
      attributes: {
        availableFanSpeeds: {
          speeds: this.info.speeds,
          ordered: true,
        },
        reversible: false,
      },
    };
  }

  query() {
    return {
      currentFanSpeedSetting: execSync(this.info.getCommand).toString(),
    };
  }

  execute(execution) {
    switch (execution.command) {
      case 'action.devices.commands.SetFanSpeed':
        execSync(this.info.setCommand.replace('%v', execution.params.fanSpeed));
        return {
          currentFanSpeedSetting: execution.params.fanSpeed,
        };
      // case 'action.devices.commands.Reverse':
      default:
        return {};
    }
  }
}

export default FanSpeed;

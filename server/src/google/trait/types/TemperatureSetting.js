import { execSync } from 'child_process';

class TemperatureSetting {
  static get key() {
    return 'action.devices.traits.TemperatureSetting';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [TemperatureSetting.key],
      attributes: {
        availableThermostatModes: this.info.modes.join(','),
        thermostatTemperatureUnit: 'C',
      },
    };
  }

  query() {
    return JSON.parse(execSync(this.info.getCommand).toString());
  }

  execute(execution) {
    switch (execution.command) {
      case 'action.devices.commands.ThermostatTemperatureSetpoint':
        execSync(this.info.setCommand.replace('%v', execution.params.thermostatTemperatureSetpoint));
        break;
      case 'action.devices.commands.ThermostatTemperatureSetRange':
        execSync(this.info.setHighCommand.replace('%v', execution.params.thermostatTemperatureSetpointHigh));
        execSync(this.info.setLowCommand.replace('%v', execution.params.thermostatTemperatureSetpointLow));
        break;
      case 'action.devices.commands.ThermostatSetMode':
        execSync(this.info.setModeCommand.replace('%v', execution.params.thermostatMode));
        break;
      default:
        break;
    }
    return this.query();
  }
}

export default TemperatureSetting;

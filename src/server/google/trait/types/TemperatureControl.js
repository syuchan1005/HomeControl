import { execSync } from 'child_process';

class TemperatureControl {
  static get key() {
    return 'action.devices.traits.TemperatureControl';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [TemperatureControl.key],
      attributes: {
        temperatureRange: {
          minThresholdCelsius: this.info.minTemp,
          maxThresholdCelsius: this.info.maxTemp,
        },
        temperatureStepCelsius: this.info.stepTemp,
        temperatureUnitForUX: 'C',
      },
    };
  }

  query() {
    return {
      temperatureSetpointCelsius: parseInt(execSync(this.info.getSetpointCommand).toString(), 10),
      temperatureAmbientCelsius: parseInt(execSync(this.info.getNowTempCommand).toString(), 10),
    };
  }

  execute(execution) {
    execSync(this.info.setCommand.replace('%v', execution.params.temperature));
    return this.query();
  }
}

export default TemperatureControl;

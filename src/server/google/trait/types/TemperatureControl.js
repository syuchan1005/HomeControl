class TemperatureControl {
  static get key() {
    return 'action.devices.traits.TemperatureControl';
  }

  constructor(min, max, step, setCel, nowCel) {
    this.min = min;
    this.max = max;
    this.step = step;
    this.setCel = setCel;
    this.nowCel = nowCel;
  }

  sync() {
    return {
      traits: [TemperatureControl.key],
      attributes: {
        temperatureRange: {
          minThresholdCelsius: this.min,
          maxThresholdCelsius: this.max,
        },
        temperatureStepCelsius: this.step,
        temperatureUnitForUX: 'C',
      },
    };
  }

  query() {
    return {
      temperatureSetpointCelsius: this.setCel,
      temperatureAmbientCelsius: this.nowCel,
    };
  }

  static init() {
    return new TemperatureControl(20, 30, 1, 23, 25);
  }
}

export default TemperatureControl;

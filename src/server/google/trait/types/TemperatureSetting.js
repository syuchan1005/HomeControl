class TemperatureSetting {
  static get key() {
    return 'action.devices.traits.TemperatureSetting';
  }

  constructor(modes, mode, setCel, nowCel) {
    this.modes = modes;
    this.mode = mode;
    this.setCel = setCel;
    this.nowCel = nowCel;
  }

  sync() {
    return {
      traits: [TemperatureSetting.key],
      attributes: {
        availableThermostatModes: this.modes.join(','),
        thermostatTemperatureUnit: 'C',
      },
    };
  }

  query() {
    return {
      thermostatMode: this.mode,
      thermostatTemperatureSetpoint: this.setCel,
      thermostatTemperatureAmbient: this.nowCel,
    };
  }

  static init() {
    return new TemperatureSetting(['off', 'on', 'cool', 'hot'], 'cool', 23, 25);
  }
}

export default TemperatureSetting;

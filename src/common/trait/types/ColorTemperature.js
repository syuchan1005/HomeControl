class ColorTemperature {
  static get key() {
    return 'action.devices.traits.ColorTemperature';
  }

  constructor(kelvin) {
    this.kelvin = kelvin;
  }

  sync() {
    return {
      traits: [ColorTemperature.key],
      attributes: {
        temperatureMinK: 2000,
        temperatureMaxK: 6500,
      },
    };
  }

  query() {
    return {
      color: {
        name: 'white',
        temperature: this.kelvin,
      },
    };
  }

  static init() {
    return new ColorTemperature(2000);
  }
}

export default ColorTemperature;

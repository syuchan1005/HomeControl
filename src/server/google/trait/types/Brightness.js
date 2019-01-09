class Brightness {
  static get key() {
    return 'action.devices.traits.Brightness';
  }

  constructor(/* info */) {
    this.brightness = 20;
  }

  sync() {
    return {
      traits: [Brightness.key],
    };
  }

  query() {
    return {
      brightness: this.brightness,
    };
  }

  static init() {
    return new Brightness(0);
  }
}

export default Brightness;

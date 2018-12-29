class OnOff {
  static get key() {
    return 'action.devices.traits.OnOff';
  }

  constructor(isOn) {
    this.isOn = isOn;
  }

  sync() {
    return {
      traits: [OnOff.key],
    };
  }

  query() {
    return {
      on: this.isOn,
    };
  }

  static init() {
    return new OnOff(false);
  }
}

export default OnOff;

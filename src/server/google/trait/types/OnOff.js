class OnOff {
  static get key() {
    return 'action.devices.traits.OnOff';
  }

  constructor(info) {
    this.isOn = !!info;
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

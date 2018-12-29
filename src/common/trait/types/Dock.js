class Dock {
  static get key() {
    return 'action.devices.traits.Dock';
  }

  constructor(isDocked) {
    this.isDocked = isDocked;
  }

  sync() {
    return {
      traits: [Dock.key],
    };
  }

  query() {
    return {
      isDocked: this.isDocked,
    };
  }

  static init() {
    return new Dock(false);
  }
}

export default Dock;

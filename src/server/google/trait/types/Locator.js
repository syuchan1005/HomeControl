class Locator {
  static get key() {
    return 'action.devices.traits.Locator';
  }

  sync() {
    return {
      traits: [Locator.key],
    };
  }

  query() {
    return {};
  }

  static init() {
    return new Locator();
  }
}

export default Locator;

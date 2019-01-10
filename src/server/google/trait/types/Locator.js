import { execSync } from 'child_process';

class Locator {
  static get key() {
    return 'action.devices.traits.Locator';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [Locator.key],
    };
  }

  query() {
    return {};
  }

  execute(/* execution */) {
    return {
      generatedAlert: execSync(this.info.getCommand).toString().trim().toLowerCase() === 'true',
    };
  }
}

export default Locator;

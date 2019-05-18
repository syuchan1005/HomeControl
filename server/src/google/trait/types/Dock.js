import { execSync } from 'child_process';

class Dock {
  static get key() {
    return 'action.devices.traits.Dock';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [Dock.key],
    };
  }

  query() {
    return {
      isDocked: execSync(this.info.getCommand).toString().trim().toLowerCase() === 'true',
    };
  }

  execute(/* execution */) {
    return this.query();
  }
}

export default Dock;

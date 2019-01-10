import { execSync } from 'child_process';

class RunCycle {
  static get key() {
    return 'action.devices.traits.RunCycle';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [RunCycle.key],
    };
  }

  query() {
    return JSON.parse(execSync(this.info.getCommand).toString());
  }

  execute(/* execution */) {
    return {};
  }
}

export default RunCycle;

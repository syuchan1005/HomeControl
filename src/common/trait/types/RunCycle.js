class RunCycle {
  static get key() {
    return 'action.devices.traits.RunCycle';
  }

  constructor(runCycle, totalTime, cycleTime) {
    this.runCycle = runCycle;
    this.totalTime = totalTime;
    this.cycleTime = cycleTime;
  }

  sync() {
    return {
      traits: [RunCycle.key],
    };
  }

  query() {
    return {
      currentRunCycle: this.runCycle,
      currentTotalRemainingTime: this.totalTime,
      currentCycleRemainingTime: this.cycleTime,
    };
  }

  static init() {
    return new RunCycle([{
      currentCycle: 'rinse',
      nextCycle: 'spin',
      lang: 'en',
    }], 600, 300);
  }
}

export default RunCycle;

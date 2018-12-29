class StartStop {
  static get key() {
    return 'action.devices.traits.StartStop';
  }

  constructor(isRunning, isPaused) {
    this.isRunning = isRunning;
    this.isPaused = isPaused;
  }

  sync() {
    return {
      traits: [StartStop.key],
      attributes: {
        pausable: true,
      },
    };
  }

  query() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
    };
  }

  static init() {
    return new StartStop(false, false);
  }
}

export default StartStop;

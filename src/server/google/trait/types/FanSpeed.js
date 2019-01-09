class FanSpeed {
  static get key() {
    return 'action.devices.traits.FanSpeed';
  }

  constructor(speeds, speedName) {
    this.speeds = speeds;
    this.speedName = speedName;
  }

  sync() {
    return {
      traits: [FanSpeed.key],
      attributes: {
        availableFanSpeeds: {
          speeds: this.speeds,
          ordered: true,
        },
        reversible: true,
      },
    };
  }

  query() {
    return {
      currentFanSpeedSetting: this.speedName,
    };
  }

  static init() {
    return new FanSpeed([{
      speed_name: 'Low',
      speed_values: [{
        speed_synonym: ['low', 'slow'],
        lang: 'en',
      }],
    }], 'Low');
  }
}

export default FanSpeed;

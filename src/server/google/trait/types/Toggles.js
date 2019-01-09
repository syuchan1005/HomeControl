class Toggles {
  static get key() {
    return 'action.devices.traits.Toggles';
  }

  constructor(toggles, setting) {
    this.toggles = toggles;
    this.setting = setting;
  }

  sync() {
    return {
      traits: [Toggles.key],
      attributes: {
        availableToggles: this.toggles,
      },
    };
  }

  query() {
    return {
      currentToggleSettings: this.setting,
    };
  }

  static init() {
    return new Toggles([{
      name: 'sterilization',
      name_values: [{
        name_synonym: ['bio-clean', 'ultrasound'],
        lang: 'en',
      }],
    },
    {
      name: 'energysaving',
      name_values: [{
        name_synonym: ['normal', 'medium', 'high'],
        lang: 'en',
      }],
    }], {
      'sterilization ': true,
    });
  }
}

export default Toggles;

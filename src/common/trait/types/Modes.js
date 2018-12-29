class Modes {
  static get key() {
    return 'action.devices.traits.Modes';
  }

  constructor(modes, modeSetting) {
    this.modes = modes;
    this.modeSetting = modeSetting;
  }

  sync() {
    return {
      traits: [Modes.key],
      attributes: {
        availableModes: this.modes,
      },
    };
  }

  query() {
    return {
      currentModeSettings: this.modeSetting,
    };
  }

  static init() {
    return new Modes([{
      name: 'load',
      name_values: [{
        name_synonym: ['load', 'size', 'load size'],
        lang: 'en',
      }],
      settings: [{
        setting_name: 'small',
        setting_values: [{
          setting_synonym: ['small', 'half'],
          lang: 'en',
        }],
      }, {
        setting_name: 'large',
        setting_values: [{
          setting_synonym: ['large', 'full'],
          lang: 'en',
        }],
      }],
      ordered: true,
    }], {
      size: 'large',
      load: 'large',
    });
  }
}

export default Modes;

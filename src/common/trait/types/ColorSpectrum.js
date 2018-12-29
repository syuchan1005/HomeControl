class ColorSpectrum {
  static get key() {
    return 'action.devices.traits.ColorSpectrum';
  }

  constructor(name, color) {
    this.color = {
      name,
      spectrumRGB: color,
    };
  }

  sync() {
    return {
      traits: [ColorSpectrum.key],
      attributes: {
        colorModel: 'rgb',
      },
    };
  }

  query() {
    return {
      color: this.color,
    };
  }

  static init() {
    return new ColorSpectrum('white', 0xFFFFFF);
  }
}

export default ColorSpectrum;

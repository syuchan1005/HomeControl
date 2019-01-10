import { execSync } from 'child_process';

class ColorSetting {
  static get key() {
    return 'action.devices.traits.ColorSetting';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [ColorSetting.key],
      attributes: {
        colorModel: 'rgb',
        colorTemperatureRange: {
          temperatureMinK: this.info.tempMinK,
          temperatureMaxK: this.info.tempMaxK,
        },
        commandOnlyColorSetting: true,
      },
    };
  }

  query() {
    return {
      color: {
        spectrumRgb: parseInt(execSync(this.info.getCommand).toString(), 10),
      },
    };
  }

  execute(execution) {
    execSync(this.info.setCommand.replace('%v', execution.params.color.spectrumRGB));
    return {
      color: {
        spectrumRGB: execution.params.color.spectrumRGB,
      },
    };
  }
}

export default ColorSetting;

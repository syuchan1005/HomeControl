import Sequelize from 'sequelize';

export default class Databese {
  constructor(storage) {
    this.db = new Sequelize({
      dialect: 'sqlite',
      storage,
    });
    this.models = {
      user: this.db.define('user', {
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        accessToken: {
          type: Sequelize.STRING,
        },
        accessTokenExpiresAt: {
          type: Sequelize.DATE,
        },
        refreshToken: {
          type: Sequelize.STRING,
        },
        refreshTokenExpiresAt: {
          type: Sequelize.DATE,
        },
      }),
      device: this.db.define('device', {
        type: {
          type: Sequelize.ENUM(
            'ACUnit',
            'AirPurifier',
            'Camera',
            'CoffeeMaker',
            'DishWasher',
            'Dryer',
            'Fan',
            'Kettle',
            'Light',
            'Outlet',
            'Oven',
            'Refrigerator',
            'Scene',
            'Sprinkler',
            'Switch',
            'Thermostat',
            'Vacuum',
            'Washer',
          ),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        defaultNames: {
          type: Sequelize.STRING,
          allowNull: false,
          // sample: 'test,testA,testB',
        },
        nicknames: {
          type: Sequelize.STRING,
          allowNull: false,
          // sample: 'test,testA,testB',
        },
        // userId
      }),
      trait: this.db.define('trait', {
        type: {
          type: Sequelize.ENUM(
            'Brightness',
            'CameraStream',
            'ColorSpectrum',
            'ColorTemperature',
            'Dock',
            'FanSpeed',
            'Locator',
            'Modes',
            'OnOff',
            'RunCycle',
            'Scene',
            'StartStop',
            'TemperatureControl',
            'TemperatureSetting',
            'Toggles',
          ),
          allowNull: false,
        },
        info: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        // deviceId
      }),
    };
    this.models.user.hasMany(this.models.device, { foreignKey: 'userId' });
    this.models.device.belongsTo(this.models.user, { foreignKey: 'userId' });

    this.models.device.hasMany(this.models.trait, { foreignKey: 'deviceId' });
    this.models.trait.belongsTo(this.models.device, { foreignKey: 'deviceId' });
  }

  async init() {
    Object.keys(this.models)
      .reduce((p, k) => p.then(this.models[k].sync()),
        this.db.authenticate());
  }
}

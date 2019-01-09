import Sequelize from 'sequelize';
import debug from 'debug';

import Trait from './google/trait';
import CommandTypes from './google/CommandTypes';

export default class Databese {
  constructor(storage) {
    this.db = new Sequelize({
      dialect: 'sqlite',
      storage,
      logging: debug('home_control:sql'),
      operatorsAliases: false,
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
      }),
      token: this.db.define('token', {
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
        scope: {
          type: Sequelize.STRING,
        },
        clientId: {
          type: Sequelize.STRING,
        },
        /* userId */
      }),
      authorizationToken: this.db.define('authorizationToken', {
        code: {
          type: Sequelize.STRING,
        },
        expiresAt: {
          type: Sequelize.DATE,
        },
        redirectUri: {
          type: Sequelize.STRING,
        },
        scope: {
          type: Sequelize.STRING,
        },
        clientId: {
          type: Sequelize.STRING,
        },
        /* userId */
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
    this.models.user.hasMany(this.models.token, { foreignKey: 'userId' });
    this.models.token.belongsTo(this.models.user, { foreignKey: 'userId' });
    this.models.user.hasMany(this.models.authorizationToken, { foreignKey: 'userId' });
    this.models.authorizationToken.belongsTo(this.models.user, { foreignKey: 'userId' });

    this.models.user.hasMany(this.models.device, { foreignKey: 'userId' });
    this.models.device.belongsTo(this.models.user, { foreignKey: 'userId' });

    this.models.device.hasMany(this.models.trait, { foreignKey: 'deviceId' });
    this.models.trait.belongsTo(this.models.device, { foreignKey: 'deviceId' });

    // eslint-disable-next-line
    this.models.device.prototype.execute = async function (execution) {
      const type = CommandTypes[execution.command];
      if (!type) {
        return {
          ids: [`${this.id}`],
          states: execution.params,
        };
      }
      const traits = await this.getTraits({ where: { type } });
      if (!traits || traits.length !== 1) {
        return {
          ids: [`${this.id}`],
          states: execution.params,
        };
      }

      return {
        ids: [`${this.id}`],
        states: traits[0].toTraitObject().execute(execution),
      };
    };
    // eslint-disable-next-line
    this.models.trait.prototype.toTraitObject = function () {
      return new Trait[this.type](JSON.parse(this.info), this.id);
    };
  }

  async init() {
    Object.keys(this.models)
      .reduce((p, k) => p.then(this.models[k].sync()),
        this.db.authenticate());
  }
}

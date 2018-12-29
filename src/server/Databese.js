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
    };
  }

  async init() {
    Object.keys(this.models)
      .reduce((p, k) => p.then(this.models[k].sync()),
        this.db.authenticate());
  }
}

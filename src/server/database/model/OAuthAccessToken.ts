import { Association, Model, DataTypes } from 'sequelize';

import { User } from './User';

// eslint-disable-next-line import/prefer-default-export
export class OAuthAccessToken extends Model {
  public accessToken!: string;

  public clientId: number | null;

  public userId!: number;

  public expiredAt: Date;

  public readonly user: User;

  public static association: {
    user: Association<User, OAuthAccessToken>;
  };

  public static initModel(sequelize) {
    OAuthAccessToken.init({
      accessToken: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      clientId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      expiredAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      tableName: 'accessTokens',
      timestamps: false,
    });

    return 'accessTokens';
  }

  public static associate() {
    OAuthAccessToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }
}

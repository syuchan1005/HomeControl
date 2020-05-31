import { Association, Model, DataTypes } from 'sequelize';

import { User } from './User';

// eslint-disable-next-line import/prefer-default-export
export class OAuthRefreshToken extends Model {
  public refreshToken!: string;

  public clientId: number | null;

  public userId!: number;

  public expiredAt: Date;

  public readonly user: User;

  public static association: {
    user: Association<User, OAuthRefreshToken>;
  };

  public static initModel(sequelize) {
    OAuthRefreshToken.init({
      refreshToken: {
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
      tableName: 'refreshTokens',
      timestamps: false,
    });

    return 'refreshTokens';
  }

  public static associate() {
    OAuthRefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }
}

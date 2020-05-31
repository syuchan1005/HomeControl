import { Association, DataTypes, Model } from 'sequelize';
import { User } from './User';

// eslint-disable-next-line import/prefer-default-export
export class LocalToken extends Model {
  public readonly id: number;

  public accessToken: string;

  public accessTokenExpiresAt: Date;

  public refreshToken: string;

  public refreshTokenExpiresAt: Date;

  public clientId: number;

  public userId: number;

  public readonly user: User;

  public static association: {
    user: Association<LocalToken, User>;
  };

  public static initModel(sequelize) {
    LocalToken.init({
      accessToken: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      accessTokenExpiresAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      refreshToken: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      refreshTokenExpiresAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      clientId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'localTokens',
      timestamps: false,
    });

    return 'localTokens';
  }

  public static associate() {
    LocalToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }
}

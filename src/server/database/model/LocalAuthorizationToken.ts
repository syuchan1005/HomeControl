import { Association, DataTypes, Model } from 'sequelize';
import { User } from './User';

// eslint-disable-next-line import/prefer-default-export
export class LocalAuthorizationToken extends Model {
  public readonly id: number;

  public code: string;

  public expiresAt: Date;

  public redirectUri: string;

  public clientId: string;

  public userId: number;

  public readonly user: User;

  public static association: {
    user: Association<LocalAuthorizationToken, User>;
  };

  public static initModel(sequelize) {
    LocalAuthorizationToken.init({
      code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      expiresAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      redirectUri: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      clientId: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'localAuthorizationTokens',
      timestamps: false,
    });
    return 'localAuthorizationTokens';
  }

  public static associate() {
    LocalAuthorizationToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }
}

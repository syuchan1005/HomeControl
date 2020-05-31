import { Model, DataTypes } from 'sequelize';

// import { OAuthAccessToken } from './OAuthAccessToken';
// import { OAuthRefreshToken } from './OAuthRefreshToken';

// eslint-disable-next-line import/prefer-default-export
export class User extends Model {
  public id!: number;

  public username!: string;

  public hash!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  // public static associations: {
  //   accessTokens: Association<User, OAuthAccessToken>;
  //   refreshTokens: Association<User, OAuthRefreshToken>;
  // };

  public static initModel(sequelize) {
    User.init({
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      hash: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      tableName: 'users',
    });

    return 'users';
  }
}

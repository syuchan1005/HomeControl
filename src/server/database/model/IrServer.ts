import { DataTypes, Model } from 'sequelize';

// eslint-disable-next-line import/prefer-default-export
export class IrServer extends Model {
  public host: string;

  public token: string;

  public static initModel(sequelize) {
    IrServer.init({
      host: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      tableName: 'irServers',
      timestamps: false,
    });

    return 'irServers';
  }
}

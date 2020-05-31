import { DataTypes, Model } from 'sequelize';

// eslint-disable-next-line import/prefer-default-export
export class Sensor extends Model {
  public readonly id: number;

  public name: string;

  public dataType: string;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;

  public static initModel(sequelize) {
    Sensor.init({
      name: {
        unique: 'name-type',
        allowNull: false,
        type: DataTypes.STRING,
      },
      dataType: {
        unique: 'name-type',
        allowNull: false,
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      tableName: 'sensors',
    });

    return 'sensors';
  }
}

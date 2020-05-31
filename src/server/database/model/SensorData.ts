import { DataTypes, Model } from 'sequelize';
import { Sensor } from './Sensor';

// eslint-disable-next-line import/prefer-default-export
export class SensorData extends Model {
  public readonly id: number;

  public sensorId: number;

  public value: number;

  public createdAt: Date;

  public static initModel(sequelize) {
    SensorData.init({
      sensorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      value: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      tableName: 'sensorData',
      timestamps: false,
    });

    return 'sensorData';
  }

  public static associate() {
    SensorData.belongsTo(Sensor, { foreignKey: 'sensorId', as: 'sensor' });
  }
}

import { Association, DataTypes, Model } from 'sequelize';
import { DeviceTypeInformation } from '@common/GoogleActionsTypes';

import { User } from '../User';
import { Trait } from './Trait';

// eslint-disable-next-line import/prefer-default-export
export class Device extends Model {
  public readonly id: number;

  public type: keyof typeof DeviceTypeInformation;

  public name: string;

  public willReportState: boolean = true;

  public roomHint: string | null;

  public userId: number;

  public readonly user: User;

  public traits: Array<Trait>;

  public static association: {
    user: Association<Device, User>;
  };

  public static initModel(sequelize) {
    Device.init({
      type: {
        allowNull: false,
        type: DataTypes.STRING, // ENUM(...Object.keys(DeviceTypeInformation)),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      willReportState: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },
      roomHint: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'devices',
    });

    return 'devices';
  }

  public static associate() {
    Device.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Device.hasMany(Trait, { foreignKey: 'deviceId', as: 'traits' });
  }
}

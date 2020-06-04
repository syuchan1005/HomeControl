import { Association, DataTypes, Model } from 'sequelize';
import { TraitTypeInformation } from '@common/GoogleActionsTypes';

import { Device } from './Device';

// eslint-disable-next-line import/prefer-default-export
export class Trait extends Model {
  public readonly id: number;

  public type: keyof typeof TraitTypeInformation;

  public deviceId: number;

  public readonly device: Device;

  public static association: {
    device: Association<Trait, Device>;
  };

  public static initModel(sequelize) {
    Trait.init({
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      deviceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'traits',
    });

    return 'traits';
  }

  public static associate() {
    Trait.belongsTo(Device, { foreignKey: 'deviceId', as: 'device' });
  }
}

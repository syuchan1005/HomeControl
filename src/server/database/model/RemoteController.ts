import { Association, DataTypes, Model } from 'sequelize';

import { User } from './User';
import { RemoteControllerButton } from './RemoteControllerButton';

// eslint-disable-next-line import/prefer-default-export
export class RemoteController extends Model {
  public readonly id: number;

  public name: string;

  public userId: number;

  public readonly user: User;

  public readonly buttons: Array<RemoteControllerButton>;

  public static association: {
    user: Association<RemoteController, User>;
    buttons: Association<RemoteController, RemoteControllerButton>;
  };

  public static initModel(sequelize) {
    RemoteController.init({
      name: {
        unique: 'name-userId',
        allowNull: false,
        type: DataTypes.STRING,
      },
      userId: {
        unique: 'name-userId',
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'remoteControllers',
    });

    return 'remoteControllers';
  }

  public static associate() {
    RemoteController.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    RemoteController.hasMany(RemoteControllerButton, { foreignKey: 'controllerId', as: 'buttons' });
  }
}

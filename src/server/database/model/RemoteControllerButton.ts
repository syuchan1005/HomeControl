import { Association, DataTypes, Model } from 'sequelize';

import { RemoteController } from './RemoteController';

// eslint-disable-next-line import/prefer-default-export
export class RemoteControllerButton extends Model {
  public readonly id: number;

  public name: string;

  public controllerId: number;

  public readonly controller: RemoteController;

  public static association: {
    controller: Association<RemoteControllerButton, RemoteController>;
  };

  public static initModel(sequelize) {
    RemoteControllerButton.init({
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      controllerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'remoteControllerButtons',
    });

    return 'remoteControllerButtons';
  }

  public static associate() {
    RemoteControllerButton.belongsTo(RemoteController, { foreignKey: 'controllerId', as: 'controller' });
  }
}

import { DataTypes, Model } from 'sequelize';
import { User } from './User';

// eslint-disable-next-line import/prefer-default-export
export class Widget extends Model {
  public readonly id: number;

  public content: string; // json

  public userId: number;

  public static initModel(sequelize) {
    Widget.init({
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'widgets',
      timestamps: false,
    });

    return 'widgets';
  }

  public static associate() {
    Widget.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }
}

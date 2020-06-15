import { Association, DataTypes, Model } from 'sequelize';
import { TraitTypeInformation } from '@common/GoogleActionsTypes';

import { Device } from './Device';
import { AttributesProvider } from './AttributesProvider';
import { StatesProvider } from './StatesProvider';
import { CommandsProvider } from './CommandsProvider';

// eslint-disable-next-line import/prefer-default-export
export class Trait extends Model {
  public readonly id: number;

  public type: keyof typeof TraitTypeInformation;

  public deviceId: number;

  public readonly device: Device;

  public readonly attributesProvider: AttributesProvider;

  public readonly statesProvider: StatesProvider;

  public readonly commandsProviders: Array<CommandsProvider>;

  public readonly dataValues: Trait;

  public static association: {
    device: Association<Trait, Device>;
    attributesProvider: Association<Trait, AttributesProvider>;
    statesProvider: Association<Trait, StatesProvider>;
    commandsProviders: Association<Trait, CommandsProvider>;
  };

  public static initModel(sequelize) {
    Trait.init({
      type: {
        unique: 'trait',
        allowNull: false,
        type: DataTypes.STRING,
      },
      deviceId: {
        unique: 'trait',
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
    Trait.hasOne(AttributesProvider, { foreignKey: 'traitId', as: 'attributesProvider' });
    Trait.hasOne(StatesProvider, { foreignKey: 'traitId', as: 'statesProvider' });
    Trait.hasMany(CommandsProvider, { foreignKey: 'traitId', as: 'commandsProviders' });
  }
}

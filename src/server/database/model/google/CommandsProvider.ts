import { Association, DataTypes, Model } from 'sequelize';
import { CommandTypeInformation } from '@common/GoogleActionsTypes';
import { Trait } from './Trait';

const CommandsProviderTypes = [
  'TEXT',
] as const;

// eslint-disable-next-line import/prefer-default-export
export class CommandsProvider extends Model {
  public readonly id: number;

  public commandType: keyof typeof CommandTypeInformation;

  public providerType: typeof CommandsProviderTypes[number];

  public content: string;

  public traitId: number;

  public readonly trait: Trait;

  public static association: {
    trait: Association<CommandsProvider, Trait>;
  };

  public static initModel(sequelize) {
    CommandsProvider.init({
      commandType: {
        allowNull: false,
        type: DataTypes.STRING, // ENUM(...Object.keys(CommandTypeInformation)),
      },
      providerType: {
        allowNull: false,
        type: DataTypes.ENUM(...CommandsProviderTypes),
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      traitId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'commandsProviders',
    });

    return 'commandsProviders';
  }

  public static associate() {
    CommandsProvider.belongsTo(Trait, { foreignKey: 'traitId', as: 'trait' });
  }
}

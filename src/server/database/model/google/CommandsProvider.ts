import { Association, DataTypes, Model } from 'sequelize';
import { CommandTypeInformation } from '@common/GoogleActionsTypes';
import { Trait } from './Trait';

export const ProviderTypes = [
  'NONE',
] as const;

// eslint-disable-next-line import/prefer-default-export
export class CommandsProvider extends Model {
  public readonly id: number;

  public traitId: number;

  public commandType: keyof typeof CommandTypeInformation;

  public providerType: typeof ProviderTypes[number];

  public content: string | null;

  public readonly trait: Trait;

  public readonly dataValues: CommandsProvider;

  public static association: {
    trait: Association<CommandsProvider, Trait>;
  };

  public static initModel(sequelize) {
    CommandsProvider.init({
      traitId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      commandType: {
        allowNull: false,
        type: DataTypes.STRING, // ENUM(...Object.keys(CommandTypeInformation)),
      },
      providerType: {
        allowNull: false,
        type: DataTypes.ENUM(...ProviderTypes),
      },
      content: {
        allowNull: true,
        type: DataTypes.STRING,
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

  public static validate(type: string, value: object) {
    return CommandTypeInformation[type]?.typeObject.is(value) || false;
  }

  public async execute() {
    switch (this.providerType) {
      case 'NONE':
      default:
    }
  }
}

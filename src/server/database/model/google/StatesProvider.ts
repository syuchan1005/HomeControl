import { Association, DataTypes, Model } from 'sequelize';
import { TraitTypeInformation } from '@common/GoogleActionsTypes';
import { Trait } from './Trait';

export const ProviderTypes = [
  'TEXT',
] as const;

// eslint-disable-next-line import/prefer-default-export
export class StatesProvider extends Model {
  public readonly traitId: number;

  public type: typeof ProviderTypes[number];

  public content: string;

  public readonly trait: Trait;

  public static association: {
    trait: Association<StatesProvider, Trait>;
  };

  public static initModel(sequelize) {
    StatesProvider.init({
      traitId: {
        unique: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM(...ProviderTypes),
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      tableName: 'statesProviders',
    });

    return 'statesProviders';
  }

  public static associate() {
    StatesProvider.belongsTo(Trait, { foreignKey: 'traitId', as: 'trait' });
  }

  public static validate(type: string, value: object) {
    return TraitTypeInformation[type]?.states.is(value) || false;
  }
}

import { Association, DataTypes, Model } from 'sequelize';
import { TraitTypeInformation } from '@common/GoogleActionsTypes';
import { Trait } from './Trait';

export const ProviderTypes = [
  'TEXT',
] as const;

// eslint-disable-next-line import/prefer-default-export
export class AttributesProvider extends Model {
  public readonly traitId: number;

  public type: typeof ProviderTypes[number];

  public content: string;

  public readonly trait: Trait;

  public readonly dataValues: AttributesProvider;

  public static association: {
    trait: Association<AttributesProvider, Trait>;
  };

  public static initModel(sequelize) {
    AttributesProvider.init({
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
      tableName: 'attributesProviders',
    });

    return 'attributesProviders';
  }

  public static associate() {
    AttributesProvider.belongsTo(Trait, { foreignKey: 'traitId', as: 'trait' });
  }

  public static validate(type: string, value: object) {
    return TraitTypeInformation[type]?.attributes.is(value) || false;
  }

  public execute(): object {
    switch (this.type) {
      case 'TEXT':
      default:
        return JSON.parse(this.content);
    }
  }
}

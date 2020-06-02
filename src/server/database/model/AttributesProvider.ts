import { Association, DataTypes, Model } from 'sequelize';
import { Trait } from './Trait';

const AttributesProviderTypes = [
  'TEXT',
] as const;

// eslint-disable-next-line import/prefer-default-export
export class AttributesProvider extends Model {
  public readonly traitId: number;

  public type: typeof AttributesProviderTypes[number];

  public content: string;

  public readonly trait: Trait;

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
        type: DataTypes.ENUM(...AttributesProviderTypes),
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
}

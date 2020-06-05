import { Association, DataTypes, Model } from 'sequelize';
import { ProviderTypes, Trait } from './Trait';

// eslint-disable-next-line import/prefer-default-export
export class AttributesProvider extends Model {
  public readonly traitId: number;

  public type: typeof ProviderTypes[number];

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
}

import { Association, DataTypes, Model } from 'sequelize';
import { ProviderTypes, Trait } from './Trait';

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
}

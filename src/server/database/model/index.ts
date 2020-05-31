import { Sequelize } from 'sequelize';
import * as baseConfig from '../config';

/* models */
import { User } from './User';
import { LocalToken } from './LocalToken';
import { RemoteController } from './RemoteController';
import { RemoteControllerButton } from './RemoteControllerButton';
import { IrServer } from './IrServer';
import { Sensor } from './Sensor';
import { SensorData } from './SensorData';
import { Widget } from './Widget';
import { LocalAuthorizationToken } from './LocalAuthorizationToken';

const modelList = [
  User,
  LocalToken,
  LocalAuthorizationToken,
  IrServer,
  RemoteController,
  RemoteControllerButton,
  Sensor,
  SensorData,
  Widget,
];

const env = process.env.NODE_ENV || 'development';
const config = baseConfig[env];

// eslint-disable-next-line import/no-mutable-exports
let sequelize: Sequelize;
if (config.dialect === 'sqlite') {
  sequelize = new Sequelize(config);
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const models = {
  book: undefined,
  bookInfo: undefined,
  genre: undefined,
  infoGenre: undefined,
};

modelList.forEach((module) => {
  // @ts-ignore
  const modelName = module.initModel(sequelize, config);
  models[modelName] = module[modelName];
});

modelList.forEach((module) => {
  // @ts-ignore
  if (module.associate) module.associate();
});

modelList.forEach((module) => {
  // @ts-ignore
  if (module.seed) module.seed();
});

export default sequelize;

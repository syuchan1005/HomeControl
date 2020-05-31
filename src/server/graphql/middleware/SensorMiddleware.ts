import GQLMiddleware from '@server/graphql/GQLMiddleware';
import { withFilter } from 'graphql-subscriptions';

import {
  MutationResolvers,
  QueryResolvers,
  SubscriptionSensorDataArgs,
  SubscriptionResolvers,
} from '@common/GQLTypes';
import {
  pubsub,
  ADD_SENSOR,
  SubscriptionAddSensorPayload,
} from '@server/graphql/PubSub';
import { Sensor } from '@server/database/model/Sensor';
import { SensorData } from '@server/database/model/SensorData';
import sequelize from '@server/database/model';
import { getConfig } from '../../../common/Config';

class SensorMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Query(): QueryResolvers {
    return {
      sensors: async () => {
        const sensors: Array<Sensor> = await Sensor.findAll();
        const collectSensors: { [sensorName: string]: string[] } = sensors
          .reduce((obj, sensor) => {
            // eslint-disable-next-line no-param-reassign
            if (!obj[sensor.name]) obj[sensor.name] = [];
            obj[sensor.name].push(sensor.dataType);
            return obj;
          }, {});
        return Object.entries(collectSensors)
          .reduce((arr, [name, dataType]) => {
            arr.push({
              name,
              dataType,
            });
            return arr;
          }, []);
      },
      sensorData: async (parent, { sensorName, dataType }) => {
        const config = await getConfig();
        const sensor = await Sensor.findOne({
          where: {
            name: sensorName,
            dataType,
          },
        });
        if (!sensor) return [];

        const data = await SensorData.findAll({
          where: {
            sensorId: sensor.id,
          },
          limit: config.sensorMaxSize,
          order: [['id', 'desc']],
        });
        if (!data) return [];
        return data.reverse();
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      addSensorData: async (parent, {
        name,
        dataType,
        value,
        createdAt,
      }) => {
        const now = new Date();
        let sensor: Sensor | null;
        let sensorData: SensorData | null;
        try {
          await sequelize.transaction(async (transaction) => {
            const sensors = await Sensor.findOrCreate({
              where: { name, dataType },
              defaults: { name, dataType },
              transaction,
            });
            // eslint-disable-next-line prefer-destructuring
            if (Array.isArray(sensors)) sensor = sensors[0];
            else sensor = sensors;
            if (!sensor) return;
            sensorData = await SensorData.create({
              sensorId: sensor.id,
              value,
              createdAt: createdAt ? new Date(createdAt) : now,
            }, { transaction });
          });
          await pubsub.publish(ADD_SENSOR, {
            name,
            dataType,
            sensorData,
          });
        } catch (e) {
          return false;
        }
        return !!sensor;
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Subscription(): SubscriptionResolvers {
    return {
      sensorData: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(ADD_SENSOR),
          (
            payload: SubscriptionAddSensorPayload,
            variables: SubscriptionSensorDataArgs,
          ) => payload.name === variables.sensorName
            && payload.dataType === variables.dataType,
        ),
      },
    };
  }
}

export default SensorMiddleware;

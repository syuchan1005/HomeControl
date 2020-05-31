import { PubSub } from 'graphql-subscriptions';
import { SensorData } from '../../common/GQLTypes';

export const pubsub = new PubSub();
export const ADD_SENSOR = 'ADD_SENSOR';
export type SubscriptionAddSensorPayload = {
  name: string;
  dataType: string;
  sensorData: SensorData;
};

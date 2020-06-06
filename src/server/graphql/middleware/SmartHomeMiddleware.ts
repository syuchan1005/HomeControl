/* eslint-disable class-methods-use-this */
import { GraphQLScalarType, ValueNode, Kind } from 'graphql';

import { MutationResolvers, QueryResolvers } from '@common/GQLTypes';
import { DeviceTypeInformation, TraitTypeInformation } from '@common/GoogleActionsTypes';
import { ProviderTypes } from '@server/database/model/google/Trait';
import { Device } from '@server/database/model/google/Device';

import GQLMiddleware from '../GQLMiddleware';
import { Context } from '../index';
import { createError } from '../GQLErrors';

type Maybe<T> = T | null;

const TypeScalarType = (
  name: string,
  typeInformation: { [key: string]: any },
) => new GraphQLScalarType({
  name,
  serialize(value: string): Maybe<string> {
    return typeInformation[value] ? value : undefined;
  },
  parseValue(value: string): Maybe<string> {
    return typeInformation[value] ? value : undefined;
  },
  parseLiteral(valueNode: ValueNode): Maybe<string> {
    if (valueNode.kind === Kind.STRING && typeInformation[valueNode.value]) {
      return valueNode.value;
    }
    return undefined;
  },
});

export const DeviceTypeScalarType = TypeScalarType('DeviceType', DeviceTypeInformation);

export const TraitTypeScalarType = TypeScalarType('TraitType', TraitTypeInformation);

export const ProviderScalarType = TypeScalarType('ProviderType', ProviderTypes
  .reduce((obj, text) => ({ ...obj, [text]: text }), {}));

// eslint-disable-next-line import/prefer-default-export
class SmartHomeMiddleware extends GQLMiddleware {
  Query(): QueryResolvers {
    return {
      deviceTypes: () => Object.values(DeviceTypeInformation),
      devices: async (parent, args, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const devices: Array<Device> = await Device.findAll({
          where: { userId: user.id },
        });
        return devices.map((d) => ({
          ...d.dataValues,
          type: DeviceTypeInformation[d.type],
          traits: [],
        }));
      },
    };
  }

  Mutation(): MutationResolvers {
    return {
      addDevice: async (parent, { device }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        try {
          const d = await Device.create({
            ...device,
            roomHint: device.roomHint ? device.roomHint : undefined,
            userId: user.id,
          });
          return {
            ...d.dataValues,
            type: DeviceTypeInformation[d.type],
            traits: [],
          };
        } catch (ignored) {
          // eslint-disable-next-line no-console
          console.error(ignored);
          throw createError('QL0002', 'DB');
        }
      },
    };
  }

  Resolver(): object {
    return {
      DeviceType: DeviceTypeScalarType,
      TraitType: TraitTypeScalarType,
      ProviderType: ProviderScalarType,
    };
  }
}

export default SmartHomeMiddleware;

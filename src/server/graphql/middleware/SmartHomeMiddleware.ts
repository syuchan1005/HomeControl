/* eslint-disable class-methods-use-this */
import { GraphQLScalarType, ValueNode, Kind } from 'graphql';

import {
  CommandInput,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  Device as DeviceGQLModel,
} from '@common/GQLTypes';
import {
  CommandTypeInformation,
  DeviceTypeInformation,
  TraitTypeInformation,
} from '@common/GoogleActionsTypes';
import { Trait } from '@server/database/model/google/Trait';
import { Device } from '@server/database/model/google/Device';

import GQLMiddleware from '../GQLMiddleware';
import { Context } from '../index';
import { createError } from '../GQLErrors';
import { AttributesProvider, ProviderTypes as AttributesProviderTypes } from '../../database/model/google/AttributesProvider';
import { StatesProvider, ProviderTypes as StatesProviderTypes } from '../../database/model/google/StatesProvider';
import { CommandsProvider, ProviderTypes as CommandsProviderTypes } from '../../database/model/google/CommandsProvider';
import sequelize from '../../database/model';
import { asyncForEach } from '../../AsyncUtil';

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

export const CommandScalarType = TypeScalarType('CommandType', CommandTypeInformation);

const ProviderScalarType = (name: string, types: string[]) => TypeScalarType(
  name, types.reduce((obj, text) => ({ ...obj, [text]: text }), {}),
);

export const AttributesProviderScalarType = ProviderScalarType('AttributesProviderType', AttributesProviderTypes as unknown as string[]);
export const StatesProviderScalarType = ProviderScalarType('StatesProviderType', StatesProviderTypes as unknown as string[]);
export const CommandsProviderScalarType = ProviderScalarType('CommandsProviderType', CommandsProviderTypes as unknown as string[]);

// eslint-disable-next-line import/prefer-default-export
class SmartHomeMiddleware extends GQLMiddleware {
  Query(): QueryResolvers {
    return {
      deviceTypes: () => Object.values(DeviceTypeInformation),
      traitTypes: () => Object.values(TraitTypeInformation),
      attributesProviderTypes: () => AttributesProviderTypes as unknown as string[],
      statesProviderTypes: () => StatesProviderTypes as unknown as string[],
      commandsProviderTypes: () => CommandsProviderTypes as unknown as string[],
      traitInfo: (parent, { type }) => TraitTypeInformation[type],
      devices: async (parent, args, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const devices: Array<Device> = await Device.findAll({
          where: { userId: user.id },
        });
        return devices.map((d) => ({
          ...d.dataValues,
          type: DeviceTypeInformation[d.type],
        })) as unknown as Array<DeviceGQLModel>;
      },
      device: async (parent, { id }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const device = await Device.findOne({
          where: { id, userId: user.id },
        });
        if (!device) throw createError('QL0015');
        return {
          ...device.dataValues,
          type: DeviceTypeInformation[device.type],
        };
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
      addTrait: async (parent, { trait }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        /* Validate */
        let commands: string[] = [...TraitTypeInformation[trait.type]?.commands];
        if (!trait.commandsProviders.every((c) => {
          const index = commands.findIndex((c1) => c1 === c.type);
          if (index !== -1) {
            commands = commands.filter((v, i) => i !== index);
            return true;
          }
          return false;
        }) || commands.length !== 0) throw createError('QL0014');
        if (!AttributesProvider.validate(trait.type, trait.attributesProvider.content)) throw createError('QL0011');
        if (!StatesProvider.validate(trait.type, trait.statesProvider.content)) throw createError('QL0012');
        /*
        if (trait.commandsProviders.some(
          (command) => !CommandsProvider.validate(command.type, command.provider.content),
        )) throw createError('QL0013');
        */

        const device = await Device.findOne({ where: { id: trait.deviceId, userId: user.id } });
        if (!device) throw createError('QL0015');

        try {
          return await sequelize.transaction(async (transaction) => {
            const dbTrait: Trait = await Trait.create({
              type: trait.type,
              deviceId: trait.deviceId,
            }, { transaction });
            await AttributesProvider.create({
              traitId: dbTrait.id,
              type: trait.attributesProvider.type,
              content: JSON.stringify(trait.attributesProvider.content),
            }, { transaction });
            await StatesProvider.create({
              traitId: dbTrait.id,
              type: trait.statesProvider.type,
              content: JSON.stringify(trait.statesProvider.content),
            }, { transaction });
            await asyncForEach(
              trait.commandsProviders,
              (commandProvider: CommandInput) => CommandsProvider.create({
                traitId: dbTrait.id,
                commandType: commandProvider.type,
                providerType: commandProvider.provider.type,
                content: commandProvider.provider.content
                  ? JSON.stringify(commandProvider.provider.content)
                  : null,
              }, { transaction }),
            );

            return dbTrait;
          });
        } catch (e) {
          throw createError('QL0002');
        }
      },
    };
  }

  Resolver(): Resolvers {
    return {
      DeviceType: DeviceTypeScalarType,
      TraitType: TraitTypeScalarType,
      CommandType: CommandScalarType,
      AttributesProviderType: AttributesProviderScalarType,
      StatesProviderType: StatesProviderScalarType,
      CommandsProviderType: CommandsProviderScalarType,
      Device: {
        traits: async ({ id }) => {
          const traits: Trait[] = await Trait.findAll({
            where: { deviceId: id },
            include: [
              'attributesProvider',
              'statesProvider',
              'commandsProviders',
            ],
          });
          return traits.map((trait) => ({
            ...trait.dataValues,
            attributesProvider: {
              ...trait.attributesProvider.dataValues,
              type: trait.attributesProvider.type as string,
              content: JSON.parse(trait.attributesProvider.content),
            },
            statesProvider: {
              ...trait.statesProvider.dataValues,
              type: trait.statesProvider.type as string,
              content: JSON.parse(trait.statesProvider.content),
            },
            commandsProvider: trait.commandsProviders.map((commandsProvider) => ({
              ...commandsProvider.dataValues,
              commandType: commandsProvider.commandType as string,
              providerType: commandsProvider.providerType as string,
              content: commandsProvider.content ? JSON.parse(commandsProvider.content) : undefined,
            })),
          }));
        },
      },
    };
  }
}

export default SmartHomeMiddleware;

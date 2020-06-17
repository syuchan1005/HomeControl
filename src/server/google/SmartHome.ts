/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import {
  ExecuteIntentCommandType,
  ExecuteIntentPayload,
  QueryIntentDeviceType,
  QueryPayload,
  SyncIntentDeviceType,
} from '@common/GoogleActionsTypes';
import { Device } from '../database/model/google/Device';
import { Trait } from '../database/model/google/Trait';
import { AttributesProvider } from '../database/model/google/AttributesProvider';
import { StatesProvider } from '../database/model/google/StatesProvider';

export const asyncMap = async <T, E>(
  arr: Array<E>,
  transform: (e: E, index: number, arr: Array<E>) => Promise<T>,
): Promise<T[]> => {
  const result = [];
  for (let i = 0; i < arr.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    result[i] = await transform(arr[i], i, arr);
  }
  return result;
};

export default class SmartHome {
  async SYNC(ctx) {
    const { id: userId } = ctx.state.oauth.token.user;

    const dbDevices: Array<Device> = await Device.findAll({
      where: { userId },
      include: [
        {
          model: Trait,
          as: 'traits',
          include: [{
            model: AttributesProvider,
            as: 'attributesProvider',
          }],
        },
      ],
    });

    const devices = dbDevices.map((device): SyncIntentDeviceType => ({
      id: device.id.toString(10),
      type: device.type,
      name: {
        name: device.name,
      },
      willReportState: device.willReportState,
      roomHint: device.roomHint,
      traits: device.traits.map((trait) => trait.type),
      attributes: device.traits
        .map((trait) => trait.attributesProvider.execute())
        .reduce((obj, attributes) => ({
          ...obj,
          ...attributes,
        }), {}),
    }));

    ctx.body = {
      requestId: ctx.request.body.requestId,
      payload: {
        agentUserId: `${userId}`,
        devices,
      },
    };
  }

  async QUERY(ctx, payload: QueryPayload) {
    const { id: userId } = ctx.state.oauth.token.user;
    const dbDevices: Array<Device> = await Device.findAll({
      where: {
        userId,
        id: {
          [Op.in]: payload.devices.map(({ id }) => id),
        },
      },
      include: [
        {
          model: Trait,
          as: 'traits',
          include: [{
            model: StatesProvider,
            as: 'statesProvider',
          }],
        },
      ],
    });

    const devices = dbDevices.map((device): QueryIntentDeviceType => ({
      online: true,
      statues: 'SUCCESS',
      ...(device.traits.reduce((obj, trait) => ({
        ...obj,
        ...(trait.statesProvider.execute()),
      }), {})),
    }));

    ctx.body = {
      requestId: ctx.request.body.requestId,
      payload: {
        devices,
      },
    };
  }

  async EXECUTE(ctx, payload: ExecuteIntentPayload) {
    const { id: userId } = ctx.state.oauth.token.user;
    const commands = await asyncMap(
      payload.commands,
      async (command) => {
        const ids = command.devices.map(({ id }) => id);
        const dbDevice: Array<Device> = await Device.findAll({
          where: {
            userId,
            id: {
              [Op.in]: ids,
            },
          },
          include: [{
            model: Trait,
            as: 'traits',
            include: ['commandsProviders'],
          }],
        });
        await asyncMap(
          dbDevice,
          async (device) => asyncMap(
            command.execution,
            (execution) => {
              const commandsProvider = device.traits
                .flatMap(({ commandsProviders }) => commandsProviders)
                .find((cp) => cp.commandType === execution.command);
              return commandsProvider?.execute() ?? Promise.resolve();
            },
          ),
        );
        return {
          ids,
          status: 'SUCCESS',
          states: {
            online: true,
            ...command.execution.reduce((obj, execution) => ({
              ...obj,
              ...execution.params,
            }), {}),
          },
        } as ExecuteIntentCommandType;
      },
    );

    ctx.body = {
      requestId: ctx.request.body.requestId,
      payload: {
        commands,
      },
    };
  }

  middleware(router, path) {
    router.post(path, async (ctx) => {
      if (!ctx.request.body.inputs || ctx.request.body.inputs.length !== 1) {
        ctx.throw(401, { error: 'missing inputs' });
      }
      const input = ctx.request.body.inputs[0];
      switch (input.intent) {
        case 'action.devices.SYNC':
          await this.SYNC(ctx);
          break;
        case 'action.devices.QUERY':
          await this.QUERY(ctx, input.payload);
          break;
        case 'action.devices.EXECUTE':
          await this.EXECUTE(ctx, input.payload);
          break;
        case 'action.devices.DISCONNECT':
          ctx.body = {};
          break;
        default:
          ctx.throw(401, { error: 'missing intent' });
          return;
      }
      ctx.status = 200;
    });
  }
}

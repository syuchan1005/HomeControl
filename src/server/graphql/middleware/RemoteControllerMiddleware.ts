/* eslint-disable no-console */
import axios from 'axios';

import { MutationResolvers, QueryResolvers } from '@common/GQLTypes';

import sequelize from '@server/database/model';
import { RemoteController } from '@server/database/model/RemoteController';
import { RemoteControllerButton } from '@server/database/model/RemoteControllerButton';
import { IrServer } from '@server/database/model/IrServer';
import { readIrBinary, saveIrBinary } from '@server/StorageManager';

import GQLMiddleware from '../GQLMiddleware';
import { createError } from '../GQLErrors';
import { Context } from '../index';

export default class RemoteControllerMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Query(): QueryResolvers {
    return {
      remoteControllers: async (parent, args, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        return RemoteController.findAll({
          where: { userId: user.id },
          include: [{ model: RemoteControllerButton, as: 'buttons' }],
        });
      },
      remoteController: async (parent, { id }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        return RemoteController.findOne({
          where: { id, userId: user.id },
          include: [{ model: RemoteControllerButton, as: 'buttons' }],
        });
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      sendRemoteControllerButton: async (parent, { buttonId }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const button = await RemoteControllerButton.findOne({
          where: { id: buttonId },
          include: [
            {
              model: RemoteController,
              as: 'controller',
              where: { userId: user.id },
            },
          ],
        });
        if (!button) throw createError('QL0008');

        const buf = await readIrBinary(button.id);

        const irServer: IrServer = await IrServer.findOne();
        if (!irServer) throw createError('QL0007');
        await axios.get(`http://${irServer.host}/send`, {
          data: buf,
        });

        return true as true;
      },
      addRemoteController: async (parent, { name }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        try {
          const controller = await RemoteController.create({
            name,
            userId: user.id,
          });
          controller.buttons = [];
          return controller;
        } catch (e) {
          throw createError('QL0009');
        }
      },
      addRemoteControllerButton: async (parent, { controllerId, name }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const controller = await RemoteController.findOne({
          where: {
            id: controllerId,
            userId: user.id,
          },
        });
        if (!controller) throw createError('QL0004');

        // get remote controller binary
        const irServer: IrServer = await IrServer.findOne();
        if (!irServer) throw createError('QL0007');
        const recvRes = await axios.get(`http://${irServer.host}/recv`);
        if (recvRes.status !== 202) throw createError('QL0010');
        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait recv
        const dumpRes = await axios.get(`http://${irServer.host}/dump`, {
          responseType: 'arraybuffer',
        });
        if (dumpRes.status !== 200) throw createError('QL0010');

        try {
          let button: RemoteControllerButton;
          await sequelize.transaction(async (transaction) => {
            button = await RemoteControllerButton.create({
              name,
              controllerId: controller.id,
            }, { transaction });
            await saveIrBinary(dumpRes.data, button.id);
          });
          return button;
        } catch (e) {
          throw createError('QL0002');
        }
      },
    };
  }
}

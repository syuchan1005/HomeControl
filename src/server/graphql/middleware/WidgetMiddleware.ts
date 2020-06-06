import { MutationResolvers, QueryResolvers } from '@common/GQLTypes';

import { Sensor } from '@server/database/model/Sensor';
import GQLMiddleware from '../GQLMiddleware';
import { Context } from '../index';
import { Widget } from '../../database/model/Widget';
import { RemoteController } from '../../database/model/RemoteController';
import { createError } from '../GQLErrors';

export default class WidgetMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Query(): QueryResolvers {
    return {
      widgets: async (parent, args, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const widgets: Array<Widget> = await Widget.findAll({
          where: { userId: user.id },
        });

        return widgets.map((widget) => ({
          id: widget.id,
          ...JSON.parse(widget.content),
        }));
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      addSensorWidget: async (parent, { name, dataType }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const sensor = await Sensor.findOne({
          where: { name, dataType },
        });
        if (!sensor) throw createError('QL0003');

        const widget = await Widget.create({
          userId: user.id,
          content: JSON.stringify({ name, dataType }),
        });

        return {
          id: widget.id,
          name,
          dataType,
        };
      },
      addRemoteControllerWidget: async (parent, { controllerId }, context: Context) => {
        const user = await context.getUser();
        if (!user) throw createError('QL0001');

        const controller = await RemoteController.findOne({
          where: { id: controllerId, userId: user.id },
        });
        if (!controller) throw createError('QL0004');

        const widget = await Widget.create({
          userId: user.id,
          content: JSON.stringify({ controllerId }),
        });

        return {
          id: widget.id,
          controllerId,
        };
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Resolver(): object {
    return {
      Widget: {
        // eslint-disable-next-line no-underscore-dangle
        __resolveType(widget) {
          if (widget.name && widget.dataType) return 'SensorWidget';
          if (widget.controllerId) return 'RemoteControllerWidget';
          return null;
        },
      },
    };
  }
}

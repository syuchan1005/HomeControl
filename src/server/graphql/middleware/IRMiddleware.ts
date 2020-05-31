import axios from 'axios';

import { MutationResolvers } from '@common/GQLTypes';
import { generateRandomToken } from '@server/AuthUtil';

import GQLMiddleware from '../GQLMiddleware';
import { IrServer } from '../../database/model/IrServer';

const CONFIG_PING_WAIT = '0 * * * * *'; // 1m

export default class IRMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      registerIrServer: async (parent, { ip }) => {
        const token = await generateRandomToken();
        await IrServer.upsert({
          host: ip,
          token,
        });
        return token;
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Schedule(): { time: string; consumer: () => void }[] {
    return [
      {
        time: CONFIG_PING_WAIT,
        consumer: async () => {
          const servers: Array<IrServer> | null = await IrServer.findAll();
          if (!servers) return;
          await Promise.all(servers.map(({ host, token }) => axios.get(`http://${host}/ping`)
            .then((response) => {
              const data = response.data as string;
              if (response.status !== 200 || data !== token) {
                return IrServer.destroy({
                  where: { host },
                });
              }
              return Promise.resolve();
            })
            .catch(() => IrServer.destroy({
              where: { host },
            }))));
        },
      },
    ];
  }
}

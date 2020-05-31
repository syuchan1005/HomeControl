import axios from 'axios';

import { MutationResolvers } from '@common/GQLTypes';
import { generateRandomToken } from '@server/AuthUtil';

import GQLMiddleware from '../GQLMiddleware';
import { IrServer } from '../../database/model/IrServer';
import { getConfig } from '../../../common/Config';

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
  async Schedule(): Promise<{ time: string; consumer: () => void }[]> {
    const config = await getConfig();
    return [
      {
        time: config.irPingWait,
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

import GQLMiddleware from '@server/graphql/GQLMiddleware';
import { QueryResolvers } from '@common/GQLTypes';

class Hello extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Query(): QueryResolvers {
    return {
      hello: () => 'Hello!!',
    };
  }
}

export default Hello;

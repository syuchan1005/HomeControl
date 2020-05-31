import {
  GraphQLDateTime,
} from 'graphql-iso-date';

import GQLMiddleware from '../GQLMiddleware';

class ScalarMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Resolver(): object {
    return {
      DateTime: GraphQLDateTime,
    };
  }
}

export default ScalarMiddleware;

import { ApolloServer, PubSubEngine } from 'apollo-server-koa';
import {
  QueryResolvers,
  MutationResolvers,
  SubscriptionResolvers,
} from '@common/GQLTypes';

export default class GQLMiddleware {
  readonly server: ApolloServer;

  readonly pubsub: PubSubEngine;

  /* eslint-disable class-methods-use-this,@typescript-eslint/no-unused-vars */

  Query(
    middleware: Pick<GQLMiddleware, 'server' | 'pubsub'>,
  ): QueryResolvers {
    return {};
  }

  Mutation(
    middleware: Pick<GQLMiddleware, 'server' | 'pubsub'>,
  ): MutationResolvers {
    return {};
  }

  Subscription(
    middleware: Pick<GQLMiddleware, 'server' | 'pubsub'>,
  ): SubscriptionResolvers {
    return {};
  }

  /* eslint-enable class-methods-use-this,@typescript-eslint/no-unused-vars */
}

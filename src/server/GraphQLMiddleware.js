import fs from 'fs';

import { ApolloServer, gql } from 'apollo-server-koa';
import bcrypt from 'bcrypt';

/* eslint-disable class-methods-use-this */
export default class GraphQLMiddleware {
  constructor(db, saltRound) {
    this.db = db;
    this.saltRound = saltRound || 10;
  }

  // noinspection JSMethodCanBeStatic
  get typeDefs() {
    return gql`${fs.readFileSync(`${__dirname}/schema.graphql`)}`;
  }

  // noinspection JSMethodCanBeStatic
  get Query() {
    return {
      hello: (parent, args, context) => (context.user ? `Hi! ${context.user.username}.` : 'TEST'),
    };
  }

  get Mutation() {
    return {
      signUp: async (parent, { username, password }) => this.db.models.user.create({
        username,
        hash: await bcrypt.hash(password, this.saltRound),
      }),
    };
  }

  middleware(app) {
    this.server = new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: {
        Query: this.Query,
        Mutation: this.Mutation,
      },
      context: async ({ ctx }) => {
        let user = null;
        if (ctx.request.header.authorization) {
          const accessToken = ctx.request.header.authorization.slice(7);
          if (accessToken) {
            user = await this.db.models.user.findOne({
              where: { accessToken },
            });
          }
          if (user && user.accessTokenExpiresAt < Date.now()) user = null;
        }
        return { ctx, user };
      },
      playground: {
        settings: {
          'editor.theme': 'light',
        },
      },
    });
    this.server.applyMiddleware({ app });
  }
}

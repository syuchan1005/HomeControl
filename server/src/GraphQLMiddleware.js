import fs from 'fs';
import { exec as cbExec } from 'child_process';
import { promisify } from 'util';

import { ApolloServer, gql } from 'apollo-server-koa';
import GraphQLJSON from 'graphql-type-json';

import bcrypt from 'bcrypt';
import Util from './Utils';

import typeDefs from './schema.graphql';

const exec = promisify(cbExec);

/* eslint-disable class-methods-use-this */
export default class GraphQLMiddleware {
  constructor(db, saltRound) {
    this.db = db;
    this.saltRound = saltRound || 10;
  }

  // noinspection JSMethodCanBeStatic
  get typeDefs() {
    return typeDefs;
  }

  // noinspection JSMethodCanBeStatic
  get User() {
    return {
      devices: user => user.getDevices(),
    };
  }

  // noinspection JSMethodCanBeStatic
  get Device() {
    return {
      traits: device => device.getTraits(),
    };
  }

  // noinspection JSMethodCanBeStatic
  get Trait() {
    return {
      state: async (trait) => {
        if (!trait.info) return null;
        const info = JSON.parse(trait.info);
        if (!info.getCommand) return null;
        try {
          // TODO
          if (typeof info.getCommand === 'string') {
            return (await exec(info.getCommand)).stdout.trim();
          }
          return await Util.executeCommand(info.getCommand);
        } catch (e) {
          return 'ERROR';
        }
      },
    };
  }

  // noinspection JSMethodCanBeStatic
  get Query() {
    return {
      user: (parent, args, { user }) => user,
    };
  }

  get Mutation() {
    return {
      signUp: async (parent, { username, password }) => {
        let user = null;
        try {
          user = await this.db.models.user.create({
            username,
            hash: await bcrypt.hash(password, this.saltRound),
          });
        } catch (e) {
          throw new Error('The username is already in use.');
        }
        return user;
      },
      addDevice: async (parent, { device }, { user }) => {
        if (!user) throw new Error('User not found');
        const dbDevice = await this.db.models.device.create({
          ...device,
          userId: user.id,
        });
        await device.traits.reduce(
          (p, trait) => p.then(() => this.db.models
            .trait.create({ ...trait, deviceId: dbDevice.id })),
          Promise.resolve(),
        );
        return dbDevice;
      },
      deleteDevice: async (parent, { deviceId }, { user }) => {
        if (!user) throw new Error('User not found');
        if (!await user.hasDevice(deviceId)) throw new Error('User not have device');
        await this.db.models.trait.destroy({ where: { deviceId } });
        const c = await this.db.models.device.destroy({ where: { id: deviceId } });
        return c === 1;
      },
      editDevice: async (parant, { deviceId, device }, { user }) => {
        if (!user) throw new Error('User not found');
        const c = await this.db.models.device.update({
          ...device,
          userId: user.id,
        }, {
          where: { id: deviceId },
        });
        await this.db.models.trait.destroy({ where: { deviceId } });
        await device.traits.reduce(
          (p, trait) => p.then(() => this.db.models
            .trait.create({ ...trait, deviceId })),
          Promise.resolve(),
        );
        return c[0] === 1 ? this.db.models.device.findOne({ where: { id: deviceId } }) : null;
      },
    };
  }

  middleware(app) {
    this.server = new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: {
        JSON: GraphQLJSON,
        User: this.User,
        Device: this.Device,
        Trait: this.Trait,
        Query: this.Query,
        Mutation: this.Mutation,
      },
      context: async ({ ctx }) => {
        let user = null;
        let token = null;
        if (ctx.request.header.authorization) {
          const accessToken = ctx.request.header.authorization.slice(7);
          if (accessToken) {
            token = await this.db.models.token.findOne({
              where: { accessToken },
            });
            if (token) user = await token.getUser();
          }
          if (user && token.accessTokenExpiresAt < Date.now()) user = null;
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

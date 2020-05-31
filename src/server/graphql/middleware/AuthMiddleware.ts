import argon2 from 'argon2';

import { MutationResolvers } from '@common/GQLTypes';
import { User } from '@server/database/model/User';

import sequelize from '@server/database/model';
import { generateAuthToken } from '@server/AuthUtil';
import { OAuthAccessToken } from '@server/database/model/OAuthAccessToken';
import { OAuthRefreshToken } from '@server/database/model/OAuthRefreshToken';

import GQLMiddleware from '../GQLMiddleware';

class AuthMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      signUp: async (parent, { username, password }) => {
        let user;
        try {
          user = await User.findOne({
            where: { username },
          });
        } catch (e) {
          console.error(e);
          return false;
        }
        if (user) return false;

        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

        try {
          await User.create({
            username,
            hash: hashedPassword,
          });
        } catch (e) {
          return false;
        }

        return true;
      },
      login: async (parent, { username, password }) => {
        const user: User = await User.findOne({
          where: { username },
        });
        if (!user) return null;

        const isValid = await argon2.verify(user.hash, password, { type: argon2.argon2id });
        if (!isValid) return null;

        const authToken = await generateAuthToken();

        try {
          await sequelize.transaction(async (transaction) => {
            await OAuthAccessToken.create({
              accessToken: authToken.accessToken,
              userId: user.id,
              expiredAt: authToken.expiredAt,
            }, { transaction });
            await OAuthRefreshToken.create({
              refreshToken: authToken.refreshToken,
              userId: user.id,
              expiredAt: authToken.refreshExpiredAt,
            }, { transaction });
          });
        } catch (e) {
          return null;
        }

        return authToken;
      },
    };
  }
}

export default AuthMiddleware;

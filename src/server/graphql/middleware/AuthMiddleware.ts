import argon2 from 'argon2';

import { MutationResolvers } from '@common/GQLTypes';
import { getConfig } from '@common/Config';
import { User } from '@server/database/model/User';

import { generateAuthToken } from '@server/AuthUtil';
import { LocalToken } from '@server/database/model/LocalToken';
import GQLMiddleware from '../GQLMiddleware';
import { createError } from '../GQLErrors';

class AuthMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      signUp: async (parent, { username, password }) => {
        const user = await User.findOne({
          where: { username },
        });
        if (user) throw createError('QL0005');

        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

        try {
          await User.create({
            username,
            hash: hashedPassword,
          });
        } catch (e) {
          throw createError('QL0005');
        }

        return true as true;
      },
      login: async (parent, { username, password, clientId }) => {
        const config = await getConfig();
        if (clientId && config.googleClient.id !== clientId) throw createError('QL0006');

        const user: User = await User.findOne({
          where: { username },
        });
        if (!user) throw createError('QL0006');

        const isValid = await argon2.verify(user.hash, password, { type: argon2.argon2id });
        if (!isValid) throw createError('QL0006');

        const authToken = await generateAuthToken();

        try {
          await LocalToken.create({
            userId: user.id,
            accessToken: authToken.accessToken,
            accessTokenExpiresAt: authToken.expiredAt,
            refreshToken: authToken.refreshToken,
            refreshTokenExpiresAt: authToken.refreshExpiredAt,
            clientId,
          });
        } catch (e) {
          throw createError('QL0006');
        }

        return authToken;
      },
    };
  }
}

export default AuthMiddleware;

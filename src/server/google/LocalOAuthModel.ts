/* eslint-disable class-methods-use-this, no-console */

import * as OAuth2Server from 'oauth2-server';
import { LocalToken } from '../database/model/LocalToken';
import { LocalAuthorizationToken } from '../database/model/LocalAuthorizationToken';
import { User } from '../database/model/User';

export type Client = {
  id: string;
  secret: string;
  grants: string[],
  redirectUris: string[],
};

// eslint-disable-next-line import/prefer-default-export,max-len
export class LocalOAuthModel implements OAuth2Server.AuthorizationCodeModel, OAuth2Server.RefreshTokenModel {
  private clients: Client[];

  constructor(clients) {
    this.clients = clients;
  }

  async getAccessToken(accessToken: string): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
    try {
      const token = await LocalToken.findOne({
        where: { accessToken },
        include: [{ model: User, as: 'user' }],
      });
      if (!token) return undefined;
      const client = this.clients.find((v) => v.id === token.clientId);
      if (!client) return undefined;
      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        scope: token.scope,
        client,
        user: {
          id: token.user.id,
          username: token.user.username,
        },
      };
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }

  async getAuthorizationCode(
    authorizationCode: string,
  ): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
    try {
      const token = await LocalAuthorizationToken.findOne({
        where: { code: authorizationCode },
        include: [{ model: User, as: 'user' }],
      });
      if (!token) return undefined;
      const client = this.clients.find((v) => v.id === token.clientId);
      if (!client) return undefined;
      return {
        authorizationCode,
        expiresAt: token.expiresAt,
        redirectUri: token.redirectUri,
        scope: token.scope,
        client,
        user: {
          id: token.user.id,
          username: token.user.username,
        },
      };
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }

  async getClient(
    clientId: string,
    clientSecret: string | null,
  ): Promise<OAuth2Server.Client | OAuth2Server.Falsey> {
    return this.clients.find((client) => clientId === client.id
      && (clientSecret == null || clientSecret === client.secret));
  }

  async getRefreshToken(
    refreshToken: string,
  ): Promise<OAuth2Server.RefreshToken | OAuth2Server.Falsey> {
    try {
      const token = await LocalToken.findOne({
        where: { refreshToken },
        include: [{ model: User, as: 'user' }],
      });
      if (!token) return undefined;
      const client = this.clients.find((v) => v.id === token.clientId);
      if (!client) return undefined;
      return {
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        client,
        user: {
          id: token.user.id,
          username: token.user.username,
        },
      };
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }

  async revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode): Promise<boolean> {
    try {
      const c = await LocalAuthorizationToken.destroy({
        where: {
          code: code.authorizationCode,
          clientId: code.client.id,
          userId: code.user.id,
        },
      });
      return c === 1;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  async revokeToken(token: OAuth2Server.RefreshToken | OAuth2Server.Token): Promise<boolean> {
    try {
      const c = await LocalToken.destroy({
        where: {
          refreshToken: token.refreshToken,
          clientId: token.client.id,
          userId: token.user.id,
        },
      });
      return c === 1;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  async saveAuthorizationCode(
    code: Pick<OAuth2Server.AuthorizationCode, 'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope'>,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
    try {
      await LocalAuthorizationToken.create({
        code: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        clientId: client.id,
        userId: user.id,
      });
      return {
        ...code,
        client,
        user,
      };
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async saveToken(
    token: OAuth2Server.Token,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
    try {
      await LocalToken.create({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        clientId: client.id,
        userId: user.id,
      });
      return {
        ...token,
        client,
        user,
      };
    } catch (e) {
      return false;
    }
  }

  async verifyScope(/* token: OAuth2Server.Token, scope: string | string[] */): Promise<boolean> {
    return true;
  }
}

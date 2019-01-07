import bcrypt from 'bcrypt';

export default class LocalOAuthModel {
  constructor(clients, db) {
    this.clients = clients;
    this.db = db;
  }

  /* generateAccessToken */
  /* generateRefreshToken */
  /* generateAuthorizationCode */

  async getAccessToken(accessToken) {
    const token = await this.db.models.token.findOne({ where: { accessToken } });
    if (!token) return null;
    const user = await token.getUser();
    if (!user) return null;
    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      scope: token.scope,
      client: {
        id: token.clientId,
      },
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async getRefreshToken(refreshToken) {
    const token = await this.db.models.token.findOne({ where: { refreshToken } });
    if (!token) return null;
    const user = await token.getUser();
    if (!user) return null;
    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      client: {
        id: token.clientId,
      },
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async getAuthorizationCode(authorizationCode) {
    const token = await this.db.models.authorizationToken.findOne({
      where: { code: authorizationCode },
    });
    if (!token) return null;
    const user = await token.getUser();
    if (!user) return null;
    return {
      code: token.code,
      expiresAt: token.expiresAt,
      redirectUri: token.redirectUri,
      scope: token.scope,
      client: {
        id: token.clientId,
      },
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  getClient(clientId, clientSecret) {
    return this.clients.find(client => clientId === client.id
      && (clientSecret === null || clientSecret === client.secret));
  }

  async getUser(username, password) {
    const user = await this.db.models.user.findOne({ where: { username } });
    if (user && bcrypt.compareSync(password, user.hash)) return user;
    return null;
  }

  /* getUserFromClient (client_credentials) */

  async saveToken(token, client, user) {
    await this.db.models.token.create({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      clientId: client.id,
      userId: user.id,
    });
    return {
      ...token,
      client,
      user,
    };
  }

  get saveAuthorizationCode() {
    // eslint-disable-next-line
    return this._saveAuthorizationCode.bind(this);
  }

  async _saveAuthorizationCode(code, client, user) {
    await this.db.models.authorizationToken.create({
      code: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      clientId: client.id,
      userId: user.id,
    });
    return {
      ...code,
      client,
      user,
    };
  }

  async revokeToken({ refreshToken, client, user }) {
    const c = await this.db.models.token.destroy({
      where: {
        refreshToken,
        clientId: client.id,
        userId: user.id,
      },
    });
    return c === 1;
  }

  async revokeAuthorizationCode({ code, client, user }) {
    const c = await this.db.models.authorizationToken.destroy({
      where: {
        code,
        clientId: client.id,
        userId: user.id,
      },
    });
    return c === 1;
  }

  /* validateScope */
  /* verifyScope (authenticate) */
}

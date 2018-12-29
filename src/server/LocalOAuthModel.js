import bcrypt from 'bcrypt';

export default class LocalOAuthModel {
  constructor(client, db) {
    this.client = {
      ...client,
      grants: ['password', 'refresh_token'],
    };
    this.db = db;
  }

  getClient(clientId, clientSecret) {
    if (clientId !== this.client.id
      || clientSecret !== this.client.secret) {
      return null;
    }
    return this.client;
  }

  async getUser(username, password) {
    const user = await this.db.models.user.findOne({ where: { username } });
    if (user && bcrypt.compareSync(password, user.hash)) return user;
    return null;
  }

  async saveToken(token, client, user) {
    await this.db.models.user.update({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    }, {
      where: {
        id: user.id,
      },
    });
    return {
      ...token,
      client,
      user,
    };
  }

  async getAccessToken(accessToken) {
    const user = await this.db.models.user.findOne({
      where: { accessToken },
    });
    if (!user) return null;
    return {
      accessToken: user.accessToken,
      accessTokenExpiresAt: user.accessTokenExpiresAt,
      client: {
        id: this.client.id,
      },
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async getRefreshToken(refreshToken) {
    const user = await this.db.models.user.findOne({
      where: { refreshToken },
    });
    if (!user) return null;
    return {
      refreshToken: user.refreshToken,
      refreshTokenExpiresAt: user.refreshTokenExpiresAt,
      client: {
        id: this.client.id,
      },
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async revokeToken({ refreshToken }) {
    const updated = await this.db.models.user.update({
      refreshToken: null,
      refreshTokenExpiresAt: null,
    }, {
      where: { refreshToken },
    });
    return updated[0] === 1;
  }
}

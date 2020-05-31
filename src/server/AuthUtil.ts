import { createHash, randomBytes } from 'crypto';
import { AuthToken } from '../common/GQLTypes';

const dayMillis = 1000 * 60 * 60 * 24;

export const generateRandomToken = (): Promise<string> => new Promise((resolve, reject) => {
  randomBytes(256, (err, buf) => {
    if (err) reject(err);
    else {
      resolve(createHash('sha1')
        .update(buf)
        .digest('hex'));
    }
  });
});

export type GenAuthToken = AuthToken & { refreshExpiredAt: Date };

export const generateAuthToken = async (): Promise<GenAuthToken> => ({
  accessToken: await generateRandomToken(),
  refreshToken: await generateRandomToken(),
  expiredAt: new Date(Date.now() + (dayMillis * 2)).toISOString(),
  refreshExpiredAt: new Date(Date.now() + (dayMillis * 4)),
});

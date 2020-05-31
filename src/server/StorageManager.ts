import fs from 'fs-extra';
import { getConfig } from '../common/Config';

// eslint-disable-next-line import/prefer-default-export
export const saveIrBinary = async (buf: Buffer, id: number) => {
  const config = await getConfig();
  await fs.ensureDir(`${config.storageBasePath}/${config.irPath}`);
  await fs.writeFile(`${config.storageBasePath}/${config.irPath}/${id}`, buf);
};

export const readIrBinary = async (id: number) => {
  const config = await getConfig();
  return fs.readFile(`${config.storageBasePath}/${config.irPath}/${id}`);
};

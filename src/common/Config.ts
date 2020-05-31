import YAML from 'yaml';
import fs from 'fs-extra';

export type Config = {
  storageBasePath: string;
  irPath: string;
  irPingWait: string;
  sensorMaxSize: number;
  googleClient: {
    id: string;
    secret: string;
    redirectUris: string[];
  };
};

let config: Config;
export const getConfig = async (): Promise<Config> => {
  if (!config) {
    const file = await fs.readFile('config.yaml', 'utf8');
    config = YAML.parse(file);
  }
  return config;
};

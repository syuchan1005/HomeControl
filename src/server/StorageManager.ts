import fs from 'fs-extra';

const CONFIG_STORAGE_BASE_PATH = 'storage';
const CONFIG_IR_PATH = 'ir';

// eslint-disable-next-line import/prefer-default-export
export const saveIrBinary = async (buf: Buffer, id: number) => {
  await fs.ensureDir(`${CONFIG_STORAGE_BASE_PATH}/${CONFIG_IR_PATH}`);
  await fs.writeFile(`${CONFIG_STORAGE_BASE_PATH}/${CONFIG_IR_PATH}/${id}`, buf);
};

export const readIrBinary = (id: number) => fs.readFile(`${CONFIG_STORAGE_BASE_PATH}/${CONFIG_IR_PATH}/${id}`);

/* eslint-disable no-console */

const fs = require('fs').promises;
const axios = require('axios');
const {
  JSDOM,
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('jsdom');

// language=TypeScript
const fileHeadText = `export type DeviceType = {
  id: string;
  type: string;
  getTraits: () => Promise<Array<TraitType>>;
  name: {
    name: string;
    nicknames?: Array<string>;
    defaultNames?: Array<string>;
  },
  willReportState: boolean;
  roomHint?: string;
  deviceInfo?: {
    manufacturer: string;
    model: string;
    hwVersion: string;
    swVersion: string;
  };
  // QUERY or EXECUTE
  customData?: { [key: string]: string | boolean | number };
  otherDeviceIds?: Array<{
    deviceId: string;
    agentId?: string;
  }>;
};


type TraitType<A = any, S = any, C extends TraitCommandType<string, any> = any> = {
  type: string;

  // SYNC
  getAttributes: () => Promise<A>;

  getStates: () => Promise<S>;

  getCommands: () => Promise<C[]>;
};

type TraitCommandType<T extends string, P> = {
  type: T;
  parameters: P;
};`;

if (!process.argv[2]) {
  console.error('invalid file path');
  return;
}
const filePath = `${__dirname}/../${process.argv[2]}`;

const forbiddenChars = ['<', '>', ':', '"', '/', '\\\\', '\\|', '\\?', '\\*', '\\.'];
const fetchDataFromNetworkOrCache = async (url) => {
  await fs.mkdir('scripts/cache').catch(() => {}/* ignored */);
  const path = `scripts/cache/${forbiddenChars.reduce(
    (str, c) => str.replace(new RegExp(c, 'g'), '_'),
    url.replace(/https?:\/\//g, ''),
  )}.json`;
  try {
    return await fs.readFile(path, 'utf8');
  } catch (e) {
    const res = await axios.get(url);
    await fs.writeFile(path, res.data);
    return res.data;
  }
};

// DONE
const genDeviceTypeInformationString = async () => {
  const res = await fetchDataFromNetworkOrCache('https://developers.google.com/assistant/smarthome/guides');
  const dom = new JSDOM(res);
  const rows = [...dom.window.document.querySelectorAll('table > tbody > tr[id]')];
  const content = rows.map((elem) => `  '${elem.id}': {
    name: '${elem.children[0].textContent.trim()}',
    type: '${elem.id}',
    description: '${elem.children[2].textContent.trim().replace(/\n/g, ' ').replace(/'/g, '\\\'')}',
    recommendedTrains: [
${elem.children[3].textContent.trim().split('\n').map((name) => `      '${name.trim()}',`).join('\n')}
    ],
  },`).join('\n');
  return `\nexport const DeviceTypeInformation = {\n${content}\n};`;
};

const hasPropType = ['object', 'array'];
const arrayType = ['array', 'list'];
const objectType = ['object'];
const stringType = ['string'];
const integerType = ['integer', 'number'];
const floatType = ['float'];
const booleanType = ['boolean', 'bool'];
const getType = (text) => {
  const match = [
    arrayType,
    objectType,
    stringType,
    integerType,
    floatType,
    booleanType,
  ].reduce((obj, arr) => {
    arr.forEach((a) => {
      // eslint-disable-next-line no-param-reassign,prefer-destructuring
      obj[a] = arr[0];
    });
    return obj;
  }, {});
  const indexes = {};
  Object.entries(match)
    .forEach(([matchText, type]) => {
      const index = text.indexOf(matchText);
      if (index !== -1 && (!indexes[type] || indexes[type] > index)) {
        indexes[type] = index;
      }
    });
  if (Object.keys(indexes).length === 0) {
    // throw new Error(`UNKNOWN TYPE TEXT: ${text}`);
    console.error(`UNKNOWN TYPE TEXT: ${text}`);
    return 'any';
  }
  return Object.entries(indexes)
    .sort((a, b) => a[1] - b[1])[0][0];
};

const getProp = (typeString, type, getElement) => {
  let prop;
  if (hasPropType.includes(type)) {
    // eslint-disable-next-line no-use-before-define
    prop = tableToTypeObject(getElement(), 0);
    if (!prop) {
      if (type === 'array') {
        prop = getType(typeString
          .replace(new RegExp('array', 'gi'), '')
          .replace(new RegExp('list', 'gi'), ''));
      } else {
        prop = getType(typeString.replace(new RegExp(type, 'gi'), ''));
      }
    }
    if (['object', 'array'].includes(prop)) {
      prop = undefined;
    }
  }
  return prop;
};

// Array, List, String, Integer, Boolean, Bool, Defaults to {bool, number(include,), string ""}
const tableToTypeObject = (element, start = 1) => {
  if (!element) return undefined;
  let attributes = [];
  if (element.tagName === 'TABLE') {
    attributes = [...element.children[0].children/* tbody > tr */].slice(start)
      .map((row) => {
        if (row.children.length === 3) {
          const typeString = row.children[1].textContent.toLowerCase();
          const type = getType(typeString);
          if (!type) return undefined;
          const nestElement = row.children[2].querySelector('table, ul');
          let descText = row.children[2].textContent;
          if (nestElement) {
            descText = descText.replace(nestElement.textContent, '');
          }
          descText = descText
            .trim()
            .toLowerCase();
          return ({
            name: row.children[0].textContent.trim(),
            type,
            required: !descText.toLowerCase().includes('optional'),
            prop: getProp(
              typeString,
              type,
              () => row.children[2].querySelector('table, ul'),
            ),
          });
        }
        if (row.children.length === 2) {
          const nestElement = row.children[1].querySelector('table, ul');
          let definitionText = row.children[1].textContent;
          if (nestElement) {
            definitionText = definitionText.replace(nestElement.textContent, '');
          }
          definitionText = definitionText
            .trim()
            .toLowerCase();
          const type = getType(definitionText);
          if (!type) return undefined;
          return ({
            name: row.children[0].textContent.trim(),
            type,
            required: !definitionText.includes('optional'),
            prop: getProp(
              definitionText,
              type,
              () => row.children[1].querySelector('table, ul'),
            ),
          });
        }
        throw new Error(`TABLE parse error: ${row}`);
      });
  } else if (element.tagName === 'UL') {
    attributes = [...element.children/* li */].map((li) => {
      const nestElement = li.querySelector('table, ul');
      let descText = li.textContent;
      if (nestElement) {
        descText = descText.replace(nestElement.textContent, '');
      }
      descText = descText
        .trim()
        .toLowerCase();
      const type = getType(descText);
      if (!type) return undefined;
      const nameElem = li.querySelector('code');
      if (!nameElem) return undefined;
      return ({
        name: nameElem.textContent.trim(),
        type,
        required: !descText.includes('optional'),
        prop: getProp(
          descText,
          type,
          () => li.querySelector('table, ul'),
        ),
      });
    });
  }
  return attributes
    .filter((e) => e)
    .reduce((obj, attr) => ({
      ...obj,
      [attr.name]: attr,
    }), {});
};

const fetchDeviceTypes = async () => {
  const res = await fetchDataFromNetworkOrCache('https://developers.google.com/assistant/smarthome/guides');
  const dom = new JSDOM(res);
  const rows = [...dom.window.document.querySelectorAll('table > tbody > tr[id]')];
  return rows.map((row) => ({
    name: row.children[0].textContent.trim(),
    type: row.id,
    description: row.children[2].textContent.trim()
      .replace(/\n/g, ' ')
      .replace(/'/g, '\\\''),
    recommendedTrains: row.children[3].textContent.trim()
      .split('\n').map((s) => s.trim()),
  }));
};

const fetchTraitTypes = async () => {
  const res = await fetchDataFromNetworkOrCache('https://developers.google.com/assistant/smarthome/traits');
  const dom = new JSDOM(res);
  const rows = [...dom.window.document.querySelectorAll('table > tbody > tr[id]')];
  const traits = rows.map((row) => ({
    url: `https://developers.google.com/${row.children[0].children[0].href}`,
    name: row.children[0].textContent.trim(),
    type: row.id,
    description: row.children[2].textContent.trim()
      .replace(/\n/g, ' ')
      .replace(/'/g, '\\\''),
  }));
  // eslint-disable-next-line no-restricted-syntax
  for (const trait of traits) {
    console.log(trait.type);
    // eslint-disable-next-line no-await-in-loop
    const cmdRes = await fetchDataFromNetworkOrCache(trait.url);
    const cmdDom = new JSDOM(cmdRes);
    const elements = [...cmdDom.window.document.querySelectorAll('h2[id^="device-"], h3[id^="action.devices.commands."], table ')];
    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];
      if (element.tagName === 'H2') {
        switch (element.id) {
          case 'device-attributes':
            trait.attributes = tableToTypeObject(elements[i + 1]);
            break;
          case 'device-states':
            trait.states = tableToTypeObject(elements[i + 1]);
            break;
          case 'device-commands': {
            trait.commands = {};
            let type = '';
            let commandId = 1;
            while (elements.length > i + commandId && elements[i + commandId].tagName !== 'H2') {
              if (elements[i + commandId].tagName === 'H3') {
                type = elements[i + commandId].id;
                if (elements.length < i + commandId + 1) {
                  trait.commands[type] = tableToTypeObject(elements[i + commandId]);
                  commandId += 1;
                }
              } else if (elements[i + commandId].tagName === 'TABLE') {
                trait.commands = tableToTypeObject(elements[i + commandId]);
                break;
              }
              commandId += 1;
            }
            break;
          }
          default:
        }
      }
    }
    /*
    const traitData = {
      attributes: {
        availableApplications: {
          type: 'array',
          required: true,
          prop: {
            key: {
              type: 'string',
              required: true,
            },
            names: {
              type: 'array',
              required: true,
              prop: {
                name_synonym: {
                  type: 'array',
                  required: true,
                  prop: 'string',
                },
                lang: {
                  type: 'string',
                  required: true,
                },
              },
            },
          },
        },
      },
      states: {
        currentApplication: {
          type: 'string',
        },
      },
      commands: {
        'action.devices.commands.appInstall': {
          newApplication: {
            type: 'string',
          },
          newApplicationName: {
            type: 'string',
          },
        },
      },
    };
    */
  }
  return traits;
};

(async () => {
  const devices = await fetchDeviceTypes();
  await fs.writeFile('./devices.json', JSON.stringify(devices, null, 2));

  const traits = await fetchTraitTypes();
  await fs.writeFile('./traits.json', JSON.stringify(traits, null, 2));

  await fs.writeFile(filePath, `${[
    fileHeadText,
  ].join('\n')}\n`);
})();

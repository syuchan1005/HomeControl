/* eslint class-methods-use-this: ["error", { "exceptMethods": ["QUERY", "EXECUTE"] }] */
import DeviceTypes from './google/DeviceTypes';

export default class SmartHome {
  constructor(db) {
    this.db = db;
  }

  async SYNC(ctx) {
    const { id } = ctx.state.oauth.token.user;
    let devices = await this.db.models.device.findAll({ where: { userId: id } });
    await devices.reduce((p, device) => p.then(async () => {
      // eslint-disable-next-line
      device.traits = await device.getTraits();
      // eslint-disable-next-line
      device.traitClasses = device.traits.map(t => t.toTraitObject());
      // eslint-disable-next-line
      device.traitSyncs = [];
      await device.traitClasses.reduce((pr, n) => pr.then(async () => {
        const q = await n.sync();
        device.traitSyncs.push(q);
      }), Promise.resolve());
    }), Promise.resolve());
    devices = devices.map(device => ({
      willReportState: false,
      id: `${device.id}`,
      type: DeviceTypes[device.type],
      name: {
        defaultNames: device.defaultNames.split(',').filter(v => v.length !== 0),
        nicknames: device.nicknames.split(',').filter(v => v.length !== 0),
        name: device.name,
      },
      ...device.traitSyncs
        .reduce((p, n) => {
          p.traits.push(...n.traits);
          // eslint-disable-next-line
            p.attributes = Object.assign(p.attributes, n.attributes);
          return p;
        }, {
          traits: [],
          attributes: {},
        }),
    }));

    ctx.body = { requestId: ctx.request.body.requestId, payload: { agentUserId: `${id}`, devices } };
  }

  async QUERY(ctx, payload) {
    let devices = [];
    await payload.devices.reduce((p, { id }) => p.then(async () => {
      devices.push(await this.db.models.device.findOne({ where: { id } }));
    }), Promise.resolve());
    await devices.reduce((p, device) => p.then(async () => {
      // eslint-disable-next-line
      device.traits = await device.getTraits();
      // eslint-disable-next-line
      device.traitClasses = device.traits.map(t => t.toTraitObject());
      // eslint-disable-next-line
      device.traitQueries = [];
      await device.traitClasses.reduce((pr, n) => pr.then(async () => {
        const q = await n.query();
        device.traitQueries.push(q);
      }), Promise.resolve());
    }), Promise.resolve());

    devices = devices.reduce((obj, device) => {
      // eslint-disable-next-line
      obj[device.id] = device.traitQueries.reduce((o, query) => Object.assign(o, query), {
        online: true,
      });
      return obj;
    }, {});

    ctx.body = { requestId: ctx.request.body.requestId, payload: { devices } };
  }

  async EXECUTE(ctx, payload) {
    const commands = [];
    // eslint-disable-next-line
    for (let command of payload.commands) {
      const devices = [];
      // eslint-disable-next-line
      await command.devices
        .reduce((p, { id }) => p.then(async () => {
          devices.push(await this.db.models.device.findOne({ where: { id } }));
        }), Promise.resolve());

      const commandR = {
        ids: [],
        status: 'SUCCESS',
        states: {
          online: true,
        },
      };
      // eslint-disable-next-line
      for (let execution of command.execution) {
        const exec = [];
        // eslint-disable-next-line
        await devices.reduce((p, d) => p.then(async() => {
          exec.push(await d.execute(execution));
        }), Promise.resolve());
        exec.forEach((e) => {
          commandR.ids.push(...e.ids);
          // eslint-disable-next-line
          commandR.states = Object.assign(commandR.states, e.states);
        });
      }
      commandR.ids = commandR.ids.filter((x, i, self) => self.indexOf(x) === i);
      commands.push(commandR);
    }

    ctx.body = { requestId: ctx.request.body.requestId, payload: { commands } };
  }

  middleware(router, path) {
    router.post(path, async (ctx) => {
      if (!ctx.request.body.inputs || ctx.request.body.inputs.length !== 1) {
        ctx.throw(401, { error: 'missing inputs' });
      }
      const input = ctx.request.body.inputs[0];
      switch (input.intent) {
        case 'action.devices.SYNC':
          await this.SYNC(ctx);
          break;
        case 'action.devices.QUERY':
          await this.QUERY(ctx, input.payload);
          break;
        case 'action.devices.EXECUTE':
          await this.EXECUTE(ctx, input.payload);
          break;
        case 'action.devices.DISCONNECT':
          ctx.body = {};
          break;
        default:
          ctx.throw(401, { error: 'missing intent' });
          return;
      }
      ctx.status = 200;
    });
  }
}

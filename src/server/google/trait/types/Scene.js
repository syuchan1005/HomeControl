class Scene {
  static get key() {
    return 'action.devices.traits.Scene';
  }

  sync() {
    return {
      traits: [Scene.key],
      attributes: {
        sceneReversible: false,
      },
    };
  }

  query() {
    return {};
  }

  execute(/* execution */) {
    return {};
  }
}

export default Scene;

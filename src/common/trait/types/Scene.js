class Scene {
  static get key() {
    return 'action.devices.traits.Scene';
  }

  sync() {
    return {
      traits: [Scene.key],
      attributes: {
        sceneReversible: true,
      },
    };
  }

  query() {
    return {};
  }

  static init() {
    return new Scene();
  }
}

export default Scene;

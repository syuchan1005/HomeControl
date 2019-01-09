class CameraStream {
  static get key() {
    return 'action.devices.traits.CameraStream';
  }

  sync() {
    return {
      traits: [CameraStream.key],
      attributes: {
        cameraStreamSupportedProtocols: [],
        cameraStreamNeedAuthToken: false,
        cameraStreamNeedDrmEncryption: false,
      },
    };
  }

  query() {
    return {};
  }

  static init() {
    return new CameraStream();
  }
}

export default CameraStream;

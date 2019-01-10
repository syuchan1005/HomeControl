class CameraStream {
  static get key() {
    return 'action.devices.traits.CameraStream';
  }

  constructor(info) {
    this.info = info;
  }

  sync() {
    return {
      traits: [CameraStream.key],
      attributes: {
        cameraStreamSupportedProtocols: this.info.supportedProtocols,
        cameraStreamNeedAuthToken: false,
        cameraStreamNeedDrmEncryption: false,
      },
    };
  }

  query() {
    return {};
  }

  execute(/* execution */) {
    return {
      cameraStreamAccessUrl: this.info.url,
    };
  }
}

export default CameraStream;

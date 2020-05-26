import { Workbox } from 'workbox-window';

export default () => {
  let wb;
  if (process.env.NODE_ENV === 'production') {
    if ('serviceWorker' in navigator) {
      wb = new Workbox('/service-worker.js');

      wb.register();
    }
  }

  return wb;
};

/* global workbox */
/* eslint-disable no-underscore-dangle,no-restricted-globals, default-case */
workbox.core.skipWaiting(); workbox.core.clientsClaim();
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

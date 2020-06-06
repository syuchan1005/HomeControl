/* global workbox */
/* eslint-disable no-underscore-dangle,no-restricted-globals, default-case */
workbox.core.skipWaiting(); workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, {});

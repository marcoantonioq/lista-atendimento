declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';


self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener('message', (event) => {
  console.log('Mensagem recebida no Service Worker:', event.data);
});

self.addEventListener('install', () => {
  // executeDailyEvent()
});

self.addEventListener('activate', (/*event*/) => {
  console.log('Eventos agendados...');
});

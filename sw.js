/*
 * Service worker: tiene in cache la pagina e la libreria, così l'app si apre
 * anche senza campo in palestra. La scheda e lo storico stanno nella memoria
 * del telefono (localStorage), non qui. Le chiamate al ponte non passano mai dalla cache.
 * Quando cambi i file, aumenta VERSION per far scaricare la nuova versione.
 */
const VERSION = 'scheda-v3';
const SHELL = [
  './',
  'index.html',
  'config.js',
  'manifest.webmanifest',
  'icons/favicon-32.png',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;   // ponte Apps Script: sempre dalla rete

  // pagina e config: prima la rete (così vedi subito gli aggiornamenti), cache se offline
  if (req.mode === 'navigate' || url.pathname.endsWith('/config.js') || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }
  // libreria e icone: prima la cache
  event.respondWith(caches.match(req).then(r => r || fetch(req)));
});

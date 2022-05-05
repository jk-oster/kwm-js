"use strict";

let myCache = 'KWMJS_cache'
let filesToCache = ['index.html'];

self.addEventListener('install', event => {
    console.log('SW install');
    event.waitUntil(caches.open(myCache).then(function (cache) {
        return cache.addAll(filesToCache).then(() => {
            console.log('Assets cached');
        }).catch(err => {
            console.log('Error caching assets', err);
        });
    }));
});

self.addEventListener('activate', () => {
    console.log('Service Worker activate');
});

self.addEventListener('fetch', event => {
    console.log('Fetch intercepted', event.request);
});

self.addEventListener('push', event => {
    console.log('Push received', event.data);
    const title = 'KWM-Push Message';
    const options = {
        body: event.data.text()
    };
    event.waitUntil(self.registration.showNotification(title, options));
});
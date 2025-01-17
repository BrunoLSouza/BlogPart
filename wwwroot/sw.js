﻿"use strict";

var cacheName = 'v2Cache';
var blogCacheFiles = [
    '/',
    //arquivos basicos da pwa
    '/sw.js',
    '/lib/bootstrap/dist/css/bootstrap.css',
    '/css/site.css',
    '/lib/jquery/dist/jquery.js',
    '/lib/bootstrap/dist/js/bootstrap.bundle.js',
    '/lib/es6-promise/es6-promise.js',
    '/lib/fetch/fetch.js',
    '/lib/systemjs/system.js',
    '/lib/localforage/localforage.min.js',
    '/lib/localforage/localforage-getitems.js',
    '/lib/localforage/localforage-setitems.js',
    '/js/site.js',
    '/js/app.js',
    '/js/blogService.js',
    '/js/swRegister.js',
    '/js/template.js',
    '/lib/showdown/showdown.js',
    '/js/clientStorage.js',
    '/manifest.json',
    '/favicon.ico'
]; 

//Installing
//Pre-cache App Shell
self.addEventListener('install', function (event) {
    console.log("SW: Evento de Instalacao");
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll(blogCacheFiles)
            })
    );
});

//Activating
//Clean up 
self.addEventListener('activate', function (event) {
    console.log("SW: Evento de Ativacao");
    self.clients.claim();
    event.waitUntil(caches.keys()
        .then(function (cacheKeys) {
            var deletePromises = [];
            for (var i = 0; i < cacheKeys.length; i++) {
                if (cacheKeys[i] != cacheName) { deletePromises.push(caches.delete(cacheKeys[i])); }
            }
            return Promise.all(deletePromises);
        }));
});

self.addEventListener('fetch', event => {

    console.log('url request: ' + event.request.url);

    if (event.request.url.toLowerCase().includes("/home")) {
        console.log('[ServiceWorker] online - get online ' + event.request.url);
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            timeout(1000, fetch(event.request)).catch(function () {
                console.log('[ServiceWorker] offline - get from cache: ' + event.request.url);
                return caches.match(event.request);
            })
        );
    }
});
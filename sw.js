



self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching all assets')
            cache.addAll(assets);
        })
    )

})
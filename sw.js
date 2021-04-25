const CACHE_NAME = "v1_cache_gradient_generator" // Esto se hace por normalizacion, no es necesario pero se usa tambien para identificar la cache
const urlsToCache = [
    "./",
    "./?umt_source=web_app_manifest",
    "./pages/fallback.html",
    "./pages/css/style.css",
    "./img/favicon.png",
    "./img/icon32.png",
    "./img/icon64.png",
    "./img/icon128.png",
    "./img/icon192.png",
    "./img/icon256.png",
    "./img/icon512.png",
    "./img/icon1024.png",
    "https://unpkg.com/vue@next",
    "./js/main.js",
    "./js/mountApp.js",
    "./css/style.css",
    "manifest.json",
    "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
]

self.addEventListener("install",e =>{
    e.waitUntil(
        caches.open(CACHE_NAME).then(
            cache => cache.addAll(urlsToCache).then(
                () => self.skipWaiting()
            ).catch(
                err => console.log(err)
            )
        )
    )
})

self.addEventListener("activate", e => {
    const cacheWhiteList = [CACHE_NAME]

    e.waitUntil(
        caches.keys().then(
            cachesNames => {
                return Promise.all(
                    cachesNames.map(
                        cacheName => {
                            if(cacheWhiteList.indexOf(cacheName) === -1){
                                return caches.delete(cacheName)
                            }
                        }
                    )
                )
            }
        ).then(
            () => self.clients.claim()
        )
    )
})

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            if(res){
                return res
            }

            return fetch(e.request)
        }).catch(
            () => caches.match("./pages/fallback.html")
        )
    )
})
const cache_name = "cache-v1";

let cached_urls = [ //precache
    '/',
    '/?source=pwa&utm_source=pwa',
    "/api/institute"
]
let no_cache = [
    "/api/data"
];

function preCache() {
    return caches.open(cache_name).then(function (cache) {
      return cache.addAll(cached_urls);
    });
}

self.addEventListener('install', function(e) {
    
    e.waitUntil(preCache());
});

function checkCache(u){
    
    for (let url of no_cache){
        if (u.indexOf(url) != -1){
            return false;
        }
    }

    return true;
}

function fetchResource(req){
    return new Promise(function(resolve,reject){
        let timeout = -1;
        

        if (checkCache(req.url)){
            timeout = setTimeout(function(){
                reject("Timed out");
            },400);
        }
        
        fetch(req).then(function(response) {
            if (checkCache(req.url)){
                return caches.open(cache_name).then(function(cache) {
                    cache.put(req, response.clone());
                    resolve(response);
                    clearTimeout(timeout);
                });
            } else {
                resolve(response);
            }
        });
        
    })
}
self.addEventListener('fetch', function(event) {
    console.log("fetch",event.request.url);
   
    event.respondWith( fetchResource(event.request).catch(()=>{
        return caches.match(event.request);
    })
        
    );
});
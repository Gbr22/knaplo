const cache_name = "cache-v1";

let cached_urls = [
    '/',
    '/?source=pwa&utm_source=pwa',
    "/api/institute"
]

function preCache() {
    return caches.open(cache_name).then(function (cache) {
      return cache.addAll(cached_urls);
    });
}

self.addEventListener('install', function(e) {
    
    e.waitUntil(preCache());
});

function fetchResource(req){
    return new Promise(function(resolve,reject){
        let time = req.url.indexOf("/api") == -1 ? 400 : 10000;
        let timeout = setTimeout(function(){
            reject("Timed out");
        },time);
        fetch(req).then(function(response) {
            return caches.open(cache_name).then(function(cache) {
              cache.put(req, response.clone());
              resolve(response);
              clearTimeout(timeout);
            });  
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
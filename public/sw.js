const cache_name = "cache-v1";

async function preCache(){
    return;
}

self.addEventListener('install', function(e) {
    
    e.waitUntil(preCache());
});

function fetchResource(req){
    return new Promise(function(resolve,reject){
        let timeout = setTimeout(function(){
            reject("Timed out");
        },400);
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
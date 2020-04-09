let cacheName = "cache-v2";

let contentToCache = [];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
          return cache.addAll(contentToCache);
        })
      );
    console.log("Worker install event");
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
          if(key !== cacheName) {
            return caches.delete(key);
          }
        }));
      })
    );
  });



function cacheFirst(request){
    return caches.match(request).then(c=>{
        let f = fetch(request).then(response=>{
            return caches.open(cacheName).then(cache=>{
                console.log("[putting]",request.url);
                cache.put(request, response.clone());
                return response;
            })
        });
        
        return c || f;
    })
}
function fetchFirst(request){
    return fetch(request).then((response)=>{
        return caches.open(cacheName).then(cache=>{
            console.log("[putting]",request.url);
            cache.put(request, response.clone());
            return response;
        })
    }).catch(() => caches.match(request));
}

function networkOnly(request){
    return fetch(request);
}

function doCache(request){
    let whiteListedExt = ["png","jpg","webp","jpeg","svg","css","js","html"];
    let whiteListedFiles = ["/","/manifest.json"];

    let url = new URL(request.url);

    let pathdots = url.pathname.split(".");
    let ext = pathdots[pathdots.length-1];

    return whiteListedFiles.includes(url.pathname) || whiteListedExt.includes(ext);
}

self.addEventListener('fetch', (e) => {
    let url = new URL(e.request.url);
    if (url.pathname == "/"){
        e.respondWith(fetchFirst(new Request("/")));
    }
    else if (doCache(e.request)){
        console.log("[fetchFirst]",e.request.url);
        e.respondWith(fetchFirst(e.request));
    } else {
        console.log("[networkOnly]",e.request.url);
        e.respondWith(networkOnly(e.request));
    }
  });
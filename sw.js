// Kharcha Pani offline support.
// App files: network first (so updates arrive straight away), saved copy when offline.
// Libraries (charts, Firebase) and fonts: saved copy first, since those never change.
// Firebase's own data traffic is left alone; the app queues changes itself while offline.
const CACHE = "kharchapani-v2";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
const LIBS = [
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js",
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=> Promise.all(
    [...APP_FILES, ...LIBS].map(u=> c.add(u).catch(()=>{}))   // one failure must not block install
  )).then(()=> self.skipWaiting()));
});

self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys()
    .then(keys=> Promise.all(keys.filter(k=> k!==CACHE).map(k=> caches.delete(k))))
    .then(()=> self.clients.claim()));
});

function networkFirst(req){
  return fetch(req).then(res=>{
    if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(c=> c.put(req, copy)); }
    return res;
  }).catch(()=> caches.match(req, {ignoreSearch:true}).then(hit=>
    hit || (req.mode==="navigate" ? caches.match("./index.html") : Response.error())));
}
function cacheFirst(req){
  return caches.match(req).then(hit=> hit || fetch(req).then(res=>{
    if(res && (res.ok || res.type==="opaque")){ const copy = res.clone(); caches.open(CACHE).then(c=> c.put(req, copy)); }
    return res;
  }));
}

self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin === self.location.origin){ e.respondWith(networkFirst(req)); return; }
  if(LIBS.includes(req.url) || url.hostname==="fonts.googleapis.com" || url.hostname==="fonts.gstatic.com"){
    e.respondWith(cacheFirst(req)); return;
  }
  // Everything else (Firebase sync traffic) goes straight to the network.
});

const C='mijote-v1';
const EXT=['www.gstatic.com','cdnjs.cloudflare.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','icon.png'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url),same=u.origin===location.origin;
  if(e.request.method!=='GET'||!(same||EXT.includes(u.hostname)))return;
  e.respondWith((async()=>{
    const c=await caches.open(C);
    if(same){
      try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}
      catch(_){return (await c.match(e.request,{ignoreSearch:true}))||(await c.match('index.html'))}
    }
    const hit=await c.match(e.request);if(hit)return hit;
    const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r;
  })());
});

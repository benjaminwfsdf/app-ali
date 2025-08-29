const CACHE = "al-love-v2"; // puedes ir subiendo la versión al cambiar cosas
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/heart-192.png",
  "./icons/heart-512.png",

  // Fotos
  "./fotos/1.JPG",
  "./fotos/2.JPG",
  "./fotos/3.JPG",
  "./fotos/4.jpg",
  "./fotos/5.JPG",
  "./fotos/6.JPG",
  "./fotos/7.JPG",
  "./fotos/8.jpg",
  "./fotos/9.jpg",
  "./fotos/10.jpg",
  "./fotos/11.jpg",
  "./fotos/12.jpg"
];


self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) =>
      Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// cache-first con update en bg
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  e.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "4e7d08357da11a270556c93fee85f431",
"assets/assets/Artboard.jpg": "5f006a1011ec4ce5939265d08844db5e",
"assets/assets/Artboard2.jpg": "060dacb035fc4651c8f4ed672e520b38",
"assets/assets/Artboard3.jpg": "c7f0143b868897fdc109662fbefd9571",
"assets/assets/Artboard4.jpg": "553963af1be5c01da9c7c9461edc1c63",
"assets/assets/Artboard5.jpg": "2f5aaf7479b566193ee3ae0e20ea43bc",
"assets/assets/bg.png": "81344352a2ce1287b13b36628e7d79cb",
"assets/assets/completed.jpg": "df5aed137f5d437678c8b378972d864d",
"assets/assets/eight.jpg": "51af4917d46f333093176837a3156479",
"assets/assets/five.jpg": "be958b0c7109d2acfdde305d6deca01a",
"assets/assets/Fonts/AGENCYR.TTF": "70777e6bd210190350f7c92395c1860f",
"assets/assets/Fonts/Blambot-Casual-Regular.ttf": "34a9c0d8675544c71c0476e933100fd5",
"assets/assets/Fonts/Blambot-Pro-Lite-Regular.ttf": "f7c5d305c32c30908365b23dcac12204",
"assets/assets/Fonts/Courgette-Regular.ttf": "cbd252f5c26cd61243888be1891f9921",
"assets/assets/Fonts/FORTE.TTF": "60a6c051c1563a067dd7166123a58698",
"assets/assets/Fonts/Marker_Felt.ttf": "aae462773966100890bdfe4a8188cc0a",
"assets/assets/four.jpg": "95042cb0414cf94cbc4b8d656c4719d2",
"assets/assets/history.jpg": "5305485bc95e0509150bfc69f81ae6cf",
"assets/assets/location.jpg": "c0558edba10fe721b7a88f4c4b97a0c4",
"assets/assets/logo.jpg": "39c5e32f57931a512251a1a30c509d3c",
"assets/assets/nine.jpg": "b41ce83a3a303cab38d6407df2bf8ee1",
"assets/assets/one.jpg": "6e6e890197c5989666e571245af73597",
"assets/assets/seven.jpg": "08a54a5b1aa53877acf420fbc9b1e199",
"assets/assets/six.jpg": "19ca947d53eb4060f83dfadb0ec16ef6",
"assets/assets/ten.jpg": "96aca50232d3e1c7ea8edb448d0544fd",
"assets/assets/three.jpg": "21f3380004dd7ea88deeb9537e3af46c",
"assets/assets/two.jpg": "1ca681ea4db0845d26c971c38532000f",
"assets/FontManifest.json": "f7e81b3207605f272bc1dc74e76cfc8e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "ba886ccc6911df4d061862122087786a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "1eb98c0b9a390b91955ce168126351f8",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "cf2cf3e64b353faddac25f8cbadf1ce6",
"/": "cf2cf3e64b353faddac25f8cbadf1ce6",
"main.dart.js": "cb6ec10784552bc81e789de38340c8d8",
"manifest.json": "fc43297b57c11d5db54ab37d60b79749",
"version.json": "23eaf2239c9251830371262f55086f6b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

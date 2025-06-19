
const CACHE_NAME = 'reviews-pwa-v2';
const urlsToCache = [
  '/',
  '/acervo',
  '/comunidade',
  '/perfil',
  '/lovable-uploads/9162a45a-bbb2-4b4c-90ad-2fc80a1b7b12.png',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Filter out external URLs and only cache local resources
        const localUrls = urlsToCache.filter(url => 
          !url.startsWith('http') || url.startsWith(self.location.origin)
        );
        return cache.addAll(localUrls);
      })
      .catch((error) => {
        console.error('Cache failed:', error);
        // Continue even if caching fails
      })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Fetch event - serve cached content when offline with better error handling
self.addEventListener('fetch', (event) => {
  // Skip external domains to prevent CORS issues
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Fetch from network with timeout
        return fetch(event.request, {
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
      })
      .catch((error) => {
        console.log('Fetch failed:', error);
        // Return fallback page for navigation requests when offline
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
        // For other requests, return a generic error response
        return new Response('Network error', {
          status: 408,
          statusText: 'Request Timeout'
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  return self.clients.claim();
});

// Handle background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  console.log('Background sync triggered');
  // Implement background sync logic here if needed
  return Promise.resolve();
}

// Handle push notifications with better error handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/lovable-uploads/9162a45a-bbb2-4b4c-90ad-2fc80a1b7b12.png',
    badge: '/lovable-uploads/9162a45a-bbb2-4b4c-90ad-2fc80a1b7b12.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver agora',
        icon: '/lovable-uploads/9162a45a-bbb2-4b4c-90ad-2fc80a1b7b12.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/lovable-uploads/9162a45a-bbb2-4b4c-90ad-2fc80a1b7b12.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Reviews - Plataforma Médica', options)
      .catch(error => {
        console.error('Failed to show notification:', error);
      })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

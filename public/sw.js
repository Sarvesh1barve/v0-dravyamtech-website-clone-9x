// Service Worker for Dravyam Technology PWA
const CACHE_NAME = 'dravyam-v1'
const STATIC_ASSETS = [
  '/',
  '/logo.png',
  '/favicon.png',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and non-http(s) URLs
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return
  }

  // API requests - network first, cache fallback
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(event.request, response.clone()))
          }
          return response
        })
        .catch(() => {
          // Fallback to cache for failed requests
          return caches.match(event.request)
        })
    )
    return
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache new assets
        if (fetchResponse.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone())
          })
        }
        return fetchResponse
      })
    })
  )
})

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-payments') {
    event.waitUntil(syncPayments())
  }
})

async function syncPayments() {
  try {
    const response = await fetch('/api/payments')
    return response.ok
  } catch (error) {
    console.error('Sync failed:', error)
    throw error
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || 'New notification from Dravyam',
    icon: '/logo.png',
    badge: '/favicon.png',
    tag: data.tag || 'dravyam-notification',
    requireInteraction: data.requireInteraction || false
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Dravyam Technology', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/')
      }
    })
  )
})

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3002/en',
        'http://localhost:3002/en/services',
        'http://localhost:3002/en/menu',
        'http://localhost:3002/en/schedule',
        'http://localhost:3002/en/gallery',
        'http://localhost:3002/en/contact',
        'http://localhost:3002/admin/login'
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}

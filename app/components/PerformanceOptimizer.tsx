'use client'

import { useEffect } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export function PerformanceOptimizer() {
  useEffect(() => {
    // Track Core Web Vitals
    const sendToAnalytics = (metric: WebVitalsMetric) => {
      // In production, send to your analytics service
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vitals:', metric)
      }
    }

    // Cumulative Layout Shift
    onCLS(sendToAnalytics)
    
    // Interaction to Next Paint (replaces FID)
    onINP(sendToAnalytics)
    
    // First Contentful Paint
    onFCP(sendToAnalytics)
    
    // Largest Contentful Paint
    onLCP(sendToAnalytics)
    
    // Time to First Byte
    onTTFB(sendToAnalytics)

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.href = '/fonts/inter.woff2'
      fontLink.as = 'font'
      fontLink.type = 'font/woff2'
      fontLink.crossOrigin = 'anonymous'
      document.head.appendChild(fontLink)

      // Preconnect to external domains
      const preconnectSupabase = document.createElement('link')
      preconnectSupabase.rel = 'preconnect'
      preconnectSupabase.href = 'https://jwxenutezijwyrguqicv.supabase.co'
      document.head.appendChild(preconnectSupabase)
    }

    preloadCriticalResources()

    // Optimize images with Intersection Observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]')
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              img.src = img.dataset.src || ''
              img.classList.remove('lazy')
              imageObserver.unobserve(img)
            }
          })
        })

        images.forEach((img) => imageObserver.observe(img))
      }
    }

    optimizeImages()

    // Service Worker registration for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('SW registration failed: ', error)
      })
    }

  }, [])

  return null // This component doesn't render anything
}

// Hook for measuring custom metrics
export function usePerformanceMetrics() {
  useEffect(() => {
    // Measure custom performance metrics
    const measureCustomMetrics = () => {
      // Time to Interactive (custom implementation)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            console.log(`${entry.name}: ${entry.duration}ms`)
          }
        }
      })
      
      observer.observe({ entryTypes: ['measure'] })
      
      // Mark when the page is interactive
      setTimeout(() => {
        performance.mark('page-interactive')
        performance.measure('time-to-interactive', 'navigationStart', 'page-interactive')
      }, 100)
    }

    measureCustomMetrics()
  }, [])
}

// Component for critical CSS inlining
export function CriticalCSS() {
  return (
    <style jsx>{`
      /* Critical CSS for above-the-fold content */
      .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .hero-title {
        font-size: 3rem;
        font-weight: 700;
        line-height: 1.2;
      }
      
      .hero-subtitle {
        font-size: 1.25rem;
        margin-top: 1rem;
        opacity: 0.8;
      }
      
      .cta-button {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 2rem;
        margin-top: 2rem;
        background-color: #A4B82C;
        color: white;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 600;
        transition: background-color 0.2s;
      }
      
      .cta-button:hover {
        background-color: #8A9824;
      }
    `}</style>
  )
}

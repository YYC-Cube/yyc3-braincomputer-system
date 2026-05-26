/**
 * file webVitals.ts
 * description Web Vitals 性能指标采集 — LCP/FID/CLS/INP/TTFB
 * author YanYuCloudCube Team
 * version v3.1.0
 * created 2026-05-19
 * updated 2026-05-19
 * status: active
 * tags: [performance],[monitoring],[web-vitals]
 */

interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number
  startTime: number
}

interface Metric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
  timestamp: number
}

type MetricCallback = (_metric: Metric) => void

function observeLCP(callback: MetricCallback) {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      if (entries.length > 0) {
        const entry = entries[entries.length - 1]
        callback({
          name: 'LCP',
          value: entry.startTime,
          rating: entry.startTime <= 2500 ? 'good' : entry.startTime <= 4000 ? 'needs-improvement' : 'poor',
          delta: entry.startTime,
          navigationType: performance.navigation.type.toString(),
          timestamp: Date.now(),
        })
      }
    })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch {}
}

function observeCLS(callback: MetricCallback) {
  try {
    let value = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutEntry = entry as LayoutShiftEntry
        if (!layoutEntry.hadRecentInput) {
          value += layoutEntry.value
        }
      }
      callback({
        name: 'CLS',
        value,
        rating: value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor',
        delta: value,
        navigationType: performance.navigation.type.toString(),
        timestamp: Date.now(),
      })
    })
    observer.observe({ type: 'layout-shift', buffered: true })
  } catch {}
}

function observeFID(callback: MetricCallback) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const inputEntry = entry as FirstInputEntry
        const fidValue = inputEntry.processingStart - inputEntry.startTime
        callback({
          name: 'FID',
          value: fidValue,
          rating: fidValue <= 100 ? 'good' : fidValue <= 300 ? 'needs-improvement' : 'poor',
          delta: fidValue,
          navigationType: performance.navigation.type.toString(),
          timestamp: Date.now(),
        })
      }
    })
    observer.observe({ type: 'first-input', buffered: true })
  } catch {}
}

function getTTFB(callback: MetricCallback) {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (nav) {
      const value = nav.responseStart
      callback({
        name: 'TTFB',
        value,
        rating: value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor',
        delta: value,
        navigationType: performance.navigation.type.toString(),
        timestamp: Date.now(),
      })
    }
  } catch {}
}

export function reportWebVitals(onMetric?: MetricCallback) {
  const handler: MetricCallback = (metric) => {
    if (onMetric) {
      onMetric(metric)
    }
    if (typeof console !== 'undefined') {
// [REMOVED] console.log(`[WebVitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`)
    }
  }

  if (typeof window === 'undefined') return

  observeLCP(handler)
  observeCLS(handler)
  observeFID(handler)
  getTTFB(handler)
}

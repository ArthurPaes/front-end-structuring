/**
 * @file Web Vitals reporter — measures Core Web Vitals and sends them
 * to the analytics adapter.
 *
 * USAGE: Call `reportWebVitals()` once in main.tsx.
 *
 * @see https://web.dev/vitals/
 */

import { trackEvent } from './analytics';

export async function reportWebVitals(): Promise<void> {
  // Dynamic import so the library is only loaded when needed
  // web-vitals v4+: FID removed, replaced with INP (Interaction to Next Paint)
  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals');

  const sendMetric = (metric: { name: string; value: number; id: string }) => {
    trackEvent({
      name: 'web-vital',
      properties: {
        metric: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        id: metric.id,
      },
    });
  };

  onCLS(sendMetric);
  onINP(sendMetric);
  onLCP(sendMetric);
  onFCP(sendMetric);
  onTTFB(sendMetric);
}

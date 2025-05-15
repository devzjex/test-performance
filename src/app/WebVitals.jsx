'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'LCP': // Largest Contentful Paint
        console.log('LCP:', metric.value);
        break;
      case 'FCP': // First Contentful Paint
        console.log('FCP:', metric.value);
        break;
      case 'CLS': // Cumulative Layout Shift
        console.log('CLS:', metric.value);
        break;
      case 'TTFB': // Time to First Byte
        console.log('TTFB:', metric.value);
        break;
      default:
        console.log(metric.name, metric.value);
    }
  });

  useEffect(() => {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script, index) => {
      console.log(`Script ${index + 1}:`, {
        src: script.src || '',
        async: script.async,
        defer: script.defer,
      });
    });
    const links = document.querySelectorAll('link');
    links.forEach((link, index) => {
      console.log(`Link ${index + 1}:`, {
        href: link.href,
        rel: link.rel,
      });
    });
  }, []);

  return null;
}

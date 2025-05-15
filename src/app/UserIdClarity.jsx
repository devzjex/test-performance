'use client';

import React, { useEffect, useState } from 'react';

export default function UserIdClarity() {
  const [isStaging, setIsStaging] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'staging.letsmetrix.com' &&
      window.location.host === '63.250.52.81:7009'
    ) {
      setIsStaging(true);
    }
  }, []);

  useEffect(() => {
    const paramValue = window.localStorage.getItem('current-un-Key');
    if (paramValue && paramValue.length > 0) {
      const clarityInterval = setInterval(() => {
        if (typeof window.clarity === 'function') {
          window.clarity('set', 'userId', paramValue.toString());
          clearInterval(clarityInterval);
        }
      }, 100);
      return () => clearInterval(clarityInterval);
    }
  }, []);

  return <>{isStaging && <meta name="robots" content="noindex, nofollow" />}</>;
}

'use client';

import React from 'react';
import LayoutDetailApp from '../../../_components/detail-app-not-logged/LayoutDetailApp';
import ReviewApp from '../review/ReviewApp';

export default function ReviewNotLogged({ initialDataAppInfo, initialDataReviews }) {
  return (
    <LayoutDetailApp initialDataAppInfo={initialDataAppInfo}>
      <ReviewApp initialDataReviews={initialDataReviews} />
    </LayoutDetailApp>
  );
}

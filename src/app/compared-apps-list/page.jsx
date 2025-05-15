import LayoutMain from '@/layouts/main/LayoutMain';
import React from 'react';
import ComparedAppsList from './_components/ComparedAppsList';

export default function page() {
  return (
    <LayoutMain>
      <ComparedAppsList />
    </LayoutMain>
  );
}

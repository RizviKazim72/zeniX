'use client';

import { Suspense } from 'react';
import PageLoader from './PageLoader';

const PageLoaderFallback = () => {
  return null; // No loader shown during SSR
};

const PageLoaderWrapper = () => {
  return (
    <Suspense fallback={<PageLoaderFallback />}>
      <PageLoader />
    </Suspense>
  );
};

export default PageLoaderWrapper;

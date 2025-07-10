/**
 * Search Page Suspense Component to handle loading state
 */

'use client';

import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';

const SearchPageFallback = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500" />
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}



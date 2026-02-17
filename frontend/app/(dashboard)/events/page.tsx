'use client';
// core
import { Suspense } from 'react';
// components
import CardSkeleton from '@/app/(dashboard)/events/components/CardSkeleton';
import PageContent from '@/app/(dashboard)/events/components/PageContent';

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}

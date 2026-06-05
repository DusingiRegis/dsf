import { Suspense } from 'react';
import CarDetailClient from './CarDetailClient';

export default function CarDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CarDetailClient />
    </Suspense>
  );
}

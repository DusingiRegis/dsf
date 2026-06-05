import { Suspense } from 'react';
import CarsClient from './CarsClient';

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CarsClient />
    </Suspense>
  );
}

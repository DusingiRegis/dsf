import { Suspense } from 'react';
import PropertiesClient from './PropertiesClient';

export const revalidate = 60;

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PropertiesClient />
    </Suspense>
  );
}

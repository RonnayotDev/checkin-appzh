'use client';
import { Suspense } from 'react';
import HistoryContent from './HistoryContent';

export default function HistoryPage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <HistoryContent />
    </Suspense>
  );
}

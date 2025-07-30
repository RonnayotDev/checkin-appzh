'use client'
import { Suspense } from 'react';
import HistoryContent from './HistoryContent'; // หรือ '@/app/history/HistoryContent'

export default function HistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryContent />
    </Suspense>
  );
}

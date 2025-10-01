'use client';

import { useLoadingStore } from '@/stores/loadingStore';

export default function GlobalLoader() {
  const { isLoading, loadingMessage } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-3">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-700 font-medium">{loadingMessage}</span>
      </div>
    </div>
  );
}

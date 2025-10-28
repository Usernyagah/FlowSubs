"use client";

import { useEffect, useState } from 'react';
import { initializeFCL } from '@/lib/fcl-config';
import { config } from '@onflow/fcl';

export function FCLProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize FCL with proper error handling
        await initializeFCL();
        
        // Configure WebSocket connection
        config()
          .put('fcl.ws', 'wss://rest-testnet.onflow.org/ws')
          .put('fcl.ws.opts', {
            retry: 3,
            timeout: 10000,
          });

        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize FCL:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize FCL'));
      }
    };

    if (!isInitialized) {
      init();
    }

    // Cleanup function
    return () => {
      // Close WebSocket connections when component unmounts
      config().delete('fcl.ws');
    };
  }, [isInitialized]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <h2 className="font-bold">Connection Error</h2>
        <p>{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

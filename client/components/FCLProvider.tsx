"use client";

import { useEffect, useState, useRef } from 'react';
import { initializeFCL } from '@/lib/fcl-config';
import { config } from '@onflow/fcl';

// Track initialization state outside the component to prevent multiple initializations
let isFCLInitialized = false;

export function FCLProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(isFCLInitialized);
  const [error, setError] = useState<Error | null>(null);
  const initStarted = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initStarted.current || isFCLInitialized) return;
    initStarted.current = true;

    const init = async () => {
      try {
        if (!isFCLInitialized) {
          await initializeFCL();
          
          // Configure WebSocket connection
          config()
            .put('fcl.ws', 'wss://rest-testnet.onflow.org/ws')
            .put('fcl.ws.opts', {
              retry: 3,
              timeout: 10000,
            });

          isFCLInitialized = true;
          setIsInitialized(true);
        }
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

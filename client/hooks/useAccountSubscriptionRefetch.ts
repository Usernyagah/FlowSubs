import { useEffect } from "react";
import * as fcl from "@onflow/fcl";

/**
 * Triggers refetch whenever the given Flow account is updated on chain.
 * @param address Flow account address
 * @param refetch Function to call on update
 */
export function useAccountSubscriptionRefetch(
  address: string | null | undefined,
  refetch: () => void
) {
  useEffect(() => {
    if (!address) return;
    const unsubscribe = fcl.account(address).subscribe(() => {
      refetch();
    });
    return () => {
      unsubscribe();
    };
  }, [address, refetch]);
}

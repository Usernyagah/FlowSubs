// lib/wallet-validation.ts
// Utility functions for wallet address validation

/**
 * List of default/placeholder addresses that should be disallowed
 */
export const DEFAULT_ADDRESSES = [
  '0xYOUR_CONTRACT_ADDRESS',
  '0x0000000000000000',
  '0x1111111111111111',
  '0x2222222222222222',
  '0x3333333333333333',
  '0x4444444444444444',
  '0x5555555555555555',
  '0x6666666666666666',
  '0x7777777777777777',
  '0x8888888888888888',
  '0x9999999999999999',
  '0xaaaaaaaaaaaaaaaa',
  '0xbbbbbbbbbbbbbbbb',
  '0xcccccccccccccccc',
  '0xdddddddddddddddd',
  '0xeeeeeeeeeeeeeeee',
  '0xffffffffffffffff',
  '0x1234567890abcdef',
  '0xfedcba0987654321',
  '0x9876543210fedcba',
  '0xabcdef1234567890',
  '0x0123456789abcdef',
  '0xdeadbeefdeadbeef',
  '0xcafebabe12345678',
  '0x0000000000000001',
  '0x0000000000000002',
  '0x0000000000000003',
  '0x0000000000000004',
  '0x0000000000000005',
  '0x0000000000000006',
  '0x0000000000000007',
  '0x0000000000000008',
  '0x0000000000000009',
  '0x000000000000000a',
  '0x000000000000000b',
  '0x000000000000000c',
  '0x000000000000000d',
  '0x000000000000000e',
  '0x000000000000000f',
];

/**
 * Validates if a Flow wallet address is valid and not a placeholder
 * @param address - The wallet address to validate
 * @returns true if the address is valid, false otherwise
 */
export function validateWalletAddress(address: string | null): boolean {
  if (!address) return false;
  
  // Check if address is a default/placeholder address
  if (DEFAULT_ADDRESSES.includes(address.toLowerCase())) {
    return false;
  }
  
  // Basic Flow address validation (starts with 0x and has proper length)
  if (!address.startsWith('0x') || address.length !== 18) {
    return false;
  }
  
  // Check if it's a valid hex string
  const hexPattern = /^0x[0-9a-fA-F]{16}$/;
  if (!hexPattern.test(address)) {
    return false;
  }
  
  return true;
}

/**
 * Gets a user-friendly error message for invalid addresses
 * @param address - The invalid address
 * @returns Error message string
 */
export function getAddressValidationError(address: string | null): string {
  if (!address) {
    return 'No wallet address provided';
  }
  
  if (DEFAULT_ADDRESSES.includes(address.toLowerCase())) {
    return 'This appears to be a placeholder or test address. Please connect with a real Flow wallet.';
  }
  
  if (!address.startsWith('0x')) {
    return 'Invalid address format. Flow addresses must start with 0x';
  }
  
  if (address.length !== 18) {
    return 'Invalid address length. Flow addresses must be 18 characters long';
  }
  
  const hexPattern = /^0x[0-9a-fA-F]{16}$/;
  if (!hexPattern.test(address)) {
    return 'Invalid address format. Address must contain only valid hexadecimal characters';
  }
  
  return 'Invalid wallet address';
}

/**
 * Checks if an address is a known test/placeholder address
 * @param address - The address to check
 * @returns true if it's a test address, false otherwise
 */
export function isTestAddress(address: string | null): boolean {
  if (!address) return false;
  return DEFAULT_ADDRESSES.includes(address.toLowerCase());
}

/**
 * Formats an address for display (truncates middle part)
 * @param address - The address to format
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Formatted address string
 */
export function formatAddress(
  address: string | null, 
  startChars: number = 6, 
  endChars: number = 4
): string {
  if (!address) return '';
  
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Gets the FlowScan URL for an address
 * @param address - The address to get FlowScan URL for
 * @param network - The network (default: 'testnet')
 * @returns FlowScan URL string
 */
export function getFlowScanUrl(address: string | null, network: string = 'testnet'): string {
  if (!address) return '';
  
  const baseUrl = network === 'mainnet' 
    ? 'https://flowscan.org' 
    : 'https://testnet.flowscan.org';
    
  return `${baseUrl}/account/${address}`;
}

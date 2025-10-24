// components/WalletInfo.tsx
// Component to display connected wallet information

'use client';

import { useFlowWallet } from '@/hooks/useFlowWallet';
import { validateWalletAddress, getFlowScanUrl } from '@/lib/wallet-validation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  CheckCircle, 
  ExternalLink,
  Copy,
  Loader2
} from 'lucide-react';
import { useState } from 'react';

export default function WalletInfo() {
  const { user, connected, walletType, disconnect, disconnecting } = useFlowWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (user?.addr) {
      await navigator.clipboard.writeText(user.addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!connected || !user?.addr || !validateWalletAddress(user.addr)) {
    return null;
  }

  const getWalletIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case 'blocto':
        return '🔵';
      case 'flow port':
        return '⚡';
      case 'dapper':
        return '🎮';
      case 'lilico':
        return '🌸';
      default:
        return '🔗';
    }
  };

  const getWalletColor = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case 'blocto':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'flow port':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'dapper':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'lilico':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          Wallet Connected
        </CardTitle>
        <CardDescription className="text-green-600">
          Your Flow wallet is connected and ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Type */}
        {walletType && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{getWalletIcon(walletType)}</span>
            <Badge className={getWalletColor(walletType)}>
              {walletType}
            </Badge>
          </div>
        )}

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-green-800">Wallet Address</label>
          <div className="flex items-center gap-2 p-3 bg-white border border-green-200 rounded-lg">
            <code className="flex-1 text-sm font-mono text-gray-700 break-all">
              {user.addr}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="shrink-0"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
            disabled={disconnecting}
            className="flex-1"
          >
            {disconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              'Disconnect'
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getFlowScanUrl(user.addr), '_blank')}
            className="shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Wallet Features */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center p-2 bg-white border border-green-200 rounded text-xs">
            <div className="font-medium text-green-800">Secure</div>
            <div className="text-green-600">Private keys safe</div>
          </div>
          <div className="text-center p-2 bg-white border border-green-200 rounded text-xs">
            <div className="font-medium text-green-800">Fast</div>
            <div className="text-green-600">Instant transactions</div>
          </div>
          <div className="text-center p-2 bg-white border border-green-200 rounded text-xs">
            <div className="font-medium text-green-800">Low Cost</div>
            <div className="text-green-600">Minimal fees</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

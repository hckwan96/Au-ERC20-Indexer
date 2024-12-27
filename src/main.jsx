import React from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider, http } from 'wagmi';
import { mainnet, sepolia, arbitrum, bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: 'ERC20 Token Indexer',
  projectId: import.meta.env.VITE_WALLETCONNECT_KEY,
  // chains: [mainnet, sepolia, arbitrum, bsc],
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    // [arbitrum.id]: http(),
    // [bsc.id]: http(),
  },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
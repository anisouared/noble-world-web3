'use client'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    hardhat,
    sepolia,
    holesky
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
    appName: 'Noble World dApp',
    projectId: 'e5e2bfb17a861ca795bfc645c862fbee',
    chains: [sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

  const queryClient = new QueryClient();

const CustomRainbowKitProvider = ({ children } : Readonly<{
    children: React.ReactNode;
  }> ) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        { children }
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default CustomRainbowKitProvider
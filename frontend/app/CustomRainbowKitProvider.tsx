"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { hardhat, sepolia, holesky } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http } from "wagmi";
import { wagmiConfig } from "@/wagmiConfig";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, rabbyWallet, coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";

const config = getDefaultConfig({
  appName: "Noble World dApp",
  projectId: "e5e2bfb17a861ca795bfc645c862fbee",
  chains: [hardhat, sepolia, holesky],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http("https://sepolia.infura.io/v3/be2a060702b04189bd889de51ec14216"),
    [holesky.id]: http("https://eth-holesky.g.alchemy.com/v2/zctdXCCxHeRKgJJAHHpB8Poap5Fd3gX5"),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const CustomRainbowKitProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default CustomRainbowKitProvider;

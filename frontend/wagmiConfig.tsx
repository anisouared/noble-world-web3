import { http, createConfig } from "@wagmi/core";
import { hardhat, holesky, sepolia } from "@wagmi/core/chains";
import { injected } from "wagmi/connectors";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, rabbyWallet, coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rabbyWallet, coinbaseWallet],
    },
  ],
  {
    appName: "Noble World dApp",
    projectId: "e5e2bfb17a861ca795bfc645c862fbee",
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [hardhat, sepolia, holesky],
  ssr: true,
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http("https://sepolia.infura.io/v3/be2a060702b04189bd889de51ec14216"),
    [holesky.id]: http("https://eth-holesky.g.alchemy.com/v2/zctdXCCxHeRKgJJAHHpB8Poap5Fd3gX5"),
  },
});

import { http, createConfig } from "@wagmi/core";
import { hardhat, sepolia, holesky } from "@wagmi/core/chains";

export const configWagmi = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http("https://sepolia.infura.io/v3/be2a060702b04189bd889de51ec14216"),
    [holesky.id]: http(),
  },
});

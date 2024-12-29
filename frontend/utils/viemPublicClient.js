import { createPublicClient, http, fallback } from "viem";
import { hardhat, holesky, sepolia } from "viem/chains";

export const viemPublicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

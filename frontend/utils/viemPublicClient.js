import { createPublicClient, http, fallback } from "viem";
import { hardhat, holesky, sepolia } from "viem/chains";

export const viemPublicClient = createPublicClient({
  chain: holesky,
  transport: http("https://eth-holesky.g.alchemy.com/v2/zctdXCCxHeRKgJJAHHpB8Poap5Fd3gX5"),
});

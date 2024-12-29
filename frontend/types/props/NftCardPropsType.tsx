import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { NftCardType } from "../NftCardType";
import { ReadContractErrorType } from "viem";

export type NftCardPropsType = {
  nft: NftCardType;
  refetchNFTCollection: () => Promise<void>;
};

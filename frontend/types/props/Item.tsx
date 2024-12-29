import { SaleStatusEnum } from "@/enums/SaleStatusEnum";
import { Address } from "viem";

export type Item = {
  itemId: bigint | undefined;
  nftCollection: Address | undefined;
  tokenId: bigint | undefined;
  priceInWei: bigint | undefined;
  seller: Address | undefined;
  buyer: Address | undefined;
  status: SaleStatusEnum | undefined;
  timestamp: bigint | undefined;
  sellerRequestsCancellation: boolean | undefined;
  buyerRequestsCancellation: boolean | undefined;

  tokenUri: string | undefined;
  category: string | undefined;
  brand: string | undefined;
  productTitle: string | undefined;
  productDescription: string | undefined;
  serialNumber: string | undefined;
  imagePath: string | undefined;
};

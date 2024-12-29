import { Address } from "abitype";

export type NftCardType = {
  id: number | undefined;
  serialNumber: string | undefined;
  brand: string | undefined;
  nftCollection: Address;
  tokenId: number;
  productTitle: string | undefined;
  productDescription: string | undefined;
  imagePath: string | undefined;
  category: string | undefined;
};

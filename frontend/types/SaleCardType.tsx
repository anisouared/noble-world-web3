import { SaleStatusEnum } from "@/enums/SaleStatusEnum";

export type SaleCardType = {
  id: number;
  serialNumber: string;
  brand: string;
  nftCollection: string;
  tokenId: number;
  SaleDate: Date;
  productTitle: string;
  productDescription: string;
  productPriceInWei: number;
  imagePath: string;
  category: string;
  seller: string;
  buyer: string | undefined;
  status: SaleStatusEnum;
};

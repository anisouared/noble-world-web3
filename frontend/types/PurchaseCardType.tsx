import { SaleStatusEnum } from "@/enums/SaleStatusEnum";

export type PurchaseCardType = {
  id: number;
  serialNumber: string;
  brand: string;
  nftCollection: string;
  tokenId: number;
  purchaseDate: Date;
  productTitle: string;
  productDescription: string;
  productPriceInWei: number;
  imagePath: string;
  category: string;
  seller: string;
  buyer: string;
  status: SaleStatusEnum;
};

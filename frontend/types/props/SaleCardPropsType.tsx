import { SaleCardType } from "../SaleCardType";
import { Item } from "./Item";

export type SaleCardPropsType = {
  productSold: Item;
  refetchSales: () => Promise<void>;
};

import { GalleryCardType } from "../GalleryCardType";
import { Item } from "./Item";

export type GalleryCardPropsType = {
  product: Item;
  refetchAllItemsForSale: () => Promise<void>;
};

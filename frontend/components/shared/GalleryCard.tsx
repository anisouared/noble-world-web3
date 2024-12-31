import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GalleryCardPropsType } from "@/types/props/GalleryCardPropsType";
import { wagmiConfig } from "@/wagmiConfig";
import NWMainContract from "@/constants/contractsData/NWMain-address.json";
import NWMainData from "@/constants/contractsData/NWMain.json";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { Address } from "viem";
import ItemPurchasing from "./ItemPurchasing";
import NWLoader from "./NWLoader";

const GalleryCard = (props: GalleryCardPropsType) => {
  const { product, refetchAllItemsForSale } = props;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [itemIsPurchased, setItemIsPurchased] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const buyItem = async () => {
    console.log(`start buying itemId ${product.itemId} and tokenId ${product.tokenId}`);

    const responseBuyItem = await writeContract(wagmiConfig, {
      address: NWMainContract.address as Address,
      abi: NWMainData.abi,
      functionName: "buyItem",
      args: [product.itemId],
      value: product.priceInWei,
    });

    console.log("responseBuyItem : " + responseBuyItem);

    const buyItemTransactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: responseBuyItem,
      //confirmations: 5,
    });

    return buyItemTransactionReceipt;
  };

  const handleBuyClick = async () => {
    try {
      console.log("buyyyy");
      setLoading(true);

      const buyItemTransactionReceipt = await buyItem();

      if (buyItemTransactionReceipt) {
        console.log("buyItemTransactionReceipt : " + buyItemTransactionReceipt);

        await refetchAllItemsForSale();
        setLoading(false);
        setItemIsPurchased(true);
      }
    } catch (error) {
      console.error("Error when buying the item", error);
      setLoading(false);
    }
  };

  // const handleOnCloseDialog = async (open: boolean) => {
  //   setOpenDialog(open);
  // };

  //console.log("productttt : " + product);
  return (
    <Dialog //open={openDialog} onOpenChange={handleOnCloseDialog}
    >
      <DialogTrigger asChild>
        <Card className="hover:shadow-[0_1px_10px_rgba(0,0,0,0.7)] transition-shadow w-full sm:w-auto overflow-hidden mb-2">
          <CardHeader className="p-4 pb-3 ">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
              <img src={product.imagePath} alt={product.productTitle} className="object-cover h-78 w-96" />
            </div>

            <Badge
              variant="secondary"
              className="bg-purple-200 hover:bg-purple-200 text-xs flex justify-center items-center"
            >
              {product.category}
            </Badge>

            <div className="flex justify-between items-center">
              <CardTitle
                className="truncate inline-block max-w-[220px] overflow-hidden whitespace-nowrap text-ellipsis pb-1"
                title={product.productTitle}
              >
                {product.productTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">Item Id : #{product.itemId?.toString()}</CardDescription>
            <CardDescription className="text-xs mt-1">Brand : {product.brand}</CardDescription>
            <CardDescription className="text-xs mt-1">Serial : {product.serialNumber}</CardDescription>
          </CardHeader>
          <div className="border-t border-gray-300 pb-2"></div>
          <CardContent className="p-4 pt-0 pb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-bold">Price (Wei)</span>
              <span className="font-semibold">{product.priceInWei?.toString()}</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-6 flex flex-col md:max-w-[800px] focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{product.productTitle}</DialogTitle>
          <DialogDescription className="pr-3 pl-3 text-center">{product.productDescription}</DialogDescription>
        </DialogHeader>
        {itemIsPurchased || loading ? (
          loading ? (
            <NWLoader />
          ) : (
            <ItemPurchasing itemId={product.itemId} tokenId={product.tokenId} />
          )
        ) : (
          <div id="contentDialog" className="flex flex-col md:flex-row mt-3">
            <div className="w-full md:w-2/5 p-1">
              <div className="flex justify-center rounded-lg md:aspect-square relative overflow-hidden mb-1">
                <img src={product.imagePath} alt={product.productTitle} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="w-full md:w-3/5 pt-1 bg-white rounded-lg md:pl-4">
              <Badge
                variant="secondary"
                className="bg-purple-200 hover:bg-purple-200 text-lg flex justify-center items-center mb-4"
              >
                {product.category}
              </Badge>
              <dl className="text-gray-900 pb-1">
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 font-medium pr-6">Serial number</dt>
                  <dd className="text-md font-semibold">{product.serialNumber}</dd>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 font-medium pr-6">Brand</dt>
                  <dd className="text-md font-semibold truncate">{product.brand}</dd>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                  <dd className="text-md font-semibold truncate">{product.nftCollection}</dd>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                  <dd className="text-md font-semibold">#{product.tokenId?.toString()}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500 font-medium pr-6">Price (Wei)</dt>
                  <dd className="text-md font-semibold">{product.priceInWei?.toString()}</dd>
                </div>
              </dl>
              <div className="grid gap-4 mt-10">
                <Button
                  onClick={handleBuyClick}
                  className="bg-blue-400 hover:bg-blue-500 mt-auto border-transparent focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent"
                >
                  BUY
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GalleryCard;

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaleCardPropsType } from "@/types/props/SaleCardPropsType";
import { SaleStatusEnum } from "@/enums/SaleStatusEnum";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/wagmiConfig";
import NWMainContract from "@/constants/contractsData/NWMain-address.json";
import NWMainData from "@/constants/contractsData/NWMain.json";
import { Address } from "abitype";
import ItemTransactionCompleted from "./ItemTransactionCompleted";
import ItemTransactionCancelled from "./ItemTransactionCancelled";
import NWLoader from "./NWLoader";

const SaleCard = (props: SaleCardPropsType) => {
  const { productSold, refetchSales } = props;
  const [loading, setLoading] = useState<Boolean>(false);

  const getStatusAndBackgroundColor = (status: SaleStatusEnum | undefined) => {
    switch (status) {
      case SaleStatusEnum.Escrowed:
        return ["Escrowed", "bg-blue-400"];
      case SaleStatusEnum.Purchasing:
        return ["Purchasing", "bg-green-300"];
      case SaleStatusEnum.Purchased:
        return ["Purchased", "bg-green-400"];
      case SaleStatusEnum.Cancellation:
        return ["Canceled", "bg-red-500"];
      case SaleStatusEnum.SaleTimeout:
        return ["SaleTimeout", "bg-red-500"];
      default:
        return ["", "bg-gray-400"];
    }
  };

  const cancelSale = async () => {
    console.log(`start cancel sale ${productSold.itemId} of tokenId ${productSold.tokenId} in Sales page`);

    const responseCancelSale = await writeContract(wagmiConfig, {
      address: NWMainContract.address as Address,
      abi: NWMainData.abi,
      functionName: "cancelSale",
      args: [productSold.itemId],
    });

    console.log("responseCancelSale in Sales page : " + responseCancelSale);

    const cancelSaleTransactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: responseCancelSale,
      //confirmations: 5,
    });

    return cancelSaleTransactionReceipt;
  };

  const handleCancelSaleClick = async () => {
    try {
      console.log("handle cancel sel in Sales page");
      setLoading(true);

      const cancelSaleReceipt = await cancelSale();

      if (cancelSaleReceipt) {
        console.log("cancelSaleReceipt in Sales Page DONE");
        setLoading(false);
        await refetchSales();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error while canceling the sale from Sales page.");
    }
  };

  return (
    <Card
      key={productSold.itemId}
      className="hover:shadow-xl transition-shadow w-full bg-stone-100 overflow-hidden mb-2"
    >
      <div
        id="card-title"
        className={`top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t ${
          getStatusAndBackgroundColor(productSold?.status)[1]
        } shadow-[0_1px_10px_rgba(0,0,0,0.7)]`}
      >
        #{productSold.itemId?.toString()} - {getStatusAndBackgroundColor(productSold?.status)[0]}{" "}
        {productSold.status != SaleStatusEnum.Cancellation &&
        (productSold.buyerRequestsCancellation || productSold.sellerRequestsCancellation)
          ? "(CANCELLATION REQUESTED)"
          : ""}
      </div>

      <CardContent className="p-4 pb-3 flex justify-between items-stretch ">
        <div className="relative aspect-square rounded-lg overflow-hidden flex-grow max-w-[300px] max-h-[330px]">
          <img
            src={productSold.imagePath}
            alt={productSold.productTitle}
            className="object-cover h-full w-full p-1 rounded-xl "
          />
        </div>
        {loading ? (
          <div className="flex flex-col justify-between w-full h-full md:w-2/3 flex-grow mt-8">
            <NWLoader />
          </div>
        ) : (
          <div className="flex flex-col justify-between pb-1 pr-5 pl-4 w-full md:w-2/3 flex-grow ">
            <div className="w-full">
              <h2 className="text-lg font-semibold text-center truncate" title={productSold.productTitle}>
                {productSold.productTitle}
              </h2>
              <h3
                className="text-sm pt-2 text-gray-600 font-semibold text-center truncate"
                title={productSold.productDescription}
              >
                {productSold.productDescription}
              </h3>
            </div>
            <div className="w-full pt-1 pb-1 p-3 bg-white rounded-lg shadow-md mt-3 shadow-[0_0_4px_rgba(0,0,0,0.7)]">
              <dl className="text-gray-900">
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 text-sm font-medium pr-6 truncate">Price (Wei)</dt>
                  <dd className="text-md font-semibold truncate">{productSold.priceInWei}</dd>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 text-sm font-medium pr-6">Collection</dt>
                  <dd className="text-md font-semibold truncate">{productSold.nftCollection}</dd>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 text-sm font-medium pr-6">Token Id</dt>
                  <dd className="text-md font-semibold">#{productSold.tokenId}</dd>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <dt className="text-gray-500 text-sm font-medium pr-6 truncate">Sale creation</dt>
                  <dd className="text-md font-semibold">{productSold.timestamp}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500 text-sm font-medium pr-6">Buyer</dt>
                  <dd className="text-md font-semibold truncate">{productSold.buyer ?? "NONE"}</dd>
                </div>
              </dl>
            </div>
            {productSold.status == SaleStatusEnum.Purchased ||
            productSold.status == SaleStatusEnum.Cancellation ||
            productSold.sellerRequestsCancellation ? (
              productSold.status == SaleStatusEnum.Purchased ? (
                <ItemTransactionCompleted />
              ) : (
                <ItemTransactionCancelled />
              )
            ) : (
              <div className="flex flex-col justify-between w-full h-full mt-3">
                <Button
                  className="bg-red-400 hover:bg-red-500 mt-auto border-transparent"
                  //disabled={!!isSaleValidatedOrCanceled}
                  onClick={handleCancelSaleClick}
                >
                  CANCEL SALE
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SaleCard;

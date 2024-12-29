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

const SaleCard = (props: SaleCardPropsType) => {
  const { productSold } = props;
  const [isSaleValidatedOrCanceled, setIsSaleValidatedOrCanceled] = useState<Boolean>(false);

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

      const cancelSaleReceipt = await cancelSale();

      if (cancelSaleReceipt) {
        console.log("cancelSaleReceipt in Sales Page DONE");
        setIsSaleValidatedOrCanceled(true);
      }
    } catch (error) {
      console.error("Error while canceling the sale from Sales page.");
    }
  };

  useEffect(() => {
    if (
      productSold.status == SaleStatusEnum.Cancellation ||
      productSold.status == SaleStatusEnum.SaleTimeout ||
      productSold.status == SaleStatusEnum.Purchased ||
      productSold.sellerRequestsCancellation
    ) {
      setIsSaleValidatedOrCanceled(true);
    }
  }, [productSold]);

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
        {getStatusAndBackgroundColor(productSold?.status)[0]}
      </div>

      <CardContent className="flex flex-grow p-1 pl-3">
        <div className="p-2 pb-6 pt-6 w-1/3 hidden md:block">
          <img
            src={productSold.imagePath}
            alt={productSold.productTitle}
            className="mt-1 w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="flex flex-col justify-between pt-1 pb-5 pr-5 pl-4 w-full md:w-2/3">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-center">{productSold.productTitle}</h2>
            <h3 className="text-gray-600 font-semibold text-center">{productSold.productDescription}</h3>
          </div>
          <div className="w-full pt-1 pb-1 p-3 bg-white rounded-lg shadow-md mb-3 mt-3 shadow-[0_0_4px_rgba(0,0,0,0.7)]">
            <dl className="text-gray-900">
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Price (Wei)</dt>
                <dd className="text-md font-semibold">{productSold.priceInWei}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                <dd className="text-md font-semibold truncate">{productSold.nftCollection}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                <dd className="text-md font-semibold">#{productSold.tokenId}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Sale creation</dt>
                <dd className="text-md font-semibold">{productSold.timestamp}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-gray-500 font-medium pr-6">Buyer</dt>
                <dd className="text-md font-semibold">{productSold.buyer ?? "NONE"}</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col justify-between w-full h-full ">
            <Button
              className="bg-red-400 hover:bg-red-500 mt-auto border-transparent"
              disabled={!!isSaleValidatedOrCanceled}
              onClick={handleCancelSaleClick}
            >
              CANCEL SALE
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaleStatusEnum } from "@/enums/SaleStatusEnum";
import { PurchaseCardPropsType } from "@/types/props/PurchaseCardPropsType";
import { breadcrumbItem } from "@nextui-org/theme";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/wagmiConfig";
import NWMainContract from "@/constants/contractsData/NWMain-address.json";
import NWMainData from "@/constants/contractsData/NWMain.json";
import { Address } from "abitype";

const PurchaseCard = (props: PurchaseCardPropsType) => {
  const { productPurchased } = props;
  const [isSaleValidatedOrCanceled, setIsSaleValidatedOrCanceled] = useState<Boolean>(false);

  const getStatusAndBackgroundColor = (status: SaleStatusEnum | undefined) => {
    switch (status) {
      case SaleStatusEnum.Escrowed:
        return ["Escrowed", "bg-orange-500"];
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

  const validateItem = async () => {
    console.log(`start validating itemId ${productPurchased.itemId} of tokenId ${productPurchased.tokenId}`);

    const responseValidateItem = await writeContract(wagmiConfig, {
      address: NWMainContract.address as Address,
      abi: NWMainData.abi,
      functionName: "validateItem",
      args: [productPurchased.itemId],
    });

    console.log("responseValidateItem : " + responseValidateItem);

    const validateItemTransactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: responseValidateItem,
      //confirmations: 5,
    });

    return validateItemTransactionReceipt;
  };

  const handleValidateItemClick = async () => {
    try {
      console.log("handle validationnnn");

      const validationItemReceipt = await validateItem();

      if (validationItemReceipt) {
        console.log("validateItemTransactionReceipt DONE");
        setIsSaleValidatedOrCanceled(true);
      }
    } catch (error) {
      console.error("Error while validating the sale by the buyer.");
    }
  };

  const cancelSale = async () => {
    console.log(
      `start cancel sale ${productPurchased.itemId} of tokenId ${productPurchased.tokenId} in Purchases page`
    );

    const responseCancelSale = await writeContract(wagmiConfig, {
      address: NWMainContract.address as Address,
      abi: NWMainData.abi,
      functionName: "cancelSale",
      args: [productPurchased.itemId],
    });

    console.log("responseCancelSale in Purchases page : " + responseCancelSale);

    const cancelSaleTransactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: responseCancelSale,
      //confirmations: 5,
    });

    return cancelSaleTransactionReceipt;
  };

  const handleCancelSaleClick = async () => {
    try {
      console.log("handle validationnnn from Purchase page");

      const cancelSaleReceipt = await cancelSale();

      if (cancelSaleReceipt) {
        console.log("cancelSaleReceipt in Purchase Page DONE");
        setIsSaleValidatedOrCanceled(true);
      }
    } catch (error) {
      console.error("Error while canceling the sale from Purchases page.");
    }
  };

  // useEffect(() => {
  //   if (
  //     productPurchased.status == SaleStatusEnum.Cancellation ||
  //     productPurchased.status == SaleStatusEnum.SaleTimeout ||
  //     productPurchased.status == SaleStatusEnum.Purchased ||
  //     productPurchased.buyerRequestsCancellation
  //   ) {
  //     setIsSaleValidatedOrCanceled(true);
  //   }
  // }, [productPurchased]);

  return (
    <Card
      key={productPurchased.itemId}
      className="hover:shadow-xl transition-shadow w-full bg-purple-100 overflow-hidden mb-2"
    >
      <div
        className={`top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t ${
          getStatusAndBackgroundColor(productPurchased?.status)[1]
        } shadow-[0_1px_10px_rgba(0,0,0,0.7)]`}
      >
        #{productPurchased.itemId?.toString()} - {getStatusAndBackgroundColor(productPurchased?.status)[0]}
      </div>

      <CardContent className="p-4 pb-3 flex justify-between items-stretch">
        <div className="relative aspect-square rounded-lg overflow-hidden flex-grow">
          <img
            src={productPurchased.imagePath}
            alt={productPurchased.productTitle}
            className="object-cover h-full w-full p-1 rounded-xl"
          />
        </div>

        <div className="flex flex-col justify-between pt-1 pb-1 pr-5 pl-4 w-full md:w-2/3 flex-grow">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-center ">{productPurchased.productTitle}</h2>
            <h3 className="text-gray-600 font-semibold text-center">{productPurchased.productDescription}</h3>
          </div>
          <div className="w-full pt-1 pb-1 p-3 bg-white rounded-lg shadow-md mb-3 mt-3 shadow-[0_0_4px_rgba(0,0,0,0.7)]">
            <dl className="text-gray-900">
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6 truncate">Price (Wei)</dt>
                <dd className="text-md font-semibold truncate truncate">{productPurchased.priceInWei}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                <dd className="text-md font-semibold truncate">{productPurchased.nftCollection}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                <dd className="text-md font-semibold truncate">#{productPurchased.tokenId}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6 truncate">Purchase date</dt>
                <dd className="text-md font-semibold truncate">{productPurchased.timestamp}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-gray-500 font-medium pr-6">Seller</dt>
                <dd className="text-md font-semibold truncate">{productPurchased.seller}</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col justify-between w-full h-full mt-2">
            <Button
              className="bg-red-400 hover:bg-red-500 mt-auto mb-2 border-transparent"
              onClick={handleCancelSaleClick}
              //disabled={!!isSaleValidatedOrCanceled}
            >
              CANCEL SALE
            </Button>
            <Button
              className="bg-green-400 hover:bg-green-500 mt-auto border-transparent"
              onClick={handleValidateItemClick}
              //disabled={!!isSaleValidatedOrCanceled}
            >
              VALIDATE
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseCard;

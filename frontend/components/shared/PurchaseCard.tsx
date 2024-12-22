import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaleStatusEnum } from "@/enums/SaleStatusEnum";
import { PurchaseCardPropsType } from "@/types/props/PurchaseCardPropsType";

const PurchaseCard = (props: PurchaseCardPropsType) => {
  const { purchase } = props;

  return (
    <Card key={purchase.id} className="hover:shadow-xl transition-shadow w-full bg-purple-100 overflow-hidden mb-2">
      <div
        className={`top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t ${
          purchase.status === SaleStatusEnum.Escrowed ? "bg-orange-500" : "bg-red-500"
        } shadow-[0_1px_10px_rgba(0,0,0,0.7)]`}
      >
        {purchase.status === SaleStatusEnum.Escrowed ? "Escrowed" : "Canceled"}
      </div>

      <CardContent className="flex flex-grow p-1 pl-3">
        <div className="p-2 pb-6 pt-6 w-1/3">
          <img
            src={purchase.imagePath}
            alt={purchase.productTitle}
            className="mt-1 w-full h-full object-cover rounded-2xl"
          />{" "}
        </div>

        <div className="flex flex-col justify-between pt-1 pb-5 pr-5 pl-4 w-2/3">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-center">{purchase.productTitle}</h2>
            <h3 className="text-gray-600 font-semibold text-center">{purchase.productDescription}</h3>
          </div>
          <div className="w-full pt-1 pb-1 p-3 bg-white rounded-lg shadow-md mb-3 mt-3 shadow-[0_0_4px_rgba(0,0,0,0.7)]">
            <dl className="text-gray-900">
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Price (Wei)</dt>
                <dd className="text-md font-semibold">{purchase.productPriceInWei}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                <dd className="text-md font-semibold truncate">{purchase.nftCollection}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                <dd className="text-md font-semibold">#{purchase.tokenId}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Purchase date</dt>
                <dd className="text-md font-semibold">{purchase.purchaseDate.toDateString()}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-gray-500 font-medium pr-6">Seller</dt>
                <dd className="text-md font-semibold truncate">{purchase.seller}</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col justify-between w-full h-full">
            <Button className="bg-red-400 hover:bg-red-500 mt-auto mb-2">CANCEL SALE</Button>
            <Button className="bg-green-400 hover:bg-green-500 mt-auto">VALIDATE</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseCard;

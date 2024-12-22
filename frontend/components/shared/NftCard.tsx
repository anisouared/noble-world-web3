import { NftCardPropsType } from "@/types/props/NftCardPropsType";
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NftCard = (props: NftCardPropsType) => {
  const { nft } = props;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          key={nft.id}
          className="hover:shadow-[0_1px_10px_rgba(0,0,0,0.7)] transition-shadow w-full sm:w-auto overflow-hidden mb-2 m-2"
        >
          <CardHeader className="p-4 pb-3 flex justify-between items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
              <img src={nft.imagePath} alt={nft.productTitle} className="object-cover w-full h-full" />
            </div>
            <CardTitle className="text-base">{nft.productTitle}</CardTitle>
          </CardHeader>
          <div className="border-t border-gray-300 pb-2"></div>
          <CardContent className="p-4 pt-0 pb-3">
            <CardDescription className="text-xs mt-1">Brand : {nft.brand}</CardDescription>
            <CardDescription className="text-xs mt-1">Serial : {nft.serialNumber}</CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-8 flex flex-col">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{nft.productTitle}</DialogTitle>
          <DialogDescription className="pr-3 pl-3 text-center">{nft.productDescription}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="pt-1 pb-1 p-3 bg-white rounded-lg">
            <dl className="text-gray-900">
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Serial number</dt>
                <dd className="text-md font-semibold">{nft.serialNumber}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Brand</dt>
                <dd className="text-md font-semibold truncate">{nft.brand}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                <dd className="text-md font-semibold truncate">{nft.nftCollection}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                <dd className="text-md font-semibold">#{nft.tokenId}</dd>
              </div>
            </dl>
          </div>
          <div className="grid gap-4 py-4">
            <Input
              type="number"
              step="0.01"
              pattern="^\d+([,]\d+)?$"
              placeholder="Prix en ether ..."
              className="pr-3 pl-3 text-center focus-visible:ring-transparent focus-visible:border-gray-400"
            />
            <Button type="submit" className="bg-green-400 hover:bg-green-500 mt-auto">
              SELL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NftCard;

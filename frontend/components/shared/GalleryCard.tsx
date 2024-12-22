import React from "react";
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

const GalleryCard = (props: galleryCardType) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="hover:shadow-[0_1px_10px_rgba(0,0,0,0.7)] transition-shadow w-full sm:w-auto overflow-hidden mb-2">
          <CardHeader className="p-4 pb-3">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
              <img src={props.imagePath} alt={props.title} className="object-cover w-full h-full" />
            </div>

            <Badge
              variant="secondary"
              className="bg-purple-200 hover:bg-purple-200 text-xs flex justify-center items-center"
            >
              {props.category}
            </Badge>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">{props.title}</CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">Brand : {props.brand}</CardDescription>
            <CardDescription className="text-xs mt-1">Serial : {props.serialNumber}</CardDescription>
          </CardHeader>
          <div className="border-t border-gray-300 pb-2"></div>
          <CardContent className="p-4 pt-0 pb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-bold">Price (Wei)</span>
              <span className="font-semibold">{props.priceInWei}</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-6 flex flex-col md:max-w-[800px]">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription className="pr-3 pl-3 text-center">{props.description}</DialogDescription>
        </DialogHeader>
        <div id="contentDialog" className="flex flex-col md:flex-row mt-3">
          <div className="w-full md:w-2/5 p-1">
            <div className="flex justify-center rounded-lg aspect-square relative overflow-hidden mb-1">
              <img src={props.imagePath} alt={props.title} className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="w-full md:w-3/5 pt-1 bg-white rounded-lg md:pl-4">
            <Badge
              variant="secondary"
              className="bg-purple-200 hover:bg-purple-200 text-lg flex justify-center items-center mb-4"
            >
              {props.category}
            </Badge>
            <dl className="text-gray-900 pb-1">
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Serial number</dt>
                <dd className="text-md font-semibold">{props.serialNumber}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Brand</dt>
                <dd className="text-md font-semibold truncate">{props.brand}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                <dd className="text-md font-semibold truncate">{props.nftCollection}</dd>
              </div>
              <div className="flex justify-between py-1 border-b">
                <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                <dd className="text-md font-semibold">#{props.tokenId}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-gray-500 font-medium pr-6">Price (Wei)</dt>
                <dd className="text-md font-semibold">{props.priceInWei}</dd>
              </div>
            </dl>
            <div className="grid gap-4 mt-10">
              <Button type="submit" className="bg-blue-400 hover:bg-blue-500 mt-auto">
                BUY
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryCard;

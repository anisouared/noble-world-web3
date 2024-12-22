"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Products = () => {
  const nfts = Array.from({ length: 1 }, (_, i) => ({
    id: i + 1,
    title: `NFT #${i + 1}`,
    description: "Digital collectible",
    price: `${(Math.random() * 2).toFixed(2)} ETH`,
    image: "/images/product1.png",
    category: ["Art", "Collectibles", "Gaming", "Music"][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.5 ? "Escrowed" : "Canceled",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(nfts.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return nfts.slice(startIndex, endIndex);
  };

  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Grille de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 place-items-center sm:place-items-start">
        {getCurrentPageItems().map((nft) => (
          <Card key={nft.id} className="hover:shadow-xl transition-shadow w-full">
            <div className="top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t bg-pink-500">
              Collection NFT 0x3337c58ed8e06197f3E8F7FD1fF425d66c8594f0
            </div>
            <div className="flex items-center justify-center">
              <Carousel
                //plugins={[plugin.current]}
                className="w-[1000px] p-6"
                // onMouseEnter={plugin.current.stop}
                // onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card
                            key={nft.id}
                            className="hover:shadow-[0_1px_10px_rgba(0,0,0,0.7)] transition-shadow w-full sm:w-auto overflow-hidden mb-2 m-2"
                          >
                            <CardHeader className="p-4 pb-3 flex justify-between items-center">
                              <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                <img src={nft.image} alt={nft.title} className="object-cover w-full h-full" />
                              </div>
                              <CardTitle className="text-base">{nft.title}</CardTitle>
                            </CardHeader>
                            <div className="border-t border-gray-300 pb-2"></div>
                            <CardContent className="p-4 pt-0 pb-3">
                              <CardDescription className="text-xs mt-1">Marque : CHANEL</CardDescription>
                              <CardDescription className="text-xs mt-1">Serial : HER-B35-2024-001</CardDescription>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="p-8 flex flex-col">
                          <DialogHeader className="flex justify-between items-center">
                            <DialogTitle>Sac en CUIR marron</DialogTitle>
                            <DialogDescription className="pr-3 pl-3 text-center">
                              Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus
                              risus.
                            </DialogDescription>
                          </DialogHeader>
                          <div>
                            <div className="pt-1 pb-1 p-3 bg-white rounded-lg">
                              <dl className="text-gray-900">
                                <div className="flex justify-between py-1 border-b">
                                  <dt className="text-gray-500 font-medium pr-6">Serial number</dt>
                                  <dd className="text-md font-semibold">AZE12543ZE</dd>
                                </div>
                                <div className="flex justify-between py-1 border-b">
                                  <dt className="text-gray-500 font-medium pr-6">Marque</dt>
                                  <dd className="text-md font-semibold truncate">CHANEL</dd>
                                </div>
                                <div className="flex justify-between py-1 border-b">
                                  <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                                  <dd className="text-md font-semibold truncate">
                                    0x3337c58ed8e06197f3E8F7FD1fF425d66c8594f0
                                  </dd>
                                </div>
                                <div className="flex justify-between py-1">
                                  <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                                  <dd className="text-md font-semibold">#5</dd>
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
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10">
                  <CarouselPrevious />
                </div>
                <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10">
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;

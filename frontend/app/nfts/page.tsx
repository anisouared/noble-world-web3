"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { NftCardType } from "@/types/NftCardType";
import NftCard from "@/components/shared/NftCard";

const Nfts = () => {
  const nfts: Array<NftCardType> = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    serialNumber: Math.floor(Math.random() * 6456345345).toString(),
    brand: ["GUCCI", "Chanel", "Louis Vuitton", "Hermès"][Math.floor(Math.random() * 4)],
    nftCollection: "0x3337c58ed8e06197f3E8F7FD1fF425d66c8594f0",
    tokenId: Math.floor(Math.random() * 50),
    productTitle: `Sac CHANEL Model ZP${i + 1}`,
    productDescription: "Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
    imagePath: "/images/product1.png",
    category: ["Art", "Collectibles", "Gaming", "Luxe"][Math.floor(Math.random() * 4)],
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(nfts.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return nfts.slice(startIndex, endIndex);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Grille de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 place-items-center sm:place-items-start">
        <Card className="hover:shadow-xl transition-shadow w-full">
          <div className="top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t bg-pink-500">
            Collection NFT 0x3337c58ed8e06197f3E8F7FD1fF425d66c8594f0
          </div>
          <div className="flex items-center justify-center">
            <Carousel className="w-[1000px] p-6">
              <CarouselContent>
                {getCurrentPageItems().map((nft) => (
                  <CarouselItem key={nft.id} className="md:basis-1/2 lg:basis-1/3">
                    <NftCard nft={nft} />
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
      </div>
    </div>
  );
};

export default Nfts;

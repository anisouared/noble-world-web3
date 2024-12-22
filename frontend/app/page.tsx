"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GalleryCard from "@/components/shared/GalleryCard";
import { GalleryCardType } from "@/types/GalleryCardType";

const Gallery = () => {
  const products: Array<GalleryCardType> = Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    title: `Sac CHANEL Model ZP${i + 1}`,
    description: "Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
    priceInWei: Math.floor(Math.random() * 1100000000000),
    imagePath: "/images/product1.png",
    category: ["Art", "Collectibles", "Gaming", "Luxe"][Math.floor(Math.random() * 4)],
    nftCollection: "0x3337c58ed8e06197f3E8F7FD1fF425d66c8594f0",
    tokenId: Math.floor(Math.random() * 50),
    brand: ["GUCCI", "Chanel", "Louis Vuitton", "Hermès"][Math.floor(Math.random() * 4)],
    serialNumber: Math.floor(Math.random() * 6456345345).toString(),
    seller: "0x50f30eC99cd8231FB5F3C6096087aa6F49906528",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Obtenir les NFTs pour la page actuelle
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  return (
    <>
      <div id="home" className="w-full bg-fuchsia-100 text-center shadow-xl">
        <div className="flex justify-center items-center p-6">
          <Card className="flex w-full max-w-6xl bg-transparent shadow-none border-none overflow-hidden">
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              <CardTitle className="text-8xl font-bold text-center font-dancing pb-8 relative text-gray-800 nw-title-shadow-purple">
                Noble World
              </CardTitle>

              <h2 className="mt-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center">
                Lorem ipsum dolor sit amet consectetur{" "}
              </h2>

              <p className="mt-8 text-gray-600 text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
            </div>
            <div className="flex-shrink-0 hidden lg:block">
              <img
                src="/images/home-nw-image.jpg"
                alt="Description de l'image"
                className="h-96 w-auto rounded-2xl object-cover z-10"
              />
            </div>
          </Card>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-8">
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-12 items-center justify-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Select>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="collectibles">Collectibles</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0 - 1 ETH</SelectItem>
                <SelectItem value="1-5">1 - 5 ETH</SelectItem>
                <SelectItem value="5-10">5 - 10 ETH</SelectItem>
                <SelectItem value="10+">10+ ETH</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Collections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-600 bg-purple-600 hover:bg-purple-700">Apply Filters</Button>
        </div>

        {/* Grille de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 place-items-center sm:place-items-start">
          {getCurrentPageItems().map((item) => (
            <GalleryCard product={item} key={item.id} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className="w-10 h-10"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Gallery;

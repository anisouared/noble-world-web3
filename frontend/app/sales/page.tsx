"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Sales = () => {
  const nfts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Sac CHANEL Model XdZ3`,
    description: `Sale ID : #${i + 1}`,
    price: `${(Math.random() * 2).toFixed(2)} ETH`,
    image: "/images/product1.png",
    category: ["Art", "Collectibles", "Gaming", "Music"][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.1 ? "Escrowed" : "Canceled",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(nfts.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return nfts.slice(startIndex, endIndex);
  };

  return (
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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 place-items-center sm:place-items-start">
        {getCurrentPageItems().map((nft) => (
          <Card key={nft.id} className="hover:shadow-xl transition-shadow w-full bg-stone-100 overflow-hidden mb-2">
            <div
              id="card-title"
              className={`top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t ${
                nft.status === "Escrowed" ? "bg-orange-500" : "bg-red-500"
              } shadow-[0_1px_10px_rgba(0,0,0,0.7)]`}
            >
              {nft.status === "Escrowed" ? "Escrowed" : "Canceled"}
            </div>

            <CardContent className="flex flex-grow p-1 pl-3">
              <div className="p-2 pb-6 pt-6 w-1/3">
                <img src={nft.image} alt={nft.title} className="mt-1 w-full h-full object-cover rounded-2xl" />
              </div>

              <div className="flex flex-col justify-between pt-1 pb-5 pr-5 pl-4 w-2/3 ">
                <div className="w-full">
                  <h2 className="text-lg font-semibold text-center">{nft.title}</h2>
                  <h3 className="text-gray-600 font-semibold text-center">{nft.description}</h3>
                </div>
                <div className="w-full pt-1 pb-1 p-3 bg-white rounded-lg shadow-md mb-3 mt-3 shadow-[0_0_4px_rgba(0,0,0,0.7)]">
                  <dl className="text-gray-900">
                    <div className="flex justify-between py-1 border-b">
                      <dt className="text-gray-500 font-medium pr-6">Prix</dt>
                      <dd className="text-md font-semibold">2 ETH</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <dt className="text-gray-500 font-medium pr-6">Collection</dt>
                      <dd className="text-md font-semibold truncate">0x3337c58ed8e06197f3E8F7FD1fF425d66c8594f0</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <dt className="text-gray-500 font-medium pr-6">Token Id</dt>
                      <dd className="text-md font-semibold">#5</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <dt className="text-gray-500 font-medium pr-6">Sale creation</dt>
                      <dd className="text-md font-semibold">12/12/2024</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-gray-500 font-medium pr-6">Buyer</dt>
                      <dd className="text-md font-semibold">NONE</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex flex-col justify-between w-full h-full ">
                  <Button className="bg-red-400 hover:bg-red-500 mt-auto">CANCEL SALE</Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
  );
};

export default Sales;

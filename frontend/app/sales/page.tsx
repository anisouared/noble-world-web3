"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaleCardType } from "@/types/SaleCardType";
import { SaleStatusEnum } from "@/enums/SaleStatusEnum";
import SaleCard from "@/components/shared/SaleCard";
import { getSupportedArchTriples } from "next/dist/build/swc";
import { useAccount } from "wagmi";
import { wagmiConfig } from "@/wagmiConfig";
import { readContract } from "@wagmi/core";
import NWMainContract from "@/constants/contractsData/NWMain-address.json";
import NWMainData from "@/constants/contractsData/NWMain.json";
import { Address } from "abitype";
import { Item } from "@/types/props/Item";
import { useQueries } from "@tanstack/react-query";
import NWERC721Data from "@/constants/contractsData/NWERC721.json";
import NWLoader from "@/components/shared/NWLoader";

const Sales = () => {
  const { address, isConnected } = useAccount();
  const [itemsForSale, setItemsForSale] = useState<Item[]>([]);

  // const sales: Array<SaleCardType> = Array.from({ length: 8 }, (_, i) => ({
  //   id: i + 1,
  //   serialNumber: Math.floor(Math.random() * 6456345345).toString(),
  //   brand: ["GUCCI", "Chanel", "Louis Vuitton", "Hermès"][Math.floor(Math.random() * 4)],
  //   nftCollection: "0x3337c58ed8e06197f3E8F7FD1fF425d66c8594f0",
  //   tokenId: Math.floor(Math.random() * 50),
  //   SaleDate: new Date(),
  //   productTitle: `Sac CHANEL Model ZP${i + 1}`,
  //   productDescription: "Urna et pharetra aliquam vestibulum morbi blandit cursus risus.",
  //   productPriceInWei: Math.floor(Math.random() * 1100000000000),
  //   imagePath: "/images/product1.png",
  //   category: ["Art", "Collectibles", "Gaming", "Luxe"][Math.floor(Math.random() * 4)],
  //   status: Math.random() > 0.1 ? SaleStatusEnum.Escrowed : SaleStatusEnum.SellerCancelled,
  //   seller: "0x50f30eC99cd8231FB5F3C6096087aa6F49906528",
  //   buyer: undefined,
  // }));

  const fetchTokenURIsResults = useQueries({
    queries: itemsForSale.map((item) => ({
      queryKey: [item.itemId?.toString(), item.tokenId?.toString()],
      queryFn: () => fetchTokenURIs(item),
      enabled: itemsForSale.length > 0,
      refetchOnWindowFocus: false,
    })),
  });

  const fetchTokenURIs = async (item: Item) => {
    try {
      console.log("IITem :" + item.tokenId);

      const tokenUri = await readContract(wagmiConfig, {
        address: item.nftCollection as Address,
        abi: NWERC721Data.abi,
        functionName: "tokenURI",
        args: [item.tokenId],
        account: address,
      });

      item.tokenUri = tokenUri as string;
      console.log("item.tokenUri : " + item.tokenUri);

      return item;
    } catch (error) {
      console.error("Error fetching token URI in purchases page: ", error);
    }
  };

  const itemsWithTokensJsonsResults = useQueries({
    queries: fetchTokenURIsResults.map((item) => ({
      queryKey: [item.data?.itemId?.toString()],
      queryFn: () => fetchTokensJson(item.data),
      enabled: fetchTokenURIsResults.every((item) => item.isSuccess),
      refetchOnWindowFocus: false,
    })),
  });

  const fetchTokensJson = async (item: Item) => {
    try {
      console.log(fetchTokenURIsResults);
      console.log("ppppppppp For Sale page !!!");
      console.log(item);

      const response = await fetch(item.tokenUri);
      const responseJson = await response.json();

      item.category = "Luxe";
      item.brand = "Big Brand";
      item.productTitle = responseJson.name;
      item.productDescription = responseJson.description;
      item.serialNumber = "serialNumber blabla";
      item.imagePath = responseJson.image;
      return item;
    } catch (error) {
      console.error("Error fetching token URI: ", error);
    } finally {
    }
  };

  const getSales = async () => {
    try {
      const itemsIdsForSaleResponse = await readContract(wagmiConfig, {
        address: NWMainContract.address as Address,
        abi: NWMainData.abi,
        functionName: "getItemsIdsForSale",
        args: [address],
        account: address,
      });

      if (itemsIdsForSaleResponse.length > 0) {
        console.log(itemsIdsForSaleResponse.length);
        console.table(itemsIdsForSaleResponse);

        const itemsForSaleResponse = await readContract(wagmiConfig, {
          address: NWMainContract.address as Address,
          abi: NWMainData.abi,
          functionName: "getItemsBatch",
          args: [itemsIdsForSaleResponse],
          account: address,
        });

        const itemsForSaleResponseTyped: {
          itemId: bigint;
          collection: Address;
          tokenId: bigint;
          priceInWei: bigint;
          seller: Address;
          buyer: Address;
          status: number;
          timestamp: bigint;
          sellerRequestsCancellation: boolean;
          buyerRequestsCancellation: boolean;
        }[] = JSON.parse(JSON.stringify(itemsForSaleResponse, (_, v) => (typeof v === "bigint" ? v.toString() : v)));

        const itemsForSaleResponseParsed: Item[] = itemsForSaleResponseTyped.map((item) => {
          return {
            itemId: item.itemId,
            nftCollection: item.collection,
            tokenId: item.tokenId,
            priceInWei: item.priceInWei,
            seller: item.seller,
            buyer: item.buyer,
            status: item.status,
            timestamp: item.timestamp,
            sellerRequestsCancellation: item.sellerRequestsCancellation,
            buyerRequestsCancellation: item.buyerRequestsCancellation,

            tokenUri: undefined,
            category: undefined,
            brand: undefined,
            productTitle: undefined,
            productDescription: undefined,
            serialNumber: undefined,
            imagePath: undefined,
          };
        });

        console.log("itemsForSaleResponseeeeeeXXXXXXX :" + itemsForSaleResponseParsed);
        setItemsForSale(itemsForSaleResponseParsed);
      }
    } catch (error) {
      console.error("Error while getting sales", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      getSales();
    }
  }, [isConnected]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(itemsWithTokensJsonsResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  if (
    !itemsWithTokensJsonsResults.every((item) => item.data) ||
    itemsWithTokensJsonsResults.some((item) => item.isLoading)
  ) {
    return <NWLoader />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 place-items-center sm:place-items-start">
        {itemsWithTokensJsonsResults.slice(startIndex, endIndex).map((item, index) => (
          <SaleCard key={index} productSold={item.data} />
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

"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { NftCardType } from "@/types/NftCardType";
import NftCard from "@/components/shared/NftCard";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import NWMainContract from "@/constants/contractsData/NWMain-address.json";
import NWMainData from "@/constants/contractsData/NWMain.json";
import NWERC721Data from "@/constants/contractsData/NWERC721.json";
import { Address, parseAbiItem } from "abitype";
import { useQuery } from "wagmi/query";
import { configWagmi } from "@/constants/configWagmi";
import { getChainId, readContract, watchContractEvent } from "@wagmi/core";
import { toast } from "@/hooks/use-toast";
import { viemPublicClient } from "@/utils/viemPublicClient";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import NWLoader from "@/components/shared/NWLoader";
import { arrayBuffer } from "stream/consumers";
import { wagmiConfig } from "@/wagmiConfig";
import { ethers } from "ethers";
import { hardhat, holesky, sepolia } from "viem/chains";

export type NFTData = {
  tokenId: number;
  brand: string | undefined;
  nftCollection: string;
  productName: string;
  serialNumber: string;
  description: string | undefined;
  imagePath: string;
};

const Nfts = () => {
  const NWMainContractAddress: Address = NWMainContract.address as `0x${string}`;

  const { address, isConnected } = useAccount();
  const [collectionAddress, setCollectionAddress] = useState<Address>("0x");
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const fetchTokensJson = async (tokenId: number) => {
    try {
      const tokenUri = await readContract(wagmiConfig, {
        address: `${collectionAddress}`,
        abi: NWERC721Data.abi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
        account: address,
      });
      console.log("tokenUriii : " + tokenUri);

      const response = await fetch(tokenUri as string);
      const responseJson = await response.json();

      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
      return { tokenId, responseJson };
    } catch (error) {
      console.error("Error fetching token URI: ", error);
    } finally {
    }
  };

  const tokenJsonsResults = useQueries({
    queries: tokenIds.map((tokenUri) => ({
      queryKey: [tokenUri],
      queryFn: () => fetchTokensJson(tokenUri),
      enabled: tokenIds.length > 0,
      refetchOnWindowFocus: false,
    })),
  });

  const getNFTsFromCollection = async () => {
    try {
      console.log("start getNFTsFromCollection");

      const collectionAddress = await readContract(wagmiConfig, {
        address: NWMainContractAddress,
        abi: NWMainData.abi,
        functionName: "getFactoryCollections",
        account: address,
      });

      console.log("collectionAddress : " + collectionAddress);
      setCollectionAddress(collectionAddress as Address);

      const mintedNftsLogs = await viemPublicClient.getLogs({
        address: collectionAddress as Address,
        event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"),
        fromBlock: BigInt(3043760),
        toBlock: "latest",
      });

      console.log("mintedNftsLogs  :" + mintedNftsLogs);

      const updatedNftsInfos = mintedNftsLogs
        .reduce((acc, current) => {
          if (!acc.has(current.args.tokenId) || acc.get(current.args.tokenId).blockNumber < current.blockNumber) {
            acc.set(current.args.tokenId, current);
          }
          return acc;
        }, new Map())
        .values()
        .toArray()
        .filter((item) => item.args.to == address);

      console.log("mintedNftsLogs" + mintedNftsLogs);
      console.log("updatedNftsInfos" + updatedNftsInfos);

      if (updatedNftsInfos.length > 0) {
        const tokenIdsLogs = updatedNftsInfos.map((log) => Number(log.args.tokenId));
        console.log("tokenIdsLogs : " + tokenIdsLogs);
        setTokenIds(tokenIdsLogs);
      }
    } catch (error) {
      toast({
        title: "Error fetching NFTs from collection",
        description: "Failed to get minted NFT of connected user from collection",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("isconnected :" + isConnected);
    if (isConnected) {
      getNFTsFromCollection();
    }
  }, [isConnected]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 place-items-center sm:place-items-start">
        <Card className="hover:shadow-xl transition-shadow w-full">
          <div className="top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t bg-pink-500">
            Collection NFT {collectionAddress[0] != "0" ? collectionAddress[0] : ""}
          </div>
          {tokenJsonsResults.some((r) => r.isLoading) || !tokenJsonsResults.some((r) => r.data) || !isConnected ? (
            !isConnected || tokenIds.length == 0 ? (
              <div className="flex flex-col items-center justify-center m-12 mt-8">
                <p className="text-xl font-semibold text-gray-700">You do not have any NFTs.</p>
                <p className="text-lg text-gray-500">Please log in or refresh the page.</p>
              </div>
            ) : (
              <NWLoader />
            )
          ) : (
            <div className="flex items-center justify-center">
              <Carousel className="w-full p-6">
                {tokenJsonsResults.every((item) => item.isSuccess) && (
                  <CarouselContent>
                    {tokenJsonsResults.map((nft) => (
                      <CarouselItem key={nft.data?.tokenId} className="md:basis-1/2 lg:basis-1/3">
                        {nft.data && (
                          <NftCard
                            nft={{
                              id: undefined,
                              category: nft.data.responseJson.productCategory,
                              tokenId: nft.data.tokenId,
                              brand: nft.data.responseJson.brand,
                              nftCollection: collectionAddress[0] as Address,
                              productTitle: nft.data.responseJson.productName,
                              serialNumber: nft.data.responseJson.serialNumber,
                              productDescription: nft.data.responseJson.productDescription,
                              imagePath: nft.data.responseJson.image,
                            }}
                            refetchNFTCollection={getNFTsFromCollection}
                          />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                )}
                <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10">
                  <CarouselPrevious className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200" />
                </div>
                <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10">
                  <CarouselNext className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200" />
                </div>
              </Carousel>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Nfts;
function timeout(arg0: number) {
  throw new Error("Function not implemented.");
}

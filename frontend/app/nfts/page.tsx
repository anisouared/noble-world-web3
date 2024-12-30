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
  const [nftsData, setNftsData] = useState<NFTData[]>();
  const [isNftsDataFetched, setIsNftsDataFetched] = useState(false);

  const nfts: Array<NftCardType> = [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(nfts.length / itemsPerPage);

  const getCurrentPageItems = (
    fetchTokenJsonsResults: UseQueryResult<
      | {
          tokenId: number;
          responseJson: any;
        }
      | undefined,
      Error
    >[]
  ) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return fetchTokenJsonsResults.slice(startIndex, endIndex);
  };

  const {
    data: getFactoryCollectionsData,
    error: getFactoryCollectionsError,
    isPending: getFactoryCollectionsPending,
    refetch: getFactoryCollectionsRefetch,
  } = useReadContract({
    address: NWMainContractAddress,
    abi: NWMainData.abi,
    functionName: "getFactoryCollections",
    account: address,
    query: {
      enabled: isConnected,
    },
  });

  const fetchTokenURIs = async (tokenId: number) => {
    try {
      // const tokenUri = await viemPublicClient.readContract({
      //   address: `${collectionAddress}`,
      //   abi: NWERC721Data.abi,
      //   functionName: "tokenURI",
      //   args: [BigInt(tokenId)],
      //   account: address,
      // });
      const tokenUri = await readContract(wagmiConfig, {
        address: `${collectionAddress}`,
        abi: NWERC721Data.abi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
        account: address,
      });
      //console.log("aaaaaaaaaaaaaaaaa");

      return { tokenId, tokenUri };
    } catch (error) {
      console.error("Error fetching token URI: ", error);
    } finally {
    }
  };

  const fetchTokensJson = async (tokenId: number, tokenUri: string) => {
    try {
      const response = await fetch(tokenUri);
      const responseJson = await response.json();
      //console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
      return { tokenId, responseJson };
    } catch (error) {
      console.error("Error fetching token URI: ", error);
    } finally {
    }
  };

  const fetchTokenURIsResults = useQueries({
    queries: tokenIds.map((tokenId) => ({
      queryKey: [tokenId],
      queryFn: () => fetchTokenURIs(tokenId),
      enabled: tokenIds.length > 0,
      refetchOnWindowFocus: false,
    })),
  });

  const tokenJsonsResults = useQueries({
    queries: fetchTokenURIsResults.map((tokenUri) => ({
      queryKey: [tokenUri],
      queryFn: () => fetchTokensJson(tokenUri.data.tokenId, tokenUri.data.tokenUri),
      enabled: fetchTokenURIsResults.length > 0,
      refetchOnWindowFocus: false,
    })),
  });

  const getNFTsFromCollection = async () => {
    try {
      const mintedNftsLogs = await viemPublicClient.getLogs({
        address: collectionAddress,
        event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"),
        fromBlock: BigInt(3039035),
        toBlock: "latest",
      });

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

      const tokenIdsLogs = updatedNftsInfos.map((log) => Number(log.args.tokenId));
      console.log("tokenIdsLogs : " + tokenIdsLogs);
      setTokenIds(tokenIdsLogs);
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
    console.log(getFactoryCollectionsData);
    setCollectionAddress(getFactoryCollectionsData as Address);
    getNFTsFromCollection();
  }, [getFactoryCollectionsData]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Grille de cards */}
      {isConnected && tokenJsonsResults.every((r) => r.isLoading) ? (
        <NWLoader />
      ) : (
        collectionAddress &&
        tokenJsonsResults &&
        isConnected && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 place-items-center sm:place-items-start">
            <Card className="hover:shadow-xl transition-shadow w-full">
              <div className="top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t bg-pink-500">
                Collection NFT {collectionAddress[0]}
              </div>
              <div className="flex items-center justify-center">
                <Carousel className="w-full p-6">
                  <CarouselContent>
                    {tokenJsonsResults.map((nft, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        {nft.data && (
                          <NftCard
                            nft={{
                              id: undefined,
                              category: undefined,
                              tokenId: nft.data.tokenId,
                              brand: "the Brand blabla",
                              nftCollection: collectionAddress[0],
                              productTitle: nft.data.responseJson["name"],
                              serialNumber: "serialNumber blabla",
                              productDescription: nft.data.responseJson["description"],
                              imagePath: nft.data.responseJson["image"],
                            }}
                            refetchNFTCollection={getNFTsFromCollection}
                          />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10">
                    <CarouselPrevious className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200" />
                  </div>
                  <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10">
                    <CarouselNext className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200" />
                  </div>
                </Carousel>
              </div>
            </Card>
          </div>
        )
      )}
    </div>
  );
};

export default Nfts;
function timeout(arg0: number) {
  throw new Error("Function not implemented.");
}

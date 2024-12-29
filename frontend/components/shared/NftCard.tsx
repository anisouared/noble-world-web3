import { NftCardPropsType } from "@/types/props/NftCardPropsType";
import React, { useState } from "react";
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
import NWLoader from "./NWLoader";
import { ethers } from "ethers";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Address, parseAbiItem } from "abitype";
import NWERC721Data from "@/constants/contractsData/NWERC721.json";
import NWMainContract from "@/constants/contractsData/NWMain-address.json";
import NWMainData from "@/constants/contractsData/NWMain.json";
import EscrowedToken from "./EscrowedToken";
import { useTransaction } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { http, createConfig } from "@wagmi/core";
import { hardhat, sepolia, holesky } from "@wagmi/core/chains";
import { wagmiConfig } from "@/wagmiConfig";
import { ConnectorAccountNotFoundError } from "wagmi";

const NftCard = (props: NftCardPropsType) => {
  const { nft, refetchNFTCollection } = props;
  const { address, isConnected } = useAccount();

  const [loading, setLoading] = useState<boolean>(false);
  const [priceInEther, setPriceInEther] = useState<string>("");
  const [tokenEscrowed, setTokenEscrowed] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  // const {
  //   data: callApproveTokenHash,
  //   error: callApproveTokenError,
  //   isPending: callApproveTokenIsPending,
  //   isSuccess: callApproveTokenIsSuccess,
  //   writeContract: callApproveTokenWriteContract,
  // } = useWriteContract({});
  // const {
  //   data: callApproveTokenTransaction,
  //   isError,
  //   isLoading,
  // } = useTransaction({
  //   hash: callApproveTokenHash,
  // });
  // const {
  //   isLoading: callApproveTokenIsLoading,
  //   isSuccess: callApproveTokenTransactionIsSuccess,
  //   error: callApproveTokenTransactionError,
  // } = useWaitForTransactionReceipt({ hash: callApproveTokenHash });
  // const approveToken = async (collectionAddress: Address, tokenId: BigInt) => {
  //   callApproveTokenWriteContract({
  //     address: collectionAddress,
  //     abi: NWERC721Data.abi,
  //     functionName: "approve",
  //     args: [NWMainContract.address, tokenId],
  //   });
  // };

  // const {
  //   data: callEscrowItemHash,
  //   error: callEscrowItemError,
  //   isPending: callEscrowItemIsPending,
  //   isSuccess: callEscrowItemIsSuccess,
  //   writeContract: callEscrowItemWriteContract,
  // } = useWriteContract({});
  // const {
  //   isLoading: callEscrowItemIsLoading,
  //   isSuccess: callEscrowItemTransactionIsSuccess,
  //   error: callEscrowItemTransactionError,
  // } = useWaitForTransactionReceipt({ hash: callEscrowItemHash });
  // const escrowItem = async (collectionAddress: Address, tokenId: BigInt, priceInWei: BigInt) => {
  //   callEscrowItemWriteContract({
  //     address: NWMainContract.address as Address,
  //     abi: NWMainData.abi,
  //     functionName: "escrowItem",
  //     args: [collectionAddress, tokenId, priceInWei],
  //   });
  // };

  const approveNFT = async () => {
    console.log("start approve NFT");
    console.log("isConnected : " + isConnected);
    const responseApproveToken = await writeContract(wagmiConfig, {
      address: nft.nftCollection,
      abi: NWERC721Data.abi,
      functionName: "approve",
      args: [NWMainContract.address, BigInt(nft.tokenId)],
    });

    console.log("responseApproveToken : " + responseApproveToken);

    const approveTokenTransactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: responseApproveToken,
      //confirmations: 5,
    });

    return approveTokenTransactionReceipt;
  };

  const EscrowNFT = async () => {
    console.log("start escrow NFT");
    const responseEscrowItem = await writeContract(wagmiConfig, {
      address: NWMainContract.address as Address,
      abi: NWMainData.abi,
      functionName: "escrowItem",
      args: [nft.nftCollection, BigInt(nft.tokenId), ethers.parseUnits(priceInEther, "ether")],
    });

    const escrowItemTransactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: responseEscrowItem,
    });

    return escrowItemTransactionReceipt;
  };

  const handleSellClick = async () => {
    try {
      if (priceInEther) {
        setLoading(true);
        await approveNFT();
        const escrowNFTSuccess = await EscrowNFT();
        if (escrowNFTSuccess) {
          console.log("setLoading TO false and setTokenEscrowed to true");
          setLoading(false);
          setTokenEscrowed(true);
        }
        setTokenEscrowed(true);
      }
    } catch (error) {
      console.error("Error while escrow item : " + error);

      setLoading(false);
    }
  };

  const handleOnCloseDialog = async (open: boolean) => {
    if (!open) {
      await refetchNFTCollection();
    }

    setOpenDialog(open);
  };

  let dialogContentToShow = null;
  if (loading) {
    dialogContentToShow = <NWLoader />;
  } else if (tokenEscrowed) {
    dialogContentToShow = <EscrowedToken tokenId={nft.tokenId} />;
  }

  return (
    <Dialog open={openDialog} onOpenChange={handleOnCloseDialog}>
      <DialogTrigger asChild>
        <Card
          key={nft.id}
          className="hover:shadow-[0_1px_10px_rgba(0,0,0,0.7)] transition-shadow overflow-hidden mb-2 m-2"
        >
          <CardHeader className="p-4 pb-3 flex justify-between items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
              {<img src={nft.imagePath} alt={nft.productTitle} className="object-cover h-78 w-96" />}
            </div>
            <CardTitle
              className="text-base overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
              title={nft.productTitle}
            >
              {nft.productTitle}
            </CardTitle>
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
        {dialogContentToShow || (
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
                min="0.01"
                placeholder="Prix en ether ..."
                className="pr-3 pl-3 text-center focus-visible:ring-transparent focus-visible:border-gray-400"
                value={priceInEther}
                onChange={(e) => setPriceInEther(e.target.value)}
              />
              <Button className="bg-green-400 hover:bg-green-500 mt-auto" onClick={handleSellClick}>
                SELL
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NftCard;

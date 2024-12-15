"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

const Products = () => {
    const nfts = Array.from({ length: 1 }, (_, i) => ({
        id: i + 1,
        title: `NFT #${i + 1}`,
        description: "Digital collectible",
        price: `${(Math.random() * 2).toFixed(2)} ETH`,
        image: "/images/product1.png",
        category: ["Art", "Collectibles", "Gaming", "Music"][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.5 ? "Escrowed" : "Canceled"
    }))

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3
    const totalPages = Math.ceil(nfts.length / itemsPerPage)

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return nfts.slice(startIndex, endIndex)
    }

    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
      )

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
                                            <div>
                                                <Card>
                                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10">
                                    <CarouselPrevious/>
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
    )
}

export default Products
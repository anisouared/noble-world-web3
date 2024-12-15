"use client"

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

const Gallery = () => {
    // Données simulées pour les cards (48 items pour 3 pages)
    const nfts = Array.from({ length: 48 }, (_, i) => ({
        id: i + 1,
        title: `NFT #${i + 1}`,
        description: "Digital collectible",
        price: `${(Math.random() * 2).toFixed(2)} ETH`,
        image: "/images/product1.png",
        category: ["Art", "Collectibles", "Gaming", "Music"][Math.floor(Math.random() * 4)]
    }))

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 16
    const totalPages = Math.ceil(nfts.length / itemsPerPage)

    // Obtenir les NFTs pour la page actuelle
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return nfts.slice(startIndex, endIndex)
    }

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
                <Button className="bg-blue-600 bg-purple-600 hover:bg-purple-700">
                    Apply Filters
                </Button>
            </div>

            {/* Grille de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 place-items-center sm:place-items-start">
                {getCurrentPageItems().map((nft) => (
                    <Card key={nft.id} className="hover:shadow-lg transition-shadow w-[260px] sm:w-[260px] md:w-[240px] lg:w-[240px] xl:w-[260px]">
                        <CardHeader className="p-4">
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                <img
                                    src={nft.image}
                                    alt={nft.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base">{nft.title}</CardTitle>
                                <Badge variant="secondary" className="text-xs">{nft.category}</Badge>
                            </div>
                            <CardDescription className="text-xs mt-1">{nft.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-semibold">{nft.price}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <button className="w-full text-xs text-blue-500 hover:text-blue-700">
                                Buy
                            </button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default Gallery
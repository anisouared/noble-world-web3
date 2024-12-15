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

const Sales = () => {
    const nfts = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `NFT #${i + 1}`,
        description: "Digital collectible",
        price: `${(Math.random() * 2).toFixed(2)} ETH`,
        image: "/images/product1.png",
        category: ["Art", "Collectibles", "Gaming", "Music"][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.5 ? "Escrowed" : "Canceled"
    }))

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4
    const totalPages = Math.ceil(nfts.length / itemsPerPage)

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
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 place-items-center sm:place-items-start">
                {getCurrentPageItems().map((nft) => (
                    <Card key={nft.id} className="hover:shadow-xl transition-shadow h-[250px] w-full bg-green-100">
                        <div className={`top-2 right-2 flex items-center justify-center text-white text-sm font-bold py-1 px-3 rounded-t ${nft.status === "Escrowed" ? "bg-orange-500" : "bg-red-500"}`}>
                            {nft.status === "Escrowed" ? "Escrowed" : "Canceled"}
                        </div>
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

export default Sales
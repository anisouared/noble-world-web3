// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

/**
 * @title Interface of Noble World's ERC721 contract for NFT collections, the anti-counterfeiting solution for marketplaces and brands
 * @author Anis OUARED
 * @notice This is an experimental contract
 */
interface INWERC721 is IERC721Enumerable {
    /**
     * @notice Initializing an NFT collection (ERC721)
     */
    function initializeCollection(
        string calldata _collectionName,
        string calldata _collectionSymbol,
        string calldata _collectionURI
    ) external;

    /**
     * @notice Mint NFT from collection
     * @param _to address of the NFT recipient
     */
    function safeMint(address _to) external payable;
}

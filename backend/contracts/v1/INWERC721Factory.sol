// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "./INWERC721.sol";

/**
 * @title Interface of Noble World's NFT factory, the anti-counterfeiting solution for marketplaces and brands
 * @author Anis OUARED
 * @notice This is an experimental contract
 */
interface INWERC721Factory {
    /**
     * @notice Data of the NFT collections created
     */
    event NFTCollectionsCreated(
        string collectionName,
        INWERC721 indexed collectionAddress,
        string collectionURI,
        uint256 timestamp
    );

    /**
     * @notice Getting addresses of NFT collections created
     * @return Array of NFT collections
     */
    function getCollectionsCreated() external view returns (address[] memory);

    /**
     * @notice Creation of NFT collection
     * @param _collectionName Name of the NFT collection to be created
     * @param _collectionSymbol Symbol of the NFT collection to be created
     * @param _collectionURI Base URI for the storage location of the NFT collection metadata.
     */
    function createNFTCollection(
        string calldata _collectionName,
        string calldata _collectionSymbol,
        string calldata _collectionURI
    ) external returns (INWERC721 collectionAddress);

    /**
     * @notice Mint NFT from a collection created by this factory
     * @param _collectionAddress NFT Collection Address
     */
    function mint(INWERC721 _collectionAddress) external;

    /**
     * @notice Mint NFT from a collection created by this factory
     * As this contract is experimental, this function facilitates minting from the experimental NFT collection
     */
    function mint() external;
}

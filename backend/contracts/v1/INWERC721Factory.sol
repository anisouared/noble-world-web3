// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "./INWERC721.sol";

interface INWERC721Factory {
    event NFTCollectionsCreated(
        string collectionName,
        INWERC721 collectionAddress,
        string collectionURI,
        uint timestamp
    );

    function createNFTCollection(
        string calldata _collectionName,
        string calldata _collectionSymbol,
        string calldata _collectionURI
    ) external returns (INWERC721 collectionAddress);

    function mint() external;

    function mint(INWERC721 collectionAddress) external;

    function getCollectionsCreated() external view returns (address[] memory);
}

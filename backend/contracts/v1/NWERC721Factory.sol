// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "./NWERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Noble World's NFT factory, the anti-counterfeiting solution for marketplaces and brands
 * @author Anis OUARED
 * @notice This is an experimental contract
 */
contract NWERC721Factory is Ownable {
    /// @notice List of NFT collection (ERC721) created
    address[] public collectionsCreated;

    /**
     * @notice Data of the NFT collections created
     */
    event NFTCollectionsCreated(
        string collectionName,
        address indexed collectionAddress,
        string collectionURI,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Getting addresses of NFT collections created
     * @return Array of NFT collections
     */
    function getCollectionsCreated() external view returns (address[] memory) {
        return collectionsCreated;
    }

    /**
     * @notice Creation of NFT collection
     * @param _collectionName Name of the NFT collection to be created
     * @param _collectionSymbol Symbol of the NFT collection to be created
     * @param _collectionURI Base URI for the storage location of the NFT collection metadata.
     * @dev This is a low level call; it allows for creating smart contracts on the fly using CREATE2.
     */
    function createNFTCollection(
        string calldata _collectionName,
        string calldata _collectionSymbol,
        string calldata _collectionURI
    ) external onlyOwner returns (address collectionAddress) {
        bytes memory collectionByteCode = type(NWERC721).creationCode;

        bytes32 salt = keccak256(abi.encodePacked(_collectionURI));

        assembly {
            collectionAddress := create2(
                0,
                add(collectionByteCode, 0x20),
                mload(collectionByteCode),
                salt
            )

            if iszero(extcodesize(collectionAddress)) {
                revert(0, 0)
            }
        }

        NWERC721(collectionAddress).initializeCollection(
            _collectionName,
            _collectionSymbol,
            _collectionURI
        );

        collectionsCreated.push(collectionAddress);

        emit NFTCollectionsCreated(
            _collectionName,
            collectionAddress,
            _collectionURI,
            block.timestamp
        );
    }

    /**
     * @notice Mint NFT from a collection created by this factory
     * @param _collectionAddress NFT Collection Address
     */
    function mint(NWERC721 _collectionAddress) external {
        NWERC721 collection = NWERC721(_collectionAddress);
        collection.safeMint(msg.sender);
    }

    /**
     * @notice Mint NFT from a collection created by this factory
     * As this contract is experimental, this function facilitates minting from the experimental NFT collection
     */
    function mint() external {
        require(
            collectionsCreated.length > 0,
            "No collection has been created"
        );
        NWERC721 collection = NWERC721(collectionsCreated[0]);
        collection.safeMint(msg.sender);
    }
}

// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "./NWERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NWERC721Factory is Ownable {
    address[] public collectionsCreated;
    address payable public feeAccount;

    event NFTCollectionsCreated(
        string collectionName,
        address collectionAddress,
        string collectionURI,
        uint timestamp
    );

    constructor() Ownable(msg.sender) {
        feeAccount = payable(owner());
    }

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

    function mint() external {
        require(
            collectionsCreated.length > 0,
            "No collection has been created"
        );
        NWERC721 collection = NWERC721(collectionsCreated[0]);
        collection.safeMint(msg.sender);
    }

    function mint(NWERC721 collectionAddress) external {
        NWERC721 collection = NWERC721(collectionAddress);
        collection.safeMint(msg.sender);
    }
}

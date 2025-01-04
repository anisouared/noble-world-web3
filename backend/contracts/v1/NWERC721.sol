// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Noble World's ERC721 contract for NFT collections, the anti-counterfeiting solution for marketplaces and brands
 * @author Anis OUARED
 * @notice This is an experimental contract
 */
contract NWERC721 is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;
    uint256 private constant MAX_SUPPLY = 40;
    uint256 private constant AMOUNT_NFT_PER_WALLET = 10;

    /// Base URI of the NFT collection
    string public baseURI;

    mapping(address => uint256) amountNFTMintedPerWallet;

    constructor() Ownable(msg.sender) ERC721("", "") {}

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Initializing an NFT collection (ERC721)
     * @dev Can only be called by Noble World NFT factory (owner) while creating an NFT collection on the fly using CREATE2
     */
    function initializeCollection(
        string calldata _collectionName,
        string calldata _collectionSymbol,
        string calldata _collectionURI
    ) external onlyOwner {
        _name = _collectionName;
        _symbol = _collectionSymbol;
        baseURI = _collectionURI;
    }

    /**
     * @notice Mint NFT from collection
     * @param _to address of the NFT recipient
     * @dev Minting can only be made from the Noble World factory (owner)
     */
    function safeMint(address _to) external payable onlyOwner {
        require(totalSupply() + 1 <= MAX_SUPPLY, "Max supply exceeded");
        require(
            amountNFTMintedPerWallet[_to] + 1 <= AMOUNT_NFT_PER_WALLET,
            "Maximum number of mint per wallet has been reached"
        );

        amountNFTMintedPerWallet[_to]++;
        _nextTokenId++;

        uint256 tokenId = _nextTokenId;
        _safeMint(_to, tokenId);
    }

    /**
     * @notice Retrieving the full metadata URI for a given token ID
     * @param _tokenId Token ID within the NFT collection
     * @return Full URI of the NFT metadata
     */
    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        _requireOwned(_tokenId);

        return
            bytes(_baseURI()).length > 0
                ? string(
                    abi.encodePacked(
                        _baseURI(),
                        Strings.toString(_tokenId),
                        ".json"
                    )
                )
                : "";
    }
}

// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NWERC721 is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;
    uint256 private constant MAX_SUPPLY = 12;
    //uint256 private constant PRICE_PER_NFT = 0.000002 ether;
    uint256 private constant AMOUNT_NFT_PER_WALLET = 3;

    string public baseURI;

    mapping(address => uint256) amountNFTMintedPerWallet;

    constructor() Ownable(msg.sender) ERC721("", "") {}

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function initializeCollection(
        string calldata _collectionName,
        string calldata _collectionSymbol,
        string calldata _collectionURI
    ) public onlyOwner {
        _name = _collectionName;
        _symbol = _collectionSymbol;
        baseURI = _collectionURI;
    }

    function safeMint(address to) public payable onlyOwner {
        require(totalSupply() + 1 <= MAX_SUPPLY, "Max supply exceeded");
        //require(msg.value >= PRICE_PER_NFT, "Not enough funds to mint");
        require(
            amountNFTMintedPerWallet[to] + 1 <= AMOUNT_NFT_PER_WALLET,
            "Maximum number of mint per wallet has been reached"
        );

        amountNFTMintedPerWallet[to]++;
        _nextTokenId++;

        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }
}

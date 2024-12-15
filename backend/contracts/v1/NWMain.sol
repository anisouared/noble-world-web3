// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "./INWERC721Factory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NWMain is Ownable {
    // State Variables
    address payable public feeAccount;
    uint256 public immutable feePercent; // the fee percentage on transactions
    uint256 public itemCount; // all items of all contracts
    INWERC721Factory factory;

    enum SaleStatus {
        SaleNotStarted,
        Escrowed,
        Purchasing,
        Purchased,
        SellerCancelled,
        BuyerCancelled,
        SaleTimeout
    }

    struct Item {
        uint256 itemId;
        address collection;
        uint256 tokenId;
        uint256 priceInWei;
        address payable seller;
        address payable buyer;
        SaleStatus status;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256[]) public sellersItemsIds;

    event NFTReceived(
        address operator,
        address from,
        uint256 tokenId,
        bytes data
    );
    event EscrowedItems(
        uint256 indexed itemId,
        address collection,
        uint256 indexed tokenId,
        uint256 priceInWei,
        address indexed seller
    );

    event PaidItems(uint256 indexed itemId, address indexed buyer);
    event SoldItems(
        uint256 itemId,
        address indexed seller,
        address indexed buyer,
        uint256 netPriceInWei,
        uint256 amountOfFees
    );
    event WithdrawFees(uint256 amountInWei, uint timestamp);

    error NotAuthorized();

    constructor(
        INWERC721Factory _factory,
        uint256 _feePercent
    ) Ownable(msg.sender) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        factory = INWERC721Factory(_factory);
    }

    function escrowItem(
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _priceInEther
    ) public {
        require(_priceInEther > 0, "Price of the item must be specified");
        require(
            IERC721(_collectionAddress).ownerOf(_tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );

        uint256 priceInWei = _priceInEther * 1 ether;
        //IERC721(_collectionAddress).approve(address(this), _tokenId);
        IERC721(_collectionAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        itemCount++;

        items[itemCount] = Item(
            itemCount,
            _collectionAddress,
            _tokenId,
            priceInWei,
            payable(msg.sender),
            payable(address(0)),
            SaleStatus.Escrowed
        );

        sellersItemsIds[msg.sender].push(itemCount);

        emit EscrowedItems(
            itemCount,
            _collectionAddress,
            _tokenId,
            priceInWei,
            msg.sender
        );
    }

    function escrowItem(
        uint256 _tokenId,
        uint256 _priceInEther
    ) external payable {
        require(
            getFactoryCollections().length > 0,
            "Collection was not recognized, it is not possible to escrow an item"
        );
        require(_priceInEther > 0, "Price of the item must be specified");

        escrowItem(getFactoryCollections()[0], _tokenId, _priceInEther);
    }

    function buyItem(uint256 _itemId) external payable {
        Item memory item = items[_itemId];
        require(msg.value >= item.priceInWei, "Not enough funds provided");
        require(item.status == SaleStatus.Escrowed, "Item not escrowed");

        item.buyer = payable(msg.sender);
        item.status = SaleStatus.Purchasing;

        items[_itemId] = item;

        emit PaidItems(_itemId, msg.sender);
    }

    function validateItem(uint256 _itemId) external payable {
        Item memory item = items[_itemId];
        require(item.buyer == msg.sender, "You are not the item buyer");
        require(item.seller != address(0), "No seller for this item");
        require(
            item.status == SaleStatus.Purchasing,
            "Item has not been repurchased"
        );

        IERC721(item.collection).transferFrom(
            address(this),
            item.buyer,
            item.tokenId
        );

        item.status = SaleStatus.Purchased;
        items[_itemId] = item;

        uint256 amountOfFees = (item.priceInWei * feePercent) / 100;
        uint256 netPriceInWei = item.priceInWei - amountOfFees;

        (bool sent, ) = item.seller.call{value: netPriceInWei}("");
        require(sent, "Failed to send Ether");

        emit SoldItems(
            _itemId,
            item.seller,
            item.buyer,
            netPriceInWei,
            amountOfFees
        );
    }

    function withdrowFees(uint256 _amountInWei) external onlyOwner {
        require(
            _amountInWei <= address(this).balance,
            "You cannot withdraw this amount"
        );

        (bool received, ) = feeAccount.call{value: _amountInWei}("");

        require(received, "Withdraw did not work");

        emit WithdrawFees(_amountInWei, block.timestamp);
    }

    function getFactoryCollections() internal view returns (address[] memory) {
        return factory.getCollectionsCreated();
    }

    fallback() external payable {}
    receive() external payable {}
}

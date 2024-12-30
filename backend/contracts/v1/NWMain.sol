// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "./INWERC721Factory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NWMain is Ownable {
    // State Variables
    address payable public feeAccount;
    uint256 public feePercent;
    INWERC721Factory factory;

    enum SaleStatus {
        SaleNotStarted,
        Escrowed,
        Purchasing,
        Purchased,
        Cancellation,
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
        uint timestamp;
        bool sellerRequestsCancellation;
        bool buyerRequestsCancellation;
    }

    Item[] public items;

    mapping(address => uint256[]) itemsIdsForSale;
    mapping(address => uint256[]) itemsIdsForPurchase;

    event EscrowedItems(
        uint256 indexed itemId,
        address collection,
        uint256 indexed tokenId,
        uint256 priceInWei,
        address indexed seller,
        uint timestamp
    );

    event PaidItems(uint256 indexed itemId, address indexed buyer, uint timestamp);

    event SoldItems(
        uint256 itemId, 
        address indexed seller,
        address indexed buyer,
        uint256 netPriceInWei,
        uint256 amountOfFees,
        uint timestamp
    );

    event SaleConcellation(uint256 itemId, uint timestamp);

    error NotAuthorized();

    constructor(
        INWERC721Factory _factory,
        uint256 _feePercent
    ) Ownable(msg.sender) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        factory = INWERC721Factory(_factory);
    }

    function getItem(uint256 _itemId) internal view returns (Item memory) {
        require(_itemId < items.length, "Item does not exist");
        
        Item memory itemToReturn;

        for(uint256 i = 0; i < items.length; i++) {
            if(items[i].itemId == _itemId) {
                itemToReturn = items[i];
                break;
            }
        }

        return itemToReturn;
    }

    function getItemsIdsForSale(address _seller) external view returns (uint256[] memory) {
        return itemsIdsForSale[_seller];
    }

    function getItemsIdsForPurchase(address _buyer) external view returns(uint256[] memory) {
        return itemsIdsForPurchase[_buyer];
    }

    function getItemsBatch(uint256[] calldata _ids) external view returns (Item[] memory) {
        Item[] memory batchToReturn = new Item[](_ids.length);

        for(uint256 i = 0; i < _ids.length; i++) {
            for(uint256 j = 0; j < items.length; j++) {
                if (items[j].itemId == _ids[i]) {
                    batchToReturn[i] = items[j];
                    break;
                }
            }
        }

        return batchToReturn;
    }

    function changeFeeAccount(address _newFeeAccount) external onlyOwner {
        feeAccount = payable(_newFeeAccount);
    }

    function changeFeePercent(uint _newFeePercent) external onlyOwner {
        require(_newFeePercent < 30 , "Percentage of fees cannot exceed 30%");
        feePercent = _newFeePercent;
    }

    function escrowItem(
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _priceInWei
    ) public {
        require(_priceInWei > 0, "Price of the item must be specified");
        require(
            IERC721(_collectionAddress).ownerOf(_tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );

        IERC721(_collectionAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        uint256 itemId = items.length;

        Item memory item = Item(
            itemId,
            _collectionAddress,
            _tokenId,
            _priceInWei,
            payable(msg.sender),
            payable(address(0)),
            SaleStatus.Escrowed,
            block.timestamp,
            false,
            false);

        items.push(item);

        itemsIdsForSale[_msgSender()].push(itemId);

        emit EscrowedItems(
            itemId,
            _collectionAddress,
            _tokenId,
            _priceInWei,
            msg.sender,
            block.timestamp
        );
    }

    function escrowItem(
        uint256 _tokenId,
        uint256 _priceInWei
    ) external payable {
        require(
            getFactoryCollections().length > 0,
            "Collection was not recognized, it is not possible to escrow an item"
        );
        require(_priceInWei > 0, "Price of the item must be specified");

        escrowItem(getFactoryCollections()[0], _tokenId, _priceInWei);
    }

    function buyItem(uint256 _itemId) external payable {
        Item memory item = getItem(_itemId);
        require(msg.value >= item.priceInWei, "Not enough funds provided");
        require(item.status == SaleStatus.Escrowed, "Item not escrowed");

        item.buyer = payable(msg.sender);
        item.status = SaleStatus.Purchasing;

        items[item.itemId] = item;

        itemsIdsForPurchase[_msgSender()].push(item.itemId);

        emit PaidItems(item.itemId, msg.sender, block.timestamp);
    }

    function validateItem(uint256 _itemId) external payable {
        Item memory item = getItem(_itemId);
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
        items[item.itemId] = item;

        uint256 amountOfFees = (item.priceInWei * feePercent) / 100;
        uint256 netPriceInWei = item.priceInWei - amountOfFees;

        (bool sellerFundsSent, ) = item.seller.call{value: netPriceInWei}("");
        require(sellerFundsSent, "Failed to send funds to seller");

        (bool feesReceived, ) = feeAccount.call{value: amountOfFees}("");
        require(feesReceived, "Withdraw did not work");

        emit SoldItems(
            item.itemId,
            item.seller,
            item.buyer,
            netPriceInWei,
            amountOfFees,
            block.timestamp
        );
    }

    function cancelSale(uint256 _itemId) external payable {
        Item memory item = getItem(_itemId);

        require(_msgSender() == item.seller || _msgSender() == item.buyer, "Must be a buyer or seller of the item");

        if (item.status == SaleStatus.Escrowed && item.seller == _msgSender()) {
            IERC721(item.collection).transferFrom(address(this), _msgSender(), item.tokenId);
            item.status = SaleStatus.Cancellation;
        } else if (item.status == SaleStatus.Purchasing) {
            bool isSeller = item.seller == _msgSender();
            bool isBuyer = item.buyer == _msgSender();

            if (isSeller) {
                require(!item.sellerRequestsCancellation, "Seller already requested cancellation");
                item.sellerRequestsCancellation = true;
            }
            
            if (isBuyer) {
                require(!item.buyerRequestsCancellation, "Buyer already requested cancellation");
                item.buyerRequestsCancellation = true;
            }

            if (item.sellerRequestsCancellation && item.buyerRequestsCancellation) {
                IERC721(item.collection).transferFrom(address(this), item.seller, item.tokenId);
                (bool sellerFundsSent, ) = item.seller.call{value: item.priceInWei}("");
                require(sellerFundsSent, "Unable to refund funds to seller");
                item.status = SaleStatus.Cancellation;
            }
        } else {
           revert("Unable to cancel sale");
        }

        items[item.itemId] = item;

        emit SaleConcellation(item.itemId, block.timestamp);
    }

    function getFactoryCollections() public view returns (address[] memory) {
        return factory.getCollectionsCreated();
    }

    fallback() external payable {}
    receive() external payable {}
}

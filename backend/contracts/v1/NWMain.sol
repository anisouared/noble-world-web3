// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "./INWERC721Factory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title Noble World main Contract, the anti-counterfeiting solution for marketplaces and brands
 * @author Anis OUARED
 * @notice This is an experimental contract
 */
contract NWMain is Ownable {
    /// @notice Address of the account that will collect sales fees
    address payable public feeAccount;

    /// @notice Percentage of fees applied to each completed sale.
    uint256 public feePercent;

    INWERC721Factory factory;

    /**
     * @notice Different phases of a sale
     */
    enum SaleStatus {
        SaleNotStarted,
        Escrowed,
        Purchasing,
        Purchased,
        Cancellation,
        SaleTimeout
    }

    /**
     * @notice An object containing the data of an item listed for sale
     */
    struct Item {
        uint256 itemId;
        address collection;
        uint256 tokenId;
        uint256 priceInWei;
        address payable seller;
        address payable buyer;
        SaleStatus status;
        uint256 timestamp;
        bool sellerRequestsCancellation;
        bool buyerRequestsCancellation;
    }

    /**
     * @notice An array of products listed for sale by their owner
     */
    Item[] public items;

    mapping(address => uint256[]) itemsIdsForSale;
    mapping(address => uint256[]) itemsIdsForPurchase;

    /**
     * @notice Details of items placed in escrow when listed for sale
     */
    event EscrowedItems(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address indexed seller,
        address collection,
        uint256 priceInWei,
        uint256 timestamp
    );

    /**
     * @notice Minimum data of items purchased (paid) but not yet validated
     */
    event PaidItems(
        uint256 indexed itemId,
        address indexed buyer,
        uint256 timestamp
    );

    /**
     * @notice Data of items purchased and validated by the buyer, including sales price and costs
     */
    event SoldItems(
        uint256 itemId,
        address indexed seller,
        address indexed buyer,
        uint256 netPriceInWei,
        uint256 amountOfFees,
        uint256 timestamp
    );

    /**
     * @notice Cancelled sales and their corresponding timestamps
     */
    event SaleConcellation(uint256 itemId, uint256 timestamp);

    constructor(
        INWERC721Factory _factory,
        uint256 _feePercent
    ) Ownable(msg.sender) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        factory = INWERC721Factory(_factory);
    }

    /**
     * @notice Retrieve an item listed for sale
     * @param _itemId Item id
     * @return Item listed for sale
     */
    function _getItem(uint256 _itemId) internal view returns (Item memory) {
        require(_itemId < items.length, "Item does not exist");

        Item memory itemToReturn;

        for (uint256 i = 0; i < items.length; i++) {
            if (items[i].itemId == _itemId) {
                itemToReturn = items[i];
                break;
            }
        }

        return itemToReturn;
    }

    /**
     * @notice Retrieve collections created by Noble World NFT factory
     */
    function getFactoryCollections() public view returns (address[] memory) {
        return factory.getCollectionsCreated();
    }

    /**
     * @notice Retrieve IDs of items that were listed for sale by a given seller
     * @param _seller Seller's address
     * @return Array of ids
     */
    function getItemsIdsForSale(
        address _seller
    ) external view returns (uint256[] memory) {
        return itemsIdsForSale[_seller];
    }

    /**
     * @notice Retrieve IDs of items for which a given buyer has started the purchase
     * @param _buyer Buyer's address
     * @return Array of ids
     */
    function getItemsIdsForPurchase(
        address _buyer
    ) external view returns (uint256[] memory) {
        return itemsIdsForPurchase[_buyer];
    }

    /**
     * @notice Retrieve a batch of items by their IDs
     * @param _ids of items
     * @return Array of items
     */
    function getItemsBatch(
        uint256[] calldata _ids
    ) external view returns (Item[] memory) {
        Item[] memory batchToReturn = new Item[](_ids.length);

        for (uint256 i = 0; i < _ids.length; i++) {
            for (uint256 j = 0; j < items.length; j++) {
                if (items[j].itemId == _ids[i]) {
                    batchToReturn[i] = items[j];
                    break;
                }
            }
        }

        return batchToReturn;
    }

    /**
     * @notice Change the account address that will collect the fees
     * @dev Only the contract owner can use this function
     * @param _newFeeAccount Address of the new account that will collect the fees
     */
    function changeFeeAccount(address _newFeeAccount) external onlyOwner {
        feeAccount = payable(_newFeeAccount);
    }

    /**
     * @notice Change fee percentage collected on each completed sale
     * @dev Only the contract owner can use this function and increase fees by no more than 30%
     */
    function changeFeePercent(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent < 30, "Percentage of fees cannot exceed 30%");
        feePercent = _newFeePercent;
    }

    /**
     * @notice Escrow of NFT linked to the item listed for sale.
     * @param _collectionAddress Address of the collection where the NFT was minted
     * @param _tokenId ID of the token that will be escrowed
     * @param _priceInWei Selling price in wei
     * @dev Item ID is included in the data for easy retrieval
     * Item ID is the same as its index in the items array
     * Seller must approve the NFT in the original ERC721 contract before calling this escrow function (This must be managed within a single transaction in the dApp)
     */
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
            payable(_msgSender()),
            payable(address(0)),
            SaleStatus.Escrowed,
            block.timestamp,
            false,
            false
        );

        items.push(item);

        itemsIdsForSale[_msgSender()].push(itemId);

        emit EscrowedItems(
            itemId,
            _tokenId,
            _msgSender(),
            _collectionAddress,
            _priceInWei,
            block.timestamp
        );
    }

    /**
     * @notice Escrow of NFT linked to the item listed for sale
     * As this contract is experimental, this function facilitates escrow using the experimental NFT collection
     * @param _tokenId ID of the token that will be escrowed
     * @param _priceInWei Selling price in wei
     */
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

    /**
     * @notice Purchasing an item
     * @param _itemId Item ID to buy
     */
    function buyItem(uint256 _itemId) external payable {
        Item memory item = _getItem(_itemId);
        require(msg.value >= item.priceInWei, "Not enough funds provided");
        require(item.status == SaleStatus.Escrowed, "Item not escrowed");

        item.buyer = payable(msg.sender);
        item.status = SaleStatus.Purchasing;

        items[item.itemId] = item;

        itemsIdsForPurchase[_msgSender()].push(item.itemId);

        emit PaidItems(item.itemId, msg.sender, block.timestamp);
    }

    /**
     * @notice The buyer validates the sale after receiving the physical product, releases the escrow to recover the NFT, and triggers the seller's payment
     * @param _itemId Item ID to validate
     */
    function validateItem(uint256 _itemId) external payable {
        Item memory item = _getItem(_itemId);
        require(item.buyer == msg.sender, "You are not the item buyer");
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

    /**
     * @notice Cancellation of sale
     * @param _itemId Item ID for sale cancellation
     * @dev Since the sale must be cancelled by both parties, this function must be called by both the seller and the buyer
     */
    function cancelSale(uint256 _itemId) external payable {
        Item memory item = _getItem(_itemId);

        require(
            _msgSender() == item.seller || _msgSender() == item.buyer,
            "Must be a buyer or seller of the item"
        );

        if (item.status == SaleStatus.Escrowed && item.seller == _msgSender()) {
            IERC721(item.collection).transferFrom(
                address(this),
                _msgSender(),
                item.tokenId
            );
            item.status = SaleStatus.Cancellation;
        } else if (item.status == SaleStatus.Purchasing) {
            bool isSeller = item.seller == _msgSender();
            bool isBuyer = item.buyer == _msgSender();

            if (isSeller) {
                require(
                    !item.sellerRequestsCancellation,
                    "Seller already requested cancellation"
                );
                item.sellerRequestsCancellation = true;
            }

            if (isBuyer) {
                require(
                    !item.buyerRequestsCancellation,
                    "Buyer already requested cancellation"
                );
                item.buyerRequestsCancellation = true;
            }

            if (
                item.sellerRequestsCancellation &&
                item.buyerRequestsCancellation
            ) {
                IERC721(item.collection).transferFrom(
                    address(this),
                    item.seller,
                    item.tokenId
                );
                (bool buyerFundsSent, ) = item.buyer.call{
                    value: item.priceInWei
                }("");
                require(buyerFundsSent, "Unable to refund funds to buyer");
                item.status = SaleStatus.Cancellation;
            }
        } else {
            revert("Unable to cancel sale");
        }

        items[item.itemId] = item;

        emit SaleConcellation(item.itemId, block.timestamp);
    }
}

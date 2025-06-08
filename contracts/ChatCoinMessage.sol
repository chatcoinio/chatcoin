// contracts/ChatCoinMessage.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChatCoinMessage {
    struct Message {
        address sender;
        address receiver;
        string  cipher;
        uint256 timestamp;
    }

    event MessageSent(address indexed sender, address indexed receiver, uint256 index);

    mapping(address => Message[]) private _inbox;

    function sendMessage(address receiver, string calldata cipher) external {
        require(receiver != address(0), "receiver zero");
        _inbox[receiver].push(Message(msg.sender, receiver, cipher, block.timestamp));
        emit MessageSent(msg.sender, receiver, _inbox[receiver].length - 1);
    }

    function inboxLength(address user) external view returns (uint256) {
        return _inbox[user].length;
    }

    function getMessage(address user, uint256 index) external view returns (Message memory) {
        return _inbox[user][index];
    }
} 
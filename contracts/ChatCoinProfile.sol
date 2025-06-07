// contracts/ChatCoinProfile.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatCoinProfile {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function register() public {
        // In a real version, you'd store a profile, emit an event, etc.
    }
}

// contracts/ChatCoinProfile.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChatCoinProfile {
    /*──────────────────
     *  Storage
     *────────────────*/
    address public owner;

    struct Profile {
        string username;
        string avatarUrl;
        string bio;
    }

    mapping(address user => Profile) private _profiles;

    /*──────────────────
     *  Events
     *────────────────*/
    event ProfileRegistered(
        address indexed user,
        string username,
        string avatarUrl,
        string bio
    );

    event ProfileUpdated(
        address indexed user,
        string avatarUrl,
        string bio
    );

    /*──────────────────
     *  Constructor
     *────────────────*/
    constructor() {
        owner = msg.sender;
    }

    /*──────────────────
     *  External functions
     *────────────────*/

    /**
     * Register a new profile. Username is immutable; avatar & bio may be empty.
     * Reverts if the caller already registered.
     */
    function register(
        string memory username,
        string memory avatarUrl,
        string memory bio
    ) external {
        require(bytes(username).length > 0, "Username is required");
        require(
            bytes(_profiles[msg.sender].username).length == 0,
            "Profile already exists"
        );

        _profiles[msg.sender] = Profile({
            username: username,
            avatarUrl: avatarUrl,
            bio: bio
        });

        emit ProfileRegistered(msg.sender, username, avatarUrl, bio);
    }

    /**
     * Update avatar URL and/or bio. Username stays immutable.
     */
    function updateProfile(
        string memory avatarUrl,
        string memory bio
    ) external {
        require(
            bytes(_profiles[msg.sender].username).length > 0,
            "Profile not found"
        );

        _profiles[msg.sender].avatarUrl = avatarUrl;
        _profiles[msg.sender].bio = bio;

        emit ProfileUpdated(msg.sender, avatarUrl, bio);
    }

    /**
     * Fetch a stored profile. Returns empty struct if none.
     */
    function getProfile(
        address user
    ) external view returns (Profile memory) {
        return _profiles[user];
    }
}

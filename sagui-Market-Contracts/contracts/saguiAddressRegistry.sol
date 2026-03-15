// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SaguiAddressRegistry is OwnableUpgradeable {
    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;

    /// @notice Sagui default Collection contract
    address public saguiCollection;

    /// @notice SaguiMarketplace contract
    address public marketplace;

    /// @notice SaguiAuction contract
    address public auction;

    /// @notice SaguiAuction contract
    address public factory;

    /// @notice SaguiMarketplace contract
    address public community;

    /// @notice SaguiMarketplace contract
    address public verification;

    /// @notice SaguiTokenRegistry contract
    address public tokenRegistry;

    /// @notice Contract initializer
    function initialize() public initializer {
        __Ownable_init();
    }

    /**
     @notice Update Sagui default collection contract
     @dev Only admin
     */
    function updateSaguiCollection(address _saguiCollection)
        external
        onlyOwner
    {
        require(
            IERC165(_saguiCollection).supportsInterface(INTERFACE_ID_ERC721),
            "Not ERC721"
        );
        saguiCollection = _saguiCollection;
    }

    /**
     @notice Update SaguiMarket contract
     @dev Only admin
     */
    function updateMarketplace(address _marketplace) external onlyOwner {
        marketplace = _marketplace;
    }

    /**
     @notice Update SaguiArtFactory contract
     @dev Only admin
     */
    function updateFactory(address _factory) external onlyOwner {
        factory = _factory;
    }

    /**
     @notice Update SaguiAuction contract
     @dev Only admin
     */
    function updateAuction(address _auction) external onlyOwner {
        auction = _auction;
    }

    /**
     @notice Update SaguiTokenRegistry contract
     @dev Only admin
     */
    function updateTokenRegistry(address _tokenRegistry) external onlyOwner {
        tokenRegistry = _tokenRegistry;
    }

    /**
     @notice Update SaguiCommunity contract
     @dev Only admin
     */
    function updateCommunity(address _community) external onlyOwner {
        community = _community;
    }

    /**
     @notice Update SaguiVerification contract
     @dev Only admin
     */

    function updateVerification(address _verification) external onlyOwner {
        verification = _verification;
    }
}


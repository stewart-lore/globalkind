// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IGlobalKindMinter {
    function mintTo(address to, uint64 quantity) external payable;
    function mint(uint64 quantity) external payable;

    function transferOwnershipProxy(address newOwner) external;

    function startSaleProxy(
        uint256 newMaxAmount,
        uint256 newMaxPerMint,
        uint256 newMaxPerWallet,
        uint256 newPrice,
        bool presale
    ) external;

    function setNiftyKit(address _niftykit) external;
    function setWethRecipient(address _wethRecipient) external;
    function setEthRecipient(address payable _ethRecipient) external;
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./INiftyKit.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NiftyKitMock is ERC721, Ownable, INiftyKit {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 private _price;
    constructor(uint256 __price) ERC721("GlobalKind", "GK") {
    _price=__price;
    }

    function transferOwnership(address newOwner) public override(Ownable,INiftyKit) onlyOwner {
        Ownable.transferOwnership(newOwner);
    }

    function batchAirdrop(
        uint64[] calldata quantities,
        address[] calldata recipients
    ) external onlyOwner {
        require(quantities.length == recipients.length, "NiftyKit: Arrays must be equal length");
        for (uint256 i = 0; i < quantities.length; i++) {
            for (uint256 j = 0; j < quantities[i]; j++) {
                safeMint(recipients[i]);
            }
        }
    }
    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function startSale(
        uint256 newMaxAmount,
        uint256 newMaxPerMint,
        uint256 newMaxPerWallet,
        uint256 newPrice,
        bool presale
    ) external onlyOwner {

    }
    function price() external view returns (uint256){
        return _price;
    }
}

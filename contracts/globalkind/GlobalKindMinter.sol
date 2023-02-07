// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../weth/IWeth9.sol";
import "../niftykit/INiftyKit.sol";
import "./IGlobalKindMinter.sol";

contract GlobalKindMinter is Ownable, IGlobalKindMinter {

    INiftyKit public niftykit;
    address payable public ethRecipient;
    address  public wethRecipient;
    IWETH9 public weth;


    constructor(address _niftykit, address payable _ethRecipient, address _wethRecipient, address payable _weth)  {
        niftykit = INiftyKit(_niftykit);
        ethRecipient = _ethRecipient;
        wethRecipient = _wethRecipient;
        weth = IWETH9(_weth);
    }

    function setNiftyKit(address _niftykit) external onlyOwner {
        niftykit = INiftyKit(_niftykit);
    }

    function setEthRecipient(address payable _ethRecipient) external onlyOwner {
        ethRecipient = _ethRecipient;
    }

    function setWethRecipient(address _wethRecipient) external onlyOwner {
        wethRecipient = _wethRecipient;
    }

    function transferOwnershipProxy(address newOwner) external onlyOwner {
        niftykit.transferOwnership(newOwner);
    }

    function startSaleProxy(
        uint256 newMaxAmount,
        uint256 newMaxPerMint,
        uint256 newMaxPerWallet,
        uint256 newPrice,
        bool presale
    ) external onlyOwner {
        niftykit.startSale(newMaxAmount, newMaxPerMint, newMaxPerWallet, newPrice, presale);
    }

    function mintTo(address to, uint64 quantity) public payable {
        _mint(to, quantity);
    }

    function mint(uint64 quantity) external payable {
        _mint(msg.sender, quantity);
    }

    function _mint(address to, uint64 quantity) internal {
        payoutEther(to, quantity);
        address[] memory toArray = new address[](1);
        toArray[0] = to;
        uint64[] memory quantityArray = new uint64[](1);
        quantityArray[0] = quantity;

        niftykit.batchAirdrop(quantityArray, toArray);
    }

    function payoutEther(address from, uint64 quantity) internal {
        uint256 price = niftykit.price();

        require(quantity > 0, "Quantity too low");
        require(msg.value == price * quantity, "Not enough funds sent");
        uint256 half = msg.value / 2;
        uint256 otherHalf = msg.value - half;

        //send half of eth to treasury
        ethRecipient.transfer(half);

        // swap half of eth to weth, and send back to sender
        weth.deposit{value : otherHalf}();
        weth.transfer(from, otherHalf);

        // send weth from sender to recipient2
        weth.transferFrom(from, wethRecipient, otherHalf);
    }

}

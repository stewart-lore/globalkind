// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require('@openzeppelin/hardhat-upgrades');
const hre = require('hardhat');
const {ethers, upgrades} = require('hardhat');

const addresses = {
    [1]: {
        wethAddresses: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        niftyKitCollection: '0x4bc079197eee197045946e8c94f35df1f5141b2b',
        prysmSquadAddressWethReceiver: 'todo',
        treasuryEthReceiver: 'todo',
    }
}

async function main() {

    const {
        wethAddresses,
        niftyKitCollection,
        prysmSquadAddressWethReceiver,
        treasuryEthReceiver
    } = addresses[1]

    const gkMinterFactory = await ethers.getContractFactory('GlobalKindMinter');
    const gkMinter = await gkMinterFactory.deploy(niftyKitCollection, treasuryEthReceiver, prysmSquadAddressWethReceiver, wethAddresses)
    console.log('GlobalKindMinter deployed to:', gkMinter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

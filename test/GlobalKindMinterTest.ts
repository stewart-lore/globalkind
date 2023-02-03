import '@openzeppelin/hardhat-upgrades';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
    GlobalKindMinter,
    IWETH9__factory,
    NiftyKitMock,
    NiftyKitMock__factory,
    WETH9,
} from '../typechain';
import { expect } from 'chai';
import {matchEvents} from "./utils";


const ethPrice = ethers.utils.parseEther('0.01');

describe('GlobalKindMinter', function () {
    let allSigners: SignerWithAddress[];
    let contributors: SignerWithAddress[];
    let contractDeployer: SignerWithAddress;

    let niftyOwnerSigner: SignerWithAddress;
    let safeSigner: SignerWithAddress;
    let treasurySigner: SignerWithAddress;

    let gkMinter: GlobalKindMinter;
    let weth: WETH9;
    let niftykit: NiftyKitMock;

    const setup = async () => {
        allSigners = await ethers.getSigners();
        contractDeployer = allSigners[0];
        safeSigner = allSigners[1];
        niftyOwnerSigner = allSigners[2];
        treasurySigner = allSigners[3];
        contributors = allSigners.slice(4, 10);

        const wethFactory = await ethers.getContractFactory('WETH9');
        weth = await wethFactory.deploy();

        const niftykitFactory = await ethers.getContractFactory('NiftyKitMock');
        niftykit = await niftykitFactory.connect(niftyOwnerSigner).deploy(ethPrice);

        const minterFactory = await ethers.getContractFactory('GlobalKindMinter');
        gkMinter = await minterFactory
            .connect(niftyOwnerSigner)
            .deploy(niftykit.address, treasurySigner.address, safeSigner.address, weth.address);
    };

    const mintToken = async (
        quantity: number,
        minterSigner: SignerWithAddress,
        tokenIdStart: number,
    ) => {
        tokenIdStart = tokenIdStart || 0;
        const minter = gkMinter.connect(minterSigner);

        const value = ethPrice.mul(quantity);
        const mintTxPromise = minter.mint(quantity, { value: value });
        const mintTx = await mintTxPromise
        const mintTxRes = await mintTx.wait()

        for (let i = 0; i < quantity; i++) {
            const tokenId = tokenIdStart + i;
            expect(await niftykit.ownerOf(tokenId)).to.equal(minterSigner.address);

             expect(mintTxRes)
                .to.emit(NiftyKitMock__factory, 'Transfer')
                .withArgs(
                    [ethers.constants.AddressZero, minterSigner.address],
                    tokenIdStart,
                    tokenIdStart + quantity - 1,
                );
        }

        const ethHalf = value.div(2);
        const wethHalf = value.sub(ethHalf);
          expect(mintTx)
            .to.emit(IWETH9__factory, 'Transfer')
            .withArgs(
                minterSigner.address, safeSigner.address, wethHalf,
            );

        const proxyEvents = matchEvents(
            mintTx.events,
            await ethers.getContractFactory('WETH9'),
            beaconProxyFactoryFactory.filters.SquadMembershipProxyCreation(),
        );
        expect(proxyEvents).to.have.length(1);

        expect(mintTx).changeEtherBalance(gkMinter, 0);
        expect(mintTx).changeEtherBalance(minterSigner, -value);
        expect(mintTx).changeEtherBalance(treasurySigner, +ethHalf);
        expect(mintTx).changeTokenBalance(weth, safeSigner, +wethHalf);
        expect(mintTx).changeTokenBalance(weth, gkMinter, 0);
        expect(mintTx).changeTokenBalance(weth, treasurySigner, 0);
        expect(mintTx).changeTokenBalance(weth, minterSigner, 0);
    };
    describe('Tests paths', async () => {
        beforeEach(async function () {
            await setup();
            await niftykit.transferOwnership(gkMinter.address);
        });
        it('should mint one token', async function () {
            await weth.connect(contributors[0]).approve(gkMinter.address, ethPrice);
            await mintToken(1, contributors[0], 0);
        });
        it('should mint 20 token', async function () {
            await weth.connect(contributors[0]).approve(gkMinter.address, ethPrice.mul(20));
            await mintToken(20, contributors[0], 0);
        });
    });

    describe('Sad paths', async () => {
        beforeEach(async function () {
            await setup();
        });
        it('should block mint tokens if weth is not approved', async function () {
            await expect(mintToken(1, contributors[0], 0)).to.revertedWithoutReason();
        });
        it('should block mint tokens if gkminter is not owner', async function () {
            await weth.connect(contributors[0]).approve(gkMinter.address, ethPrice);
            await expect(mintToken(1, contributors[0], 0)).to.revertedWith(
                'Ownable: caller is not the owner',
            );
        });
        it('should fail when weth approval is not high enough', async function () {
            await niftykit.transferOwnership(gkMinter.address);
            await weth.connect(contributors[0]).approve(gkMinter.address, ethPrice.mul(1));
            await expect(mintToken(3, contributors[0], 0)).to.revertedWithoutReason();
        });
    });
});

# Prysm Membership Contracts

### Setup
Install deps
`yarn`

### Test
`yarn test`

### Deploy goerli
```
npx hardhat run --network goerli scripts/deploy-with-factory.js
```
You will get two addresses printed to the console

### Verify Etherscan
```
npx hardhat verify --network goerli <SquadMembershipFinV1 address>
npx hardhat verify --network goerli <SquadMembershipFinProxyFactory address> <SquadMembershipFinV1 address>
```

----

## Protocol Litepaper

#### Intro
Squad Membership is a soul-bound ERC721 (ERC721S) contract that is owned by an
account. The account can be any eth account, but we intend to use it with a
squad gnosis safe multisig account so that on chain actions are governed by the
signers of the multisig. Tokens of a SquadMembership represent membership in the
squad and sometimes equity in the squad.

#### Functional Goals
- Individual Membership and Equity in a squad is represented by a token.
- Tokens, and therefore Equity, are transferable at the squad's discretion.
- Equity amount is not stored on chain.

#### Tokens & Equity
Tokens are linked to our off chain equity. Previously we tracked equity by
account only. Now equity is the token. Whoever owns the token, owns the equity.
Our equity calculation remains off-chain and will be required to take into
consideration Transfer events.

#### Minting
Minting is authorized by the owner with an allow list merkle tree. The
tree root is saved on chain. Individuals in the list can claim their token via
our webapp or use the publicly available allowlist stored in IPFS.

Only one token per account is allowed per collection. This is not enforced on 
chain. Instead our off chain app will only recognize the first proxy created via
event logs.

#### Soul-bound
Tokens are soul-bound in a sense that they cannot be transferred by the individual
owner. However the contract supports transferring tokens in at the discretion of
the collection owner. For example when a user's account is compromised the
equity can be 'recovered' by transferring the token to a new account. The Squad
can transfer the token on behalf of the compromised account which effectively
transfers the equity share to a new account.


#### Contract Overview
* `ContractURIDescriptor.sol` - library to generate a URL pointing to our off chain contract metadata service
* `SquadMembershipBase.sol` - base blueprint contract representing the 721 behavior but not enforcing requirements
* `SquadMembershipFinBeacon.sol` - OZ UpgradeableBeacon for all proxies.
* `SquadMembershipFinProxyFactory.sol` - Beacon Proxy factory for the 721 contract
* `SquadMembershipFinV1.sol` - Concrete blueprint for all proxies of v1 for membership collections.
* `SquadMembershipV1.sol` - Interface to v1 membership collection with some common method definitions.
* `TokenURIDescriptor.sol` - library to generate a URL pointing to our off chain token metadata service

### Audit Goals
1. Verify soul bound nature of contract based on described requirements
2. Verify requirements around minting limits such as one per account per squad collection
3. Verify the upgradeable beacon cannot be controlled by non owner
4. Verify dependency libraries (OpenZeppelin) are vulnerability-free

### Questions for Arbitrary Exec:
1. Proxies can be created on behalf of the owner. The initializer however is not configurable. Is there room for attack here in the proxy factory?
2. 

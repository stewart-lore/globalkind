# Global Kind Prysm integration

### Setup
Install deps
`yarn`

### Test
`yarn test`

### Deploy goerli
```
npx hardhat run --network goerli scripts/deploy-with-factory.js
```
You will get one address for the global kind minter contract, printed to the console

### Verify Etherscan
```
npx hardhat verify --network goerli <address>
```

----

### The Global Kind
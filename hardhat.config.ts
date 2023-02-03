import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-abi-exporter';
import 'hardhat-docgen';
import 'solidity-coverage';
import '@nomicfoundation/hardhat-chai-matchers';

import { HardhatUserConfig } from 'hardhat/config';
import * as dotenv from 'dotenv';

const env = dotenv.config();

const {
    ALCHEMY_API_KEY: alchemyApiKey,
    MNEMONIC: mnemonic,
    ETHERSCAN_API_KEY: etherscanApiKey,
    COINMARKETCAP_API_KEY: coinmarketcapKey,
} = env.parsed || {};

const config: HardhatUserConfig = {
    // Your type-safe config goes here
    solidity: {
        version: '0.8.15',
        settings: {
            optimizer: {
                enabled: true,
                runs: 10_000,
            },
        },
    },
    // paths: {
    //   sources: './contracts/beacon1155',
    // },
    defaultNetwork: 'hardhat',
    networks: mnemonic
        ? {
              goerli: {
                  url: `https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`,
                  accounts: { mnemonic: mnemonic },
              },
          }
        : undefined,
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: etherscanApiKey,
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
        coinmarketcap: coinmarketcapKey,
        showMethodSig: true,
    },
    typechain: {
        outDir: './typechain',
    },
    abiExporter: {
        path: './abi',
        clear: true,
    },
};
export default config;

module.exports = {
  skipFiles: [
    // WETH is for testing purposes only
    'contracts/globalkind/weth/WETH.sol',
    'contracts/globalkind/weth/IWETH9.sol',
    'contracts/globalkind/weth/INiftyKit.sol',
    'contracts/globalkind/weth/NiftyKitMock.sol',
  ],
  configureYulOptimizer: true,
  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true               // Run the grep's inverse set.
  }
};

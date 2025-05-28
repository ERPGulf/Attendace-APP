const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// Block all `.babelrc` files inside node_modules
config.resolver.blockList = exclusionList([
  /node_modules\/.*\/\.babelrc$/,
]);

module.exports = config;

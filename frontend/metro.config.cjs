const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Add support for additional extensions if needed
  config.resolver.sourceExts.push('cjs', 'mjs', 'ts', 'tsx', 'jsx', 'js');

  return config;
})();

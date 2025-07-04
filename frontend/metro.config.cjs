const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Safely access or initialize config.resolver
  config.resolver = config.resolver || {};
  config.resolver.sourceExts = config.resolver.sourceExts || [];

  // Add your custom extensions
  config.resolver.sourceExts.push('cjs', 'mjs', 'ts', 'tsx', 'jsx', 'js');

  return config;
})();

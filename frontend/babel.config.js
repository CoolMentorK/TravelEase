module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        [
            'module:react-native-dotenv',
            {
                moduleName: '@env',
                path: '.env',
                blocklist: null,
                allowlist: null,
                safe: false,
                allowUndefined: true,
                verbose: false,
            },
        ],
    ],
};

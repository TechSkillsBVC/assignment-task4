module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@components': './src/components',
            '@pages': './src/pages',
            '@services': './src/services',
            '@types': './src/types',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@context': './src/context'
          },
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};

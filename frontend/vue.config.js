const webpack = require('webpack');
const path = require('path');
module.exports = {
  parallel: false,
  chainWebpack: (config) => {
    config.resolve.symlinks(false);

    // config.module
    //   .rule('ts')
    //   .use('ts-loader')
    //   .loader('ts-loader')
    //   .tap((options) => {
    //     options.transpileOnly = false;
    //     return options;
    //   });
    //
    // config.module
    //   .rule('tsx')
    //   .use('ts-loader')
    //   .loader('ts-loader')
    //   .tap((options) => {
    //     options.transpileOnly = false;
    //     return opti2ons;
    //   });
  },
  configureWebpack: {
    // module: {
    //   rules: [
    //     {
    //       // Test for a polyfill (or any file) and it won't be included in your
    //       // bundle
    //       test: path.resolve(__dirname, './node_modules/asyncctx/ContinuationLocalStorage.js'),
    //       use: 'null-loader',
    //     },
    //     {
    //       // Test for a polyfill (or any file) and it won't be included in your
    //       // bundle
    //       test: path.resolve(__dirname, './node_modules/jovo-core/dist/src/index.js'),
    //       use: 'null-loader',
    //     },
    //     {
    //       // Test for a polyfill (or any file) and it won't be included in your
    //       // bundle
    //       test: path.resolve(
    //         __dirname,
    //         './node_modules/jovo-platform-alexa/dist/src/core/AlexaSpeechBuilder.js',
    //       ),
    //       use: 'null-loader',
    //     },
    //     {
    //       // Test for a polyfill (or any file) and it won't be included in your
    //       // bundle
    //       test: path.resolve(
    //         __dirname,
    //         './node_modules/jovo-platform-alexa/dist/src/core/AlexaSkill.js',
    //       ),
    //       use: 'null-loader',
    //     },
    //     {
    //       // Test for a polyfill (or any file) and it won't be included in your
    //       // bundle
    //       test: path.resolve(
    //         __dirname,
    //         './node_modules/jovo-platform-alexa/dist/src/core/AlexaUser.js',
    //       ),
    //       use: 'null-loader',
    //     },
    //     {
    //       // Test for a polyfill (or any file) and it won't be included in your
    //       // bundle
    //       test: path.resolve(__dirname, './node_modules/jovo-platform-alexa/dist/src/Alexa.js'),
    //       use: 'null-loader',
    //     },
    //   ],
    // },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-import'),
          require('tailwindcss'),
          require('postcss-nested'),
          require('postcss-custom-properties'),
          require('autoprefixer'),
        ],
      },
    },
  },
};

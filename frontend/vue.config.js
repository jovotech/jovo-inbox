const webpack = require('webpack');
const path = require('path');

const ignoreJovoCliPlugin = new webpack.IgnorePlugin({
  resourceRegExp: /.\/cli$/,
  contextRegExp: /@jovotech[/\\]platform-\w+[/\\]dist[/\\]\w+$/,
});

const externals = {
  '@jest/globals': 'var {}',
  // 'axios': 'var {}',
  'google-auth-library': 'var { JWT: function JWT() {} }',
  'i18next': 'var {}',
  'json-colorizer': 'var () => {}',
  'lodash.clonedeep': 'var () => {}',
  'lodash.unset': 'var () => {}',
  './GoogleAssistantRepromptComponent': 'var {}',
  './JovoLogger': 'var { JovoLogger: function JovoLogger() {} }',
};

module.exports = {
  parallel: false,
  outputDir: './../api/public/client',
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
  configureWebpack:
    process.env.NODE_ENV === 'production'
      ? {
          plugins: [
            ignoreJovoCliPlugin,
            new webpack.IgnorePlugin({
              resourceRegExp: /.*(JovoProxy|BaseOutput|BaseComponent)$/,
            }),
          ],
          externals: {
            ...externals,
            './GoogleAssistantRepromptComponent': 'var {}',
          },
        }
      : {
          devtool: 'inline-source-map',
          plugins: [ignoreJovoCliPlugin],
          externals: externals,
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

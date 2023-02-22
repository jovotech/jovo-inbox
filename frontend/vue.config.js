const webpack = require('webpack');
const path = require('path');

require('dotenv').config({
  path: `../.env`, // take .env file from root folder
});

const ignoreJovoCliPlugin = new webpack.IgnorePlugin({
  resourceRegExp: /.\/cli$/,
  contextRegExp: /@jovotech[/\\]platform-\w+[/\\]dist[/\\]\w+$/,
});

const externals = {
  '@jest/globals': 'var {}',
  'google-auth-library': 'var { JWT: function JWT() {} }',
  'i18next': 'var {}',
  'json-colorizer': 'var () => {}',
  'lodash.clonedeep': 'var () => {}',
  'lodash.unset': 'var () => {}',
  './GoogleAssistantRepromptComponent': 'var {}',
  './JovoLogger': 'var { JovoLogger: function JovoLogger() {} }',
};
if (process.env.NODE_ENV === 'production') {
  externals['./JovoProxy'] = 'var { JovoProxy: function JovoProxy() {} }';
  externals['./BaseComponent'] = 'var { BaseComponent: function BaseComponent() {} }';
  externals['./BaseOutput'] = 'var { BaseOutput: function BaseOutput() {} }';
  externals['./AsyncJovo'] = 'var { AsyncJovo: function AsyncJovo() {} }';
  externals['./TestJovo'] = 'var { TestJovo: function TestJovo() {} }';
}

module.exports = {
  parallel: false,
  outputDir: './dist',
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
  configureWebpack:
    process.env.NODE_ENV === 'production'
      ? {
          plugins: [ignoreJovoCliPlugin],
          externals: {
            ...externals,
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

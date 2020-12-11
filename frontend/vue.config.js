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
    //     return options;
    //   });
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

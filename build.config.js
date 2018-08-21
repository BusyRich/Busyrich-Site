const config = {
  sass: {
    watchSrc: './src/scss/**',
    srcPath: './src/scss/',
    destPath: './public/css/',
    options: {
      outputStyle: 'compressed'
    }
  },
  js: {
    watchSrc: './src/js/**',
    destPath: './public/js',
    defaultPath: './src/js/default',
    nodepPath: './src/js/nodep/'
  }
};

module.exports = config;
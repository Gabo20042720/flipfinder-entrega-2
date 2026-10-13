// Jasmine + Karma + Webpack/Babel (JSX) con cobertura (karma-coverage + babel-plugin-istanbul).
// Si Chrome no se detecta automáticamente, define CHROME_BIN con la ruta del navegador.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-coverage')
    ],
    files: ['test/**/*.spec.jsx'],
    preprocessors: { 'test/**/*.spec.jsx': ['webpack'] },
    webpack: {
      mode: 'development',
      devtool: false,
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: { chrome: '100' } }], ['@babel/preset-react', { runtime: 'automatic' }]],
              plugins: [['istanbul', { exclude: ['test/**', '**/*.spec.jsx'] }]]
            }
          }
        }]
      }
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'text-summary' }, { type: 'text' }, { type: 'html', subdir: 'html' }]
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] }
    },
    singleRun: true
  });
};

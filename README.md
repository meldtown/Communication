# Packages

## ES6

* babel-core
* babel-loader
* babel-preset-es2015
* babel-register

## Tests

* mocha
* nyc
* jsdom
* jsdom-global
* jquery-mockjax
* ignore-styles

## WebPack

* webpack
* webpack-dev-server

### Commons

* extract-text-webpack-plugin

### Templates

* html-loader

### Styles

* autoprefixer
* node-sass
* postcss-loader
* sass-loader
* style-loader
* css-loader

# WebStorm configure tests runner

Extra Mocha options: `--require babel-register --require ignore-styles --require jsdom-global/register`

File patterns \ Test file patterns: `src/**/*.spec.js`
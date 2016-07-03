'use strict';

const webpack = require('webpack');
const path = require('path');

var args = process.argv; // Get command line arguments

var config = webpack({
  entry: path.join(__dirname, 'assets/js/index.js'), // Entry point for application
  output: {
    path: path.join(__dirname, 'public/js'), // exit directory
    filename: 'app.js' //exit file
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.js?$/, // Filetype handled by this loader
        include: path.join(__dirname, 'assets'), //only look in assets folder
        query: {
          presets: ['es2015','react']
        }
      }
    ]
  }
});

var logger = (err, stats) => {
  if(err)
       return console.log(err);
   console.log(stats.toString({errors: true, warnings: true, colors: true}));
   console.log('\nBundling Complete\n');
};

if(args.find((el) => el === 'w' || el === 'watch')) {
  config.watch({
    aggregateTimeout: 300, // Wait 300ms after changes before running
  }, logger);
} else {
  config.run(logger);
}

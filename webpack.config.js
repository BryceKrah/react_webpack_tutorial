'use strict';

const webpack = require('webpack');
const path = require('path');

webpack({
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
}, (err, stats) => {
  if(err)
       return console.log(err);
   console.log(stats.toString({errors: true, warnings: true, colors: true}));
   console.log('\nBundling Complete\n');
});

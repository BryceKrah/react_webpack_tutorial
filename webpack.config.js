'use strict';

const webpack = require('webpack');
const path = require('path');

var args = process.argv; // Get command line arguments

var config = {
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
  },
  plugins: []
}

// Add minification if minify or m is in command line args
if(args.find(el => el === 'm' || el === 'minify')) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
         screw_ie8: true,
         warnings: false
      },
      sourceMap: false // Do not produce a source map
     })
   );
} else {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.SourceMapDevToolPlugin({ // Maps source files to bundled files
      test: /\.js$/
    })
  )
}

var bundler = webpack(config);

var logger = (err, stats) => {
  if(err)
       return console.log(err);
   console.log(stats.toString({errors: true, warnings: true, colors: true}));
   console.log('\nBundling Complete\n');
};

// Add watcher if watch or w in command line arguments
if(args.find((el) => el === 'w' || el === 'watch')) {
  bundler.watch({
    aggregateTimeout: 300, // Wait 300ms after changes before running
  }, logger);
} else {
  bundler.run(logger);
}

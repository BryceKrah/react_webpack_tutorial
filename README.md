# Using React With Webpack

This is a brief tutorial on setting up the build tools for using react with webpack, including transpiling from es6 to es5
and a JSX transformer. It will also cover setting up a Sass precompiler and minifier.

### Requirements

* node ~ v5
* npm ~ v3
* git ~ v2

I set this up in Windows 7 with MINGW installed, and it should work on any Unix machine. You may have to show hidden files for it to work on windows.

### Getting started

Clone this repo, switch to the branch named step-0 and run npm install
```
git clone https://github.com/harryganz/react_webpack_tutorial.git
cd react_webpack_tutorial
git checkout step-0
npm install
```

Step 0 has the basic file structure and an express server, but nothing else. You can check if it is working by running ```npm start``` and
visiting http://localhost:3000/ in your browser.

### Step-0: Installing and configuring Webpack

The first thing you need to do is set up and configure web-pack. Webpack uses loaders, which take an input file(s), transform them, and produce an ouput file(s) and plugins which set options and do additonal transformations on top of the loader.

First, let's install webpack, the babel loader, and a couple babel plugins that allow us to compile and transpile react and ES6 code into browser compatible ES5.
```
npm install webpack babel-loader babel-core babel-preset-react babel-preset-es2015 --save
```
Next, we need to configure webpack. The best way to do this is to make a webpack.config.js file in the root of the project, and to set the paths to the entry file, output file, and loaders.
```
// webpack.config.js
'use strict';

const path = require('path');

module.exports = {
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
        include: path.join(__dirname, 'assets') //only look in assets folder
      }
    ]
  }
}
```

We need to also set up babel to use the es2015 and react plugins so the loader will work. Make a .babelrc file in the root of the project with the following json:
```
// .babelrc
{
  "presets": [
    "es2015",
    "react"
  ]
}
```
* Note: *You might need to enable hidden files on windows for this to work*

Let's test it out by making an index.js file in assets/js writing some es6 in it, and including it on the landing page (public/index.html):
```
// assets/js/index.js

const printMessage = () => `
You have successfully configured webpack and babel
`;

window.onload = () => {
  let $h3 = document.getElementsByTagName('h3')[0];
  $h3.innerHTML = printMessage();
}
```

Now let's add a script tag to the body public/index.html:
```
<!-- public/index.js -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>React Webpack Tutorial</title>
  <script src="/js/app.js" charset="utf-8"></script>
</head>
<body>
  <h3>Welcome to Step-0 of the React and Webpack Tutorial</h3>
</body>
</html>
```

Finally, let's run the bundler and restart the server:
```
node ./node_modules/webpack/bin/webpack.js
npm start
```

If you visit http://localhost:3000/ you should see the message: "You have successfully configured webpack and babel". If you don't, checkout step-1 ```git checkout step-1``` and see what it should look like.

**Optional: npm bundling script**

I imagine typing ```node ./node_modules/webpack/bin/webpack.js``` can get a bit annoying, and I will cover hot-loading in a bit, but we should probably write an npm script to handle it. Add the following to the scripts section of the package.json file in the root of the project:
```
// package.json
// Stuff
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "prestart": "npm install",
  "start": "node server.js",
  "bundle": "webpack" // <-- ADD THIS LINE
},
// More stuff
```

Now all you need to do is run ```npm run bundle``` to run the webpack bundler.

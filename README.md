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

### Step-1: Installing and configuring Webpack

The first thing you need to do is set up and configure web-pack. Webpack uses loaders, which take an input file(s), transform them, and produce an ouput file(s) and plugins which set options and do additonal transformations on top of the loader.

First, let's install webpack, the babel loader, and a couple babel plugins that allow us to compile and transpile react and ES6 code into browser compatible ES5.
```
npm install webpack babel-loader babel-core babel-preset-react babel-preset-es2015 --save
```
Next, we need to configure webpack. The best way to do this is to make a webpack.config.js file in the root of the project, and to set the paths to the entry file, output file, and loaders.
```
// webpack.config.js
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
        include: path.join(__dirname, 'assets') //only look in assets folder
      }
    ]
  }
}, (err, stats) => {
  if(err)
       return console.log(err);
   console.log(stats.toString({errors: true, warnings: true, colors: true}));
   console.log('\nBundling Complete\n');
});
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
node webpack.config.js
npm start
```

If you visit http://localhost:3000/ you should see the message: "You have successfully configured webpack and babel". If you don't, checkout step-1 ```git checkout step-1``` and see what it should look like.

**Optional: npm bundling script**

You can write an npm script to run the bundler automatically. At this point it doesn't really do anything special. Add the following to package.json:
```
// package.json
// Stuff
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "prestart": "npm install",
  "start": "node server.js",
  "bundle": "node webpack.config.js" // <-- ADD THIS LINE
},
// More stuff
```

Now all you need to do is run ```npm run bundle``` to run the webpack bundler.

### Step-2 Using Webpack with React

We already did all of the configuration we need to get webpack to work with React. The .babelrc file includes both the es2015 and react plugins. So all we need to do is install the react and react-dom plugins, write some components, and include them in our assets folder.

First, we need to install react and react-dom so we can use react functions in our source code:
```
npm install react react-dom --save
```

We should probably change our landing page to have a div that React can render to.
```
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>React Webpack Tutorial</title>
  <script src="/js/app.js" charset="utf-8"></script>
</head>
<body>
  <div id="container"></div>
</body>
</html>
```

Now, let's write a very simple component in React using ES6 syntax. I like to put my components in a sub-folder of assets/js called (shockingly) components, and I usually have a top-level component called something unimaginative, like app-component.js.

```
// assets/js/components/app-component.js

// CommonJS import statement and ES6
// destructuring assignment
// equivalent to var Component = require('react').Component
// var React = require('react')
import React, {Component} from 'react';

// Uses new ES6 class keyword to define a
// JS constructor that has React.Component as its
// Prototype
// In ES5: var App = React.createClass({});
class App extends Component {

  // Similar to componentWillMount in React.createClass
  constructor(props) {
    super(props);

    // Similar to getInitialState in React.createClass
    this.state = {
      currentColorIndex: 0,
      colors: ['#f00', '#0f0', '#00f', '#fff']
    }
  }

  // The 'this' scope is bound at runtime in user defined functions,
  // must be manually bound to prevent unexpected behavior
  changeColor() {
    let index = this.state.currentColorIndex % 4;
    this.refs.container.style.backgroundColor =  this.state.colors[index];
    this.setState({currentColorIndex: index+1});
  }

  // ES5 version this.render = function(){};
  render() {
    return (
      // JSX - compiles to Javascript
      <div
        onClick={ this.changeColor.bind(this) }
        ref="container"
        style={ {padding: '1em 0.5em', cursor: 'pointer'} }
      >
        <h3>Congratulations on getting webpack and react working</h3>
        <p> Click Me!</p>
      </div>
    );
  }
}

// Make App available to module loader
module.exports = App;
```

Now that we have a component, we should change our entry point (assets/index.js) to render it to the DOM.
```
// assets/index.js

// Import react and react-dom using CommonJS module loading and ES6
// Without a path, searches in node_modules
// destructuring assignment
import React from 'react'; // => var React = require('react')
import {render} from 'react-dom'; // => var render = require('react-dom').render

import App from './components/app-component'; // Local import

window.onload = function(){
  // Entry point, renders to DOM
  render (
    <App />,
    document.getElementById("container")
  );
};
```

Finally we are ready to run the bundler, and restart our server:
```
node webpack.config.js
npm start
```

Visit http://localhost:3000/, you should see a div that says "Congratulations on getting webpack and react working" and that changes colors when you click on it. If you don't, checkout step-2 ```git checkout step-2``` and find out where you went wrong.

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
```

The query property of each loader can be used to pass options to a loader. In this case, babel needs the es2015 preset to transpile es6 to es5, and the react preset to transplile JSX to javascript.

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

### Step-2: Using Webpack with React

We already did all of the configuration we need to get webpack to work with React. The query property includes both the es2015 and react presets. So all we need to do is install the react and react-dom plugins, write some components, and include them in our assets folder.

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

## Step-3: Watching for changes

Having to run the bundler manually after every change and restart the server can quickly become a chore, so using watchers is a very good idea.

First, install nodemon globally. It will restart the server every time a file changes in the application directory.
```
npm install -g nodemon
```
* *Some Linux distributions might require a ```sudo npm install -g nodemon```.*

Next, we need to add a watch option to our webpack config. The basic configuration remains the same, but now we run the watched version when the watch command line argument is present.

```
// webpack.config.js
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
        include: path.join(__dirname, 'assets') //only look in assets folder
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
```
Check that it is working by opening two new terminal windows. In one run nodemon, which restarts the server on changes:
```
nodemon
```
In the other run webpack with the watch option:
```
node webpack.config.js watch
```
Now it should re-run the bundler and restart the server every time a file is changed.

**Optional: Run npm script**

If you added the npm script in step-1, you can invoke the watcher thusly:
```
npm run bundle -- watch
```
It might also be a good idea to set up a dev server which will automatically run the bundler and restart the server every time you make a change to the source files.
Install nodemon and concurrently locally:
```
npm install nodemon concurrently --save-dev
```
Then, add the following script to your package.json, in the scripts section:
```
"dev": "concurrently \"npm run bundle -- w\" \"nodemon server.js\""
```
Now, if you run ```npm run dev```, you can edit the source files and the changes will be instantly loaded.

### Step 4: Adding Minification

Webpack has a built-in uglify plugin that allows you to minify code. This is great for production code, and usually reduces the javascript payload by more than half. It is easy to use, but requires us to change our webpack configuration yet again.
You can also add a source map to the development version, so the stacktrace shows you line numbers in the source files, instead of in the bundled file.

```
// webpack.config.js
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
```

Now, adding the command line argument "m" or "minify" will produce a minified js file, and leaving it out will bundle the file, but not minify it. To test it out, try
```
node webpack.config.js m
```
and take a look at the unreadable minified output in public/app.js.

If you have been making the npm scripts in the optional sections, try ```npm run bundle -- m```

### Step-5: Webpack With Sass

Webpack has a strange relationship with css. It only understands javascript, so you must require your css in javascript for it to use it, and, instead of writing to an external stylesheet, it actually writes the css into the bundled javascript, then loads it as an embedded stylesheet on the DOM when the page loads. This sounds insane, but there is actually some good reasoning behind it. While frameworks like React and Angular have been making front-end javascript more and more modular, external stylesheets have remained monolithic. This often leads to "dead code" as some styles are changed and others are no longer referenced. Webpack has resolved this by allowing you to import only the styles you need for a particular component.

First we need to install style-loader, css-loader, node-sass and sass-loader:
```
npm install style-loader css-loader node-sass sass-loader --save
```

Next we should change out webpack.config.js to use these loaders:
```
// webpack.config.js
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
      },
      {
        loaders: ["style", "css", "sass"], // Multiple loaders in one line
        test: /\.scss$/
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
```

Now that webpack can understand sass, let's add some sass to our project. Add a file called app-styles.scss to the components folder and put the following in it:
```
/assets/js/components/app-styles.scss
.clickable {
  padding: 1em;
  cursor: pointer;

  &:after {
    content: "Looks like you also got SASS working!";
  }
}
```

Then change the component to use new stylesheet:
```
// CommonJS import statement and ES6
// destructuring assignment
// equivalent to var Component = require('react').Component
// var React = require('react')
import React, {Component} from 'react';

// Stylesheet import using the css and styles loader
require("./app-styles.scss");

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
        className="clickable"
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

Notice the new require statement. It will put the styles contained in that file into an embedded stylesheet. Also, don't forget to add the className, "clickable", to the div in the render function.

If you already have the webpack watcher and nodemon running, you don't have to do anything else. Otherwise, run the following in separate console windows:
```
nodemon
node webpack.config.js watch
```

Upon visiting http://localhost:3000/, you should now see "Looks like you got SASS working" added to the previous message.
If you don't, checkout step-5 ```git checkout step-5``` and see what you might be missing.

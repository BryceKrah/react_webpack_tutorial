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

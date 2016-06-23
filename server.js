'use strict'; // es6 compatibility mode

const express = require('express'); // lightweight web-app framework
const morgan = require('morgan'); // Logging middleware
const path = require('path'); // built in path resolver

// Set-up app
const app = express();

// App wide-middlewares
app.use(express.static(path.join(__dirname, 'public'))); // Staticly serves public dir
app.use(morgan('dev')); // Log all requests

// Run server, note ES6 anonymous function syntax and let keyword
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Application started, running on port ', port);
});

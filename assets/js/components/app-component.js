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

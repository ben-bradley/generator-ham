(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AComponent = require('./components/aComponent');

React.render(React.createElement(AComponent, null), document.getElementById('app'));


},{"./components/aComponent":2}],2:[function(require,module,exports){
var AnotherComponent = require('./anotherComponent'),
  APIComponent = require('./apiComponent');

var AComponent = React.createClass({displayName: "AComponent",
  render: function() {
    return (
      React.createElement("div", null,
        React.createElement("h1", null, "REACTION!"),
        React.createElement("h2", null, "xxxxxxx"),
        React.createElement(AnotherComponent, null),
        React.createElement(APIComponent, null)
      )
    )
  }
});

module.exports = AComponent;


},{"./anotherComponent":3,"./apiComponent":4}],3:[function(require,module,exports){
var AnotherComponent = React.createClass({displayName: "AnotherComponent",
  render: function() {
    return (
      React.createElement("div", null,
        React.createElement("h3", null, "this is a child componentt")
      )
    )
  }
});

module.exports = AnotherComponent;


},{}],4:[function(require,module,exports){
var AnotherComponent = React.createClass({displayName: "AnotherComponent",
  render: function() {
    return (
      React.createElement("div", null,
        React.createElement("pre", null, "The api is: ", API)
      )
    )
  }
});

module.exports = AnotherComponent;


},{}]},{},[1]);

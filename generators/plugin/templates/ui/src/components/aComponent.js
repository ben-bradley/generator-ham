var AnotherComponent = require('./anotherComponent'),
  APIComponent = require('./apiComponent');

var AComponent = React.createClass({
  render: function() {
    return (
      <div>
        <h1>REACTION!</h1>
        <h2>xxxxxxx</h2>
        <AnotherComponent />
        <APIComponent />
      </div>
    )
  }
});

module.exports = AComponent;

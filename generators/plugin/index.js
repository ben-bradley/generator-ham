'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async(),
      cwd = this.destinationRoot();

    var dir = cwd.split('/').pop();

    var message = (dir === 'plugins') ?
      chalk.green('You\'re good to go!') :
      chalk.red('You\'re not in the plugins directory!');

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the glorious ' + chalk.red('H.A.M.') + ' generator!\r' + message
    ));

    var prompts = [{
      type: 'text',
      name: 'name',
      message: 'What would you like to call your HAM App?',
      default: 'myApp'
    }];

    this.prompt(prompts, function (props) {

      this.props = props;

      done();
    }.bind(this));
  },

  writing: {
    plugin: function () {
      var dir = this.props.name + '/';
      this.mkdir(dir);

      this.template('_package.json', dir + 'package.json');

      this.copy('index.js', dir + 'index.js');

      this.directory('config', dir + 'config');
      this.directory('test', dir + 'test');
      this.directory('ui', dir + 'ui');

      this.mkdir(dir + 'logs');
      this.mkdir(dir + 'controllers');
      this.mkdir(dir + 'routes');

      this.template('routes/_api.js', dir + 'routes/api.js');
      this.template('routes/_ui.js', dir + 'routes/ui.js');
    }
  }
});

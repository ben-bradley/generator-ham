var Hapi = require('hapi'), // for reasons
  config = require('config'), // for app config
  Assets = require('./assets'), // for bower assets
  glob = require('glob'), // for dynamically reading plugins
  args = require('argify'), // for command-line args
  path = require('path'), //
  Lout = require('lout'), // for API documentation
  Good = require('good'), // for logging
  GoodFile = require('good-file');

// load the config files in each plugin
var ENV = process.env.NODE_ENV || 'default';
glob.sync('./plugins/*/config/' + ENV + '.json').forEach(function (file) {
  var pluginConfig = require(file);
  if (Object.keys(pluginConfig).length !== 1)
    throw new Error('Plugin config must have 1 top-level property: ' + file);
  config.util.extendDeep(config, pluginConfig);
});

var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    },
    router: {
      stripTrailingSlash: true
    }
  }
});

// init the API
server.connection({
  port: config.api_port,
  labels: ['api']
});

// init the UI
server.connection({
  port: config.ui_port,
  labels: ['ui']
});

// store the config for reference
server.app.config = config;

var excludes = (args.excludes) ? args.excludes.split(',') : false;
var includes = (args.includes) ? args.includes.split(',') : false;

var reporters = [];

// register each plugin and configure a Good reporter for each
glob.sync(__dirname + '/plugins/*/index.js').forEach(function (file) {
  var plugin = require(file),
    name = path.dirname(file).split('/').pop(),
    load = true;

  if (includes && includes.indexOf(name) === -1)
    load = false;
  else if (excludes && excludes.indexOf(name) > -1)
    load = false;

  if (load)
    server.register({
      register: plugin
    }, {
      routes: {
        prefix: '/' + name
      }
    }, function (err) {
      if (err)
        throw new Error(err);
      reporters.push({
        reporter: GoodFile,
        args: [
          path.dirname(file) + '/logs/' + name + '.log', {
            log: ['plugins', name]
          }
        ]
      });
      if (!config.test)
        console.log('Plugin loaded: ' + name);
    });
  else
    console.log('Plugin NOT loaded: ' + name);
});

server.register({
  register: Assets
}, function(err) {
  if (err)
    throw new Error(err);
  if (!config.test)
    console.log('Plugin loaded: Assets');
});

// register Lout for the /docs routes
server.register({
  register: Lout
}, function (err) {
  if (err)
    throw new Error(err);
  if (!config.test)
    console.log('Plugin loaded: Lout');
});

// register Good for logging
if (reporters.length)
  server.register({
    register: Good,
    options: {
      opsInterval: 1000,
      reporters: reporters
    }
  }, function (err) {
    if (err)
      throw new Error(err);
    if (!config.test)
      console.log('Plugin loaded: Good');
  });

// In every environment except test, fire up the server
if (!config.test)
  server.start(function (err) { // oink
    if (err)
      throw new Error(err);
    console.log('Server started!');
    server.connections.forEach(function (cn) {
      console.log({
        labels: cn.settings.labels,
        uri: cn.info.uri
      });
    });
  });

// Export the server for testing
module.exports = server;

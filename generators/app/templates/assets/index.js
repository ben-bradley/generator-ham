module.exports.register = function (server, options, next) {

  // select the UI server
  var ui = server.select('ui');

  ui.route({
    method: 'get',
    path: '/assets/{p*}',
    config: {
      description: 'The root route for handling request for 3rd party libs',
      handler: {
        directory: {
          path: __dirname + '/bower_components'
        }
      }
    }
  });

  next();
}

module.exports.register.attributes = {
  pkg: require('./package.json')
}

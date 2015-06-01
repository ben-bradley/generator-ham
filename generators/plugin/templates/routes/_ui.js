var Handlebars = require('handlebars');

var PATHS = {
  dist: __dirname + '/../ui/dist'
}

module.exports = function(server, options) {
  var ui = server.select('ui'),
    api = server.select('api'),
    name = '<%= props.name %>';

  ui.views({
    engines: {
      html: Handlebars
    },
    path: PATHS.dist,
    isCached: !server.app.config.development
  });

  ui.route({
    method: 'get',
    path: '/', // ends up being "/<%= props.name %>"
    config: {
      description: 'Serve the <%= props.name %> index.html',
      handler: function(request, reply) {
        reply.view('index', {
          title: '<%= props.name %> UI',
          someContent: 'This is templated content',
          appFile: (server.app.config.development) ? name + '/app.js' : name + '/app.min.js',
          api: api.info.uri
        });
      }
    }
  });

  ui.route({
    method: 'get',
    path: '/{p*}',
    config: {
      description: 'Path to serve the <%= props.name %> assets',
      handler: {
        directory: {
          path: PATHS.dist
        }
      }
    }
  });
}

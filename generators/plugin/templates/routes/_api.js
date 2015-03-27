var _ = require('lodash');

var properties = ['method', 'path', 'info', 'headers', 'payload', 'query'];

module.exports = function(server, options) {

  // select the API server
  var api = server.select('api');

  // Add a route to the API
  api.route({
    method: '*', // all methods
    path: '/{p*}', // all routes beginning with "/<%= props.name %>"
    config: {

      // this is the fn that finally deals with the request
      handler: function (request, reply) {
        var response = {
          ts: new Date(),
          params: (request.params.p) ? request.params.p.split('/') : []
        };

        // this is how you can log things
        server.log('<%= props.name %>', 'message here')

        reply(_.assign(response, _.pick(request, properties)));
      },

      // This appears in the "/docs" route
      description: 'Returns details about the request.'
    }
  });
}

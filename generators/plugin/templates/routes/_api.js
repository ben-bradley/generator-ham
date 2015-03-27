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
        // this is how you can log things
        server.log('<%= props.name %>', 'message here');

        reply({
          ts: new Date()
        });

      },

      // This appears in the "/docs" route
      description: 'Returns details about the request.'
    }
  });
}

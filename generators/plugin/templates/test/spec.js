var should = require('should'),
  request = require('supertest'),
  config = require('config');

var API = request('http://localhost:' + config.api_port), // for calls to the API
  UI = request('http://localhost:' + config.ui_port); // for calls to the UI

module.exports = function(server) {

  describe('Loopback', function () {

    describe('The API', function () {

      // start the server for each test
      beforeEach(function(done) {
        server.start(done);
      });

      // drop the server after each test
      afterEach(function(done) {
        server.stop(done);
      });

      // This is what a test should/can look like
      it('GET /loopback should return data', function (done) {
        API.get('/loopback')
          .expect(200)
          .expect(function (res) {
            var json = res.body;
            (json).should.be.an.Object;
            (json).should.have.properties(['headers', 'info', 'method', 'params', 'path', 'payload', 'query', 'ts']);
            (json.path).should.equal('/loopback');
            (json.method).should.equal('get');
          })
          .end(done);
      });

    }); // end REST API

  });

}

var glob = require('glob');

var server = require('..');

glob.sync(__dirname+'/../plugins/*/test/*.js').forEach(function(file) {
  require(file)(server);
});

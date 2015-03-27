var glob = require('glob');

module.exports.register = function(server, options, next) {

  glob.sync(__dirname+'/routes/*.js').forEach(function(file) {
    require(file)(server, options);
  });

  next();
}

module.exports.register.attributes = {
  pkg: require('./package.json')
}

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  glob = require('glob'),
  path = require('path'),
  browserify = require('browserify'),
  sourcemaps = require('gulp-sourcemaps'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  watchify = require('watchify'),
  reactify = require('reactify'),
  nodemon = require('gulp-nodemon'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify');

gulp.task('default', ['html', 'bundle', 'nodemon']);

var PATHS = {
  plugins: __dirname + '/plugins/*',
  src: __dirname + '/plugins/*/ui/src',
  dist: __dirname + '/plugins/*/ui/dist'
}

// Compile JSX into JS
gulp.task('bundle', function () {
  glob.sync(PATHS.src + '/app.js').forEach(bundler);
});
function bundler(file) {
  var watchArgs = watchify.args;
  watchArgs.transform = [reactify];
  var Bundler = watchify(browserify(watchArgs));
  var uiRoot = path.dirname(file) + '/..';
  Bundler.add(file);

  function bundle() {
    console.log('Bundling: ' + file);
    return Bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest(uiRoot + '/dist'));
  };
  Bundler.on('update', bundle);
  bundle();
}

// Copy an HTML file into /dist
gulp.task('html', function () {
  glob.sync(PATHS.src + '/*.html').forEach(html);
});
function html(file) {
  var uiRoot = path.dirname(file) + '/..';
  gulp.src(file)
    .pipe(gulp.dest(uiRoot + '/dist'));
}

// Uglify/min a .js file
gulp.task('uglify', function () {
  glob.sync(PATHS.dist + '/app.js').forEach(min);
});
function min(file) {
  var uiRoot = path.dirname(file) + '/..';
  gulp.src(file)
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(uiRoot + '/dist'));
}

// Monitor the app
gulp.task('nodemon', function () {
  // watch for new HTMLs and publish them
  gulp.watch(PATHS.src + '/*.html', function (ev) {
    html(ev.path);
  });

  // watch for new dist/app.js and min them
  gulp.watch(PATHS.dist + '/app.js', function(ev) {
    min(ev.path);
  });

  // start the server
  nodemon({
    env: process.ENV,
    script: 'index.js',
    args: process.argv.slice(2),
    watch: [
      'index.js',
      PATHS.plugins + '/index.js',
      PATHS.dist + '/*.html',
      'plugins/*/routes/*.js',
      'plugins/*/controllers/*.js'
    ]
  });
});

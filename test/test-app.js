'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('ham:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({
        'skip-install': true
      })
      .withPrompt({
        name: 'myHam',
        author: 'Wilbur'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'assets/index.js',
      'assets/package.json',
      'assets/logs/assets.log',
      'assets/bower_components',
      'config/default.json',
      'config/production.json',
      'config/release.json',
      'config/test.json',
      'test/spec.js',
      'bower.json',
      'package.json',
      '.bowerrc',
      '.gitignore',
      '.travis.yml',
      'gulpfile.js',
      'index.js',
      'readme.md'
    ]);
  });
});

describe('ham:plugin', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/plugin'))
      .inDir(path.join(os.tmpdir(), './temp-test/myHam/plugins'))
      .withOptions({
        'skip-install': true
      })
      .withPrompt({
        name: 'myHamApp'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'myHamApp/config/default.json',
      'myHamApp/config/production.json',
      'myHamApp/config/test.json',
      'myHamApp/controllers/',
      'myHamApp/routes/api.js',
      'myHamApp/routes/ui.js',
      'myHamApp/test/spec.js',
      'myHamApp/ui/src/components/aComponent.js',
      'myHamApp/ui/src/components/anotherComponent.js',
      'myHamApp/ui/src/components/apiComponent.js',
      'myHamApp/ui/src/app.js',
      'myHamApp/ui/src/index.html',
      'myHamApp/ui/dist/index.html',
      'myHamApp/ui/dist/app.js',
      'myHamApp/ui/dist/app.min.js',
      'myHamApp/index.js',
      'myHamApp/package.json'
    ]);
  });
});

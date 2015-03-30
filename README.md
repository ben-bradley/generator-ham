# generator-ham [![Build Status](https://secure.travis-ci.org/ben-bradley/generator-ham.png?branch=master)](https://travis-ci.org/ben-bradley/generator-ham)

> A [Yeoman](http://yeoman.io) generator for quickly building modular micro-apps on a Gulp, Hapi, Mongoose, Bower, Browserify, React framework.

## "Modular micro-wutsits"?

I found that I was frequently being asked to write apps to solve short or no-notice problems and I needed a way to quickly spin up new services.

My first approach was to build an Express server for each app and strap a UI to it.  This worked, but I found that I ran into trouble when I had to try and keep the hosts and ports straight.  I tried spinning up a reverse proxy to manage this, but that quickly became more painful than I wanted to deal with.

Then I found Hapi and was blown away by it's plugin architecture.  This framework made it easy to spin up one server, and write self-contained micro-app plugins.  Now I maintain one codebase, one server, and I can focus on writing the micro-app instead of the server framework to get it online.

## How It Works

Currently, there are two major components to the Ham Generator:

1. Server `yo ham`
2. Plugin `yo ham:plugin`

### Server `yo ham`

This will generate the server framework needed to get your micro-apps online.  When it's done running, you should have a folder structure as follows:

```
/
  assets/
    bower_components/
    logs/
    index.js
    package.json
  config/
    default.json
    production.json
    release.json
    test.json
  plugins/
  test/
    spec.js
  .bowerrc
  .gitignore
  .travis.yml
  bower.json
  gulpfile.js
  index.js
  package.json
  readme.md
```

#### 'assets/`

Let me be very clear, I am __not__ good at UI/UX.  I rely very heavily on the work of the good folks who make Bootstrap and UIKit to make my micro-apps look good.

This generator is NOT optimized for UI work.  If you have ideas for how to make that part better, please let me know with a PR.

The `assets` folder is where I dump all the common, 3rd party UI libraries like JQuery, React, Bootstrap, etc...  If you do a `bower install ...`, this is where it goes.

Calling these assets in your HTML is done like this:

```html
<link  href="/assets/font-awesome/css/font-awesome.css" rel="stylesheet">
<script src="/assets/jquery/dist/jquery.min.js"></script>
<script src="/assets/react/react.min.js"></script>
```

#### `config/`

This is where you can store your server config data.  Each plugin will also have a config folder that gets added to the config object so you can keep each micro-app config isolated from the others.  This is where you would put config data that applies to the server framework instead of each individual plugig/micro-app.

Invoking a particular config is done at run-time by specifing the `NODE_ENV=` environment variable.

#### `plugins/`

Here's where the good stuff goes.  Once you get your server configured, you should jump into this folder and run `yo ham:plugin` to fire up your first micro-app, but I'll get into more detail on that later.

#### `test/`

Similarly to the `config/` framework, the `test/` folder here will also call into each plugin's `test/` folder and execute any tests you have written there.

#### The other top-level files

* `.bowerrc` - Points Bower at the `assets/bower_components` directory.
* `.gitignore` - Makes Git not pay attention to the usual suspects.
* `.travis.yml` - Having actual tests to validate your stuff is sooooo helpful.  You should do it.
* `bower.json` - I've got React listed in the default dependencies since that's the front-end framework I'm using at the moment, but switching it out with your own should be pretty straight-forward.
* `gulpfile.js` - This is what makes the magic happen.  You should crack it open and have a look.  If you know how it can be made better, please let me know.
* `index.js` - This is what pulls the strings on the server framework.
* `package.json` - The standard NPM package info file.
* `readme.md` - You should also write up a good readme.md so that when your users ask you to tweak that micro-app that you wrote for them 6 months ago, you can context-shift like a boss.

### Plugins/Micro-Apps `yo ham:plugin`

This `yo` command has to be run from the `plugins/` directory.  When it's done, you'll have the following folder structure (assume that I named the plugin/micro-app `appA`):

```
/plugins/
  appA/
    config/
    controllers/
    logs/
    routes/
    test/
    ui/
      dist/
        app.js
        app.min.js
        index.html
      src/
        components/
          aComponent.js
          anotherComponent.js
          apiComponent.js
        app.js
        index.html
    index.js
    package.json
```

#### `config/`

Your plugin will likely require some config data which you can store here.  When the server is started, whatever `NODE_ENV` variable is specified will be the config file loaded.

You can call the data from within your micro-app like this:

```javascript
// /plugins/appA/config/default.json
{
  "appA": {
    "foo": "bar"
  }
}
```

```javascript
// /plugins/appA/config/production.json
{
  "appA": {
    "foo": "baz"
  }
}
```

```javascript
// /plugins/appA/index.js
var config = require('config')
console.log("foo = " + config.appA.foo);
```

```shell
$ iojs ./index.js
foo = bar
$ NODE_ENV=production iojs ./index.js
foo = baz
```

#### `controllers/`

This is where I keep my data-access logic.  Typically, I use Mongoose to interact with the data so I'll usually have a `models/` folder along side this one.  The scripts in this folder export Promises for data that the `routes/` will call to present data to the user/UI.

#### `logs/`

Each plugin can produce a logfile that is stored here.  You can write to the logs like this:

```javascript
server.log('appA', 'message here');
```

#### `routes/`

The scripts in this folder largely line up with the `controllers/` folder, but their concern is creating the URL and doing error-handling for what the `controllers/` do.

```javascript
// /plugins/appA/routes/api.js
module.exports = function(server, options) {
  var api = server.select('api');
  api.route({
    method: 'get',
    path: '/', // the route ends up being "http://host/appA/"
    handler: function(request, reply) {
      reply({
        foo: 'bar'
      });
    }
  });
}
```

#### `test/`

You should really, really write tests.  It will save you sooooooooooo much headache when you get six plugins fired up and interacting.

#### `ui/`

This folder is where the plugin-specific UI code goes.  I built it this way so that each plugin is self-contained and as modular internally as possible.  You develop in the `ui/src/` folder and Gulp will package and update the `ui/dist` folder with the good stuff.

The Gulp script doesn't auto-reload the browser, so you'll have to do that yourself, but it will compile and browserify the JSX for you.

## License

MIT

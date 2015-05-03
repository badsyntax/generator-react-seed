'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var htmlWiring = require('html-wiring');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.green('React-Seed') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'name',
      message: 'What is the name of your project?',
      default: 'example-react-project'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      var done = this.async();

      var msg = 'Generating from ' + 'Generator Boilerplate'.cyan + ' v' + this.pkg.version.cyan + '...';
      this.log.writeln(msg);

      var ignores = [
        '.git',
        'node_modules'
      ];

      var root = path.join(__dirname, '..', 'node_modules', 'react-seed');

      glob('**/*', {
        nodir: true,
        cwd: root,
        dot: true
      }, function(err, files) {
        files.forEach(function(file) {
          var parts = file.split(path.sep);
          var ignoreFile = parts.reduce(function(found, part) {
            return found || ignores.indexOf(part) !== -1
          }, false);
          if (ignoreFile) { return; }
          this.fs.copy(
            path.join(root, file),
            this.destinationPath(file)
          );
          done();
        }, this);
      }.bind(this));
    }
  },

  install: function () {
    this.installDependencies({
      bower: false,
      npm: true
    });
  }
});

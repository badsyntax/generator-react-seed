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
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      default: 'example-react-project'
    }, {
      type: 'input',
      name: 'description',
      message: 'Give a brief description of your project',
      default: 'Example description'
    }, {
      type: 'input',
      name: 'repository',
      message: 'Repository URL',
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      var done = this.async();

      var ignores = [
        '.git',
        'package.json',
        'node_modules'
      ];

      var root = path.join(__dirname, '..', 'node_modules', 'react-seed');

      glob('**/*', {
        nodir: true,
        cwd: root,
        dot: true
      }, onFindFiles.bind(this));

      function onFindFiles(err, files) {
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
        }, this);
        this.fs.copy(
          this.templatePath('_package.json'),
          this.destinationPath('package.json')
        );
        var pkg = require(this.templatePath('_package.json'));
        pkg.name = this.props.name;
        pkg.description = this.props.description;
        pkg.repository = this.props.repository;
        this.write('package.json', JSON.stringify(pkg, null, 2));
        done();
      }
    }
  },

  install: function () {
    this.installDependencies({
      bower: false,
      npm: true
    });
  }
});

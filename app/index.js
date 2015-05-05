'use strict';

require('chalk');

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var path = require('path');
var glob = require('glob');
var util = require('util');
var rimraf = require('rimraf');
var async = require('async');
var objectAssign = require('object-assign');

var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

updateNotifier({pkg: pkg}).notify();

module.exports = yeoman.generators.Base.extend({

  initializing: function () {

    this.pkg = pkg;

    this.branches = [{
      name: 'master',
      promptText: 'None'
    }, {
      name: 'feature/react-router',
      promptText: 'react-router'
    }, {
      name: 'feature/material-ui',
      promptText: 'material-ui'
    }];

    this.on('end', function() {
      this.log('Run `npm start` to start the application.');
    });
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + 'React-Seed'.green + ' generator!'
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
    }, {
      type: 'list',
      name: 'branch',
      message: 'What additional features do you want?',
      choices: this.branches.map(function(branch) {
        return branch.promptText;
      }),
      default: 0
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

      async.waterfall([
        rimraf.bind(rimraf, this.templatePath()),
        spawnGitClone.bind(this),
        glob.bind(glob, '**/*', {
          nodir: true,
          cwd: this.templatePath(),
          dot: true
        }),
        onFindFiles.bind(this),
        writePackageJson.bind(this)
      ], done);

      function spawnGitClone(next) {

        this.log('Cloning seed project from github...');

        var branch = this.branches.filter(function(branch) {
          return (branch.promptText === this.props.branch);
        }.bind(this))[0];

        var url = 'https://github.com/badsyntax/react-seed.git';

        var cmd = util.format(
          'git clone --depth=1 -b %s %s %s',
          branch.name, url, this.templatePath()
        );

        var parts = cmd.split(' ');
        var args = parts.slice(1);
        var git = this.spawnCommand(parts[0], args);

        git.on('error', next);
        git.on('close', function (code) {
          if (code !== 0) { return next('child process exited with code ' + code); }
          next(null);
        });
      }

      function onFindFiles(files, next) {
        files.forEach(copyFile.bind(this));
        next();
      }

      function copyFile(file) {
        var parts = file.split(path.sep);
        var ignoreFile = parts.reduce(function(found, part) {
          return (found || ignores.indexOf(part) !== -1);
        }, false);
        if (ignoreFile) { return; }
        this.copy(file, file);
      }

      function writePackageJson(next) {

        var pkg = require(this.templatePath('package.json'));

        objectAssign(pkg, {
          name: this.props.name,
          version:  '0.0.0',
          description: this.props.description,
          repository: this.props.repository
        });

        this.write('package.json', JSON.stringify(pkg, null, 2));
        next();
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

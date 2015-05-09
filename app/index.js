'use strict';

require('chalk');

var yeoman = require('yeoman-generator');
var path = require('path');
var glob = require('glob');
var util = require('util');
var rimraf = require('rimraf');
var async = require('async');
var objectAssign = require('object-assign');
var validateNpmPackageName = require('validate-npm-package-name');
var gitConfig = require('git-config');
var githubApi = require('octonode');
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

module.exports = yeoman.generators.Base.extend({

  initializing: function () {

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

    this.log('Welcome to the ' + 'React-Seed'.green + ' generator!');

    this.on('end', function() {
      this.log('Finished generating the project!'.green);
      this.log('Run `npm start` to start the application.');
    });

    this.checkForUpdates();
  },

  checkForUpdates: function() {
    var notifier = updateNotifier({
      pkg: pkg
    });
    notifier.notify({ defer: false });
  },

  prompting: function () {
    var done = this.async();

    async.waterfall([
      getGithubUsername.bind(this),
      runPrompts.bind(this)
    ], done);

    function getGithubUsername(next) {

      this.log.write('Loading github user data...'.yellow);

      var config = gitConfig.sync();
      var email = config.user.email;

      var clientApi = githubApi.client();
      var ghSearchApi = clientApi.search();

      ghSearchApi.users({
        q: email
      }, function(err, users) {
        this.log('done.'.yellow);
        next(null,
          !err && users.items.length > 0 ?
          users.items[0].login :
          'your-github-user'
        );
      }.bind(this));
    }

    function runPrompts(username, next) {
      var prompts = [{
        type: 'input',
        name: 'name',
        message: 'Name of the project',
        validate: function(input) {
          var valid = validateNpmPackageName(input);
          return (valid.validForNewPackages && valid.validForNewPackages);
        },
        default: 'example-react-project'
      }, {
        type: 'input',
        name: 'description',
        message: 'Brief description of the project',
        default: 'Example description'
      }, {
        type: 'input',
        name: 'repository',
        message: 'Repository',
        default: function(answers) {
          return username + '/' + answers.name;
        }
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
        next(null);
      }.bind(this));
    }
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
        removeTemplateFiles.bind(this),
        cloneProject.bind(this),
        copyFiles.bind(this),
        writePackageJson.bind(this)
      ], done);

      function removeTemplateFiles(next) {
        rimraf(this.templatePath(), next);
      }

      function cloneProject(next) {

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

      function copyFiles(next) {
        glob('**/*', {
          nodir: true,
          cwd: this.templatePath(),
          dot: true
        }, function onFindFiles(err, files) {
          if (err) { return next(err); }
          files.forEach(copyFile.bind(this));
          next();
        }.bind(this));
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

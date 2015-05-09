# generator-react-seed [![Build Status](https://travis-ci.org/badsyntax/generator-react-seed.svg?branch=master)](https://travis-ci.org/badsyntax/generator-react-seed)

> Seed project for React apps using ES6 & webpack

This yeoman generator will install base projet files from my [react-seed](https://github.com/badsyntax/react-seed) project. You have the option of installing the following features:

* react-router
* material-ui

## Getting Started

Ensure yeoman is installed:

```bash
npm install -g yo
```

Install generator-react-seed from npm:

```bash
npm install -g generator-react-seed
```

Finally, initiate the generator:

```bash
yo react-seed
```

## Files

```
├── CHANGELOG.md
├── LICENSE
├── README.md
├── app
│   ├── actions
│   │   └── AppActions.js
│   ├── app.jsx
│   ├── components
│   │   ├── App
│   │   │   ├── App.jsx
│   │   │   └── _App.scss
│   │   ├── Body
│   │   │   ├── Body.jsx
│   │   │   └── _Body.scss
│   │   └── Footer
│   │       ├── Footer.jsx
│   │       ├── _Footer.scss
│   │       └── __tests__
│   │           └── Footer-test.js
│   ├── constants
│   │   └── AppConstants.js
│   ├── dispatcher
│   │   └── AppDispatcher.js
│   ├── favicon.ico
│   ├── index.html
│   ├── scss
│   │   ├── _base.scss
│   │   ├── _functions.scss
│   │   ├── _mixins.scss
│   │   ├── _toolkit.scss
│   │   └── app.scss
│   ├── stores
│   │   ├── BaseStore.js
│   │   ├── ItemsStore.js
│   │   └── __tests__
│   │       └── BaseStore-test.js
│   └── util
│       └── WebAPI.js
├── dev-server.js
├── jest-preprocessor.js
├── package.json
└── webpack.config.js
```

## License

Copyright (c) 2015 Richard Willis

MIT (http://opensource.org/licenses/MIT)

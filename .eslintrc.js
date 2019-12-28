module.exports = {
  "env": {
    "amd": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "models": "readonly",
    "modelNames": "false",
    "packageHelper": "readonly",
    "SERVER_PUBLIC_IP": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "varsIgnorePattern": "^_"
    }]
  }
};
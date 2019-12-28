module.exports = {
  "env": {
    "amd": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "SharedArrayBuffer": "readonly",
    "models": "readonly",
    "packageHelper": "readonly",
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "indent": ["error", 2, {
      "VariableDeclarator": {
        "var": 2,
        "let": 2,
        "const": 3
      }
    }],
    "indent": ["error", 2, {
      "ArrayExpression": "first"
    }],
    "indent": ["error", 2, {
      "ImportDeclaration": "first"
    }],
    "indent": ["error", 2, {
      "flatTernaryExpressions": true
    }],
    "no-console": 2,
    "no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "varsIgnorePattern": "^_"
    }]
  }
};
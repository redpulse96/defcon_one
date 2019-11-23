/* jshint node: true */

const packageHelper = {
  DIRNAME: __dirname,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  LOGS_DIR: process.env.LOGS_DIR,
  MODEL_CONFIG_DIR: __dirname + '/datasources/index',
  SERVER_HOST_IP: process.env.SERVER_HOST_IP || '0.0.0.0',

  passport: require('passport'),
  passport_local: require('passport-local'),
  publicIp: require('public-ip'),
  fs: require('fs'),
  http: require('http'),
  express: require('express'),
  express_session: require('express-session'),
  bodyParser: require('body-parser'),
  cookieParser: require('cookie-parser'),
  mysql2: require('mysql2'),
  sequelize: require('sequelize'),
  bunyan: require('bunyan'),
  btoa: require('btoa'),
  moment: require('moment'),
  lodash: require('lodash'),
  async: require('async'),
  createError: require('http-errors'),
  path: require('path'),
  winston: require('winston'),
  request: require('request'),
  debug: require('debug'),
  jsonwebtoken: require('jsonwebtoken'),
  mongoose: require('mongoose'),
  bcrypt: require('bcryptjs')
};

module.exports = packageHelper;
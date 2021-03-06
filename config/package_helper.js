/* jshint node: true */
const TWILIO = require('../public/javascripts/constants').TWILIO;

const packageHelper = {
  DIRNAME: __dirname,
  LOGS_DIR: process.env.LOGS_DIR,
  MODEL_CONFIG_DIR: __dirname + '/datasources/index',
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SERVER_HOST_IP: process.env.SERVER_HOST_IP || '0.0.0.0',

  async: require('async'),
  bcrypt: require('bcryptjs'),
  bodyParser: require('body-parser'),
  btoa: require('btoa'),
  bunyan: require('bunyan'),
  cookieParser: require('cookie-parser'),
  cors: require('cors'),
  createError: require('http-errors'),
  debug: require('debug'),
  express: require('express'),
  express_session: require('express-session'),
  figlet: require('figlet'),
  fs: require('fs'),
  http: require('http'),
  http_status_codes: require('http-status-codes'),
  jsonwebtoken: require('jsonwebtoken'),
  lodash: require('lodash'),
  moment: require('moment'),
  mongoose: require('mongoose'),
  mysql2: require('mysql2'),
  passport: require('passport'),
  passport_local: require('passport-local'),
  path: require('path'),
  publicIp: require('public-ip'),
  request: require('request'),
  sequelize: require('sequelize'),
  twilio: require('twilio')(TWILIO.ACCOUNTSID, TWILIO.AUTHTOKEN),
  winston: require('winston')
};

module.exports = packageHelper;
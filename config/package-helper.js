/* jshint node: true */

const DIRNAME = __dirname;
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql2 = require('mysql2');
const sequelize = require('sequelize');
const bunyan = require('bunyan');
const btoa = require('btoa');
const moment = require('moment');
const _ = require('lodash');
const async = require('async');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const request = require('request');
const debug = require('debug');

exports.DIRNAME = DIRNAME;
exports.NODE_ENV = NODE_ENV;
exports.PORT = PORT;

exports.http = http;
exports.bunyan = bunyan;
exports.btoa = btoa;
exports.moment = moment;
exports._ = _;
exports.async = async;
exports.request = request;
exports.createError = createError;
exports.express = express;
exports.bodyParser = bodyParser;
exports.mysql2 = mysql2;
exports.sequelize = sequelize;
exports.path = path;
exports.cookieParser = cookieParser;
exports.logger = logger;
exports.debug = debug;

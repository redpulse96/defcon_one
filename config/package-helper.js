/* jshint node: true */
'use strict'

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const http = require('http');
const bunyan = require('bunyan');
const btoa = require('btoa');
const moment = require('moment');
const _ = require('lodash');
const async = require('async');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const request = require('request');

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
exports.path = path;
exports.cookieParser = cookieParser;
exports.logger = logger;
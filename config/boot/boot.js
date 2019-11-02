#!/usr/bin/env node

/**
 * Module dependencies.
 */
const packageHelper = require('../package_helper');
global.packageHelper = packageHelper;

let app = require('../server/server');
let debug = packageHelper.debug('defcon-one:server');

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = val => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  let addr = server.address();
  let bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(packageHelper.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

// let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port);
app.on('error', onError);
app.on('listening', onListening);

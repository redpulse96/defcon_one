#!/usr/bin/env node

global.packageHelper = require('./config/package_helper');
global.models = require('./config/datasources/index');
global.Op = require('./config/datasources/operator_aliasing');

const app = require('./config/server');
const debug = packageHelper.debug('defcon-one:server');
const figlet = packageHelper.figlet;

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
 * Get port from environment and store in Express.
 */
const port = normalizePort(packageHelper.PORT || '5000');
app.set('port', port);
app.set('ip', packageHelper.SERVER_HOST_IP);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = error => {
  console.error('there was an error while connecting to the server');
  console.error(error);
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
  let addr = app.get('ip');
  let bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);

  console.log('Listening on ' + bind);
  console.log('server is listening on ', bind);
  console.log(figlet.textSync('Defcon One'));
}

models.sequelize.authenticate()
  .then(() => {
    /**
     * Listen on provided port, on all network interfaces.
     */
    app.listen(port, err => {
      if (err) throw onError(err);
      onListening();
    });
  });

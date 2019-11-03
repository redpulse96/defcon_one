
const packageHelper = require('../package_helper');
const indexRouter = require('../../routes/index');
const apiRoutes = require('../../routes/api-routes');

global.packageHelper = packageHelper;

const app = packageHelper.express();
const log = require('../log_config').logger('defcon_one_server');

// view engine setup
app.set('views', packageHelper.path.join(packageHelper.DIRNAME, '../views'));
app.set('view engine', 'ejs');

app.use(packageHelper.express.json());
app.use(packageHelper.express.urlencoded({
  extended: false
}));
app.use(packageHelper.bodyParser.json());
app.use(packageHelper.bodyParser.urlencoded({
  extended: true
}));
app.use(packageHelper.cookieParser());
app.use(packageHelper.express.static(packageHelper.path.join(packageHelper.DIRNAME, '../public')));

app.use('/', indexRouter);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler 
app.use((req, res, next) => {
  next(packageHelper.createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

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

/**
 * Event listener for HTTP server "error" event.
 */
const onError = error => {
  log.error('there was an error while connecting to the server');
  log.error(error);
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
  packageHelper.debug('Listening on ' + bind);
  log.info('server is listening on ', bind);
}

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port);
app.on('error', onError);
app.on('listening', onListening);

//DB Connections
require('../connections');

module.exports = app;

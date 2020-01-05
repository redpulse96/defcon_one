const indexRoutes = require('../routes/index');
const userRoutes = require('../routes/users');
const apiRoutes = require('../routes/api');
const apiLogger = require('./middleware/log_middleware');
const utils = require('../controllers/utility/utils');

const app = packageHelper.express();
const cors = packageHelper.cors;
const passport = packageHelper.passport;
const session = packageHelper.express_session;

const {
  verifyToken,
  // ensureAuth,
  attachUserToRequest
} = require('./middleware/auth_middleware');

const {
  SECRET_KEY
} = require('../public/javascripts/constants');

const {
  INTERNAL_SERVER_ERROR,
  PAGE_NOT_FOUND
} = require('./response_config');

const corsOptions = {
  "origin": /localhost:3000/,
  "methods": "GET,POST",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

try {
  // view engine setup
  app.set('views', packageHelper.path.join(packageHelper.DIRNAME, '../views'));
  app.set('view engine', 'ejs');

  app.use(packageHelper.express.json());
  app.use(packageHelper.express.urlencoded({
    extended: false
  }));

  // Body parser
  app.use(packageHelper.bodyParser.json());
  app.use(packageHelper.bodyParser.urlencoded({
    extended: true
  }));

  // Cookie parser
  app.use(packageHelper.cookieParser());
  app.use(packageHelper.express.static(packageHelper.path.join(packageHelper.DIRNAME, '../public')));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport session
  require('./passport')(passport);
  app.use(session({
    key: 'defcon_one_id',
    secret: SECRET_KEY,
    resave: true,
    session: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000 // 3600000 for 1 hour
    }
  }));

  app.use('/', indexRoutes);
  app.use('/users', cors(corsOptions), apiLogger, userRoutes);
  app.use('/api', cors(corsOptions), apiLogger, verifyToken, attachUserToRequest, apiRoutes); // ensureAuth

  // catch 404 and forward to error handler 
  app.use((err, res) => {
    console.error('---Route_not_found---');
    return utils.generateResponse(PAGE_NOT_FOUND)(res);
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'dev' ? err : {};

    // render the error page
    return utils.generateResponse(INTERNAL_SERVER_ERROR)(res);
  });
} catch (error) {
  log.error('---ERROR_CAUGHT---');
  log.error(error);
  return reject({
    success: false,
    error_code: 500,
    message: 'Internal server error',
    data: {}
  });
}

module.exports = app;

const indexRoutes = require('../routes/index');
const userRoutes = require('../routes/users');
const apiRoutes = require('../routes/api');

const app = packageHelper.express();
const cors = packageHelper.cors;
const passport = packageHelper.passport;
const session = packageHelper.express_session;

const { verifyToken, ensureAuth } = require('./middleware/auth_middleware');
const { SECRET_KEY } = require('../public/javascripts/constants');

const corsOptions = {
  "origin": /localhost:3000/,
  "methods": "GET,POST",
  "preflightContinue": true,
  "optionsSuccessStatus": 204
};

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

// Passport session
require('./passport')(passport);
app.use(session({
  secret: SECRET_KEY,
  resave: true,
  saveUninitialized: true
}));
 
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(packageHelper.cookieParser());
app.use(packageHelper.express.static(packageHelper.path.join(packageHelper.DIRNAME, '../public')));

app.use('/', indexRoutes);
app.use('/users', userRoutes);
// THIS BELOW LINE SHOULD BE DELETED LATER;
app.use('/api', cors(corsOptions), (req, res, next) => {
  req.user = {
    "feature_rights": [1, 2, 3],
    "is_active": true,
    "is_archived": false,
    "mobile_no": 7760225404,
    "name": "DEMO TEST",
    "role_type": "r_dentist",
    "role_id": 1,
    "username": "demo@emr.in",
    "password": "$2a$10$7eWmc4bEcDjJVtqWmZqOPuIBiDVAq1HavfqbaFfGVqzw/CDBiwSFa",
    "date": "2019-11-30 15:07:37"
  };
  next();
}, apiRoutes);
// app.use('/api', ensureAuth, verifyToken, apiRoutes);

// catch 404 and forward to error handler 
app.use((err, res) => {
  console.error(err);
  res.status(404).send({
    success: false,
    message: packageHelper.createError(404).message || 'Not found',
    data: {}
  });
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500).send({
    success: false,
    message: err.message || 'Internal server error',
    data: {}
  });
});

module.exports = app;

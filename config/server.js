const indexRoutes = require('../routes/index');
const userRoutes = require('../routes/users');
const apiRoutes = require('../routes/api');

const passport = packageHelper.passport;
const session = packageHelper.express_session;
const app = packageHelper.express();

const { verifyToken, ensureAuth } = require('./middleware/auth_middleware');

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
  secret: 's%3Af-LcbnMAtrDwm87ExePnNxrakQBApz2F.fkY%2FiA4%2FekLHtzJ3bLswxLKeHz2iE7gYHcR6s8idtH4',
  resave: true,
  saveUninitialized: true
}))
 
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(packageHelper.cookieParser());
app.use(packageHelper.express.static(packageHelper.path.join(packageHelper.DIRNAME, '../public')));

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/api', ensureAuth, verifyToken, apiRoutes);

// catch 404 and forward to error handler 
app.use((req, res, next) => {
  next(packageHelper.createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

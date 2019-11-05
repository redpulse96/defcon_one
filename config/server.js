const indexRoutes = require('../routes/index');
const apiRoutes = require('../routes/api_routes');

const app = packageHelper.express();

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

app.use('/', indexRoutes);
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

module.exports = app;

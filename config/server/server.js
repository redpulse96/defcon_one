const index_router = require('../../routes/index');
const api_routes = require('../../routes/api-routes');

let app = package_helper.express();

// view engine setup
app.set('views', package_helper.path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');

app.use(package_helper.logger('dev'));
app.use(package_helper.express.json());
app.use(package_helper.express.urlencoded({
  extended: false
}));
app.use(package_helper.bodyParser.json());
app.use(package_helper.bodyParser.urlencoded({
  extended: true
}));
app.use(package_helper.cookieParser());
app.use(package_helper.express.static(package_helper.path.join(__dirname, 'public')));

//DB Connections
require('../connections');

app.use('/', index_router);
app.use('/api', api_routes);

// catch 404 and forward to error handler 
app.use((req, res, next) => {
  next(package_helper.createError(404));
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

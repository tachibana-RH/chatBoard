const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const validator = require('express-validator');
const MySQLStore = require('express-mysql-session')(session);
const mysqlModels = require('./modules/mysqlModels')

const indexRouter = require('./routes/index');
const mainRouter = require('./routes/main');
const createRouter = require('./routes/createtopic');
const topicRouter = require('./routes/topic');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

const sessionStore = new MySQLStore(mysqlModels.opts);

const session_opt = {
  secret: 'secret cat chat',
  store: sessionStore,
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  name: 'cht3sid3',
  cookie: { maxAge: 180 * 60 * 1000, secure: false}
};

if (app.get('env') === 'production') {
  // app.set('trust proxy', 1) // trust first proxy
  session_opt.cookie.secure = true // serve secure cookies
}

app.use(session(session_opt));
app.disable('x-powered-by');

const ALLOWED_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS'
];
const ALLOWED_ORIGINS = [
  'https://chatsboard.com:49443'
];
// レスポンスHeaderを組み立てる
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(','));
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.setHeader("Access-Control-Allow-Credentials",true);
  }
  next();
});

app.use('/', indexRouter);
app.use('/main', mainRouter);
app.use('/createtopic', createRouter);
app.use('/topic', topicRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
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

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var register = require('./routes/register');
var data = require('./routes/data');
var view = require('./routes/view');

var app = express();
var port = 4001;

// Add Headers
app.all('*', function(req, res,next) {
  /**
   * Response settings
   * @type {Object}
   */
  var responseSettings = {
    "AccessControlAllowOrigin":'*',
    "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
    "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
    "AccessControlAllowCredentials": true
  };

  /**
   * Headers
   */
  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

  if ('OPTIONS' == req.method) {
    res.send(200);
  }else {
    next();
  }

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/register',register);
app.use('/data', data);
app.use('/',view);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(port,function(){
  console.log('Server started successfully with : ', port);
})

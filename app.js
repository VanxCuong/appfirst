var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require("express-session");
const expressValidator = require('express-validator');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var cartdetail = require('./routes/cart');
var deliveryinformation = require('./routes/deliveryinformation');
var admin = require('./routes/admin');
var ctg = require('./routes/ctg');
var show = require('./routes/show');
var support = require('./routes/support');
var forget = require('./routes/forget');

var app = express();
// mongodb://localhost:27017/firstapp   - mongodb://vanxcuong:12345612@ds117759.mlab.com:17759/firstapp
mongoose.connect('mongodb://vanxcuong:12345612@ds117759.mlab.com:17759/firstapp',function(err){
  if(err){
    console.log("Connect database failed !!!");
  }else{
    console.log("Connect database success !!!");
    
  }
});
app.use(expressValidator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'MasterTVC',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req , res , next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
	next();
})
app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/cart', cartdetail);
app.use('/deliveryinformation', deliveryinformation);
app.use('/admin', admin);
app.use('/ctg', ctg);
app.use('/show', show);
app.use('/support', support);
app.use('/forget', forget);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy,
  user=require("../models/user");
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log(username);
    console.log(password);
    
  }
));
var user=require("../models/user");
var GrRole=require("../models/GrRole");
var RoleUser=require("../models/RoleUser");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  var bcrypt = require('bcryptjs');
var arrRouter=[];
var arrRouter2=[];
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
function(username, password, done) {
  user.findOne({email:username}).exec(function(err,user){
    if (err) { return done(err); }
    if (!user) {
      console.log(`Khoong phải user`);
      return done(null, false, { message: 'Tài khoản không tồn tại' });
    }
    bcrypt.compare(password, user.password, function(err, res) {
      if(res){
          return done(null, user);
      }else{
          console.log("Mật khẩu không chính xác");
          return done(null,false,{message : 'Mật khẩu không chính xác'});
      }
    });
  })
  
}
));
passport.serializeUser(function(user, done) {
  checkrouter(user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    
    done(err, user);
    }).catch(function (err) {
      console.log(err);
    });
});

function checkrouter(id) {
  arrRouter=[];
  arrRouter2=[];
  var arr=[];
  
  RoleUser.findOne({user_id:id}).populate("role_id").exec(function(err,result){
    GrRole.find({role_id:result.role_id._id}).populate("router_id").exec(function(err,result){
        for(var i=0;i<result.length;i++){
          arr=result[i].router_id.name.split("/");
          if(arrRouter.indexOf(arr[0])<0){
            arrRouter.push(arr[0]);
          }
          if(arrRouter2.indexOf(arr[1])){
            arrRouter2.push(arr[1]);
          }
          // arrRouter.push(result[i].router_id.name);
        }
        module.exports.arr=arrRouter;
        module.exports.arr2=arrRouter2;
    })
  })
}

module.exports.passport=passport;
module.exports.arr=arrRouter;
module.exports.arr2=arrRouter2;


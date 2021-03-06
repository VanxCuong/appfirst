var express = require('express');
var router = express.Router();
var user=require("../models/user");
var role=require("../models/role");
var RoleUser=require("../models/RoleUser");
var bcrypt = require('bcryptjs');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("register")
});
router.post('/', function(req, res, next) {
  var dl={
    fullname:req.body.name,
    email:req.body.email,
    password:req.body.reqpassword,
    sex:req.body.sex,
    birthday:req.body.date
  }
  var dl=new user(dl);
  req.check("email","Yêu cầu nhập đúng định dạng email").isEmail();
  req.check("reqpassword","Mật khẩu không hợp lệ").isLength({min:4,max:12}).matches(/\d/).equals(req.body.password);
  var errors=req.validationErrors();
  if(errors){
    res.send(errors); 
  }else{
    user.findOne({email:dl.email}).exec(function(err,result){
      if(result){
        res.send(false);
      }else{
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(dl.password, salt, function(err, hash) {
            dl.password=hash;
            dl.save(function(err,result){
              if(err){
                res.send(false);
              }else{
                insertRoleUser(function(idRole){
                  data={
                    user_id:result._id,
                    role_id:idRole
                  }
                  RoleUser.create(data,function(err,result){
                    if(err){
                      res.send(false);
                    }else{
                      res.send(true);
                    }
                  })
                })
              }
            });
          });
        });
        
      }
    });
  }
});
function insertRoleUser(cb){
  role.find({role:"Khách hàng"},function(err,result){
    cb(result[0]._id);
  })
}
router.post("/checkemail",function(req,res,next){
  var email=req.body.email;
  user.findOne({email:email}).exec(function(err,result){
    if(result){
      res.send(false);
    }else{
      res.send(true);
    }
  });
})

module.exports = router;

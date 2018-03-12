var express = require('express');
var bcrypt = require('bcryptjs');
var user=require("../models/user");
var order=require("../models/order");
var pass=require("../keys/passportjs");
var router = express.Router();

/* GET users listing. */
function checkAPI(req, res, next){
  if(!req.user){
    res.redirect('/');
  }else{
      next();
  }
}
function checkRouter(req,res,next){
  console.log(req.url);
  
  var url="users"+req.url;
  console.log(url);
  
  var k=1;
  for(var i=0;i<pass.arr.length;i++){
    if(url==pass.arr[i]){
      k=0;
      console.log(url);
    }
    console.log(url);
  }
  if(k==0){
    next();
  }else{
     res.redirect('/');
    
  }
}
router.get('/',checkRouter, function(req, res, next) {
  res.render("./user/info-user",{user:req.user});
});
/**
 * update thông tin cá nhân Users
 */
router.post('/updateInfoUser',checkRouter, function(req, res, next) {
  var _id=req.body._id;
  var dl={
    fullname:req.body.fullname,
    sex:req.body.sex,
    birthday:req.body.birthday,
    id:req.body.id,
  }
  user.update({_id:_id},dl,function(err,result){
    if(err){
      console.log("Update lỗi rồi:",err);
    }else{
      res.send(true);
    };
  })
});
router.post('/updateContact',checkRouter, function(req, res, next) {
  var _id=req.body._id;
  var dl={
    address:req.body.address
  }
  user.update({_id:_id},dl,function(err,result){
    if(err){
      console.log("Update lỗi rồi:",err);
    }else{
      res.send(true);
    };
  })
});
router.post('/updatePassword',checkRouter,function(req,res,next){
  var _id=req.body._id;
  var passOld=req.body.passOld;
  var dl={
    password:req.body.passRep
  }
  req.check("passRep","Mật khẩu không hợp lệ").isLength({min:4,max:12}).matches(/\d/).equals(req.body.passNew);
  var errors=req.validationErrors();
  if(errors){
    res.send(errors);
  }else{
    user.findById(_id).exec(function(err,thanhvien){
      bcrypt.compare(passOld, thanhvien.password, function(err, kq) {
        if(kq){
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(dl.password, salt, function(err, hash) {
              dl.password=hash;
              user.update({_id:_id},dl,function(errors,success){
                if(errors){
                  console.log("Lỗi rồi",errors);
                  res.send(false);
                }else{
                  res.send(true);
                }
              })
            });
          });
        }else{
          res.send(false);
        }
      });
    })
  }
})
/**
 * Xử lý quản lý order
 */
router.get('/order',checkRouter, function(req, res, next) {

  order.find({user_id:req.user._id}).populate("product_id").exec(function (err,result) {  
    res.render("./user/manager-order",{order:result});
  })
  
  
});
/**
 * End Xử lý quản lý order
 */
/**
 * Xử lý order đang chờ
 */
router.get('/orderNew', checkRouter,function(req, res, next) {
  order.find({user_id:req.user._id,status:0}).populate("product_id").exec(function (err,result) {  
    res.render("./user/manager-order-new",{order:result});
  })
});
/**
 * End Xử lý order đang chờ
 */
router.get('/addressorder', checkRouter,function(req, res, next) {
  res.render("./user/address-order",{user:req.user});
});

module.exports = router;

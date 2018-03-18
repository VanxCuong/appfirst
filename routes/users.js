var express = require('express');
var bcrypt = require('bcryptjs');
var user=require("../models/user");
var order=require("../models/order");
var tollbaruser=require("../models/tollbaruser");
var pass=require("../keys/passportjs");
var router = express.Router();

/* GET users listing. */

function checkRouter(req,res,next){
  var url="users"+req.url;
  var tollUrl=url.split("/");
  var k=1;
  for(var i=0;i<pass.arr.length;i++){
    if(pass.arr[i]==tollUrl[0]){
      for (let index = 0; index < pass.arr2.length; index++) {
        if(pass.arr2[index]==tollUrl[1]){
          k=0;
        }
      }
    }
  }
  if(k==0){
    next();
  }else{
     res.redirect('/');
    // next();
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
  order.find({user_id:req.user._id,status:0}).sort({_id:-1}).populate("product_id").exec(function (err,result) {  
    res.render("./user/manager-order-new",{order:result});
  })
});
/**
 * End Xử lý order đang chờ
 */
router.get('/addressorder', checkRouter,function(req, res, next) {
  res.render("./user/address-order",{user:req.user});
});
/**
 * Tollbar User
 */
router.get('/tollbarUser',function(req, res, next) {
  tollbaruser.find({}).exec(function (err,result) {  
    res.send(result);
  })
});
/**
 * Show detail product order
 */
router.get('/detailorder.:id',function(req, res, next) {
  var id=req.params.id;
  console.log(id);
  order.findById(id).populate("product_id").populate("user_id").exec(function(err,result){
    res.render("./user/show-orderdetail",{order:result});
  })
});
module.exports = router;

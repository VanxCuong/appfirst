var express = require('express');
var product=require("../models/product");
var category=require("../models/category");
var comments=require("../models/comments");
var GrRole=require("../models/GrRole");
var RoleUser=require("../models/RoleUser");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  var bcrypt = require('bcryptjs');
var user=require("../models/user");
var passportjs=require("../keys/passportjs");
var router = express.Router();
/* GET home page. */
router.get("/session",function(req,res,next){
  var kq="";
  if(req.user){
    RoleUser.findOne({user_id:req.user._id}).populate("user_id").populate("role_id").exec(function (err,result) {
      kq=result;
      res.send(kq);
    })
  }else{
    res.send(kq);
  }
  console.log(`hihi:`,kq);
  
  
  
})
router.get("/giohang",function(req,res,next){
  var arr=[];
  if(req.session.cart){
    arr.push(req.session.cart);
  }
  res.send(req.session.cart);
})

/**
 * Xử Lý phần trang chủ
 */
router.get("/category",function(req,res,next){
  category.find().exec(function(err,result){
    res.send(result);
  })
})
router.get("/check",function(req,res,next){
  res.send(passportjs.arr+passportjs.arr2);
})
router.get('/', function(req, res, next) {
  product.find().skip(0).limit(12).exec(function(err,result){
    res.render('index', { product:result , amountProduct:result.length});
  })
});
router.post('/showproducts', function(req, res, next) {
  amountProduct=req.body.amountProduct;
  console.log(amountProduct);
  product.find().skip(Number(amountProduct)).limit(12).exec(function(err,result){
    res.send(result);
  })
});
/**
 * Kết thúc xử lý trang chủ
 */

router.get('/product', function(req, res, next) {
  res.render('product_detail', { title: 'Express' });
});
router.post('/login',
  passport.authenticate('local',{ successRedirect: '/users',
                                   failureRedirect: '/',
                                   failureFlash: true })
);
router.get('/logout', function(req, res){
  if(passportjs.arr.length>0||passportjs.arr2.length>0){
    passportjs.arr=[];
    passportjs.arr2=[];
  }
  req.logout();
  res.redirect('/');
  
});
router.post('/cmt/add', function(req, res){
    var dl=new comments({
      content:req.body.content,
      product_id:req.body.product_id,
      user_id:req.body.user_id,
      link:req.body.link
    })
    dl.save(function (err,result) {
      res.send(true);
    })
});
/**
 * Xử lý phần comments
 */
router.get('/cmt/select/:link', function(req, res){
  link=req.params.link;
  comments.find({status:1,link:link}).skip(0).sort({_id:-1}).limit(7).populate("user_id").exec(function(err,result) {
    if(result){
      res.send(result);
    }
  })
});
router.get('/cmt/selectall/:quantity', function(req, res){
  var quantity=req.params.quantity;
  console.log(quantity);
  comments.find({status:1,link:link}).skip(Number(quantity)).sort({_id:-1}).populate("user_id").exec(function(err,result) {
    if(result){
      res.send(result);
    }
  })
});
module.exports = router;
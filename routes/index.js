var express = require('express');
// var passport=require("../keys/passportjs");
var product=require("../models/product");
var category=require("../models/category");
var comments=require("../models/comments");
var stringToDom = require('string-to-dom');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  var bcrypt = require('bcryptjs');
var user=require("../models/user");
var router = express.Router();

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
  console.log(`serializeUser`,user);
  
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  console.log(`deserializeUser:`,id);
  user.findById(id, function(err, user) {
      done(err, user);
    }).catch(function (err) {
      console.log(err);
    });
  
});


/* GET home page. */
router.get("/session",function(req,res,next){
  if(req.user){
    res.send(req.user);
  }
})
/**
 * Xử Lý phần trang chủ
 */
router.get("/category",function(req,res,next){
  category.find().exec(function(err,result){
    res.send(result);
  })
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

var express = require('express');
var bcrypt = require('bcryptjs');
var user=require("../models/user");
var router = express.Router();

/* GET users listing. */
function checkAPI(req, res, next){
  if(!req.user){
    res.redirect('/');
  }else{
      next();
  }
}
router.get('/',checkAPI, function(req, res, next) {
  res.render("./user/info-user",{user:req.user});
});
/**
 * update thông tin cá nhân Users
 */
router.post('/updateInfoUser',checkAPI, function(req, res, next) {
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
      console.log(result);
      
      res.send(true);
    };
  })
});
router.post('/updateContact',checkAPI, function(req, res, next) {
  var _id=req.body._id;
  var dl={
    address:req.body.address
  }
  user.update({_id:_id},dl,function(err,result){
    if(err){
      console.log("Update lỗi rồi:",err);
    }else{
      console.log(result);
      res.send(true);
    };
  })
});
router.post('/updatePassword',checkAPI,function(req,res,next){
  var _id=req.body._id;
  console.log(_id);
  
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

router.get('/order',checkAPI, function(req, res, next) {
  res.render("./user/manager-order",{user:req.user});
});
router.get('/orderNew', checkAPI,function(req, res, next) {
  res.render("./user/manager-order-new",{user:req.user});
});
router.get('/addressorder', checkAPI,function(req, res, next) {
  res.render("./user/address-order",{user:req.user});
});

module.exports = router;

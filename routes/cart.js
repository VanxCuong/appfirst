var express = require('express');
var Giohang=require("../keys/Giohang");
var order=require("../models/order");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.session.cart){
    data=null;
  }else{
    giohang=new Giohang(req.session.cart);
    if(Object.keys(giohang.items).length==0){
      data=null;
    }else{
      data=giohang.convertArray();
      console.log(data);
    }
  }
  res.render("cart",{showCart:data});
});
router.get("/update/:sl/:id",function(req,res,next){
  var quantity=req.params.sl;
  var id=req.params.id;
  var giohang=new Giohang(req.session.cart);
  giohang.update(id,quantity);
  req.session.cart=giohang;
  res.send(true);
})
router.get("/delete/:id",function(req,res,next){
  var id=req.params.id;
  var giohang=new Giohang(req.session.cart);
  giohang.delete(id);
  req.session.cart=giohang;
  res.redirect("/cart")
})
router.get("/checkcart",function(req,res,next){
  if(!req.session.cart){
    req.session.cart=null;
  }
  res.send(req.session.cart);
})
router.post("/udi",function(req,res,next){ 
  req.check("name","Bạn chưa nhập tên").notEmpty();
  req.check("addressorder","Bạn chưa nhập địa chỉ giao hàng").notEmpty();
  req.check("phone","Bạn chưa nhập số điện thoại").notEmpty();
  req.check("addresscity","Bạn chưa nhập tỉnh/thành phố").notEmpty();
  req.check("methodPay","Bạn chưa nhập phương thức giao hàng").notEmpty();
  var errors=req.validationErrors();
  if(errors){
    res.send(errors); 
  }else{
    var name=req.body.name,
    addressorder=req.body.addressorder,
    phone=req.body.phone,
    addresscity=req.body.addresscity,
    methodPay=req.body.methodPay;
    var giohang=new Giohang(req.session.cart);
    giohang.updateinfo(name,addresscity,addressorder,phone,methodPay);
    res.send(true);
    
  }
})
router.post("/order",function(req,res,next){
  var insertOrder=new order({
    user_id:req.body.idUser,
    product_id:req.body.idProduct,
    quanlity:req.body.quanlity,
    customer:req.body.customer,
    city:req.body.city,
    pay:req.body.pay,
    phone:req.body.phone,
    addressorder:req.body.addressorder
  })
  insertOrder.save(function(err,result){
    if(err){
      res.send(false)
    }else{
      res.send(true);
    }
  })
})
module.exports = router;

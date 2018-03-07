var express = require('express');
var category=require("../models/category");
var product=require("../models/product");
var Giohang=require("../keys/Giohang");
var router = express.Router();

/* GET users listing. */
/**
 * Trang Chi Tiết Sản Phẩm
 */
router.get('/:link', function(req, res, next) {
    var link=req.params.link;  
    var rd=getRandomArbitrary(1,SoProduct-8);
    product.findOne({link:link}).limit(1).exec(function(err,result){
      // detail product (frames left)
      product.find().sort({_id:-1}).limit(4).exec(function(err,ProductNew){
        // show 4 product new ( frames right)
        product.find().limit(8).skip(rd).exec(function(err,ProductRanDom){
          // Show products liên quan
          res.render('product_detail', { productShow:result,productNew:ProductNew,productRandom:ProductRanDom});
        })
      })
    })
});
/**
 * Kết thúc Chi Tiết Sản Phẩm
 */
/**
 * Thêm Giỏ Hàng
 */
router.get("/cart/:id",function(req,res,next){
    var id=req.params.id;
    console.log(id);
    var giohang=new Giohang(req.session.cart?req.session.cart:{items:{}});
    product.findOne({_id:id}).exec(function(err,result){
        console.log(result);
        giohang.add(result._id,result);
        req.session.cart=giohang;
        res.redirect('/cart');
    })
})
var SoProduct;
/**
 * Lấy Số lượng bản ghi
 */
findRecord(function(err,result){
  SoProduct=result.length+1;
  console.log(SoProduct);
  
})
function findRecord(cb){
    product.find().exec(function(err,result){
      cb(err,result);
    })
}
/**
 * getRandomArbitrary: Chọn ngẫu nhiên 1 số trong khoảng min->max
 * @param {*} min: Số Nhỏ Nhất 
 * @param {*} max : Số Lớn Nhất
 */
function getRandomArbitrary(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}
module.exports = router;

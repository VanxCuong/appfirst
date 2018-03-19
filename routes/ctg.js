var express = require('express');
var category=require("../models/category");
var product=require("../models/product");
var router = express.Router();

/* GET users listing. */
router.get('/:category', function(req, res, next) {
    ctg=req.params.category;
    category.find({name:ctg}).exec(function(err,kq){
        product.find({category_id:kq[0]._id}).populate("category_id").exec(function(err,result){
            res.render("ctg",{ctgProduct:kq[0],productCTG:result,amountProductCTG:result.length});
        })
    })
});
// Tìm kiếm sản phẩm
function escapeRegex(text) {
    return text.replace(/[-[\]({})*+?.,\\^$|#\s]/g, "\\$&");
  };
router.post("/search",function(req,res,next){
var searchsp=req.body.searchsp;
var idctg=req.body.idctg;
const regex=new RegExp(escapeRegex(searchsp),'gi');
product.find({name:regex,category_id:idctg},function(err,result){
    if(result.length<1){
        res.send(false);
    }else{
        res.send(result);
    };
})
})
module.exports = router;

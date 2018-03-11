var express = require('express');
var multer=require("multer");
var category=require("../models/category");
var product=require("../models/product");
var tollbar=require("../models/admintollbar");
var order=require("../models/order");
var comments=require("../models/comments");
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+ '-' + file.originalname) 
  }
})
function fileFilter (req, file, cb) {
if(!file.originalname.match(/\.(jpg|png|gif|jpeg|PNG)$/)){
  cb(new Error('Bạn Chỉ được upload file ảnh'));
  console.log('Bạn chỉ được upload file Ảnh');
}else{
  cb(null, true);
}
}
var upload = multer({ storage: storage,fileFilter:fileFilter }).single('imagesProduct');

/* GET home page. */
/**
 * Bắt đầu Xử lý phần category
 */
router.get('/', function(req, res, next) {
  category.find({},function(err,result){
    res.render('./admin/info-admin', {category:result });
  })
});
/**
 * THêm Danh Mục
 */
router.post('/category', function(req, res, next) {
  var nameCategory=req.body.category;
  dl={
    name:nameCategory
  }
  category.create(dl,function(err,result){
    if(err) console.log(`Lỗi rồi:`,err);
    else  res.redirect('/admin');    
  })
});
/**
 * Kết thúc xử lý category
 */
/**
 * Bắt đầu xử lý thêm sản phẩm
 */
router.get('/insertProduct', function(req, res, next) {
  category.find({},function(err,result){
    res.render('./admin/insert-product', {category:result });
  })
});
router.post('/insertProduct',upload, function(req, res, next) {
  var images=req.file.path.split("\\");
  var price_sale=req.body.priceSale,
      price_old=req.body.price;
  var price_new=price_old-(price_sale*price_old/100);
  var Newproduct=new product({
    name:req.body.name,
    image:images[2],
    content:req.body.content,
    description:req.body.infoProduct,
    description_detail:req.body.detailProduct,
    price_sale:price_sale,
    price_old:price_old,
    price_new:price_new,
    amount:req.body.number,
    category_id:req.body.category_id,
    link:req.body.link
  })
  Newproduct.save(function(err,result){
    res.redirect('/admin/insertProduct');
  })
});
/**
 * Kết thúc xử lý thêm sản phẩm
 */
/**
 * Bắt đầu Xử lý Quản lý Sản Phẩm
 */
var positionProduct=8;
router.get('/managerProduct', function(req, res, next) {
  product.find({}).sort({_id:-1}).limit(9).skip(0).exec(function(err,result){
    res.render('./admin/manager-product', { product:result,AmountProduct:result.length});
  })
});
router.post('/removeproduct', function(req, res, next) {
  var id=req.body.id;
  product.remove({_id:id}).exec(function(err,result){
     if(result){res.send(true);}else{res.send(false);}
  })
});
// Click xem giá tawng daafn
router.post("/Decrease",function(req,res,next){
  var DecreaseAmount=req.body.number;
  console.log(DecreaseAmount);
  //Vì DecreaseAmount do ajax truyền lên là dạng String nên khi tìm kiếm ta phải chuyển sang Number như bên dưới.
  product.find({}).sort({_id:-1}).limit(Number(DecreaseAmount)).skip(0).exec(function(err,result){
    result.sort(compare);
    if(err) {
      console.log("Lỗi rồi:",err);
    }else{
      res.send(result);
    }
  })
})
/**
 * Hàm Sắp Xếp
 * Thay đổi  giản dần.
 * @param {*} a 
 * @param {*} b 
 */
function compare(a,b) {
  if (a.price_old > b.price_old)
    return -1;
  if (a.price_old < b.price_old)
    return 1;
  return 0;
}
// Hàm sắp xếp tăng dần
function SapXep(a,b) {
  if (a.price_old < b.price_old)
    return -1;
  if (a.price_old > b.price_old)
    return 1;
  return 0;
}
// click Xem giá giảm dần
router.post("/Increase",function(req,res,next){
  IncreaseAmount=req.body.number;
  product.find({}).sort({_id:-1}).limit(Number(IncreaseAmount)).skip(0).exec(function(err,result){
    result.sort(SapXep);
    if(err) {
      console.log("Lỗi rồi:",err);
    }else{
      res.send(result);
    }
  })
})
// Xem Thêm Sản Phẩm
router.post("/amountProduct",function(req,res,next){
  amount=req.body.amount;
  product.find({}).sort({_id:-1}).limit(9).skip(Number(amount)).exec(function(err,result){
    res.send(result);
  })
})
router.get('/editproduct/*.:id', function(req, res, next) {
  var id=req.params.id;
  product.findById(id).populate("category_id").exec(function(err,result){
    console.log(result);
    
    category.find().exec(function(err,kq){
      if(err){
        console.log("Tìm ID Sửa SP Lỗi rồi:",err);
      }else{
        console.log(kq);
        
        res.render('./admin/edit-product', {product:result,categoryProduct:kq});
      }
    })
    
  })
});
router.post('/editproduct/*.:id',upload, function(req, res, next) {
  var id=req.params.id;
  var price_sale=req.body.priceSale,
      price_old=req.body.price;
  var price_new=price_old-(price_sale*price_old/100);
  if(!req.file){
    var dl={
      name:req.body.name,
      content:req.body.content,
      description:req.body.infoProduct,
      description_detail:req.body.detailProduct,
      category_id:req.body.category_id,
      price_sale:req.body.priceSale,
      price_old:req.body.price,
      price_new:price_new,
      amount:req.body.number,
      link:req.body.link
    };
    product.update({_id:id},dl,function(err,result){
      if(err){
        console.log("Update Product errors:",err);
      }else{
         res.redirect('/admin/managerProduct');
      }
    })
  }else{
    var images=req.file.path.split("\\");
    var dl={
      name:req.body.name,
      image:images[2],
      content:req.body.content,
      description:req.body.infoProduct,
      description_detail:req.body.detailProduct,
      price_sale:req.body.priceSale,
      price_old:req.body.price,
      amount:req.body.number,
      link:req.body.link
    }
    product.update({_id:id},dl,function(err,result){
      if(err){
        console.log("Update Product errors:",err);
      }else{
         res.redirect('/admin/managerProduct');
      }
    })
  }
  // console.log(Newproduct);
});
// Tìm kiếm sản phẩm
function escapeRegex(text) {
  return text.replace(/[-[\]({})*+?.,\\^$|#\s]/g, "\\$&");
};
router.post("/search",function(req,res,next){
  var searchsp=req.body.searchsp;
  const regex=new RegExp(escapeRegex(searchsp),'gi');
  product.find({name:regex},function(err,result){
    if(result.length<1){
      console.log("ihih");
      res.send(false);
    }else{
      res.send(result);
    };
  })
})
// Xem thêm sản phẩm
/**
 * Kết thúc Xử lý Quản lý Sản Phẩm
 */
router.get('/managerOrder', function(req, res, next) {
  order.find({status:0}).populate("product_id").populate("user_id").exec(function (err,result) {
    res.render('./admin/manager-order', { order:result });
  })
  
});
router.get('/ordersuccess', function(req, res, next) {
  res.render('./admin/order-success', { title: 'Express' });
});
router.get('/managerusers', function(req, res, next) {
  res.render('./admin/manager-users', { title: 'Express' });
});
/**
 * Xử lý phần bình luận
 */
router.get('/managercomments', function(req, res, next) {
  comments.find({status:0}).sort({_id:1}).limit(20).skip(0).populate("product_id").populate("user_id").exec(function (err,result) {  
    res.render('./admin/manager-comments', { title: 'Express',comments:result, qttCmt:result.length });
  })
});
router.get('/acceptsCmt/:id', function(req, res, next) {
  var id=req.params.id;
  console.log(id);
  dl={
    status:"1",
  }
  comments.update({_id:id},dl,function (err,result) {  
    if(result){
      res.send(true);
    }
  })
});
router.get('/DeleteALL', function(req, res, next) {
  comments.deleteMany({status:0},function (err,result) {  
    if(result){
      res.send(true);
    }
  })
});
router.get('/AcceptALL', function(req, res, next) {
  comments.updateMany({},{status:1},function (err,result) {  
    if(result){
      res.send(true);
    }
  })
});
/**
 * Kết thúc Xử lý phần bình luận
 */
router.get('/profit', function(req, res, next) {
  res.render('./admin/profit', { title: 'Express' });
});
/**
 * Bắt Đầu Xử Lý Thanh Công Cụ Cho admin
 */
router.get('/searchtollbar', function(req, res, next) {
  tollbar.find({},function(err,result){
    res.send(result);
  })
});
router.get('/tollbar/:id', function(req, res, next) {
  var id=req.params.id;
  tollbar.remove({_id:id}).exec(function(err,result){
    res.redirect("/admin/tollbar")
  })
});

router.get('/tollbar', function(req, res, next) {
  tollbar.find({},function(err,result){
    res.render("./admin/manager-tollbar",{tollbar:result});
  })
});
router.post('/tollbar', function(req, res, next) {
  var dl={
    name:req.body.name,
    link:req.body.link
  }
  tollbar.create(dl,function(err,result){
    res.redirect("/admin/tollbar");
  })
});
/**
 * Kết thúc Xử Lý Thanh Công Cụ Cho admin
 */
module.exports = router;

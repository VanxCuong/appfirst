
var express = require('express');
var multer=require("multer");
var category=require("../models/category");
var product=require("../models/product");
var tollbar=require("../models/admintollbar");
var tollbaruser=require("../models/tollbaruser");
var order=require("../models/order");
var comments=require("../models/comments");
var role=require("../models/role");
var routerWeb=require("../models/router");
var GrRole=require("../models/GrRole");
var user=require("../models/user");
var RoleUser=require("../models/RoleUser");
var slide=require("../models/slide");
var arr=require("../keys/passportjs");
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
}else{
  cb(null, true);
}
}
var upload = multer({ storage: storage,fileFilter:fileFilter }).single('imagesProduct');

/* GET home page. */
/**
 * Bắt đầu Xử lý phần category
 */
router.get('/',checkRouter, function(req, res, next) {
  category.find({},function(err,result){
    res.render('./admin/info-admin', {category:result });
  })
});
/**
 * THêm Danh Mục
 */
function checkRouter(req,res,next){
  var url="admin"+req.url;
  var tollUrl=url.split("/");
  var k;
  for(var i=0;i<arr.arr.length;i++){
    if(arr.arr[i]==tollUrl[0]){
      k=1;
      for (let index = 0; index < arr.arr2.length; index++) {
        if(arr.arr2[index]==tollUrl[1]){
          k=0;
        }
      }
    }
  }
  if(k==0){
    next();
  }else if(k==1){
     res.render("./admin/manager-errors");
  }else{
    res.redirect('/');
    // next();
  }
}
router.post('/category',checkRouter, function(req, res, next) {
  req.check("category","Yêu cầu bạn nhập tên danh mục").notEmpty();
  var errors=req.validationErrors();
  if(errors){
    res.send(errors[0].msg); 
  }else{
    var nameCategory=req.body.category;
    dl={
      name:nameCategory
    }
    category.create(dl,function(err,result){
      if(err) console.log(`Lỗi Insert category:`,err);
      else  res.redirect('/admin');
    })
  }
});
router.get("/category/:id",checkRouter,function(req,res,next){
  id=req.params.id;
  product.remove({category_id:id},function (err,result) {  
    category.remove({_id:id},function(err,result){
       res.redirect('/admin');
    })
  })
})
/**
 * Kết thúc xử lý category
 */
/**
 * Bắt đầu xử lý thêm sản phẩm
 */
router.get('/insertProduct',checkRouter, function(req, res, next) {
  category.find({},function(err,result){
    res.render('./admin/insert-product', {category:result });
  })
});
router.post('/insertProduct',upload,checkRouter, function(req, res, next) {
  req.check("name","Bạn chưa nhập tên").isLength({min:2}).notEmpty();
  req.check("price","Bạn chưa nhập giá cho sản phẩm").notEmpty();
  req.check("link","Yêu cầu bạn nhập link theo định dạng, VD: link-a-b-c").notEmpty();
  var errors=req.validationErrors();
  if(errors){
    xhtml="";
    console.log(errors);
    
    for (let index = 0; index < errors.length; index++) {
      xhtml+=`<h5>${errors[index].msg}</h5>`
    }
    res.send(xhtml);
  }else{
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
  }
});
/**
 * Kết thúc xử lý thêm sản phẩm
 */
/**
 * Bắt đầu Xử lý Quản lý Sản Phẩm
 */
var positionProduct=8;
router.get('/managerProduct',checkRouter, function(req, res, next) {
  product.find({}).sort({_id:-1}).limit(9).skip(0).exec(function(err,result){
    res.render('./admin/manager-product', { product:result,AmountProduct:result.length});
  })
});
router.post('/removeproduct',checkRouter, function(req, res, next) {
  var id=req.body.id;
  comments.remove({product_id:id},function (err,result) {  
    order.remove({product_id:id},function (err,result) {  
      product.remove({_id:id}).exec(function(err,result){
        if(result){res.send(true);}else{res.send(false);}
     })
    })
  })
  
});
// Click xem giá tawng daafn
router.post("/Decrease",checkRouter,function(req,res,next){
  var DecreaseAmount=req.body.number;
  //Vì DecreaseAmount do ajax truyền lên là dạng String nên khi tìm kiếm ta phải chuyển sang Number như bên dưới.
  product.find({}).sort({_id:-1}).limit(Number(DecreaseAmount)).skip(0).exec(function(err,result){
    result.sort(compare);
    if(err) {
      console.log("Sắp xếp Decrease Lỗi rồi:",err);
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
router.post("/Increase",checkRouter,function(req,res,next){
  IncreaseAmount=req.body.number;
  product.find({}).sort({_id:-1}).limit(Number(IncreaseAmount)).skip(0).exec(function(err,result){
    result.sort(SapXep);
    if(err) {
      console.log("Increase Lỗi rồi:",err);
    }else{
      res.send(result);
    }
  })
})
// Xem Thêm Sản Phẩm
router.post("/amountProduct",checkRouter,function(req,res,next){
  amount=req.body.amount;
  product.find({}).sort({_id:-1}).limit(9).skip(Number(amount)).exec(function(err,result){
    res.send(result);
  })
})
router.get('/editproduct/*.:id',checkRouter, function(req, res, next) {
  var id=req.params.id;
  product.findById(id).populate("category_id").exec(function(err,result){
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
router.post('/editproduct/*.:id',upload,checkRouter, function(req, res, next) {
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
/**
 * Xử lý Order
 */
router.get('/managerOrder',checkRouter, function(req, res, next) {
  order.find({status:0}).populate("product_id").populate("user_id").exec(function (err,result) {
    res.render('./admin/manager-order', { order:result });
  })
  
});

router.get('/handlingStatus/:id',checkRouter, function(req, res, next) {
  order.updateOne({_id:req.params.id},{status:1},function (err,result) {  
    res.send(true);
  })
});
router.get('/delOrder/:id',checkRouter, function(req, res, next) {
  order.remove({_id:req.params.id},function (err,result) {  
    res.send(true);
  })
});
// order detail
router.get('/detailOrder/:id',checkRouter, function(req, res, next) {
  var id=req.params.id;
  order.findById(id).populate("product_id").populate("user_id").exec(function (err,result) {  
    res.render("./admin/detail-order",{order:result});
  })
});

/**
 * Quản Lý Đơn Hàng Đã Giao
 */
router.get('/ordersuccess',checkRouter, function(req, res, next) {
  order.find({status:1}).populate("product_id").populate("user_id").sort({_id:-1}).skip(0).limit(20).exec(function (err,result) {
    res.render('./admin/order-success', { order:result });
  })
});
router.post("/showOrderSuccess",function (req,res,next) {  
  var sl=req.body.sl;
  var slOrderSuccser=sl;
  order.find({status:1}).populate("product_id").populate("user_id").sort({_id:-1}).skip(Number(slOrderSuccser)).limit(20).exec(function (err,result) {
    res.send(result);
  })
})
// Tìm kiếm Sản phẩm.
router.post("/searchOrderSuccess",function(req,res,next){
  var arrOrder=[];
  var i=0;
  var searchsp=req.body.searchsp;
  const regex=new RegExp(escapeRegex(searchsp),'gi');
  console.log(regex);
  
  // Tìm xem có bao nhiêu tên trùng với regex ( regex là email khách hàng gửi về.);
  product.find({name:regex},function(err,result){
    if(result.length<1){
      res.send(false);
    }else{ 
      result.forEach(element => {
        order.findOne({status:1,product_id:element._id}).populate("product_id").populate("user_id").exec(function (err,k) {
          i++;
          if(k){
            arrOrder.push(k);
          }
          if(i==result.length){
            res.send(arrOrder);
          }
        })
      });
    };
    
      
  })
})
/**
 * Xử lý User
 */
//Hiển thị
router.get('/managerusers',checkRouter, function(req, res, next) {
  RoleUser.find({}).populate("user_id").populate("role_id").skip(0).limit(20).exec(function (err,result) {  
    role.find().exec(function(err,kq){
      // res.send(result);
      if(err){
        console.log("Quản Lý User ERR");
      }else{
        res.render('./admin/manager-users', { user:result ,role:kq});
      }
    })
  })
});
// Xem thêm user
router.post('/ShowUsers', function(req, res, next) {
  var sl=req.body.sl;
  var qttSl=sl;
  RoleUser.find({}).populate("user_id").populate("role_id").skip(Number(qttSl)).limit(20).exec(function (err,result) {  
    role.find().exec(function(err,kq){
      res.send({ user:result ,role:kq});
    })
  })
});
// Tìm kiếm user
router.post("/searchUsers",function (req,res,next) {  
  var arrUser=[];
  var i=0;
  var searchsp=req.body.searchsp;
  const regex=new RegExp(escapeRegex(searchsp),'gi');
  // Tìm xem có bao nhiêu tên trùng với regex ( regex là email khách hàng gửi về.);
  user.find({email:regex},function(err,result){
    if(result.length<1){
      res.send(false);
    }else{ 
      arrUser=[];
      // search quyền chỉnh sửa
      role.find().exec(function(err,kq){  
        // Duyệt mảng kết quả user đã tìm ở trên .điều kiện Id(_id) của User trùng với Id(User_id) của collection RoleUser
        // Do việc sung đột đồng bộ nên phải dùng lệnh if so sánh duyệt mảng i tăng dần. nếu bằng số lượng element tối đa trong mảng result thì truyền kết quả về cho khách hàng
        result.forEach(element => {
          RoleUser.findOne({user_id:element._id}).populate("user_id").populate("role_id").sort({_id:-1}).exec(function (err,k) {
            i++;
            if(k){
              arrUser.push(k);
            }
            if(i==result.length){
              res.send({user:arrUser,role:kq});
            }
          })
        });
      })
      // role
      
    };
    
      
  })
})
router.post('/editusers',checkRouter, function(req, res, next) {
  var role_id=req.body.role_id;
  var user_id=req.body.user_id;
  console.log(role_id+"-"+user_id);
  RoleUser.update({user_id:user_id},{role_id:role_id},function (err,result) {  
    if(err){
      console.log("Update User Lỗi rồi:",err);
      
    }else{
      res.send(true);
    }
  })
});
//Xóa User
router.get("/deleteUser/:id",checkRouter,function (req,res,next) {  
  id=req.params.id;
  comments.remove({user_id:id},function (err,result) {  
    order.remove({user_id:id},function (err,result) {  
      RoleUser.remove({user_id:id},function (err,result) {  
        user.remove({_id:id},function (err,result) {  
           res.redirect('/admin/managerusers');
        })
      })
    })
  })
})
// Select theo cấp bậc
router.get("/selectLevel/:id",function (req,res,next) {  
  id=req.params.id;
  RoleUser.find({role_id:id}).populate("user_id").populate("role_id").sort({_id:-1}).exec(function(err,result){
    role.find().exec(function(err,kq){
      res.send({ user:result ,role:kq});
    })
  })
})
/**
 * Kết thúc xử lý User
 */

/**
 * Xử lý phần bình luận
 */
router.get('/managercomments',checkRouter, function(req, res, next) {
  comments.find({status:0}).exec(function (err,kq) {  
    comments.find({status:0}).populate("user_id").populate("product_id").sort({_id:1}).limit(20).skip(0).exec(function (err,result) {  
      // res.send(result);
      res.render('./admin/manager-comments', { title: 'Express',comments:result, qttCmt:result.length,qttStatus:kq.length });
    })
  })
});
router.post("/showComments",function(req,res,next){
  var sl=req.body.sl;
  comments.find({status:0}).populate("user_id").populate("product_id").sort({_id:1}).limit(20).skip(Number(sl)).exec(function (err,result) {  
    res.send(result);
  })
})

router.get('/acceptsCmt/:id',checkRouter, function(req, res, next) {
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
router.get('/deleteCmt/:id',checkRouter, function(req, res, next) {
  var id=req.params.id;
  console.log(id);
  comments.remove({_id:id},function (err,result) {  
    if(result){
      res.send(true);
    }
  })
});
router.get('/DeleteALL',checkRouter, function(req, res, next) {
  comments.deleteMany({status:0},function (err,result) {  
    if(result){
      res.send(true);
    }
  })
});
router.get('/AcceptALL',checkRouter, function(req, res, next) {
  comments.updateMany({},{status:1},function (err,result) {  
    if(result){
      res.send(true);
    }
  })
});

/**
 * Kết thúc Xử lý phần bình luận
 */
router.get('/profit',checkRouter, function(req, res, next) {
  res.render('./admin/profit', { title: 'Express' });
});
/**
 * Xử lý thanh công cụ cho User
 */
router.get('/usertollbar/:id', function(req, res, next) {
  var id=req.params.id;
  tollbaruser.remove({_id:id}).exec(function(err,result){
    res.redirect("/admin/usertollbar")
  })
});
router.get('/usertollbar', function(req, res, next) {
  tollbaruser.find({},function(err,result){
    res.render("./admin/manager-tollbarUser",{tollbar:result});
  })
});
router.post('/usertollbar', function(req, res, next) {
  var dl={
    name:req.body.name,
    link:req.body.link
  }
  tollbaruser.create(dl,function(err,result){
    res.redirect("/admin/usertollbar");
  })
});
/**
 * End Xử lý thanh công cụ cho User
 */
/**
 * Bắt Đầu Xử Lý Thanh Công Cụ Cho admin
 */
router.get('/searchtollbar',checkRouter, function(req, res, next) {
  tollbar.find({},function(err,result){
    res.send(result);
  })
});
router.get('/tollbar/:id',checkRouter, function(req, res, next) {
  var id=req.params.id;
  tollbar.remove({_id:id}).exec(function(err,result){
    res.redirect("/admin/tollbar")
  })
});

router.get('/tollbar',checkRouter, function(req, res, next) {
  tollbar.find({},function(err,result){
    res.render("./admin/manager-tollbar",{tollbar:result});
  })
});
router.post('/tollbar',checkRouter, function(req, res, next) {
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
/**
 * Xử lý router phân quyền
 */
// Xử lý phần vài trò
router.get('/role',checkRouter, function(req, res, next) {
  role.find().exec(function(err,result){
    res.render("./admin/manager-role",{role:result});
  })
  
});
router.post('/role',checkRouter, function(req, res, next) {
  req.check("role","Yêu cầu bạn nhập tên quản trị").notEmpty();
  var errors=req.validationErrors();
  if(errors){
    res.send(errors[0].msg); 
  }else{
    dl=new role({
      role:req.body.role
    })
    dl.save(function(err,result){
      if(err){
        console.log("Lỗi rồi:",err);
        res.send("Yêu cầu bạn nhập tên khác");
      }else{
         res.redirect('/admin/role');
      }
    })
  }
});
// Kết thúc vai trò
// Xử lý phần router
router.get('/router',checkRouter, function(req, res, next) {
  GrRole.find().populate("role_id").populate("router_id").exec(function(err,result){
    role.find().exec(function(err,kq){
      res.render("./admin/manager-router",{router:result,role:kq});
    })
  })
});
router.post('/router',checkRouter, function(req, res, next) {
  var role_id=req.body.role;
  req.check("name","Yêu cầu bạn nhập tên đường dẫn").notEmpty();
  req.check("role","Yêu cầu bạn nhập quyền hạn").notEmpty();
  var errors=req.validationErrors();
  if(errors){
    res.send(errors); 
  }else{
    dl=new routerWeb({
      name:req.body.name
    })
    
    dl.save(function(err,result){
      if(err){
        console.log("Lỗi rồi:",err);
        res.send("Yêu cầu bạn nhập tên khác");
      }else{
        data=new GrRole({
          router_id:result._id,
          role_id:role_id
        })
        data.save(function(err,result){
          if(err){
            res.send("Yêu cầu bạn nhập tên khác");
          }else{
            res.redirect('/admin/router');
          }
        })
      }
    })
  }
});
// Xóa router
router.get("/router/:id",function (req,res,next) { 
  id=req.params.id;
  GrRole.remove({_id:id}).exec(function(err,result){
    res.redirect("/admin/router");
  });
})
// Kết thúc router

/**
 * Xử lý Slide
 */
router.get("/slided",checkRouter,function (req,res,next) {  
  slide.find().exec(function(err,result){
    res.render("./admin/manager-slide",{slide:result});
  })
  
})
router.post("/slided",upload,checkRouter,function (req,res,next) {
  console.log(req.file);
  if(req.file==undefined){
    res.send("<h3 class='text-center mt-4'>Bạn Chưa Upload Ảnh</h3>");
  }else{
    var images=req.file.path.split("\\"),
      link=req.body.link,
      dl={
        image:images[2],
        link:link
      };
      slide.create(dl,function(err,result){
        if(err){
          console.log("Thêm ảnh lỗi rồi.");
          
          res.send("<h3 class='text-center mt-4'>Bạn Chưa Upload Ảnh</h3>");
        }else{
           res.redirect('/admin/slided');
        }
      })
  }
})
router.get("/editSlider/*.:id",checkRouter,function(req,res,next){
  var id=req.params.id;
  slide.findById(id).exec(function(err,result){

    res.render("./admin/edit-slider",{slide:result});
  })
})
router.post("/sucessSlide/:id",upload,checkRouter,function(req,res,next){
  var id=req.params.id;
  var dl={};
  if(req.file==undefined){
    dl={
      link:req.body.link
    };
  }else{
    var images=req.file.path.split("\\");
    dl={
      image:images[2],
      link:req.body.link
    }
  }
  slide.updateOne({_id:id},dl,function(err,result){
    if(result){
      res.redirect("/admin/slided");
    }
  });
})
// Xóa slider
router.get("/delSlider/:id",checkRouter,function(req,res,next){
  var id=req.params.id;
  slide.deleteOne({_id:id},function(err,result){
      res.redirect("/admin/slided");
  })
})
/**
 * Kết thúc xử lý slider
 */
module.exports = router;

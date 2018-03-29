var express = require('express');
var bcrypt = require('bcryptjs');
var user=require("../models/user");
var order=require("../models/order");
var tollbaruser=require("../models/tollbaruser");
var pass=require("../keys/passportjs");
const nodemailer =require("nodemailer");
var config=require("../keys/info");
var router = express.Router();
// Load quên mật khẩu
router.get("/",function (req,res,next) {  
    var msg=req.flash("message-err");
    var success=req.flash("message");
    res.render("forgetPassword",{message:msg,success:success[0]});
})
// Nhận Email từ client
var fixSendMail=0;
router.post("/",function (req,res,next) {  
    var email=req.body.email;
    var token;
    var mk="fjh";
    if(fixSendMail==0){
        fixSendMail++;
        user.findOne({email:email},function (err,result) {  
            if(err|| !result){
                console.log("k có email này");
                req.flash("message-err","Không tìm thấy Email: "+email);
                res.redirect("/forget");
            }else{
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(mk, salt, function(err, hash) {
                        token=hash;
                        var arr=token.split("/");
                        result.resetPasswordToken=arr[0];
                        result.resetPasswordExpires=Date.now() + 3600000;
                        result.save(function (err,kq) {
                            if(kq){
                                var output=`
                                <div style="width: 80%;margin: auto;background: #f3eaea80;padding: 35px;">
                                    <h1>Bạn có một yêu cầu tìm mật khẩu từ WebSite: MasterTVC.Com</h1>
                                    <h5>Vui lòng Cick vào link bên dưới để tiến hành đổi mật khẩu.</h5>
                                    <p><a href="https://mastertvc.herokuapp.com/forget/reset-${arr[0]}" >Đổi mật khẩu tại đây!!!Click Now</a></p>
                                </div>
                                `;
                                var transporter=nodemailer.createTransport({
                                    service:"gmail",
                                    host: 'imap.gmail.com',
                                    port: 993,
                                    secure: true, // true for 465, false for other ports
                                    auth:{
                                    user:config.data.email,
                                    pass:config.data.password,
                                    },
                                    tls:{
                                        rejectUnauthorized:false
                                    }
                                })
                                var mail={
                                    from:'Văn Cương <'+config.data.email+'>',
                                    to:email,
                                    subject:'Support WebSite:MasterTVC.herokuapp.com',
                                    text:"Yêu cầu đổi mật khẩu.",
                                    html: output // html body
                                }
                                transporter.sendMail(mail,function (err,result) {  
                                    if(err){
                                        console.log("Gửi Mail Lỗi:"+err);
                                        req.flash("message-err","Không tìm thấy Email: "+email);
                                        return res.redirect("/forget");
                                    }else{
                                        console.log('Email sent');
                                        req.flash("message","Bạn vui lòng kiểm tra Email:"+email+""+" xác nhận lại mật khẩu. "); 
                                        return res.redirect("/forget");
                                    }
                                })
                            }
                        })
                    });
                });
            }
        })
        // Tìm kiếm
    }else{
        req.flash("message","Bạn vui lòng kiểm tra Email:"+email+""+" xác nhận lại mật khẩu. "); 
        return res.redirect("/forget");
    }
    // FIx bug
})
// Load Trang nhập mật khẩu mới
router.get("/reset-:id",function (req,res,next) {  
    var token=req.params.id;
    var message=true;
    // MSG: Thông báo đổi pass thành công
    var msg=req.flash("checkPass");
       // Nếu không có thông báo này mới next()
    user.findOne({resetPasswordToken:token,resetPasswordExpires:{$gt:Date.now()}},function (err,result) {  
        console.log(result);
        if(err||!result){
            // Nếu không tìm thấy thì message=null -> Giao diện hết hạn xử dụng.
            message=null;
        }
        res.render("ResetPassword",{message:message,user:result,info:msg[0]});
    })

});
// Xử lý đổi mật khẩu
router.post("/setnow/:id",function (req,res,next) {  
    var token=req.params.id;
    console.log(token);
    
    var password=req.body.passnew;
    var reqPasswrod=req.body.reqpassnew;
    var data={
        password:reqPasswrod,
        resetPasswordToken:null,
        resetPasswordExpires:null
    }
    if(reqPasswrod==""){
        req.flash("checkPass","Vui lòng nhập mật khẩu mới.");
        return res.redirect("/forget/reset-"+token);
    }else if(reqPasswrod!=password){
        req.flash("checkPass","Mật khẩu của bạn không khớp.");
        return res.redirect("/forget/reset-"+token);
    }else if(reqPasswrod.length<4||req.reqPasswrod>12){
        req.flash("checkPass","Mật khẩu yếu vui lòng nhập lại mật khẩu.");
        return res.redirect("/forget/reset-"+token);
    }else{
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(data.password, salt, function(err, hash) {
                data.password=hash;
                user.updateOne({resetPasswordToken:token,resetPasswordExpires:{$gt:Date.now()}},data,function (err,result) {  
                    if(result){
                        console.log(result);
                        req.flash("checkPass","Đổi mật khẩu thành công.");
                    }
                    return res.redirect("/forget/reset-"+token);
                    
                })
            });
        });
    }
    
   
   
});

module.exports = router;

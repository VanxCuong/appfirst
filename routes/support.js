var express = require('express');
const nodemailer =require("nodemailer");
var config=require("../keys/info");
var router = express.Router();

/* GET users listing. */
/**
 * Trang Chi Tiết Sản Phẩm
 */
router.post('/customer', function(req, res, next) {
    req.check("name","Bạn chưa nhập tên").notEmpty();
    req.check("email","Bạn chưa nhập email").isEmail();
    req.check("phone","Bạn chưa nhập số điện thoại").toInt().isLength({min:9,max:12});
    req.check("content","Bạn chưa nhập nội dung").notEmpty();
    var errors=req.validationErrors();
    if(errors){
        res.send(errors); 
    }else{
        var data={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            content:req.body.content
        }
        var output=`
        <h1>Bạn có một liên hệ mới</h1>
        <h3>Chi Tiết Liên Hệ</h3>
        <ul>
            <li>Tên Khách hàng:${data.name}</li>
            <li>Email:${data.email}</li>
            <li>Số điện thoại:${data.phone}</li>
            <li>Nội Dung:${data.content}</li>
        </ul>
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
            from:'"'+data.name+'" <'+data.email+'>',
            to:'googlythattuyet@gmail.com',
            subject:'Support WebSite:MasterTVC.herokuapp.com',
            text:data.content,
            html: output // html body
        }
        transporter.sendMail(mail,function (err,result) {  
            if(err){
                console.log('Lỗi Send Email:'+err);
                res.send(false);
            }else{
                console.log('Email sent');
                res.send(true);
            }
        })

    }
});
router.post('/contact', function(req, res, next) {
    req.check("title","Bạn chưa nhập tiêu đề").notEmpty();
    req.check("name","Bạn chưa nhập tên").notEmpty();
    req.check("email","Bạn chưa nhập email").isEmail();
    req.check("phone","Bạn chưa nhập số điện thoại").toInt().isLength({min:9,max:12});
    req.check("content","Bạn chưa nhập nội dung").notEmpty();
    
    var errors=req.validationErrors();
    if(errors){
        res.send(errors); 
    }else{
        var data={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            content:req.body.content,
            title:req.body.title
        }
        var output=`
        <h1>Bạn có một liên hệ mới</h1>
        <h3>Chi Tiết Liên Hệ</h3>
        <ul>
            <li>Tên Khách hàng: ${data.name}</li>
            <li>Email Khách hàng: ${data.email}</li>
            <li>Số điện thoại: ${data.phone}</li>
            <li>Nội Dung: ${data.content}</li>
        </ul>
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
            from:'"'+data.name+'" <'+data.email+'>',
            to:'googlythattuyet@gmail.com',
            subject:data.title + "từ MasterTVC.com",
            text:data.content,
            html: output // html body
        }
        transporter.sendMail(mail,function (err,result) {  
            if(err){
                console.log('Lỗi Send Email:'+err);
                res.send(false);
            }else{
                console.log('Email sent');
                res.send(true);
            }
        })

    }
});

module.exports = router;

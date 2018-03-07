const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    fullname:{type:String,default:"Khách hàng"},
    email:{type:String,required:true},
    password:{type:String,required:true},
},{collection:"admin"});
module.exports=mongoose.model("Admin",schema);
const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema=new Schema({
    role:{type:String,required:true,trim:true,unique:true},
},{collection:"role"});
module.exports=mongoose.model("Role",schema);
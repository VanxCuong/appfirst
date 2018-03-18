const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,trim:true,required:true,unique:true},
    link:{type:String,trim:true,required:true,unique:true},
},{collection:"tollbaruser"});
module.exports=mongoose.model("TollbarUser",schema);
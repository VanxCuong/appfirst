const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,trim:true,required:true,unique:true},
    link:{type:String,trim:true,required:true,unique:true},
    level:{type:Number,required:true,trim:true}
},{collection:"admintollbar"});
module.exports=mongoose.model("Admintollbar",schema);
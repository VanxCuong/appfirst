const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,trim:true,required:true},
    link:{type:String,trim:true,required:true}
},{collection:"admintollbar"});
module.exports=mongoose.model("Admintollbar",schema);
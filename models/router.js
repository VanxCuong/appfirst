const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,trim:true,required:true},
},{collection:"router"});
module.exports=mongoose.model("Router",schema);
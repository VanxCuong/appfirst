const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    image:{type:String,trim:true,required:true},
    link:{type:String,trim:true},
},{collection:"router"});
module.exports=mongoose.model("Router",schema);
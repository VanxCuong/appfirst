const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,required:true},
},{collection:"category"});
module.exports=mongoose.model("Category",schema);
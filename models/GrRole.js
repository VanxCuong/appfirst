const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema=new Schema({
    role_id:{type: Schema.Types.ObjectId, ref: 'Role'},
    router_id:{type: Schema.Types.ObjectId, ref: 'Router'},
},{collection:"grouprole"});
module.exports=mongoose.model("GroupRole",schema);
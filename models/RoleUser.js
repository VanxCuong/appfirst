const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    role_id:{type: Schema.Types.ObjectId, ref: 'Role'},
},{collection:"roleuser"});
module.exports=mongoose.model("RoleUser",schema);
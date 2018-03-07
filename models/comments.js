const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    content:{type:String,trim:true},
    product_id:{type: Schema.Types.ObjectId, ref: 'Product' },
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    status:{type:Boolean,default:0},
    create_at:{type:Date,default:Date.now}
},{collection:"comments"});
module.exports=mongoose.model("Comment",schema);
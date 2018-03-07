const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    product_id:[{type: Schema.Types.ObjectId, ref: 'Product' }],
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    status:{type:Boolean,default:1},
    create_at:{type:Date,default:Date.now}
},{collection:"order"});
module.exports=mongoose.model("Order",schema);
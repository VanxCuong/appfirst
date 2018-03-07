const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    product_id:{type: Schema.Types.ObjectId, ref: 'Product' },
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    quanlity:{type:Number},
    customer:{type:String},
    city:{type:String},
    addressorder:{type:String},
    phone:{type:Number},
    pay:{type:String},
    status:{type:Boolean,default:0},
    create_at:{type:Date,default:Date.now}
},{collection:"order"});
module.exports=mongoose.model("Order",schema);
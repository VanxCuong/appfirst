const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    fullname:{type:String,default:"Khách hàng"},
    email:{type:String,required:true,trim:true,unique:true},
    password:{type:String,required:true},
    birthday:{type:String,default:"01/01/1970"},
    phone:{type:String},
    id:{type:Number},
    address:{type:String},
    sex:{type:Boolean,default:1},
    order_id:{type: Schema.Types.ObjectId, ref: 'Order' },
    create_at:{type:Date,default:Date.now},
    level:{type:Number,default:1}
},{collection:"user"});
module.exports=mongoose.model("User",schema);
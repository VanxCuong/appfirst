const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    content:{type:String},
    description:{type:String},
    description_detail:{type:String},
    price_sale:{type:Number,default:100,trim:true},
    price_old:{type:Number,required:true,trim:true},
    price_new:{type:Number},
    amount:{type:Number},
    category_id:{type: Schema.Types.ObjectId, ref: 'Category' },
    status:{type:Boolean,default:1},
    link:{type:String,trim:true,unique:true},
    view:{type:Number,default:0},
    create_at:{type:Date,default:Date.now}
},{collection:"product"});
module.exports=mongoose.model("Product",schema);
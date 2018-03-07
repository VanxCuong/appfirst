function Giohang(oldCart){
    this.items=oldCart.items || {};
    this.add=function(id,object){
        var giohang=this.items[id];
        if(!giohang){
            giohang=this.items[id]={item:object,soluong:0,name:null,city:null,addressorder:null,phone:null,methodPay:null};
        }
        giohang.soluong++;
    }
    this.convertArray=function(){
        var arr=[];
        for(var item in this.items){
            arr.push(this.items[item]);
        }
        return arr;
    }
    this.delete=function(id){
        delete this.items[id];
    }
    this.update=function(id,sl){
        if(sl<1){
            soluong=1;
        }else if(sl>10){
            soluong=10;
        }else{
            soluong=sl;
        }
        cartItem=this.items[id];
        cartItem.soluong=soluong;
    }
    // 
    this.updateinfo=function(name,city,addressorder,phone,methodPay){
        // update hàng loạt các order
        for(var item in this.items){
            this.items[item].name=name;
            this.items[item].city=city;
            this.items[item].addressorder=addressorder;
            this.items[item].phone=phone;
            this.items[item].methodPay=methodPay;
        }
    }
}
module.exports=Giohang;
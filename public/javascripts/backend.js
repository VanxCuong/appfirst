
$(document).ready(function () {
    register();
    checkValEmail();
    checkSesssion();
    checkCategory();
    ShowProducts();
    // Search sản phẩm ở mục tất cả sản phẩm
    AllProductSearch();
    // Search sp ở phần danh mục
    ctgProductSearch();
    MyReturn();
    changeQuantityCart();
    checkRegisterOrder();
    ShowComment();
});
/**
 * Xử lý phần bình luận comment
 */
var pageCmt=`<div class="comment-query">
<div class="frames-query">
    <textarea name="" class="comment-query-main" maxlength="300" id="comment-query-main"  placeholder="Ví dụ: Chất liệu sản phẩm là gì ?"></textarea>
    <p class="success-comment" style="display:none"></p>
    <a href="#" class="submit-comment btn btn-danger">Đặt Câu Hỏi </a>
    <div class="number-max"><span class="number-cout">0</span>/300</div>
</div>
</div>`
var quantityCmt=7;
var showCmt=`<a href="#" class="btnShowBL btn btn-outline-danger text-center" quantityCmt="${quantityCmt}">XEM TẤT CẢ BÌNH LUẬN</a>`
var loadCmt=function (res) {
    var a="",dem=0;
    
    $.each(res, function (indexInArray, valueOfElement) { 
        a+=`<div class="des-comment-product">
            <div class="user-comment">
                <span class="img-user">
                    <i class="fas fa-user-circle"></i>
                </span>
                <span class="name-user">
                    ${valueOfElement.user_id.fullname}
                </span>
                <div class="des-comment">  ${valueOfElement.content}</div>
            </div>
        </div>`
        dem++;
    });
    if(dem==0){
        a=`<p id="comment-null" class="mt-4">Chưa có bình luận nào.</p>`;
    }
    return a;
}
function ShowComment(){
    url="/session";
    /**
     * Xem User đăng nhập chưa
     * Nếu đăng nhập rồi thì hiện khung bình luận
     */
    configGetAjax(url,function (response) {
        if(response){
            $(".pageFixcmt").remove();
            $(".comment-product .title-comment-product").after(pageCmt);
        }
    })
    /**
     * Xử lý gửi bình luận
     */
    $(document).on('click','.submit-comment', function () {
        $(this).html('Đặt câu hỏi <span id="hu-loadNow"><img src="/images/load.gif" alt="" width="50" ></span>');
        var bl=$("#comment-query-main").val();
        var product=$(".comment-product").attr("idproduct");
        var link=$(".comment-product").attr("linkProduct");
        url="/cmt/add";
        console.log(`ID:`+idUser);
        
        data={
            content:bl,
            user_id:idUser,
            product_id:product,
            link:link
        } 
        if(bl==""){
            $(".success-comment").html('Câu hỏi quá ngắn!!').show();
            $(this).html('Đặt câu hỏi');
        }else{
            setTimeout(() => {
                configAjax(url,data,function (response) {
                    if(response==true){
                        $("#hu-loadNow").remove();
                        $(".success-comment").html("Đặt Câu Hỏi thành công. Vui lòng đời xét duyệt").show();
                    }
                })
                
            }, 200);
        }
        $("#comment-query-main").val("")
        return false;
    });
    /**
     * Load Hàng Loạt Bình Luận
     */
    
    var pstCmt=location.pathname.split("/");
    var loadbl="/cmt/select/"+pstCmt[2];
    if(pstCmt[1]=="show"){
        configGetAjax(loadbl,function (res) {
            if(res){
                $("#frames-comment").html(loadCmt(res));
                if(res.length>=7){
                    $(".show-comment").html(showCmt);
                }
            }
        })
    }
    /**
     * click xem thêm comment
     */
    $(document).on('click','.btnShowBL', function () {
        var url= "/cmt/selectall/"+quantityCmt;
        configGetAjax(url,function(res) {
            $("#frames-comment").append(loadCmt(res));
            // ẩn nút xem tất cả bình luận
            quantityCmt+=res.length;
            $(".btnShowBL").remove();
        })
        return false;
    });
}
/**
 * check THANH TOÁN
 * link:http://localhost:3000/deliveryinformation
 */
var moneyShip=20000;
var arrCartId=[];
var createDataOrder=[{
    txtCustomer:"",
    txtPhone:"",
    txtCity:"",
    txtAddressorder:"",
    txtMethodPay:""
}]
    
var successStepone=`<a href="" class="btn btn-primary btn-block disabled"> <i class="fab fa-angellist"></i> Đăng nhập hoàn tất.</a>
<a href="" class="mt-3 btn btn-outline-success successStepOne">Chuyển Sang Bước 2.</a>`;
var huload=`<div class="huload mt-3" display="margin:auto" >
<img src="/images/o2mtzbxKtid.gif" alt="" style="position: relative;left: 50%;transform: translateX(-50%);">
</div>`
var codeSteptwo=function(res){
    var cityname="";
    var methodPay="";
    var Carthtml="";
    /**
     * Xử Lý phương thức thanh toán
     */
    if(createDataOrder[0].txtMethodPay=="0"){
        methodPay=`<div class="form-check">
        <label class="form-check-label">
            <input type="radio" class="form-check-input" name="select-price"  value="0" checked >
            Thanh toán khi nhận hàng
        </label>
        </div>
        <div class="form-check">
            <label class="form-check-label">
                <input type="radio" class="form-check-input" name="select-price"  value="1" >
                Chuyển khoản ngân hàng
            </label>
        </div>`
    }else if(createDataOrder[0].txtMethodPay=="1"){
        methodPay=`<div class="form-check">
        <label class="form-check-label">
            <input type="radio" class="form-check-input" name="select-price"  value="0" >
            Thanh toán khi nhận hàng
        </label>
        </div>
        <div class="form-check">
            <label class="form-check-label">
                <input type="radio" class="form-check-input" name="select-price"  value="1" checked >
                Chuyển khoản ngân hàng
            </label>
        </div>`
    }else{
        methodPay=`<div class="form-check">
        <label class="form-check-label">
            <input type="radio" class="form-check-input" name="select-price"  value="0"  >
            Thanh toán khi nhận hàng
        </label>
        </div>
        <div class="form-check">
            <label class="form-check-label">
                <input type="radio" class="form-check-input" name="select-price"  value="1" >
                Chuyển khoản ngân hàng
            </label>
        </div>`
    }
    /** Xử lý tỉnh thành */
    if(createDataOrder[0].txtCity=="0"){
        cityname=`
            <option value="0">Hồ Chí minh</option>
            <option value="1">Hà Nội</option>
        `
    }else if(createDataOrder[0].txtCity=="1"){
        cityname=`
            <option value="1">Hà Nội</option>
            <option value="0">Hồ Chí minh</option>
        `
    }else{
        cityname=`
            <option value="">Lựa chọn</option>
            <option value="0">Hồ Chí minh</option>
            <option value="1">Hà Nội</option>
        `
    }
    /** Xử lý in sản phẩm */
    Carthtml=shopCartOder(res,function(a,b) {
        console.log(a+b);
      });
    return `<div class="back-out">
<div class="img-back-out">
    <a href="#" class="backouthome">Quay lại Bước 1</a>
</div>
</div>
<div class="row mt-3" id="steptwofalse">
<div class="col-sm-6 col-xs-12 ">
    <div class="card">
        <h3 class="card-header">Thông tin khách hàng</h3>
        <div class="card-block">
            <div class="container">
                <div class="row">
                    <form action="" method="post" class="form-control">
                        <div class="form-group rgt-info row">
                            <label for="name" class="col-6 col-form-label text-right text-right">Tên</label>
                            <div class="col-6">
                                <input class="form-control" name="name" id="customer" type="text" value="${createDataOrder[0].txtCustomer}"  placeholder="Họ & tên">
                                <div class="checkUser false-email" style="display:block" > <span class="require-form">*</span></div>
                                <small id="checkname" class="text-muted reNull"></small>
                            </div>
                        </div>
                        <div class="form-group rgt-info row">
                            <label for="addressCity" class="col-6 col-form-label text-right">Tỉnh/thành phố</label>
                            <div class="col-6">
                                    <select name="addressCity" id="addressCity" class="form-control">
                                        ${cityname}
                                    </select>
                                    <small id="checkadCity" class="text-muted reNull"></small>
                                    <!-- <div class="checkUser false-email" style="display:block" > <span class="require-form">*</span></div> -->
                            </div>
                        </div>
                        <div class="form-group rgt-info row">
                            <label for="address-info" class="col-6 col-form-label text-right">Địa chỉ nhận hàng</label>
                            <div class="col-6">
                                <textarea class="form-control"  placeholder="Địa chỉ nhận hàng (Tầng,số nhà,đường,xã,huyện)" id="addressorder" name="addressorder" id="address-info">${createDataOrder[0].txtAddressorder}</textarea>
                                <div class="checkUser false-email" style="display:block" > <span class="require-form">*</span></div>
                                <small id="checkadOrder" class="text-muted reNull"></small>
                            </div>
                        </div>
                        <div class="form-group rgt-info row">
                            <label for="phoneNumber" class="col-6 col-form-label text-right">Điện thoại di động</label>
                            <div class="col-6">
                                    <input type="number" value="${createDataOrder[0].txtPhone}" name="phone" id="phoneNumber" class="form-control" maxlength="12" placeholder="Số điện thoại"  aria-describedby="helpId">
                                    <div class="checkUser false-email" style="display:block" > <span class="require-form">*</span></div>
                                    <small id="checkphone" class="text-muted reNull"></small>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
        <!-- card-block -->
    </div>
    <!-- card -->
</div>
<div class="col-sm-6 col-xs-12">
    <div class="card">
        <h3 class="card-header">Phương thức thanh toán</h3>
        <div class="card-block">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        ${methodPay}
                        <div class="form-check">
                            <label class="form-check-label">
                                <small id="checkmethodPay" class="text-muted reNull"></small>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    <!-- card Phương thức thanh toán-->
    <div class="card mt-4">
        <h3 class="card-header">Check Sản Phẩm</h3>
        <div class="card-block">
            <div class="container">
                <div class="row">
                    <table class="table table-striped table-bordered table-responsive-sm mt-3">
                        <thead class="thead-light ">
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn Giá</th>
                                <th>Tổng cộng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ Carthtml }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- card-block -->
    </div>
    <!-- card -->
</div>
</div>
<!-- row -->
<div class="frames-success text-center mt-3">
<div class="form-check">
    <label class="form-check-label">
    <input type="checkbox" class="form-checkbox-input" name=""  value="checkedValue" >
    Tôi đã đọc & Đồng ý với <a href="#">Điều kiện</a> và <a href="#">Điều Khoản</a>
    </label>
</div>
</div>
<a href="#" class="btn btn-outline-danger successStepTwo text-center" display"margin:auto">Xác nhận đơn hàng</a>
`
}        
var Sumtotal=0;
var SumProduct=0;
/**
 * Xử lý in sản phẩm
 * @param {} res : array object cart order
 * @param {} cb  : callback xử lý khác,
 */
function shopCartOder(res,cb) {
    var Carthtml="";
    $.map(res.items, function (elementOrValue, indexOrKey) {
        Carthtml+=`<tr>
        <td><img src="/uploads/${elementOrValue.item.image}" width="50" alt=""></td>
        <td>${processString(elementOrValue.item.name)}</td>
        <td>
            ${elementOrValue.soluong}
            
        </td>
        <td>${format(elementOrValue.item.price_new)} VNĐ</td>
        <td>${format(elementOrValue.item.price_new*elementOrValue.soluong)} VNĐ</td>
        </tr>`
        // truyền giá sp vs số lượng sp
        cb(elementOrValue.item.price_new,elementOrValue.soluong);
    })
    return Carthtml;
}
var codeStepThree=function(res){
    var k=0;
    var total=0;
    infoCartOder=shopCartOder(res,function(a,b){
        total+=a*b;
        SumProduct+=Number(b) ;
    })
    /** Fix lỗi quay lại các bước bị tăng giá sản phẩm */
    if(k==0){
        Sumtotal=total;
        k++;
    }
    return `<div class="back-out">
    <div class="img-back-out">
        <a href="" class="backOutStepTwo">Quay lại Bước 2</a>
    </div>
    </div>
    <div class="row">
    <div class="col-sm-12">
        <table class="table table-striped table-bordered table-responsive-xs mt-3">
            <thead class="thead-light ">
                <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn Giá</th>
                    <th>Tổng cộng</th>
                </tr>
            </thead>
            <tbody>
                ${ infoCartOder }
            </tbody>
        </table>
        <div class="deliveryinfomation-sale">
            <h4>Ưu đãi</h4>
            <div class="form-group rgt-info row">
                <label for="name" class="col-5  col-form-label text-right text-right">Sử dụng mã giảm giá (Nếu có)</label>
                <div class="col-5">
                    <input class="form-control" name="name"  type="text" placeholder="Mã giảm giá">
                </div>
            </div>
        </div>
        <!-- deliveryinfomation-sale -->
        <div class="info-customer-order">
            <h3>Đơn hàng</h3>
            <table class="table table-bordered table-responsive-sm">
                    <tr>
                        <th>Thành Tiền</th>
                        <td>${ format(Sumtotal)} VNĐ</td>
                    </tr>
                    <tr>
                        <th>Phí vận chuyển</th>
                        <td>${ format(SumProduct*moneyShip)} VNĐ</td>
                    </tr>
                    <tr>
                        <th>Thuế</th>
                        <td>0 VNĐ</td>
                    </tr>
                    <tr>
                        <th>Mã giảm giá</th>
                        <td>0 VNĐ</td>
                    </tr>
                    <tr>
                        <th class="text-center" style="font-size:20px">Tổng Chi Phí</th>
                        <th class="price-main" style="font-weight:bold;font-size:20px">${ format(SumProduct*moneyShip+Sumtotal)} VNĐ</th>
                    </tr>
            </table>
        </div>
        <!-- info-customer-order -->
        
    </div>
    <!-- col-12 -->
    
    </div>
    <!-- row -->
    <a href="#" class="btn btn-danger successStepThree">Đặt hàng</a>`;
}
var codeStepFour=function(res){
    return `<h4 class="title-sucess mt-3"><span class="dhtc">Đặt hàng thành công</span> <br>  <span>Sản phẩm sẽ được giao trong 2 ngày tới không tính thứ 7 và chủ nhật.</span></h4>
    <a href="/" class="btn btn-outline-success">Quay lại trang chủ</a>
    <a href="/users/ordernew" class="btn btn-outline-success">Kiểm tra đơn hàng</a>`
}
function checkRegisterOrder(){
    url="/session";
    configGetAjax(url,function(response){
        if(response){
            $("#tabsJustifiedContent #home").html(successStepone);
        }
    })
    // CLick xong bước 1
    $(document).on('click','#deliveryInfomation .successStepOne', function () {
        var url="/cart/checkcart";
        configGetAjax(url,function(response){
            if(response){
                console.log(response);
                editItf(".successStepOne","#stepone","#steptwo","#addCart");
                $("#addCart").html(codeSteptwo(response));
            }else{
                console.log("hhihi");
                $(".successStepOne").before("<p class='text-center bg-checked mt-3'>Bạn chưa có sản phẩm nào để thanh toán.</p>");
            }
        })
        return false;
    });
    // CLick xong bước 2
    $(document).on('click','#deliveryInfomation .successStepTwo', function () {
        if($('.form-checkbox-input').is(':checked')){
            // Lấy giá trị name của phương thức giao hàng
            var selectPrice=$('input[name="select-price"]:checked').map(function(){
                return this.value;
            }).get();
            // Dữ liệu bước 2/
            var dl={
                name:$("#customer").val(),
                addressorder:$("#addressorder").val(),
                phone: $("#phoneNumber").val(),
                addresscity:$("#addressCity").val(),
                methodPay:selectPrice[0]
            }
            createDataOrder[0].txtCustomer=dl.name;
            createDataOrder[0].txtAddressorder=dl.addressorder;
            createDataOrder[0].txtCity=dl.addresscity;
            createDataOrder[0].txtPhone=dl.phone;
            createDataOrder[0].txtMethodPay=dl.methodPay;
            console.log(createDataOrder);
            console.log(dl);
            var url="/cart/udi";
            configAjax(url,dl,function(response){
                $.each(response, function (i, v) {
                    if(v.param=="name"){
                        $("#checkname").html(v.msg);
                    }
                    if(v.param=="addressorder"){
                        $("#checkadOrder").html(v.msg);
                    }
                    if(v.param=="phone"){
                        $("#checkphone").html(v.msg);
                    }
                    if(v.param=="addresscity"){
                        $("#checkadCity").html(v.msg);
                    }
                    if(v.param=="methodPay"){
                        $("#checkmethodPay").html(v.msg);
                    }
                });
                if(response==true){
                    var url="/cart/checkcart";
                    configGetAjax(url,function(response){
                        if(response){
                            editItf(".successStepTwo","#steptwo","#stepthree","#checkout");
                            $("#checkout").html(codeStepThree(response));
                        }
                        
                    })
                    
                }
            })
        }else{
            $(this).before("<p class='text-center bg-checked'>Yêu cầu bạn chấp nhận thỏa thuận của chúng tôi.</p>");
        }
        return false;
    });
    // CLick Xong bước 3
    $(document).on('click','#deliveryInfomation .successStepThree', function () {
        
        var CheckQuanLiTyProduct=0;
        console.log(idUser);
        
        var url="/cart/checkcart"
        configGetAjax(url,function(response){
            $.each(response.items, function (indexInArray, valueOfElement) { 
                var dl={
                    idUser:idUser,
                    idProduct:indexInArray,
                    quanlity:valueOfElement.soluong,
                    customer:valueOfElement.name,
                    city:valueOfElement.city,
                    pay:valueOfElement.methodPay,
                    phone:valueOfElement.phone,
                    addressorder:valueOfElement.addressorder
                }
                var url="/cart/order";
                setTimeout(() => {
                    configAjax(url,dl,function(response){
                        if(CheckQuanLiTyProduct==0){ // Nếu số lượng
                            editItf(".successStepThree","#stepthree","#stepfour","#success");
                            $("#success").html(codeStepFour(response));
                            CheckQuanLiTyProduct++;
                        }
                    })
                }, 100);
            });
            CheckQuanLiTyProduct=0;
        })
        
        
        return false;
    });

    // click input ẩn báo lỗi
    $($("#deliveryInfomation .form-control")).click(function (e) {
        console.log("ihi");
        
        $(".reNull").val("");
    });
    /**
     * Xử lý nút quay lại 1.
     */
    $(document).on('click',".backouthome", function () {
        backout(".backouthome","#steptwo",'#stepone','#home');
        return false;
    });
    /**
     * Xử lý nút quay lại 2.
     */
    $(document).on('click',".backOutStepTwo", function () {
        backout(".backOutStepTwo","#stepthree",'#steptwo','#addCart');
        return false;
    });
}
/**
 * Logic Các Bước Đặt hàng:
 * B1: Click success
 * B2: ẩn các tab hiện tại.
 * B3: hiện tab mới
 * @param {*} click : id click đặt hàng và tab Bước 1 ẩn
 * @param {*} a : Bước 1 ẩn
 * @param {*} b : Bước 2 hiện
 * @param {*} c : tab Bước 2 hiện
 */
function editItf(click,a,b,c){
    $(click).after(huload);
    $(a).addClass("disabled");
    $(a).removeClass("active");
    $(a).removeClass("show");
    $(b).removeClass("disabled");
    $(b).addClass("active");
    $(b).addClass("show");
    setTimeout(() => {
        $(click).parent().removeClass("active");
        $(click).parent().removeClass("show");
        $(c).addClass("active");
        $(c).addClass("show");
        $(".huload").remove();
    }, 1000);
}
function backout(click,a,b,c){
    $(click).parent().parent().after(huload);
    $(a).addClass("disabled");
    $(a).removeClass("active");
    $(a).removeClass("show");
    $(b).removeClass("disabled");
    $(b).addClass("active");
    $(b).addClass("show");
    setTimeout(() => {
        $(click).parent().parent().parent().removeClass("active");
        $(click).parent().parent().parent().removeClass("show");
        $(c).addClass("active");
        $(c).addClass("show");
        $(".huload").remove();
    }, 1000);
}
/**
 * THay đổi số lượng giỏ hàng.
 */
function changeQuantityCart(){
    $(".ChangeQuantity").change(function (e) { 
        var z=$(this).val(),
            i=$(this).attr("idu"),
            url="/cart/update/"+z+"/"+i;
        configGetAjax(url,function(response){
            if(response==true){
                location.reload();
            }
        })
    });
}

/**
 * click vào nút tìm kiếm 
 * Trả về: ko chuyển trang
 */
function MyReturn(){
    $("#formSearch").click(function (e) { 
        return false;
    });
}
/**
 * Search sản phẩm ở phần danh mục
 */
function ctgProductSearch(){
    $('.danh-muc #category .search-product #form-search').keyup(function (e) { 
        $("#show-hu-load").show();
        var searchsp=$(this).val(),
            position=location.pathname.split("/"),
            url="/ctg/search",
            idctg=$(this).attr("idctg");
            data={
                searchsp:searchsp,
                idctg:idctg
            };
            
        configAjax(url,data,function(response){
            if(response==false ){
                k++;
                $(".interfacechecksp").html('<p>Không có sản phẩm nào thuộc danh mục:'+position[2] +'- tên: '+searchsp+' </p>').css({"color":"red","font-weight":"bold"});
                $(".icons-load").hide();
            }else{
                $(".interfacechecksp").html("");
                $(".icons-load").show();
            }
            html= eachResult(response);
            $(".home-showProduct").html(html);
            $("#show-hu-load").hide();
            
        })
        return false;
    });
}
/**
 * Search sản phẩm ở mục tất cả sản phẩm
 */
function AllProductSearch(){
    $(document).on('keyup','.allSp #category .search-product #form-search', function () {
        $("#show-hu-load").show();
        var searchsp=$(this).val(),
            url="/admin/search",
            data={searchsp:searchsp};
            console.log(searchsp);
            
        configAjax(url,data,function(response){
            if(response==false ){
                k++;
                $(".interfacechecksp").html('<p>Không có sản phẩm nào tên: '+searchsp+' </p>').css({"color":"red","font-weight":"bold"});
                $(".icons-load").hide();
            }else{
                $(".interfacechecksp").html("");
                $(".icons-load").show();
            }
            html= eachResult(response);
            $(".home-showProduct").html(html);
            $("#show-hu-load").hide();
            
        })
        return false;
    });
}
/**
 * Ajax Search SP
 */
function documentSearch(url,data){
    
}
/**
 * 
 * @param {*} url 
 * @param {*} data 
 * @param {*} cb 
 */
function configAjax(url,data,cb){
    $.ajax({
        type: "post",
        url: url,
        data: data,
        dataType: "json",
        success: cb
    });
}
function configGetAjax(url,cb){
    $.ajax({
        type: "get",
        url: url,
        success: cb
    });
}
function eachResult(response){
    var html="";
    $.each(response, function (indexInArray, valueOfElement) { 
        var thanhtien=valueOfElement.price_old-(valueOfElement.price_old*valueOfElement.price_sale/100); 
        html+=`
        <div class="col-sm-3 mt-3 col-xs-12 ">
        <div class="card-product">
            <div class="card text-left|center|right">
                <div class="img-product">
                    <a href="/show/${valueOfElement.link}"><img class="card-img-top" src="/uploads/${valueOfElement.image}" alt=""></a>
                </div>
                <div class="card-body">
                    <a href="#"><h4 class="card-title">${processString(valueOfElement.name)}</h4></a>
                    <p class="card-text price-new">${ format(thanhtien)}  VNĐ</p>
                    <p class="card-text "> 
                        <span class="price-old">${ format(valueOfElement.price_old)} %</span> 
                        <span class="price-sale">${valueOfElement.price_sale}% </span>
                        
                    </p>
                </div>
                <div class="card-footer">
                    <a href="/admin/editproduct/${valueOfElement.link}.${valueOfElement._id}"><i class="fas fa-edit"></i> Chỉnh Sửa</a>
                    <a href="/admin/removeproduct/${valueOfElement.link}.${valueOfElement._id}" class="float-right"><i class="fas fa-times"></i> Xóa</a>
                </div>
            </div>
        </div>
    </div>
    <!-- col-sm-3 -->
        `;
    });
    
    return html;
}
// Chỉnh giá trị tiền
format=function(money){
    money=money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1.");
    return money;
}
// Fix tên
function processString(gt){
    var k=gt.slice(20);
    if(k){
        gt=gt.slice(0,19)+"...";
    }else{
        gt=gt.slice(0,19);
    }
    return gt;
} ;
/**
 * Click Xem Thêm Nhiều Sản phẩm
 */
var amount=12;
function ShowProducts(){
    $(document).on('click','.icons-load .showProducts', function () {
        $("#show-hu-load").show();
        var amountProduct=$(this).attr("idu");
        url="/showproducts";
        data={amountProduct:amountProduct};
        configAjax(url,data,function(response){
            var html=eachResult(response);
            $(".home-showProduct").append(html);
            console.log(response.length);
            amount+=response.length;
            console.log(amount);
            $(".icons-load").html('<a href="#" class="btn btn-outline-danger showProducts" idu="'+amount+'">Xem Thêm</a>')
            if(amount % 12!=0){
                $(".icons-load").hide();
            }
            $("#show-hu-load").hide();
        });
        return false;
    });
};
/**
 * Kết thúc xem thêm nhiều sản phẩm
 */
/**
 * Load Danh Mục Trang Chủ
 */
function checkCategory(){
    var position=location.pathname;
        position=position.split("/");
    if(!position[2]){
        var html='<li class="list-group-item d-flex justify-content-between align-items-center active "><a href="#">Tất cả sản phẩm</a></li>'
    }else{
        var html=`<li class="list-group-item d-flex justify-content-between align-items-center "><a href="/">Tất cả sản phẩm</a></li>`
    }
    $.ajax({
        type: "GET",
        url: "/category",
        success: function (response) {
            $.each(response, function (indexInArray, valueOfElement) { 
                if(position[2]==valueOfElement.name){
                    html+=`<li class="list-group-item d-flex justify-content-between align-items-center active "><a href="/ctg/${valueOfElement.name}">${valueOfElement.name}</a></li>`
                }else{
                    html+=`<li class="list-group-item d-flex justify-content-between align-items-center "><a href="/ctg/${valueOfElement.name}">${valueOfElement.name}</a></li>`
                }
            });
            $(".list-ctg").html(html);
        }
    });
}

/**
 * Xử Lý Xuất Category ra trang chủ ;
 */
var checkEmail="email",
    checkPassword="reqpassword",
    checkErrPass='<div class="checkUser false-password float-right" style="display:block"><i class="fas fa-exclamation"></i> Mật khẩu không khớp</div>',
    checkErrEmail='<div class="checkUser false-password float-right" style="display:block"><i class="fas fa-exclamation"></i> Bạn nhập sai định dạng Email.</div>',
    k=0,kq=0,
    control='<span class="require-form">*</span>',
    TrueNameEmail='<div class="checkUser true-email" style="display:block"><i class="fas fa-check-circle"></i></div>',
    FalseNameEmail='<div class="checkUser " style="display:block"><i class="fas fa-times"></i> Sai định dạng</div>',
    UserExist='<div class="checkUser " style="display:block"><i class="fas fa-exclamation"></i> Đã tồn tại</div>',
    accessNow='<a class="btn btn-outline-success btn-block accessFlash" href="#form-dangnhap" data-toggle="modal">Đăng nhập ngay<i class="fas fa-users"></i></a>';
    UserSuccess='<div class="dktc text-center accessFlash ">Đăng ký thành công</div>';
// <div class="checkUser true-email" style="display:none"><i class="fas fa-check-circle"></i></div>
/**
 * register check và đăng ký tài khoản
 */
function register(){
    $('#registerEmail,#registerReqPass').click(function (e) { 
        $(".false-email").html(control);
        $(".checkPassword").html(control);
    });
    // $("input").click(function(){
    //     $(".usersuccess").remove(accessNow);
    // })
    $(document).on("click","#User_register", function () {
        var sex=$('input[name="sex"]:checked').map(function(){
            return this.value;
        }).get();
        var email=$("#registerEmail").val(),
            email=email.toLowerCase(),
            days=$("#registerDay").val(),
            month=$("#registerMonth").val(),
            year=$("#registerYear").val(),
            date=days+"/"+month+"/"+year;
        //  Không chọn đủ 3 giá trị này. ngày - tháng - năm mà = 0 thì date= null .
        if(days==0||year==0||date==0){
            date=null;
        }
        var dl={
            name:$("#registerName").val(),
            email:email,
            password:$("#registerPass").val(),
            reqpassword:$("#registerReqPass").val(),
            sex:sex[0],
            date:date
        }
        $.ajax({
            type: "post",
            url: "/register",
            data:dl,
            dataType: "json",
            success: function (response) {
                console.log(response);
                
                if(response==false){
                    $(".false-email").html(UserExist);
                }
                if(response==true && kq==0){
                    kq++;
                    $("#User_register").before(UserSuccess);
                    $("#User_register").before(accessNow);
                    setTimeout(function(){ 
                        $(".accessFlash").remove();
                    }, 3000)
                    $("#registerEmail").val("");
                    $("#registerName").val("");
                    $("#registerPass").val("");
                    $("#registerReqPass").val("");
                }
                $.each(response, function (indexInArray, valueOfElement) { 
                    if(valueOfElement.param==checkEmail){
                        $(".false-email").html(checkErrEmail);
                    }else if(valueOfElement.param==checkPassword){
                        if(k==0){
                            $(".checkPassword").html(checkErrPass);
                            k++;
                        }
                    }
                });
            }
        });
        return false;
    });
}

/**
 * check Email đã có chưa
 */
function checkValEmail(){
    $('#registerEmail').change(function (e) {
        var email=$(this).val();
        if(!validateEmail(email)){
            $(".false-email").html(FalseNameEmail);
        }else{
            var url="/register/checkemail";
            var data={email:email};
            configAjax(url,data,function (response) {
                if(response==true){
                    $(".false-email").html(TrueNameEmail);
                }else{
                    $(".false-email").html(UserExist);
                }
            })
        }
        
    });
}
/**
 * Kiểm tra định dạng email. Đúng thì trả về email sai thì null
 * @param {*} email
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
/**
 * Đăng Nhập
 */
function Dangnhap(){
    $(document).on('click','#UserAcess', function () {
        var username=$("#username-access").val();
        var password=$("#password-access").val();
        var url="/login";
        var data={
            username:username,
            password:password
        }
        configAjax(url,data,function (response) {
            console.log(response);
        });
        return false;
    });
}
/**
 * check xem đã đăng nhập chưa
 */
var idUser;
var Globalnavbar="";
function checkSesssion(){
    var url="/session";
    configGetAjax(url,function (response) {
        if(response){
            idUser=response.user_id._id;
            $(".ulcheckss").html(navHeaderUser(response));
        }else{
            $(".ulcheckss").html(navHeaderUser(response));
        }
    })
    configGetAjax("/giohang",function(response){
        var soluong=0;
        if(response){
            $.each(response.items, function (indexInArray, valueOfElement) { 
                soluong+=Number(valueOfElement.soluong);
            });
            // Do check session quá nhanh nên phải đặt time cho giỏ hàng...
            setTimeout(() => {
                if(soluong==0){
                    $("#quantityCart").html("");
                }else{
                    $("#quantityCart").html(`(${soluong})`);
                }
            }, 200);
        }else{
            $("#quantityCart").html("");
        }
    })
}
/**
 * 
 * @param {*} res 
 */
function navHeaderUser(res){
    var navadmin="";
    var navHeader="";
    if(res==""){
        navHeader=`<li class="nav-item">
                <a class="nav-link" href="#form-dangnhap" data-toggle="modal">Đăng Nhập <i class="fas fa-users"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/register">Đăng Ký <i class="fas fa-address-card"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/cart">Giỏ hàng <i class="fas fa-cart-plus"></i> <span id="quantityCart"></span></a>
            </li>`
    }else{
        if(res.role_id.role=="Quản trị"||res.role_id.role=="ADMIN"){
            navadmin='<li class="nav-item"><a class="nav-link " href="/admin">Quản trị</a></li>';
        }
        navHeader=`
            ${navadmin}
            <li class="nav-item"><a class="nav-link " href="/users/order">Kiểm tra đơn hàng</a></li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Xin Chào ${res.user_id.fullname}</a>
                <div class="dropdown-menu dropdown-checkout">
                    <a class="dropdown-item" href="/users">Thông tin cá nhân</a>
                    <a class="dropdown-item" href="/logout">Đăng xuất</a>
                </div>
            </li>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/cart">Giỏ hàng <i class="fas fa-cart-plus"></i> <span id="quantityCart"></span> </a>
            </li>
        `;
    }
    return navHeader;
}
$(document).ready(function () {
    productEditImg();
    searchsp();
    deletesp();
    showProduct();
    ShowSortDecrease();
    ShowSortIncrease();
    ShowOrderSuccess();
    showTollbar();
    AcceptCmt();
    handlingOrder();
    ShowComments();
    ShowUsers();
    EditImgSlide();
});
/**
 * Xử lý Slider
 */
/**
 * $(this).after('<input type="file" name="imagesProduct"  class="form-control" >');
            $(this).next().after('<a href="#" class="CancelEditImg btn btn-danger mt-3">Hủy</a>');
 */
var insert=`
    <div class="edit-picture">
        <input type="file" name="imagesProduct"  class="form-control" >
        <a href="#" class="CancelEditImg btn btn-danger mt-3">Hủy</a>
    </div>
`;
function EditImgSlide(){
    var click=0;
    $(document).on('click','.show-edit-img', function () {
        
        if(click==0){
            click++;
            console.log('click:'+click);
        
            $(this).parent().after(insert);
        }
        return false;
    });
    $(document).on('click',".CancelEditImg", function () {
        click=0;
        $(this).parent().remove();
        return false;
    });
}
/**
 * Hàm tối ưu code click xem thêm sản phẩm
 * @param {*} a : Class or ID Click
 * @param {*} b : url post
 * @param {*} cb : function: Xử lý chức năng khác
 */
function fixCodeShow(a,b,cb){
    $(document).on('click','#'+a+'', function () {
        $(".Hu-load").show();
        var sl=$(this).attr("sl");
        var url=b;
        var data={sl:sl};
        configAjax(url,data,function (response) {  
            if(response){
                cb(response,sl);
                $(".Hu-load").hide();
            }
        });
        return false;
    });
}

//Fix code search SP
/**
 * Hàm tối ưu code tìm kiếm sản phẩm
 * @param {*} a : Class or ID Click
 * @param {*} b : url post
 * @param {*} cb : function: Xử lý chức năng khác
 */
function fixCodeSeach(a,b,cb){
    $(document).on('keyup',a, function () {
        $(".Hu-load").show();
        var searchsp=$(this).val(),
            url=b,
            data={searchsp:searchsp};
            configAjax(url,data,function(response){
                if(response==false ){
                    $("#reloads").html("");
                    $(".checksp").html('<p>Không tìm thấy: '+searchsp+' </p>').css({"color":"red","font-weight":"bold"});
                }else{
                    $(".checksp").html("");
                    cb(response);
                }
                $(".Hu-load").hide();
                
            })
        return false;
    });
}
/**
 * Xem thêm Users
 */
function ShowUsers() {  
    // Xem THêm User
    fixCodeShow("ShowUsers","/admin/ShowUsers",function (response,sl) {  
        $("#reloads").append(UsersCode(response));
        if(response.user.length<20){
            $('.ShowUsers').hide();
        }
        sl=Number(sl)+Number(response.user.length);
        $('.ShowUsers').html(`<a href="#" class="btn btn-danger" id="ShowUsers" sl="${sl}" </a>Xem Thêm</a>`);
    });
    //Tìm Kiếm User
    fixCodeSeach(".manager-users #form-search","/admin/searchUsers",function (response) {  
        html= UsersCode(response);
        $("#reloads").html(html);
        $("#ShowUsers").hide();
    })
    /** Select theo cấp bậc */
    $(document).on('click','.selectLevel', function () {
        idRole=$(this).attr("idu");
        configGetAjax("/admin/selectLevel/"+idRole,function (response) {  
            if(response){
                html= UsersCode(response);
                $("#reloads").html(html);
                $("#ShowUsers").hide();
            }
        })
        return false;
    });
}
function UsersCode(res) {  
    var kq="";
    var role="";
    $.each(res.role, function (i, v) { 
        role+=`<option value="${v._id}">${ v.role }</option>`;         
    });
    $.each(res.user, function (i, v) { 
        kq+=`<tr>
            <td class="text-center"><a href="">${ v.user_id.fullname }</a></td>
            <td>${ v.user_id.email }</td>
            <td>********</td>
            <td>
                <p id="roleUser">${ v.role_id.role }</p>
                <select class="form-control select-role" name="role"  style="display:none">
                    <option value="">${ v.role_id.role }</option>
                    ${role}
                </select>
            </td>
            <td>OFFLINE</td>
            <td>
                <div class="behavior">
                    <a href="" class="float-left btn btn-outline-success edit-user">Chỉnh sửa</a>
                    <a href="/admin/deleteUser/${v.user_id._id}" onclick="if(!confirm('Bạn có muốn sẽ xóa tất cả thông tin liên quan đến:${ v.user_id.email} ?')){return false;}"  class="float-right btn btn-outline-danger del-user" >Xóa</a>
                </div>
                <div class="behavior-success" style="display:none">
                    <a href=""class="float-right btn btn-outline-success btn-block save-user"  idu="${ v.user_id._id }">Lưu</a>
                </div>
            </td>
        </tr>`;
    });
    return kq;
}
/**
 * Xử lý trạng thái order
 */
function handlingOrder() {  
    $(document).on('click','.fix-status', function () {
        $(this).next().show();
        $(this).hide();
        return false;
    });
    $(document).on('change',"select[name='successStatus']", function () {
        id=$(this).attr("idu");
        if($(this).val()=="1"){
            configGetAjax("/admin/handlingStatus/"+id,function (res) {
                $('#reloads').load(location.href + " #reloads>*");
            })
        }else if($(this).val()=="2"){
            configGetAjax("/admin/delOrder/"+id,function (res) {
                $('#reloads').load(location.href + " #reloads>*");
            })
        }else{
            $('#reloads').load(location.href + " #reloads>*");
        }
    });
    
}

/**
 * Xử Lý Phần Bình Luận
 */
function AcceptCmt(){
    // Chấp nhận bình luận
    xulybinhluan(".manager-comments #AcceptCmt",function(id){
        return "/admin/acceptsCmt/"+id;
    });
    // Xóa cmt
    xulybinhluan(".manager-comments #deleteCmt",function(id){
        return "/admin/deleteCmt/"+id;
    });
    // Xóa tất cả bình luận
    xulybinhluan(".manager-comments #DeleteALL",function(id){
        return "/admin/DeleteALL/";
    });
    // Thêm tất cả bình luận
    xulybinhluan(".manager-comments #AcceptALL",function(id){
        return "/admin/AcceptALL/";
    });
}
var xulybinhluan=function(a,cb){
    $(document).on('click',a, function () {
        var id=$(this).attr("idu");
        url=cb(id);
        if(confirm("Bạn có đồng ý không ?")){
            configGetAjax(url,function(response){
                if(response==true){
                    $('#reloads').load(location.href + " #reloads>*");
                }
            })
        }
        return false;
    });
}
// Xem Thêm Bình Luận
function ShowComments(){
    fixCodeShow("ShowComments","/admin/showComments",function (response,sl) {  
        $(".manager-comments #reloads").append(CommentsCode(response));
        sl=Number(sl)+Number(response.length);
        if(response.length<20){
            $(".ShowComments").hide();
        }
        $(".ShowComments").html(`<a href="#" class="btn btn-danger" id="ShowComments" sl="${sl}" </a>Xem Thêm</a>`);
    });
}
function CommentsCode(res){
    kq="";
    $.each(res, function (i, v) { 
        kq+=`<tr>
            <td><a href="/show/${ v.product_id.link }"><img src="/uploads/${ v.product_id.image }" width="50" alt=""></a></td>
            <td idkh="${ v.user_id._id}"><a href="">${ v.user_id.fullname}</a></td>
            <td >${ v.content}</td>
            <td>
                <a href="" class="float-left btn btn-outline-success" id="AcceptCmt" idu="${ v._id}" >Chấp nhận </a>
                <a href=""class="float-right btn btn-outline-danger " id="deleteCmt" idu="${ v._id}" >Xóa</a>
            </td>
        </tr>`
    });
    return kq;
}
/**
 *  Xem Thêm Order
 */
function ShowOrderSuccess(){
    fixCodeShow("showOrderSucces","/admin/showOrderSuccess",function (response,sl) {  
        $(".manager-order-success #reloads").append(OrderSuccess(response));
        sl=Number(sl)+Number(response.length);
        if(response.length<20){
            $(".showOrderSucces").hide();
        }
        $(".showOrderSucces").html(`<a href="#" class="btn btn-danger" id="showOrderSucces" sl="${sl}" </a>Xem Thêm</a>`);
    });
    // Tìm kiếm sản phẩm
    fixCodeSeach(".manager-order-success #form-search","/admin/searchOrderSuccess",function (response) {  
        html= OrderSuccess(response);
        $("#reloads").html(html);
        $("#showOrderSucces").hide();
    });
}
function OrderSuccess(res) {  
    kq="";
    $.each(res, function (i, v) { 
        kq+=`<tr>
        <td><a href="">${ v.user_id.fullname}</a></td>
        <td>${ getDateTime(v.create_at) }</td>
        <td><a href="/show/${ v.product_id.link }"><img src="/uploads/${ v.product_id.image }" width="50" alt=""></a></td>
        <td>${ v.product_id.name}</td>
        <td>${ v.quanlity}</td>
        <td>${ format(v.quanlity*v.product_id.price_new) } VNĐ</td>
        <td>
            <p>Hoàn tất</p>
        </td>
    </tr>`
    });
    return kq;
    
}
function getDateTime(date) {
    var d = new Date(date);
    var hour = d.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = d.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = d.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = d.getFullYear();

    var month = d.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = d.getDate();
    day = (day < 10 ? "0" : "") + day;

    return   hour + ":" + min +" - " + day + "/" + month+ "/" +year ;
};
/**
 * Kết thúc xử lý order
 */
/**
 * Amount: Số lượng sản phẩm mặc định tại http://localhost:3000/admin/managerProduct
 */
var amount=9; 
// Click Xem giá giảm dần
function ShowSortDecrease(){
    checkSort("/admin/Decrease","Decrease");
}
// click xem giá tăng dần
function ShowSortIncrease(){
    checkSort("/admin/Increase","Increase");
}
/**
 * Checksort Hàm chuyền dữ liệu 
 * @param {*} url : Đường dẫn bắt sự kiện
 * @param {*} idClick : ID frontend click
 */
function checkSort(url,idClick){
    $(document).on('click','#'+idClick+'', function () {
        var number=$("#showProduct").attr("idsp");
        data={number:number};
        configAjax(url,data,function(response){
            var html=eachResulta(response);
            $(".show-sp-search").html(html);
        });
        return false;
    });
}
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
/**
 * Click Show Product
 */

function showProduct(){
    $(document).on('click','.manager-product #showProduct', function () {
        $(".Hu-load").show();
        $amount=$(this).attr("idsp");
        data={amount:$amount};
        url="/admin/amountProduct";
        configAjax(url,data,function(response){
            amount+=response.length;
            var html=eachResulta(response);
            $(".show-sp-search").append(html);
            // Nếu kết quả trả về < 9 thì ẩn button xem thêm sp
            if(response.length<9){
                $("#showProductMain").hide();
            }
            // Gán lại button xem thêm sản phẩm tại http://localhost:3000/admin/managerProduct
            $("#showProductMain").html('<a href="#" class="btn btn-outline-danger" id="showProduct" idsp="'+amount+'">Xem Thêm</a>')
            $(".Hu-load").hide();
        })
        return false;
    });
}
function eachResulta(response){
    var html="";
    $.each(response, function (indexInArray, valueOfElement) { 
        var thanhtien=valueOfElement.price_old-(valueOfElement.price_old*valueOfElement.price_sale/100); 
        html+=`
        <div class="col-sm-4 mt-3 col-xs-12 ">
        <div class="card-product">
            <div class="card text-left|center|right">
                <div class="img-product">
                    <a href="/show/${valueOfElement.link}"><img class="card-img-top" src="/uploads/${valueOfElement.image}" alt=""></a>
                </div>
                <div class="card-body">
                    <a href="#"><h4 class="card-title">${processString(valueOfElement.name)}</h4></a>
                    <p class="card-text price-new">${ format(thanhtien)}  VNĐ</p>
                    <p class="card-text "> 
                        <span class="price-old">${ format(valueOfElement.price_old)} %></span> 
                        <span class="price-sale">${valueOfElement.price_sale}%</span>
                        
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
/**
 * Xóa Sản Phẩm
 */
function deletesp(){
    $(document).on('click','#admin-del-product', function () {
        if(confirm("Bạn Có chắc muốn xóa sản phẩm này không?")){
            var id=$(this).attr("href"),
                url="/admin/removeproduct",
                data={id:id};
            configAjax(url,data,function(response){
                if(response==true){
                    location.reload();
                }else{
                    alert("Xóa Không Thành Công");
                }
            })
        }
        return false;
    });
}
/**
 * Search sản phẩm
 */
var k=0;
function searchsp(){
    fixCodeSeach(".manager-product #form-search","/admin/search",function (response) {  
        html= eachResulta(response);
        $(".show-sp-search").html(html);
        $("#showProduct").hide();
    })
}
/**
 * Hiển thị thanh công cụ:
 */
function showTollbar(){
    configGetAjax("/admin/searchtollbar",function (response) {  
        var html='<li class="disabled ">ADMIN</li>';
            $.each(response, function( index, value ) {
                if(value.link==location.pathname){
                    html+=`<li class="active"><a href="${value.link}">${value.name}</a></li>`;
                }else{
                    html+=`<li><a href="${value.link}">${value.name}</a></li>`;
                }
            });
            $(".ul-list-info").html(html);
    })
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
 * Click sửa ảnh
 */
var img=0;
function productEditImg(){
    $(".productEditImg").click(function (e) { 
        if(img==0){
            img++;
            $(this).after('<input type="file" name="imagesProduct"  class="form-control" >');
            $(this).next().after('<a href="#" class="CancelEditImg btn btn-danger mt-3">Hủy</a>');
            $(this).hide();
        }
        return false;
    });
    $(document).on('click','.CancelEditImg', function () {
        img=0;
        $(".productEditImg").show();
        $(this).prev().remove();
        $(this).remove();
        return false;
    });
}

$(document).ready(function () {
    productEditImg();
    searchsp();
    deletesp();
    showProduct();
    ShowSortDecrease();
    ShowSortIncrease();
    showTollbar();
    AcceptCmt();
});
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
            var html=eachResult(response);
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
            var html=eachResult(response);
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
function eachResult(response){
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
    $('.manager-product #form-search').keyup(function (e) { 
        var searchsp=$(this).val(),
            url="/admin/search",
            data={searchsp:searchsp};
            configAjax(url,data,function(response){
                if(response==false ){
                    k++;
                    $(".checksp").html('<p>Không có sản phẩm nào tên: '+searchsp+' </p>').css({"color":"red","font-weight":"bold"});
                }else{
                    $(".checksp").html("");
                }
                html= eachResult(response);
                $(".show-sp-search").html(html);
            })
        return false;
    });
}
/**
 * Hiển thị thanh công cụ:
 */
function showTollbar(){
    $.ajax({
        type: "get",
        url: "/admin/searchtollbar",
        dataType: "json",
        success: function(response){
            var html='<li class="disabled ">ADMIN</li>';
            $.each(response, function( index, value ) {
                if(value.link==location.pathname){
                    html+=`<li class="active"><a href="${value.link}">${value.name}</a></li>`;
                }else{
                    html+=`<li><a href="${value.link}">${value.name}</a></li>`;
                }
            });
            $(".ul-list-info").html(html);
        }
    });
}
// Chỉnh giá trị tiền
format=function(money){
    money=money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1.");
    return money;
}
// Fix tên
function processString(gt){
    var k=gt.slice(10);
    if(k){
        gt=gt.slice(0,9)+"...";
    }else{
        gt=gt.slice(0,9);
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
        $(".productEditImg").show();
        $(this).prev().remove();
        $(this).remove();
        return false;
    });
}

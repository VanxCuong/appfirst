$(document).ready(function () {
    penciluser();
    EditUser();
});
/**
 * Edit interface User
 */
function EditUser(){
    $(document).on('click','.behavior .edit-user', function () {
        $(this).parent().next().show();
        $(this).parent().parent().prev().prev().children("#roleUser").hide();
        $(this).parent().parent().prev().prev().children(".select-role").show();
        $(this).parent().hide();
        return false;
    });
    $(document).on('click','.behavior-success .save-user', function () {
        $(this).parent().prev().show();
        $(this).parent().parent().prev().prev().children("#roleUser").show();
        $(this).parent().parent().prev().prev().children(".select-role").hide();
        $(this).parent().hide();
        var role=$(this).parent().parent().prev().prev().children(".select-role").val();
        var user_id=$(this).attr("idu");
        $.ajax({
            type: "post",
            url: "/admin/editusers",
            data: {
                role_id:role,
                user_id:user_id
            },
            dataType: "json",
            success: function (response) {
                if(response){
                    $('#reloads').load(location.href + " #reloads>*");
                }
            }
        });
        return false;
    });
}
/**
 * Chỉnh sửa quản lý tài khoản
 */
function penciluser(){
    var k=0,k1=0,k2=0;
    var Notsame="Bạn vui lòng nhập đúng mật khẩu";
    $(document).on('click','.pencil-info', function () {
        var id=$(this).attr("idu");
        if(k==0){ 
            $(".fix-info-now .pencil-info-hidden").css("display","none");
            $(".fix-info-now .pencil-info-show").css("display","block");
            $(this).html("Lưu");
            k++;
        }else{
            var days=$("#DayInfo").val(),
                month=$("#MonthInfo").val(),
                year=$("#YearInfo").val();
            birthday=days+"/"+month+"/"+year;
            if(days==0||month==0||year==0){
                birthday=null;
            }
            var dl={
                _id:id,
                fullname:$("#NameInfo").val(),
                sex:$("#SexInfo").val(),
                birthday:birthday,
                id:$("#idInfo").val(),
            }
            var link="/users/updateInfoUser", // Đường dẫn ajax
                reload="reload-info"; // ID reload 1 phần của trang
            // Ajax sử lý update thông tin cá nhân
            configUser(link,dl,reload);
            $(".fix-info-now .pencil-info-show").css("display","none");
            $(".fix-info-now .pencil-info-hidden").css("display","block");
            $(this).html("Chỉnh sửa");
            k=0;
            
        }
        return false;
    });
    $(".pencil-contact").click(function(){
        var _id=$(this).attr("idu");
        if(k1==0){ 
            $(".info-contact .pencil-contact-info").css("display","none");
            $(".info-contact .pencil-contact-show").css("display","block");
            $(this).html("Lưu");
            k1++;
        }else{
            // dữ liệu cần update
            var dl={
                _id:_id,
                address:$("#addressInfo").val()
            }
            var link="/users/updateContact",
                reload="reload-contact";
            configUser(link,dl,reload);
            $(".info-contact .pencil-contact-show").css("display","none");
            $(".info-contact .pencil-contact-info").css("display","block");
            $(this).html("Chỉnh sửa");
            k1=0;
        }
        return false;
    })
    /**
     * Đổi mật khẩu User
     * passOld: Pass cũ
     * passNew: Pass nhập mới
     * passRep: Pass nhập lại
     * logic: Click đổi mật khẩu nếu k2=0 thì show khung đổi mk và tăng k2 lên 1
     * K2 !=0 thì sẽ xử lý đổi mật khẩu vs database qua ajax.
     */
    $(document).on('click','.pencil-user', function () {
        var id=$(this).attr("idu");
        var passOld=$("#passOld").val(),
            passNew=$("#passNew").val(),
            passRep=$("#passRep").val(),
            dl={
                _id:id,
                passOld:passOld,
                passNew:passNew,
                passRep:passRep
            };
        if(k2==0){
            k2++;
            $(this).after('<a href="#"" class="btn btn-outline-warning btn-block close-pencil-user">Đóng</a>')
            $(".pencil-user-info").css("display","none");
            $(".pencil-user-show").css("display","block");
        }else{
            $.ajax({
                type: "post",
                url: "/users/updatePassword",
                data: dl,
                dataType: "json",
                success: function (response) {
                    // return sucess
                    if(response==true){
                        $("#success-password").html('Đổi mật khẩu thành công');
                        $(".pencil-user-show").css("display","none");
                        $(".pencil-user-info").css("display","block");
                        $(".close-pencil-user").remove();
                        k2=0;
                        $("#passOld").val("");
                        $("#passNew").val("");
                        $("#passRep").val("");
                    } 
                    // return err
                    if(response==false){
                        $("#success-password").html('Mật khẩu cũ không đúng');
                    }
                    // return err từ req.check with express-validator
                    $.each(response, function (indexInArray, valueOfElement) { 
                         if(valueOfElement.param=="passRep"){
                             $("#success-password").html(valueOfElement.msg);
                         }
                    });

                    
                }
            });
            
            
        }
        return false;
    });
    //click đóng đổi mật khẩu
    $(document).on("click",".close-pencil-user", function () {
        k2=0;
        $(".pencil-user-show").css("display","none");
        $(".pencil-user-info").css("display","block");
        $("#success-password").html("");
        $(this).remove();
        return false;
    });
    // click vào 1 trong 3 ô đổi mật khẩu sẽ ẩn chữ báo lỗi
    $("#passOld,#passNew,#passRep").click(function (e) { 
        $("#success-password").html("");
    });
}
function configUser(link,dl,reload){
    $.ajax({
        type: "post",
        url: link,
        data: dl,
        dataType: "json",
        success: function (response) {
            if(response==true){
                $('#'+reload+'').load(location.href + " #"+reload+">*");
            }
        }
    });
}
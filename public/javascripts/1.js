$(document).ready(function () {
    showMenu();
    scroll();
    cmt();
    backTop();
    feedback();
});
function showMenu(){
    $(".nav-item.dropdown").hover(function () {
        $(this).children().addClass("show");
    }, function () {
        $(this).children().removeClass("show");
    }
);
}
function scroll(){
    $(window).scroll(function () { 
        if($(window).scrollTop()>0){
            $(".header").addClass("fixed-top")
        }
        if($(window).scrollTop()==0){
            $(".header").removeClass("fixed-top")
        }
    });
}
function cmt(){
    $(document).on('keyup',"#comment-query-main", function () {
        var val=$(this).val();
        $(".number-cout").html(val.length);
    });
}
function backTop(){
    var k=0;
    $(window).scroll(function(){
        if($(window).scrollTop()>$(window).height()){
            $(".scrollTop").show();
            k=0;
        }
        else{
            $(".scrollTop").hide();
        }
        $(document).on('click','.scrollTop', function () {
            if(k==0){
                k++;
                $("body,html").animate({
                    scrollTop:0
                },800);
            }
        });
    })
    
}
/**
 * Xử lý feedBack
 */
function feedback(){
    $(document).on('click','.feedback .fd-nav', function () {
        $(this).hide();
        $(this).next().show();
    });
    $(document).on('click','.feedback .fb-show .card-header', function () {
        $(this).parent().parent().hide();
        $(this).parent().parent().prev().show();
    });
}
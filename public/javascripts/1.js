$(document).ready(function () {
    showMenu();
    scroll();
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
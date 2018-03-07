jQuery(document).ready(function($) {
	var native_width=0,
		navtive_height=0;
	// kích hoạt hiệu ứng khi hover
	$(".show-product").mousemove(function(e) {
		// Tính kích thước thật của ảnh;
		// chỉ sau khi tính toán xong kích thước thật ta mới show phiên bản room của ảnh
		if(!native_width && !navtive_height){
			var image_object=new Image();
			image_object.src=$(".img-product-main img").attr("src");
			native_width=image_object.width;
			navtive_height=image_object.height;
			
		}else{
			var magnify_offset=$(this).offset();
			// mx my là tọa độ của chuột  so với ảnh
			var mx=e.pageX - magnify_offset.left;
			var my=e.pageY- magnify_offset.top;
			// e.pageX : vị trí chuột chiều ngang của màn hình  ( ----------)
			// e.pageY : vị trí chuột chiều dọc của màn hình ( | )
			// $(this).height() Độ cao của ảnh
			// $(this).width() Độ rộng của ảnh
			// fadeout kính lúp khi chuột bên ngoài div 
			if(mx<$(this).width() && my<$(this).height() && my>0&&mx>0){
				$(".large").fadeIn('fast');
			}else{
				$(".large").fadeOut('fast');
			}
			if($(".large").is(':visible')){
				// ảnh to ở trong kính lúp
				// mx/độ rộng ảnh nhỏ sẽ ra tỉ lệ của mouse vs ảnh, nhân vs độ rộng của kích thước thật 
				// sẽ ra vị trí tương ứng của chuột trên ảnh to
				// một nửa độ rộng ảnh thật để căn giữa kính lúp 
				// dùng function mathround để làm tròn 
				// Vì background position dùng pixel nên cần trả về giá trị âm 
				rx=Math.round(mx/$(".img-product-main img").width()*native_width-$(".large").width()/2)*-1;
				ry=Math.round(my/$(".img-product-main img").height()*navtive_height-$(".large").height()/2)*-1;
				var bgp=rx+"px "+ry+"px";
				// di chuyển kính lúp theo chuột
				var px=mx-$(".large").width()/2;
				var py=my-$(".large").height()/2;
				$(".large").css({
					left:px,
					top:py,
					"transform":"scale(1.5)",
					"background-position":bgp
				})
			}
		}
	});
});
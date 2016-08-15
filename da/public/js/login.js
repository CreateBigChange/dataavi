$(function(){
	$(".screenbg ul li").each(function(){
		$(this).css("opacity","0");
	});
	$(".screenbg ul li:first").css("opacity","1");
	var index = 0;
	var t;
	var li = $(".screenbg ul li");	
	var number = li.size();
	function change(index){
		li.css("visibility","visible");
		li.eq(index).siblings().animate({opacity:0},3000);
		li.eq(index).animate({opacity:1},3000);
	}
	function show(){
		index = index + 1;
		if(index<=number-1){
			change(index);
		}else{
			index = 0;
			change(index);
		}
	}
	t = setInterval(show,8000);
	//根据窗口宽度生成图片宽度
	var width = $(window).width();
	$(".screenbg ul img").css("width",width+"px");

	//ajax

	var url="/api/v1/user/login";
	
	function ajax(username,passwd,url)
	{
		$.ajax({
		url:url,
		type:"post",
		dataType:"json",
		data:JSON.stringify({username:username, passwd:passwd}),
		success:function(user)
		{
				if(user=='username or password error')
				{
					alert("账号或者密码错误;");
				}	
				else
				{
					window.location.href="/index.html?user_id="+user.id+"&sid="+user.sid;
				}
		},
		error:function()
		{
			alert("账号或者密码错误");
		}
		});
	}
	$("#login").click(function(){
		var username = $("#username")[0].value;
		var passwd = $("#passwd")[0].value; 
		ajax(username,passwd,url);

	})
});

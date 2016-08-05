


 /***************************正则匹配参数修改全局变量以及数据初始化**************/
    str =window.location.search;
    var reg = new RegExp(/\?user_id=(\d)+&sid=((.?)+)/);
    arr=str.match(reg);
    user_id=arr[1];
    sid=arr[2];
    num=0;
    type="teleplay";
    platform="all";
    limit=20;
    offset=0;
    order_by="day_play_counts";
    _="1470066582355";
    url="http://hnsdmp.com/api/v1/user/3/playinfo";
    $("[type='teleplay']").css("background","#d1cdc8");
    /******************************搜索***********************************/
    $("#searchVa").click(function () {
        type ="variety";
       window.location.href="http://hnsdmp.com/two.html?name="+$("#searchInput").val()+"&type="+type+"&sid="+sid+"&user_id="+user_id;

    })

    $("#searchTv").click(function () {
        type="teleplay";
        window.location.href="http://hnsdmp.com/two.html?name="+$("#searchInput").val()+"&type="+type+"&sid="+sid+"&user_id="+user_id;

    })

    /************************** type选择******************************/
    $("#teleplay").click(function () {
        $(".type").css("background","#ffffff");
         type =$(this).attr("type");
        $(this).css("background","#d1cdc8");
        num=0;
        offset=0;
        $("#appendone").empty();
        $("#appendtwo").empty();
        pageajax(type,  platform  ,limit  ,offset  ,sid , order_by  ,_,url);
    })

    $("#variety").click(function () {
        $(".type").css("background","#ffffff");
        type =$(this).attr("type");
        $(this).css("background","#d1cdc8");
        num=0;
        offset=0;
        $("#appendone").empty();
        $("#appendtwo").empty();
        pageajax(type,  platform  ,limit  ,offset  ,sid , order_by  ,_,url);
    })
    /***************************platform选择*****************************************/
    $(".platform").click(function () {
        platform = $(this).attr("platform");
        //清空所有子节点 相关参数设置
        num=0;
        offset=0;
        $("#appendone").empty();
        $("#appendtwo").empty();
        pageajax(type,  platform  ,limit  ,offset  ,sid , order_by  ,_,url);
    });

    /************************************左右滑动参数配置 ********/



    $(".inner div").css("width", screen.width);
    $(".inner ").css("width", screen.width * 2);
    $(".body ").css("height", screen.height-60);
    $(".inner ").css("height", screen.height -300);
    $("body").css("height", screen.height);

    /*3.设定每次移动的距离,和，最多移动的次数*/
    Flipsnap('.inner',{
        distance:screen.width,
        maxPoint:2        //最多移动的次数
    });

/****************** * 菜单模态框的配置*************************************/

    function overlay() {
        var e1 = document.getElementById('mymodal-overlay');
        var e2 = document.getElementById('modal-data');
        e1.style.visibility = (e1.style.visibility == "visible"  ) ? "hidden" : "visible";
        var sm = $("#showModal");
        if (sm.css("display") == "none")
            sm.css("display", "block");
        else
            sm.css("display", "none");
    }

    $("#more").click(function () {
        overlay();
    })
    $(".myButton2").click(function () {
        overlay();
    })
    $(".myButton1").click(function () {
        overlay();
    })


/**********************************************8向下滚动事件的配置及数据的获取 *************/
    $(window).bind('scroll', function() {
        show()
    });
    function show() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            num++;
            offset=num*20;
            pageajax(type,  platform  ,limit  ,offset  ,sid , order_by  ,_,url);
        }
    }
    /*********************数据重置*************************************************/


/*******************************************************************
 * function ajax 获取数据
 * @param type
 * @param platform
 * @param limit
 * @param offset
 * @param sid
 * @param order_by
 * @param _
 * @param url
 */
    function pageajax(type,  platform  ,limit  ,offset  ,sid , order_by  ,_,url)
    {
        var htmlone ="";
        var htmltwo ="";
        url+="?type="+type+"&platform="+platform+"&limit="+limit+"&offset="+offset+"&sid="+sid+"&order_by="+order_by+"&_="+_;

        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            data:JSON.stringify({}),
            success:function(data)
            {
               console.log(data);
                if(data=='username or password error')
                {
                    alert("密码或者账号错误");
                }
                else
                {
                   for(var i =0;i<data.length;i++){
                       htmlone+="<tr><td>"+data[i].name+"</td><td>"+data[i].avg_play+"</td><td>"+data[i].all_play_counts+"</td></tr>";
                       htmltwo+="<tr><td>"+data[i].day_play_counts+"</td><td>"+data[i].current_number+"/"+data[i].all_number+"</td><td>"+data[i].time_at+"</td></tr>";
                   }
                    $("#appendone").append(htmlone);
                    $("#appendtwo").append(htmltwo);
                }
            },
            error:function()
            {
                alert("请求失败");
            }
        });
    }


/***********************************angular 数据绑定 初始化 * ************************/
    var app = angular.module('myApp', []);
    app.controller('customersCtrl', function($scope, $http) {
        $http.get("http://hnsdmp.com/api/v1/user/"+user_id+"/playinfo?type=teleplay&platform=all&limit=20&offset=0&sid="+sid+"&order_by=day_play_counts&_=1470066582355")
                .success(function(response) {
                    console.log(response);
                    $scope.names = response;
                });
    });

   
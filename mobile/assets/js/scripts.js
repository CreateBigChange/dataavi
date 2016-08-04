
jQuery(document).ready(function() {

    /**
     * 前段验证密码和账号
     */
    $('.page-container form').submit(function(){
        var username = $(this).find('.username').val();
        var password = $(this).find('.password').val();
        if(username == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '27px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.username').focus();
            });
            return false;
        }
        if(password == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '96px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.password').focus();
            });
            return false;
        }
    });

    $('.page-container form .username, .page-container form .password').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });

    /**
     * 验证用户的ajax
     * @param username
     * @param passwd
     * @param url
     */

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
                     alert("密码或者账号错误");
                }   
                else
                {
                    window.location.href="/mobileBrief.html?user_id="+user.id+"&sid="+user.sid;
                }
        },
        error:function()
        {
            alert("请求失败");
        }
        });
    }
    
$("#login").click(function () {
    var userName = $("#userName").val();
    var passWord = $("#passWord").val();
    var url="http://hnsdmp.com/api/v1/user/login";
    ajax(userName,passWord,url);
})
});

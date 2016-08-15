$(function() {
    var user_id = $.getUrlParam("user_id");
    var sid = $.getUrlParam("sid");
    if (!user_id || !sid) {
        window.location.href = "./login.html";
    } else {
        $("#upload").click(function() {
            var formData = new FormData();
            formData.append('file', $('#file')[0].files[0]);
            $.ajax({
                url: '/api/v1/user/1/upload?sid=' + sid,
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    alert("上传成功");
                },
                error: function (xhr, status, err) {
                    alert(JSON.parse(xhr.responseText).message);
                },
            });
        });
    }
});

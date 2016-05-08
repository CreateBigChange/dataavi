function getcookie(objname){
    var ck=document.cookie.split(';');
    for(var i=0;i<ck.length;i++){
        temp=ck[i].split("=");
        if(temp[0].substr(1)==objname)
            return decodeURI(unescape(temp[1]));
        if(temp[0]==objname)
            return decodeURI(unescape(temp[1]));
    }
    return false;
}


function setcookie(name,value)
{
    var exp = new Date();
    exp.setTime(exp.getTime() + 3600 * 24 * 1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function delcookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() -3600);
    if(getck(name))
    document.cookie = name + "="+ getck(name) + ";expires=" + exp.toGMTString();
}


String.prototype.format=function()
{
  if(arguments.length==0) return this;
  for(var s=this, i=0; i<arguments.length; i++)
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
  return s;
};

(function ($) {
    $.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
    }
})(jQuery);


function rawMarkup(txt) {
    if (!txt) {
        return { __html: "" };
    }
    console.log(txt);
    rawMark = marked(txt, {sanitize: false});
    return { __html: rawMark };
};

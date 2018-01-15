/**
 * Created by Jack on 2016/5/26.
 * 登录页面 js
 */

$(function () {

    pageInit();//页面 样式初始化
    var userName = localStorage.getItem("userLogin_name");
    //var userPwd = localStorage.getItem("userLogin_pwd");

    if (userName == "" || userName == null) {
    }
    else {
        $("#userName").val(userName);
        //$("#password").val(userPwd).focus();
        $(".pwd_remember").find("input").attr("checked", "checked")
    }


});
//页面 样式初始化
var pageInit = function () {
    //设置content的高度
    var w_width = $(window).width();
    var height = w_width * 5 / 16;//content 高度
    $(".content").height(height);

    //form表单的 css
    var pTop = parseInt($(".content form").css("padding-top"));//form 表单padding-top
    var pBtm = parseInt($(".content form").css("padding-bottom"));//form 表单padding-bottom
    var top = (height - $(".content form").height() - (pTop + pBtm)) / 2;
    $(".content form").css("top", top);
};
//enter键 登录
var CheckIsEnter = function (e) {
    var k = window.event ? e.keyCode : e.which;
    if (k == 13) {
        submitSignin();
    }
};
//登录
var submitSignin = function () {

    var login_name = $.trim($("#userName").val());
    var login_pwd = $.trim($("#password").val());

    if (login_name == "") {
        toastrMsg("warning", "请输入姓名！");
        return;
    }
    if (login_pwd == "") {
        toastrMsg("warning", "请输入密码！");
        return;
    }
    if (!$(".captcha_container").is(":hidden") && $(".captcha_container").find("input").val() == "") {
        toastrMsg("warning", "请输入验证码！");
        return;
    }


    var obj = new Object();
    obj.account = login_name;
    obj.password = login_pwd;
    obj.captcha = $(".captcha_container").is(":hidden") ? "" : $(".captcha_container").find("input").val();
//        alert(JSON.stringify(user))

    branPostRequest("signin", obj, function (data) {
        //alert(JSON.stringify(data));

        if (data.code == 1000) {

            if (data.result.code == 2) {    //超过10次输入错误
                toastr.error("超过10次输入错误，请联系管理员");
                return;
            }
            if (data.result.code == 1) {    //要输入验证码
                var img_url = data.result.captcha_url;//
                var img = $("<img />").attr("src", img_url);

                $(".captcha_container").show().find(".imgCode").html(img);
                //toastr.error("请输入验证码");
                return;
            }

            if ($(".pwd_remember").find("input").is(":checked")) { //记住用户名
                localStorage.setItem("userLogin_name", login_name);
                //localStorage.setItem("userLogin_pwd", login_pwd);
            }
            else {
                localStorage.setItem("userLogin_name", "");
                //localStorage.setItem("userLogin_pwd", "");
            }

            location.replace("main");

        }
        else {
            toastrMsg("error", data.msg);//"无法登录,请联系管理员\n" +
            CaptchaChange();

        }

    }, function (error) {
        branError(error)
    });

};
// 点击 更改验证码
var CaptchaChange = function () {
    var user_name = $.trim($("#userName").val());
    if (user_name == "") {
        return
    }

    var obj = new Object();
    obj.account = user_name;

    var url = "captcha" + "?" + jsonParseParam(obj);

    branGetRequest(url, function (data) {
        //alert(JSON.stringify(data))

        if (data.code == 1000) {
            var img_url = data.result.url;//

            if (img_url) {
                var img = $("<img />").attr("src", img_url);
                $(".captcha_container").show().find(".imgCode").html(img);

                pageInit();//页面 样式初始化
            }
            else {   //没有图片URL
                $(".captcha_container").hide();
            }
        }
        else {
            branError(data.msg);
        }

    }, function (error) {
        branError(error)
    })

};



<template>

    <div class="middle-box text-center loginscreen  animated fadeInDown login_bg">

        <header>
            <div class="login_bg1"></div>
            <div class="hotline_container">
                <div class="line">
                    <img src="./assets/image/phone.png">
                    <span>全国服务热线</span>
                </div>
                <div class="hotline_phone">4006-710-710</div>
            </div>
        </header>

        <div class="content">

            <form class="m-t" role="form" method="post" action="">
                <h4 style="">招才进宝企业后台管理登录</h4>

                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <img src="./assets/image/icon_userName.png">
                        </div>
                        <input v-model="userName" type="text" class="form-control"
                               placeholder="用户名" required="" maxlength="18"
                               autocomplete="off" v-on:blur.prevent="CaptchaChange">
                    </div>
                </div>

                <div class="form-group">

                    <div class="input-group">
                        <div class="input-group-addon">
                            <img src="./assets/image/icon_userPwd.png">
                        </div>
                        <input v-model="userPwd" type="password" class="form-control" maxlength="32"
                               placeholder="密码" required="" autocomplete="off"
                               v-on:keypress="CheckIsEnter">
                    </div>
                </div>

                <div class="form-group captcha_container" style="">

                    <div class="input-group">
                        <div class="input-group-addon">
                            <img src="./assets/image/icon_userPwd.png">
                        </div>

                        <input v-model="captcha" type="text" class="form-control" maxlength="20"
                               placeholder="验证码">
                    </div>

                    <div class="imgCode" v-on:click="CaptchaChange"></div>
                </div>

                <div class="form-group" style="float:left;width:100%;">
                    <div class="col-xs-6" style="">
                        <div class="checkbox pwd_remember">
                            <label>
                                <input type="checkbox" v-model="name_remember">
                                <span>记住用户名</span>
                            </label>
                        </div>
                    </div>
                    <!--<div class="col-xs-6 pwd_modify" style="line-height: 40px;display: none;"-->
                    <!--onclick="pwdModifyModalShow()">-->
                    <!--修改密码-->
                    <!--</div>-->
                </div>

                <button id="submitBtn" type="button"
                        class="btn btn-primary block full-width m-b"
                        @click="submitSignin" style="width:100%;margin-bottom:10px;">
                    登录
                </button>

            </form>

        </div>

        <footer>
            <div>苏州不木网络科技有限公司版权所有 苏ICP备16004093号-1 版本V2.4</div>
            <div>
                <span>本系统仅支持</span>
                <a title="点击下载Chrome浏览器"
                   href="http://www.blueku.com/ChromeStandalone_50.0.2661.102_Setup.exe">Chrome浏览器</a>
            </div>
        </footer>

    </div>

</template>

<script>
    // import $ from 'jquery'

    export default {

        name: "Login",
        data: () => {
            return {

                userName: "",//用户名称
                userPwd: "",//用户密码
                captcha: "",//验证码
                name_remember: true,//是否记住密码

            }
        },
        created: function () {

            //查看是否记住用户名
            this.userName = localStorage.getItem("userLogin_name");

            if (this.userName) {
                this.name_remember = true;
            }
            else {
                this.name_remember = true;
            }


        },
        mounted: function () {
            this.pageInit();//页面 样式初始化
        },
        watch: {},
        methods: {

            pageInit: function () {
                $("body").css("padding", 0);
                $("#wrapper").css("background-color", "transparent");
                //设置content的高度
                var w_width = $(window).width();
                var height = w_width * 5 / 16;//content 高度
                $(".content").height(height);

                console.log("页面宽度 ------ " + $(window).width());

                //form表单的 css
                var pTop = parseInt($(".content form").css("padding-top"));//form 表单padding-top
                var pBtm = parseInt($(".content form").css("padding-bottom"));//form 表单padding-bottom
                var top = (height - $(".content form").height() - (pTop + pBtm)) / 2;
                $(".content form").css("top", top);

            },

            //enter键 登录
            CheckIsEnter: function (event) {
                let k = window.event ? event.keyCode : event.which;
                console.log("key ------- " + k);
                if (k === 13) {
                    this.submitSignin();//登录
                }
            },

            //登录
            submitSignin: function () {
                console.log("login..........");
                console.log(this.$route)
                this.$router.push({path: 'main'})
                console.log(this.$route)
//                alert("登录")
                return
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

            },

            // 点击 更改验证码
            CaptchaChange: function () {
                console.log("用户名称 ------- " + this.userName);


                return

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

            }

        }

    }

</script>


<style scoped>

    /*$light:red*/

    .login_bg {
        width: 100% !important;//
        margin: 0;
        max-width: inherit;
        padding: 0;
    }

    header {
        position: relative;
        width: 100%;
        padding: 0 10%;
        height: 80px;
    }

    header .login_bg1 {
        background: url("./assets/image/login_bg3.png") no-repeat;
        background-size: 100% 100%;
        width: 196px;
        height: 45px;
        position: relative;
        top: 17px;
        float: left;
    }

    header .hotline_container {
        position: relative;
        float: right;
        top: 20px;
        font-size: 12px;
        margin-right: 50px;
    }

    header .hotline_container .line {
        position: relative;
        width: 100%;
        line-height: 21px;
        color: rgb(102, 102, 102);
        font-weight: bold;
    }

    header .hotline_container .line img {
        position: relative;
        width: 15px;
        height: 15px;
        top: 3px;
        margin-right: 5px;
        float: left;
    }

    header .hotline_container .hotline_phone {
        color: rgb(35, 135, 195);
        line-height: 19px;
        letter-spacing: 1.5px;
    }

    .content {
        position: relative;
        width: 100%;
        background: url("./assets/image/login_bg4.png") no-repeat;
        background-size: 100% 100%;
    }

    .content form {
        position: absolute;
        right: 100px;
        top: 170px;
        width: 300px;
        padding: 0 20px 20px;
        background-color: #fff;
        border-radius: 5px;
    }

    .content form h4 {
        line-height: 40px;
        color: #0064b6;
    }

    .content form .col-xs-6 {
        padding: 0;
        cursor: pointer;
        color: #0064b6;
    }

    .content form .captcha_container {
        display: none;
        position: relative;
    }

    .content form .captcha_container .imgCode {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 99;
        width: 28%;
    }

    .content form .captcha_container .imgCode img {
        width: 100%;
        height: 100%;
    }

    footer {
        position: relative;
        width: 100%;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
        color: rgb(153, 153, 153);
        margin-top: 20px;
    }

    @media screen and (max-width: 1000px) {
        .content form {
            position: absolute;
            right: 60px;
            width: 260px;
            padding: 0 20px;
            background-color: #fff;
            border-radius: 5px;
        }

        .content form h4 {
            line-height: 30px;
        }

        .content form .captcha_container .imgCode {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 99;
            width: 33%;
        }

        .form-group {
            margin-bottom: 8px;
        }
    }

</style>
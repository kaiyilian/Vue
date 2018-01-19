<template>

    <div class="row border-bottom" id="head_layout">

        <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0;display:none;">

            <div class="navbar-header">
                <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#">
                    <i class="fa fa-bars"></i>
                </a>
            </div>

        </nav>

        <div class="logo" style="" onclick="indexTabOnclick();">
            <img src="../../assets/image/logo.png"/>
        </div>

        <div class="txt">招才进宝企业管理后台</div>

        <div class="txt1" style="position: absolute;top:0;width:100%;left:0;text-align: center;line-height:75px;">
            吐槽请联系 赵先生：13915581423
        </div>

        <div class="user_info">
            <span class="icon_message"
                  onclick="getInsidePageDiv(urlGroup.notification.index,'notification_center', '消息中心')"></span>
            <span class="icon_user_head"></span>
            <span class="user_name"></span>
            <span class="txt">，您好！</span>

            <span class="pwd_modify_container" onclick="pwdModifyModalShow()">
            <img src="../../assets/image/icon_pwd_modify.png"/>
            <span>修改密码</span>
        </span>

            <span class="login_out_container" onclick="LoginOut()">
            <img src="../../assets/image/icon_login_out.png"/>
            <span>退出</span>
        </span>

        </div>
    </div>

</template>

<script>
    export default {
        name: "bran-header"
    }
</script>

<style scoped>
    /*@import "../../assets/css/layout/head_layout.css";*/

    #head_layout {
        position: fixed;
        width: 100%;
        height: 75px;
        top: 0;
        left: 0;
        margin: 0;
        background-color: #fff;
        /*box-shadow: 0 4px 8px 1px rgba(0, 0, 0, 0.15);*/
        z-index: 1030;
    }

    #head_layout .logo {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 11px;
        left: 30px;
        z-index: 1;
        cursor: pointer;
    }

    #head_layout > .txt {
        position: relative;
        width: 100%;
        line-height: 74px;
        font-size: 20px;
        color: #242a30;
        padding: 0 100px;
    }

    #head_layout .user_info {
        position: absolute;
        right: 25px;
        top: 0;
        height: 100%;
        padding: 25px 0;
        color: #242a30;
        line-height: 25px;
    }

    #head_layout .user_info .icon_message {
        width: 22px;
        height: 19px;
        float: left;
        margin: 3px 8px 3px 3px;
        background: url("../../assets/image/icon_contract/icon_message.png") no-repeat;
        background-size: contain;
        cursor: pointer;
    }

    #head_layout .user_info .icon_user_head {
        width: 18px;
        height: 18px;
        float: left;
        margin: 3px;
        background: url("../../assets/image/icon_navbar/icon_navbar.png") no-repeat -21px 0;
    }

    #head_layout .user_info span {
        display: block;
        float: left;
    }

    #head_layout .user_info span img {
        width: 18px;
        height: 18px;
        float: left;
        margin: 3px;
    }

    #head_layout .user_info .pwd_modify_container,
    #head_layout .user_info .login_out_container {
        cursor: pointer;
        margin-left: 5px;
    }

    /*弹框 */

    .pwd_modify_modal .modal-body {
    }

    .pwd_modify_modal .modal-body .row {
        margin-left: 0;
        margin-right: 0;
    }

    .pwd_modify_modal .modal-body .row .col-xs-2 {
        padding: 0;
        text-align: center;
        line-height: 34px;
    }

</style>
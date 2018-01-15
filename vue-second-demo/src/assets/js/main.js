var PERMISSION_DENIED_CODE = "2003";
var SESSION_TIMEOUT = "2004";

var $pwd_modify_modal;//修改密码 弹框

$(function () {

    $pwd_modify_modal = $(".pwd_modify_modal");
    //修改密码弹框 - 显示（初始化）
    $pwd_modify_modal.on("show.bs.modal", function () {
        var $row = $pwd_modify_modal.find(".modal-body .row");
        $row.find("input").val("");
    });

});

//获取用户信息
var getUserInfo = function () {
    var url = urlGroup.home.userInfo_by_home;//

    branGetRequest(
        url,
        function (data) {
            //alert(JSON.stringify(data))

            if (data.code == 1000) {

                var id = "";
                var name = "";
                var company_name = "";
                var last_login_time = "";
                var last_login_ip = "";//

                if (data.result.id) {
                    id = data.result.id;
                }
                else {
                    id = "";
                }

                if (data.result.name) {
                    name = data.result.name;
                }
                else {
                    name = "";
                }

                if (data.result.last_login_time) {
                    last_login_time = data.result.last_login_time;
                    last_login_time = new Date(last_login_time).toLocaleString().replace(/\//g, "-");
                }
                else {
                    last_login_time = "";
                }

                if (data.result.last_login_ip) {
                    last_login_ip = data.result.last_login_ip;
                }
                else {
                    last_login_ip = "";
                }

                if (data.result.corp_name) {
                    company_name = data.result.corp_name;
                }
                else {
                    company_name = "";
                }

                $("#head_layout").find(".user_name").html(name);//head中 用户姓名

                var $user_info = $(".index_container").find(".user_info");
                $user_info.find(".corp_name").html(company_name);
                //$user_info.find(".user_name").html(name);
                $user_info.find(".last_login_time").html(last_login_time);
                $user_info.find(".last_login_ip").html(last_login_ip);

                sessionStorage.setItem("user_name", name);
                sessionStorage.setItem("user_id", id);

            }
            else {
                branError(data.msg);
            }

        },
        function (error) {
            branError(error);
        }
    )
};

//修改密码弹框显示
var pwdModifyModalShow = function () {
    $pwd_modify_modal.modal("show");
};

//密码 修改确认
var pwdModifySure = function () {
    var txt = "";
    var old_pwd = $.trim($pwd_modify_modal.find(".old_pwd input").val());
    var new_pwd = $.trim($pwd_modify_modal.find(".new_pwd input").val());
    var new_pwd_sure = $.trim($pwd_modify_modal.find(".new_pwd_sure input").val());

    if (old_pwd == "") {
        txt = "请输入旧密码";
    }
    else if (new_pwd == "") {
        txt = "请输入新密码";
    }
    else if (new_pwd_sure == "") {
        txt = "请输入确认密码";
    }
    else if (new_pwd_sure != new_pwd) {
        txt = "两次密码输入不一致！";
    }

    if (txt != "") {
        toastr.error(txt);
        return
    }

    var obj = {};
    obj.account = sessionStorage.getItem("user_name");//:'登录名',
    obj.id = sessionStorage.getItem("user_id");//:'用户id',
    obj.old_password = old_pwd;//:'旧密码',
    obj.new_password = new_pwd;//:'新密码'

    branPostRequest(
        urlGroup.basic.pwd_modify,
        obj,
        function (data) {

            if (data.code == 1000) {
                $pwd_modify_modal.modal("hide");
                toastr.success("密码修改成功，3s后请重新登录！");
                setTimeout(function () {
                    location.replace("login");
                }, 3000)
            }
            else {
                branError(data.msg);
            }

        },
        function (error) {
            branError(error)
        }
    )
};

//登出
var LoginOut = function () {

    operateMsgShow("是否确认退出", function () {

        var url = urlGroup.basic.Login_Out;
        var obj = {};

        loadingInit();

        branPostRequest(url, obj, function (data) {
            if (data.code == 1000) {
                location.replace("login")
            }
            else {
                branError(data.msg)
            }

        }, function (error) {
            branError(error);
        })

    });

};

/**
 * 点击左侧菜单栏，请求tab的内容div
 * @param requestURL    请求actioin的路由
 * @param pageTabId        选项卡Id
 * @param pageName        选项卡名称
 */
var getInsidePageDiv = function (requestURL, pageTabId) {
    //内容展示
    var div = $("<div></div>");
    div.addClass("wrapper wrapper-content");
    div.attr("id", "page_" + pageTabId);
    div.attr("data-id", pageTabId);
    $('#content-main').html(div);
    //div.appendTo($('#content-main'));

    showPageLoadHUD('#page_' + pageTabId);//加载动画 加载中。

    $.ajax({
        type: "get",
        url: requestURL,
        async: true,
        success: function (data, status, jqXHR) {
            //debugger
            if (data["code"] == PERMISSION_DENIED_CODE) {
                toastr.error("页面没有访问权限");
                //removeTab(pageTabId, event);
                //console.log("remove" + pageTabId);
            }
            else if (data["code"] == SESSION_TIMEOUT) {
                location.href = "login";
            }
            else {
                $('#page_' + pageTabId).html(data); //填充内容

                //初始化左侧菜单
                initNav(pageTabId);
            }
        }
    });
};

//初始化左侧菜单
var initNav = function (pageTabId) {

    //如果是首页
    if (pageTabId == "index") {
        var $index = $("#side-menu > li").find("li").first();

        $index.addClass("active");
        $index.siblings().removeClass("active");
        $index.siblings().find(".in").removeClass("in");

        return
    }

    //当前tab对应的navbar 显示
    $("#side-menu > li > ul > li > a").each(function () {

        var id = $(this).attr("data-id");

        if (id == pageTabId) {

            var $cur_li = $(this).closest("li");
            var $cur_ul = $cur_li.closest("ul");
            var $cur_p_li = $cur_ul.parent("li");

            $cur_li.addClass("active");
            $cur_li.siblings("li").removeClass("active");
            $cur_ul.addClass("in");

            $cur_p_li.addClass("active");
            $cur_p_li.siblings("li").removeClass("active");
            $cur_p_li.siblings("li").find(".in").removeClass("in");
            $cur_p_li.siblings("li").find(".active").removeClass("active");


        }

    });

};


///////////暂时不用///////////
///////////暂时不用///////////
///////////暂时不用///////////
///////////暂时不用///////////


/**
 * tab 标签 参数
 **/
//var existedTabIdArrya = new Array("index");//保存选项卡的数组 (默认有首页)
//var selectedTabId = null;//选中的标签对应的id
//var $content_tabs;//tab 外层container
//var $J_tabLeft;//向左 按钮
//var $J_tabRight;//向右 按钮
//var $J_tabClose;//关闭 按钮
//var $J_menuTabs;//tab按钮 外层(总的)
//var $J_menuTab_container;//tab按钮 container(现有的)
//var $J_menuTab;//tab 按钮
//
//var tabLineWidth;//tab 一行的 宽度
//var tabLineCurIndex;//当前tab所在行的index （从1 开始）
//var tabCountInLine;//一行中的 tab的数量
//var tabLineTotal;//tab 一共的行数
//var $itemTabWidth;//每个tab的宽度（含padding+margin）

$(function () {

    //initTabParams();//初始化 标签的 参数
    //
    ////tab 一行的 宽度
    //tabLineWidth = $content_tabs.width() - ($J_tabLeft.width() + 12) -
    //	($J_tabRight.width() + 12) - ($J_tabClose.width() + 12);
    ////一行中的 tab的数量
    //tabCountInLine = Math.floor(tabLineWidth / $itemTabWidth);
    //
    //$pwd_modify_modal = $(".pwd_modify_modal");
    ////修改密码弹框 - 显示（初始化）
    //$pwd_modify_modal.on("show.bs.modal", function () {
    //	var $row = $pwd_modify_modal.find(".modal-body .row");
    //	$row.find("input").val("");
    //});

});

//初始化 标签的 参数
var initTabParams = function () {
    $content_tabs = $("#page-wrapper .content-tabs");
    $J_tabLeft = $content_tabs.find(".J_tabLeft");//向左 按钮
    $J_tabRight = $content_tabs.find(".J_tabRight");//向右 按钮
    $J_tabClose = $content_tabs.find(".J_tabClose");//关闭 按钮
    $J_menuTabs = $content_tabs.find(".J_menuTabs");//tab按钮 外层(总的)
    $J_menuTab_container = $J_menuTabs.find("#div_page_tabs");//tab按钮 container(现有的)
    //$J_menuTab = $J_menuTab_container.find(".J_menuTab");//tab 按钮

    //tab 一行的 宽度
    tabLineWidth = 0;
    //一行中的 tab的数量
    tabCountInLine = 0;
    tabLineCurIndex = 1;//当前tab所在行的index （从1 开始）
    tabLineTotal = 0;//tab 一共的行数
    $itemTabWidth = 110;//每个tab的宽度（含padding+margin）
};

/**
 * 点击左侧菜单栏，请求tab的内容div
 * @param requestURL    请求actioin的路由
 * @param pageTabId        选项卡Id
 * @param pageName        选项卡名称
 */
var getInsidePageDiv1 = function (requestURL, pageTabId, pageName, succFun) {

    if ($.inArray(pageTabId, existedTabIdArrya) < 0) {  //如果标签还没有
        existedTabIdArrya.push(pageTabId);//数组加入新的item

        //添加选项卡
        var a = $("<a></a>").html(pageName);//赋值标签名称
        a.attr("id", "tab_" + pageTabId);//tab标签 id
        a.attr("data-id", pageTabId);
        a.addClass("J_menuTab");//赋值标签class
        a.click(function () {
            menuTabOnclick(pageTabId, succFun);
        });
        a.appendTo($J_menuTab_container);//放入标签组

        //关闭按钮
        var li = $("<li></li>");
        li.addClass("fa fa-times-circle");
        li.click(function () {
            removeTab(pageTabId, event);
        });
        li.appendTo(a);

        //内容展示
        var div = $("<div></div>");
        div.addClass("wrapper wrapper-content");
        div.attr("id", "page_" + pageTabId);
        div.attr("data-id", pageTabId);
        div.appendTo($('#content-main'));

        showPageLoadHUD('#page_' + pageTabId);//加载动画 加载中。

        //ajaxSetup();//

        $.ajax(requestURL, {
            async: true,
            success: function (data, status, jqXHR) {
                if (data["code"] == PERMISSION_DENIED_CODE) {
                    toastr.error("页面没有访问权限");
                    removeTab(pageTabId, event);
                    //console.log("remove" + pageTabId);
                }
                else if (data["code"] == SESSION_TIMEOUT) {
                    location.href = "login";
                }
                else {
                    $('#page_' + pageTabId).html(data); //填充内容
                    menuTabOnclick(pageTabId, succFun);//点击对应的tab
                }
            }
        });
    }
    else {
        menuTabOnclick(pageTabId, succFun);//标签选中事件
    }
};

//首页按钮点击事件
var indexTabOnclick = function () {
    menuTabOnclick("index");
};

//选项卡选中事件
var menuTabOnclick = function (pageTabId, succFun) {

    //tab标签组中 该按钮被选中
    $('#tab_' + pageTabId).addClass("active").siblings(".J_menuTab").removeClass("active");
    //选中的id
    selectedTabId = pageTabId;
    //页面 对应的内容展示
    $('#page_' + pageTabId).show().siblings(".wrapper").hide();

    tabInit(pageTabId);//tab内容初始化

    //当前tab对应的navbar 显示
    $("#side-menu > li > ul > li > a").each(function () {

        var id = $(this).attr("data-id");

        if (id == pageTabId) {

            var $cur_li = $(this).closest("li");
            var $cur_ul = $cur_li.closest("ul");
            var $cur_p_li = $cur_ul.parent("li");

            $cur_li.addClass("active");
            $cur_li.siblings("li").removeClass("active");
            $cur_ul.addClass("in");

            $cur_p_li.addClass("active");
            $cur_p_li.siblings("li").removeClass("active");
            $cur_p_li.siblings("li").find(".in").removeClass("in");
            $cur_p_li.siblings("li").find(".active").removeClass("active");


        }

    });

    if (succFun) {
        succFun();
    }

};

//tab内容初始化
var tabInit = function (pageTabId) {
    var cur_tab = $("#tab_" + pageTabId);

    //当前tab所在行的index
    tabLineCurIndex = Math.ceil((cur_tab.index() + 1) / tabCountInLine);
    //tab 总行数 (+1)
    tabLineTotal = Math.ceil($J_menuTab_container.find(".J_menuTab").length / tabCountInLine);

    //第一步 判断当前标签是否在一屏内

    var currentTabIndex = cur_tab.index();//当前标签index

    var prevTabWidth = 0;//当前标签之前标签的总长度

    //遍历 该项标签之前的标签
    for (var i = 0; i < currentTabIndex; i++) {
        //var itemWidth = $itemTab.eq(i).width() + 30 + 1;
        prevTabWidth += $itemTabWidth;//获取之前标签的总长度
    }

    //如果当前标签 可以展示在 一屏中
    if ((prevTabWidth + $itemTabWidth) <= tabLineWidth) {
        //前方左右标签显示
        //$("#page-wrapper > .content-tabs #div_page_tabs").animate({marginLeft: 0}, "fast");
        $J_menuTab_container.animate({marginLeft: 0}, "fast");
    }
    else {
        var moreWidth = prevTabWidth + $itemTabWidth - tabLineWidth;//tab中超出一行tab的宽度

        //向左移动的长度
        var marginLeft = Math.ceil(moreWidth / $itemTabWidth) * $itemTabWidth;


        $J_menuTab_container.animate({marginLeft: -marginLeft}, "fast")

    }

};

//关闭选项卡事件
var removeTab = function (pageTabId, event) {
    event.stopPropagation();//阻止事件冒泡

    var cur_tab = $("#tab_" + pageTabId);//当前tab
    var tabIndex = $.inArray(pageTabId, existedTabIdArrya);//当前tab index

    if (tabIndex > 0) {//不能关闭首页
        existedTabIdArrya.splice(tabIndex, 1);//先从数组中删除
        cur_tab.remove();//删除 tab
        $('#page_' + pageTabId).remove();//删除 div

        //如果 删除的是 最后一个标签
        if (existedTabIdArrya.length <= tabIndex) {
            menuTabOnclick(existedTabIdArrya[--tabIndex]);//选中前面的tab
        }
        else {
            menuTabOnclick(existedTabIdArrya[tabIndex]);//选中后面的tab
        }

    }

};

//选中上一个tabLine事件
var PrevLineTab = function () {

    //如果在 第1页
    if (tabLineCurIndex <= 1) {
        return
    }
    else {
        tabLineCurIndex -= 1;
        var moreWidth = (tabLineCurIndex - 1) * tabCountInLine * $itemTabWidth;

        $J_menuTab_container.animate({marginLeft: -moreWidth}, "fast")
    }

};

//选中下一个tab事件
var NextLineTab = function () {
    //debugger
    if (tabLineCurIndex >= tabLineTotal) {
        return
    }
    else {
        var moreWidth = tabLineCurIndex * tabCountInLine * $itemTabWidth;
        tabLineCurIndex += 1;

        $J_menuTab_container.animate({marginLeft: -moreWidth}, "fast")
    }

};

//关闭全部选项卡
var closeAllTabs = function () {
    $J_menuTab_container.find(".J_menuTab").each(function () {
        var pageTabId = $(this).attr("data-id");//当前标签id

        var tabIndex = $.inArray(pageTabId, existedTabIdArrya);//
        //alert(tabIndex)
        if (tabIndex > 0) {
            existedTabIdArrya.splice(tabIndex, 1);//先从数组中删除
            $('#tab_' + pageTabId).remove();//删除tab
            $('#page_' + pageTabId).remove();//删除div
        }
    });
    indexTabOnclick();//首页点击事件
};

//关闭其他选项卡
var closeOtherTabs = function () {
    //如果 当前页在首页
    if ($.inArray(selectedTabId, existedTabIdArrya) == 0) {
        closeAllTabs();
        return;
    }

    $J_menuTab_container.find(".J_menuTab").each(function () {
        if (!$(this).hasClass("active")) {  //不是选中的标签
            var pageTabId = $(this).attr("data-id");//当前标签id

            var tabIndex = $.inArray(pageTabId, existedTabIdArrya);//
            if (tabIndex > 0) {
                existedTabIdArrya.splice(tabIndex, 1);//先从数组中删除
                $('#tab_' + pageTabId).remove();//删除tab
                $('#page_' + pageTabId).remove();//删除div
            }
        }
    });

};



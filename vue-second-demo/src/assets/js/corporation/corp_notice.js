/**
 * Created by CuiMengxin on 2016/12/19.
 * 企业 - 消息中心
 */

var $corp_notice_add_modal = $(".corp_notice_add_modal");
var $corp_notice_info_modal = $(".corp_notice_info_modal");

var corp_notice = {
    totalPage: 10,//一共 的页数
    currentPage: 1,//当前页
    DelArray: [],//删除 用户id数组
    containerName: "",

    //初始化
    init: function () {

        corp_notice.containerName = ".corp_notice_container";

        corp_notice.initParam();//初始化 参数
        corp_notice.getNotificationList();//获取消息

        //新增 消息 弹框显示
        $corp_notice_add_modal.on('shown.bs.modal', function (e) {

            var $row = $corp_notice_add_modal.find(".modal-body .row");

            //初始化
            $row.find(".notification_title_add input").val("");
            $row.find(".notification_author_add input").val("");
            $row.find(".notification_content_add textarea").val("");

            corp_notice.initDeptList();//初始化 部门
        });

        //查看 消息 弹框显示
        $corp_notice_info_modal.on('shown.bs.modal', function (e) {
            var $row = $corp_notice_info_modal.find(".modal-body .row");

            $row.find(".notification_title_show").html(notification_info.title);
            $row.find(".notification_author_show").html(notification_info.author);
            $row.find(".notification_dept_show").html(notification_info.dept);
            $row.find(".notification_content_show").html(notification_info.content);

        });

    },
    //初始化 参数
    initParam: function () {
        corp_notice.DelArray = [];
    },
    //初始化 部门
    initDeptList: function () {

        branGetRequest(
            urlGroup.corp.notice.dept_list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    var list = "";
                    for (var i = 0; i < data.result.length; i++) {
                        var item = data.result[i];

                        var version = item.version;//
                        var department_id = item.department_id;//
                        var department_name = item.department_name;//

                        list += "<option data-version='" + version + "' " +
                            "value='" + department_id + "'>" + department_name + "</option>";

                    }

                    $corp_notice_add_modal.find(".notification_dept_add select").html(list);


                }
                else {
                    branError(data.msg)
                }

            },
            function (error) {
                branError(error)
            }
        );

    },

    //获取消息
    getNotificationList: function () {
        var $table = $(corp_notice.containerName).find(".table_container table");

        var obj = {};
        obj.page = corp_notice.currentPage;
        obj.page_size = "10";
        var url = urlGroup.corp.notice.list + "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code === RESPONSE_OK_CODE) {

                    corp_notice.totalPage = data.result.pages;//
                    if (corp_notice.currentPage > corp_notice.totalPage) {
                        corp_notice.currentPage -= 1;
                        corp_notice.getNotificationList();
                        return;
                    }

                    var list = "";//
                    var notification = data.result.notifications;
                    if (!notification || notification.length === 0) {
                        list = "<tr><td colspan='8'>暂无公告</td></tr>";
                    }
                    else {
                        for (var i = 0; i < notification.length; i++) {
                            var item = notification[i];

                            var id = item.notification_id;//
                            var name = item.poster_name ? item.poster_name : "";//
                            var dept_id = item.department_id ? item.department_id : "";//
                            var dept_name = item.department_name ? item.department_name : "";//发布者 所属部门
                            var title = item.notification_title ? item.notification_title : "";//
                            var content = item.notification_content ? item.notification_content : "";//
                            var show_content = content.length > 20 ? content.substr(0, 20) + "..." : content;
                            var time = item.post_time;//
                            time = timeInit(time);

                            list +=
                                "<tr class='item notification_item' " +
                                "data-id = '" + id + "' " + ">" +
                                "<td class='choose_item' onclick='corp_notice.chooseItem(this)'>" +
                                "<img src='image/UnChoose.png'/>" +
                                "</td>" +
                                "<td class='notification_no'>" + (i + 1) + "</td>" +
                                "<td class='notification_title'>" + title + "</td>" +
                                "<td class='notification_content' data-content='" + content + "'>" +
                                show_content +
                                "</td>" +
                                "<td class='notification_dept' data-id='" + dept_id + "'>" + dept_name + "</td>" +
                                "<td class='notification_author'>" + name + "</td>" +
                                "<td class='notification_time'>" + time + "</td>" +
                                "<td class='operate'>" +
                                "<div class='btn btn-sm btn-success btn_detail' " +
                                "onclick='corp_notice.notificationDetailShow(this)'>查看详情</div>" +
                                "</td>" +
                                "</tr>";

                        }
                    }
                    $table.find("tbody").html(list);

                    corp_notice.notificationListInit();//
                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },
    //消息列表 初始化
    notificationListInit: function () {
        var $table = $(corp_notice.containerName).find(".table_container table");
        var $item = $table.find("tbody .item");
        var $pager_container = $(corp_notice.containerName).find(".pager_container");

        if ($item.length === 0) {
            $pager_container.hide();
        }
        else {
            var options = {
                bootstrapMajorVersion: 3, //版本  3是ul  2 是div
                //containerClass:"sdfsaf",
                //size: "small",//大小
                alignment: "left",//对齐方式
                currentPage: corp_notice.currentPage, //当前页数
                totalPages: corp_notice.totalPage, //总页数
                numberOfPages: 5,//每页显示的 页数
                useBootstrapTooltip: true,//是否使用 bootstrap 自带的提示框
                itemContainerClass: function (type, page, currentpage) {  //每项的类名
                    //alert(type + "  " + page + "  " + currentpage)
                    var classname = "p_item ";

                    switch (type) {
                        case "first":
                            classname += "p_first";
                            break;
                        case "last":
                            classname += "p_last";
                            break;
                        case "prev":
                            classname += "p_prev";
                            break;
                        case "next":
                            classname += "p_next";
                            break;
                        case "page":
                            classname += "p_page";
                            break;
                    }

                    if (page == currentpage) {
                        classname += " active "
                    }

                    return classname;
                },
                itemTexts: function (type, page, current) {  //
                    switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                    }
                },
                tooltipTitles: function (type, page, current) {
                    switch (type) {
                        case "first":
                            return "去首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "去末页";
                        case "page":
                            return page === current ? "当前页数 " + page : "前往第 " + page + " 页"
                    }
                },
                onPageClicked: function (event, originalEvent, type, page) { //点击事件
                    //alert(page)

                    var currentTarget = $(event.currentTarget);
                    corp_notice.currentPage = page;
                    corp_notice.getNotificationList();

                }

            };

            var ul = "<ul class='pagenation' style='float:right;'></ul>";
            $pager_container.show();
            $pager_container.html(ul);
            $pager_container.find('ul').bootstrapPaginator(options);
        }

        //是否 已经全部选择
        optChoose.isChooseAll(
            corp_notice.containerName,
            function () {
                corp_notice.checkIsChoose();//检查 是否选中
            }
        );

    },

    //选择单行
    chooseItem: function (self) {

        optChoose.chooseItem(
            self,
            corp_notice.containerName,
            function () {
                corp_notice.checkIsChoose();//检查 是否选中
            }
        );

    },
    //选择全部
    chooseAll: function () {

        optChoose.chooseAll(
            corp_notice.containerName,
            function () {
                corp_notice.checkIsChoose();//检查 是否选中
            }
        );

    },
    //检查 是否选中
    checkIsChoose: function () {
        var $table = $(corp_notice.containerName).find(".table_container table");
        var $item_active = $table.find("tbody .item.active");
        var $btn_del = $(corp_notice.containerName).find(".foot .btn_del");

        if ($item_active.length > 0) {
            $btn_del.addClass("btn-success").removeClass("btn-default");
        }
        else {
            $btn_del.addClass("btn-default").removeClass("btn-success");
        }
    },

    //消息发布 弹框显示
    notificationReleaseShow: function () {
        $corp_notice_add_modal.modal("show");
    },
    //消息发布
    notificationRelease: function () {
        if (!corp_notice.checkParamByNotification()) {
            return
        }

        var obj = {};
        obj.notification_title = $corp_notice_add_modal.find(".notification_title_add input").val();
        obj.notification_content = $corp_notice_add_modal.find(".notification_content_add textarea").val();//
        obj.notification_poster = $corp_notice_add_modal.find(".notification_author_add input").val();
        obj.department_id = $corp_notice_add_modal.find(".notification_dept_add select option:selected").val();

        loadingInit();

        branPostRequest(
            urlGroup.corp.notice.release,
            obj,
            function (data) {
                //alert(JSON.stringify(data))
                if (data.code === RESPONSE_OK_CODE) {
                    toastr.success("发布消息成功！");
                    $corp_notice_add_modal.modal("hide");

                    corp_notice.getNotificationList();//
                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },
    //消息发布 - 检测参数
    checkParamByNotification: function () {
        var flag = false;
        var txt = "";

        var title = $corp_notice_add_modal.find(".notification_title_add input").val();
        var name = $corp_notice_add_modal.find(".notification_author_add input").val();
        var content = $corp_notice_add_modal.find(".notification_content_add textarea").val();

        if (title == "") {
            txt = "标题不能为空";
        }
        else if (title.length > 32) {
            txt = "标题长度不能超过32位";
        }
        else if (name == "") {
            txt = "姓名不能为空";
        }
        else if (name.length > 32) {
            txt = "姓名长度不能超过32位";
        }
        else if (content == "") {
            txt = "内容不能为空";
        }
        else if (content.length > 256) {
            txt = "内容长度不能超过256位";
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    },

    //消息详情 弹框显示
    notificationDetailShow: function (self) {
        var $item = $(self).closest(".item");

        notification_info.title = $item.find(".notification_title").html();
        notification_info.content = $item.find(".notification_content").attr("data-content");
        notification_info.author = $item.find(".notification_author").html();
        notification_info.dept = $item.find(".notification_dept").html();

        $corp_notice_info_modal.modal("show");
    },

    //删除消息 多项删除
    notificationDelMore: function () {
        corp_notice.DelArray = [];

        var $table = $(corp_notice.containerName).find(".table_container table");
        var $item_active = $table.find("tbody .item.active");

        if ($item_active.length <= 0) {
            toastr.warning("请选择消息");
            return;
        }

        for (var i = 0; i < $item_active.length; i++) {
            var id = $item_active.eq(i).attr("data-id");

            corp_notice.DelArray.push(id);
        }

        corp_notice.notificationDel();//删除
    },
    //删除消息
    notificationDel: function () {

        delWarning("确认删除选中的消息吗？", function () {

            loadingInit();

            var obj = {};
            obj.notification_ids = corp_notice.DelArray;

            branPostRequest(
                urlGroup.corp.notice.del,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {
                        toastr.success("删除成功！");
                        corp_notice.getNotificationList();
                    }
                    else {
                        branError(data.msg);
                    }
                },
                function (error) {
                    branError(error);
                }
            );

        });

    }
};

//消息 参数
var notification_info = {
    title: "",
    content: "",
    author: "",
    dept: ""
};

$(function () {
    corp_notice.init();
});


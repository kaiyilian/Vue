/**
 * Created by Administrator on 2017/6/23.
 */

var $notification_container = $(".notification_container");

var notification = {

    currentPage: 1,//当前页
    totalPage: 10,//一共 的页数
    n_id: "",//消息 id

    init: function () {

        notification.notificationList();//消息列表 获取

    },

    //消息列表 清空
    clearNotificationList: function () {

        var msg = "<div class='msg_none'>暂无消息</div>";
        $notification_container.find(".notification_list").html(msg);

    },
    //消息列表 获取
    notificationList: function () {
        notification.clearNotificationList();//消息列表 清空

        var obj = {
            page: notification.currentPage,
            page_size: "10"
        };
        var url = urlGroup.notification.list + "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        notification.totalPage = data.result.pages ? data.result.pages : 1;//总页数
                        if (notification.currentPage > notification.totalPage) {
                            notification.currentPage -= 1;
                            notification.notificationList();
                            return;
                        }

                        var list = "";//列表
                        var arr = data.result.result ? data.result.result : [];
                        if (!arr || arr.length === 0) {

                        }
                        else {

                            for (var i = 0; i < arr.length; i++) {
                                var $item = arr[i];

                                var id = $item.id ? $item.id : "";//
                                var msg = $item.msg ? $item.msg : "";//
                                var readState = $item.readState ? $item.readState : 0;//0:未读 1:已读 ,
                                var contract_id = $item.returnId ? $item.returnId : 0;//
                                var createTime = $item.createTime ? $item.createTime : 0;//
                                createTime = timeInit2(createTime);

                                list +=
                                    "<div class='row item' " +
                                    "data-id='" + id + "' " +
                                    "data-status='" + readState + "' " +
                                    "data-contract_id='" + contract_id + "' " +
                                    ">" +
                                    "<div class='col-xs-6 title'>" + msg + "</div>" +
                                    "<div class='col-xs-6 time'>" + createTime + "</div>" +
                                    "</div>"

                            }

                            $notification_container.find(".notification_list").html(list);

                        }

                        notification.notificationListInit();// 初始化

                    }

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },
    //消息列表 初始化
    notificationListInit: function () {

        var $notification_list = $notification_container.find(".notification_list");
        var $item = $notification_list.find(".item");
        var $pager_container = $notification_container.find(".pager_container");

        if ($item.length === 0) {
            $pager_container.hide();
        }
        else {

            $item.each(function () {

                var $this = $(this);

                var contract_id = $this.attr("data-contract_id");//合同id
                var status = parseInt($this.attr("data-status"));
                if (status === 0) {
                    $this.addClass("unRead");
                }

                $this.click(function () {

                    if ($this.hasClass("unRead")) {

                        notification.n_id = $this.attr("data-id");//消息 ID

                        sessionStorage.setItem("contract_id", contract_id);

                        notification.notificationRead();//消息设置成 已读

                    }

                });

            });

            var options = {
                bootstrapMajorVersion: 3, //版本  3是ul  2 是div
                //containerClass:"sdfsaf",
                //size: "small",//大小
                alignment: "right",//对齐方式
                currentPage: notification.currentPage, //当前页数
                totalPages: notification.totalPage, //总页数
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

                    notification.currentPage = page;
                    notification.notificationList();//查询

                }

            };

            var ul = '<ul class="pagenation" style="float:right;"></ul>';
            $pager_container.show();
            $pager_container.html(ul);
            $pager_container.find(".pagenation").bootstrapPaginator(options);
        }

    },

    //消息设置成 已读
    notificationRead: function () {

        var obj = {
            id: notification.n_id
        };

        branPatchRequest(
            urlGroup.notification.state_change,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {
                    // toastr.success("操作成功！");

                    var tabId = "contract_detail_" + sessionStorage.getItem("contract_id");//tab中的id
                    var pageName = "合同详情";

                    getInsidePageDiv(urlGroup.e_contract.detail.index, tabId, pageName);

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    }

};

$(function () {
    notification.init();
});

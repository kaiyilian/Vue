/**
 * Created by Administrator on 2016/7/13.
 * 试用期到期
 */


//试用期到期
var probation_expire_manage = {

    totalPage: 10,//一共 的页数
    currentPage: 1,//当前页
    AcceptArray: "",//受理 数组
    containerName: "",

    init: function () {

        probation_expire_manage.containerName = ".probation_expire_container";
        probation_expire_manage.AcceptArray = [];
        probation_expire_manage.getEmpList();//获取 试用期到期员工列表

    },

    //获取 试用期到期员工列表
    getEmpList: function () {
        var $table = $(probation_expire_manage.containerName).find(".table_container table");

        var obj = {};
        obj.page_size = "10";
        obj.page = probation_expire_manage.currentPage;

        loadingInit();

        branPostRequest(
            urlGroup.home.probation_expire.list,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {
                    probation_expire_manage.totalPage = data.result.total_page;//总页数
                    if (probation_expire_manage.currentPage > probation_expire_manage.totalPage) {
                        probation_expire_manage.currentPage -= 1;
                        probation_expire_manage.getEmpList();
                        return;
                    }

                    var list = "";
                    var models = data.result.models;
                    if (!models || models.length == 0) {
                        list = "<tr><td colspan='6'>暂无试用期到期的员工</td></tr>";
                    }
                    else {
                        for (var i = 0; i < models.length; i++) {
                            var item = models[i];

                            var id = item.id;//
                            var name = item.name;//
                            var version = item.version;//
                            var start_time = item.start_time;//
                            start_time = timeInit(start_time);
                            var end_time = item.end_time;//
                            end_time = timeInit(end_time);

                            list +=
                                "<tr class='item emp_item' " +
                                "data-id='" + id + "' " +
                                "data-version='" + version + "'>" +
                                "<td class='choose_item' onclick='probation_expire_manage.chooseItem(this)'>" +
                                "<img src='image/UnChoose.png'/>" +
                                "</td>" +
                                "<td class='emp_no'>" + (i + 1) + "</td>" +
                                "<td class='emp_name'>" + name + "</td>" +
                                "<td class='emp_probation_begin_time'>" + start_time + "</td>" +
                                "<td class='emp_probation_end_time'>" + end_time + "</td>" +
                                "<td class='operate btn_operate'>" +
                                "<span class='btn btn-sm btn-success btn_accept' " +
                                "onclick='probation_expire_manage.empAcceptOnly(this)'>受理</span>" +
                                "</td>" +
                                "</tr>";
                        }
                    }

                    $table.find("tbody").html(list);
                    probation_expire_manage.empListInit();//试用期到期员工列表 初始化
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
    //试用期到期员工列表 初始化
    empListInit: function () {
        var $table = $(probation_expire_manage.containerName).find(".table_container table");
        var $item = $table.find("tbody .item");
        var $page_container = $(probation_expire_manage.containerName).find('.pager_container');

        if ($item.length == 0) {
            $page_container.hide();
        }
        else {
            var options = {
                bootstrapMajorVersion: 3, //版本  3是ul  2 是div
                //containerClass:"sdfsaf",
                //size: "small",//大小
                alignment: "left",//对齐方式
                currentPage: probation_expire_manage.currentPage, //当前页数
                totalPages: probation_expire_manage.totalPage, //总页数
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

                    //var currentTarget = $(event.currentTarget);
                    probation_expire_manage.currentPage = page;
                    probation_expire_manage.getEmpList();

                }

            };

            var ul = '<ul class="pagenation" style="float:right;"></ul>';
            $page_container.show();
            $page_container.html(ul);
            $page_container.find('ul').bootstrapPaginator(options);
        }

        //是否 已经全部选择
        optChoose.isChooseAll(
            probation_expire_manage.containerName,
            function () {
                probation_expire_manage.checkIsChoose();//检查 是否选中
            }
        );

    },

    //选中当前行
    chooseItem: function (self) {

        optChoose.chooseItem(
            self,
            probation_expire_manage.containerName,
            function () {
                probation_expire_manage.checkIsChoose();//检查 是否选中
            }
        );

    },
    //选择全部
    chooseAll: function () {

        optChoose.chooseAll(
            probation_expire_manage.containerName,
            function () {
                probation_expire_manage.checkIsChoose();//检查 是否选中
            }
        );

    },
    //检查 是否选中
    checkIsChoose: function () {
        var $table = $(probation_expire_manage.containerName).find(".table_container table");
        var $item_active = $table.find("tbody .item.active");
        var $btn_accept = $(probation_expire_manage.containerName).find(".foot .btn_accept");

        if ($item_active.length > 0) {
            $btn_accept.addClass("btn-success").removeClass("btn-default");
        }
        else {
            $btn_accept.addClass("btn-default").removeClass("btn-success");
        }
    },

    //单个用户 受理
    empAcceptOnly: function (self) {
        probation_expire_manage.AcceptArray = [];

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");

        var obj = {
            "id": id,
            "version": version
        };

        probation_expire_manage.AcceptArray.push(obj);

        probation_expire_manage.acceptSure();//续约
    },
    //多个用户 受理
    empAcceptMore: function () {
        probation_expire_manage.AcceptArray = [];//初始化
        var $table = $(probation_expire_manage.containerName).find(".table_container table");
        var $item_active = $table.find("tbody .item.active");


        if ($item_active.length == 0) {
            toastr.warning("您没有选择用户");
            return
        }

        var flag = true;//判断选中的 员工是否都符合条件
        var first_date = $item_active.eq(0).find(".emp_probation_end_time").html();//选中的第一个员工的 试用期到期时间

        for (var i = 0; i < $item_active.length; i++) {

            var id = $item_active.eq(i).attr("data-id");
            var version = $item_active.eq(i).attr("data-version");
            var date = $item_active.eq(i).find(".emp_probation_end_time").html();

            if (date != first_date) {   //如果有合同 结束时间不相同，则跳出 报错
                flag = false;
                break;
            }

            var obj = {
                "id": id,
                "version": version
            };

            probation_expire_manage.AcceptArray.push(obj);

        }

        if (!flag) {
            toastr.warning("有员工合同结束时间不一致！请重新选择");
            return;
        }

        probation_expire_manage.acceptSure();//续约
    },

    //受理 - 确认
    acceptSure: function () {

        operateMsgShow("是否确认受理", function () {

            loadingInit();

            var obj = {};
            obj.idVersions = probation_expire_manage.AcceptArray;

            branPostRequest(
                urlGroup.home.probation_expire.accept,
                obj,
                function (data) {
                    //alert(JSON.stringify(data));

                    if (data.code == 1000) {
                        toastr.success("受理成功！");

                        probation_expire_manage.init();//
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

$(function () {
    probation_expire_manage.init();
});

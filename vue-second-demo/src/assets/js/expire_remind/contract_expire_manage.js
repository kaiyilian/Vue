/**
 * Created by Administrator on 2016/7/13.
 * 合同到期
 */

var $contract_expire_renew_modal = $(".contract_expire_renew_modal");

//合同到期
var contract_expire_manage = {

    totalPage: 10,//一共 的页数
    currentPage: 1,//当前页
    RenewArray: [],//续约 数组
    containerName: "",

    //初始化
    init: function () {

        contract_expire_manage.containerName = ".contract_expire_container";
        contract_expire_manage.RenewArray = [];

        contract_expire_manage.initTime();//初始化 时间
        contract_expire_manage.getEmpList();//获取 合同到期员工列表

        //续签弹框 显示
        $contract_expire_renew_modal.on("shown.bs.modal", function () {

            var $row = $contract_expire_renew_modal.find(".modal-body");

            $row.find(".end_time input").val("");//结束时间 置空

            var renew_begin_time = contract_expire_manage.RenewArray[0].end_time;//开始时间
            renew_begin_time = new Date(renew_begin_time).getTime();
            renew_begin_time += 86400000;
            renew_begin_time = timeInit(renew_begin_time);

            $row.find(".begin_time input").val(renew_begin_time);


        });


    },
    //初始化 时间
    initTime: function () {

        var start = {
            elem: "#contract_expire_beginTime",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "", //设定最小日期为当前日期
            max: '', //最大日期
            istime: false,//是否开启时间选择
            istoday: false, //是否显示今天
            choose: function (datas) {
                //end.min = datas; //开始日选好后，重置结束日的最小日期
                //end.start = datas;//将结束日的初始值设定为开始日
            }
        };

        var end = {
            elem: "#contract_expire_endTime",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "",
            max: "",
            istime: false,
            istoday: false,
            choose: function (datas) {
                //start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        laydate(start);
        laydate(end);

    },

    //获取 合同到期员工列表
    getEmpList: function () {
        var $table = $(contract_expire_manage.containerName).find(".table_container table");

        var obj = {};
        obj.page_size = "10";
        obj.page = contract_expire_manage.currentPage;

        loadingInit();

        branPostRequest(
            urlGroup.home.contract_expire.list,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {
                    contract_expire_manage.totalPage = data.result.total_page;//总页数
                    if (contract_expire_manage.currentPage > contract_expire_manage.totalPage) {
                        contract_expire_manage.currentPage -= 1;
                        contract_expire_manage.getEmpList();
                        return;
                    }

                    var list = "";
                    var models = data.result.models;
                    if (!models || models.length == 0) {
                        list = "<tr><td colspan='6'>暂无合同到期的员工</td></tr>";
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
                                "<td class='choose_item' onclick='contract_expire_manage.chooseItem(this)'>" +
                                "<img src='image/UnChoose.png'/>" +
                                "</td>" +
                                "<td class='emp_no'>" + (i + 1) + "</td>" +
                                "<td class='emp_name'>" + name + "</td>" +
                                "<td class='emp_contract_begin_time'>" + start_time + "</td>" +
                                "<td class='emp_contract_end_time'>" + end_time + "</td>" +
                                "<td class='operate btn_operate'>" +
                                "<span class='btn btn-sm btn-success btn_renew' " +
                                "onclick='contract_expire_manage.empRenewOnly(this)'>续约</span>" +
                                "</td>" +
                                "</tr>";
                        }
                    }

                    $table.find("tbody").html(list);
                    contract_expire_manage.empListInit();//合同到期 员工列表 初始化

                }
                else {
                    branError(data.msg);
                }

            }, function (error) {
                branError(error);
            });

    },
    //合同到期 员工列表 初始化
    empListInit: function () {
        var $table = $(contract_expire_manage.containerName).find(".table_container table");
        var $item = $table.find("tbody .item");
        var $page_container = $(contract_expire_manage.containerName).find('.pager_container');

        if ($item.length == 0) {
            $page_container.hide();
        }
        else {
            var options = {
                bootstrapMajorVersion: 3, //版本  3是ul  2 是div
                //containerClass:"sdfsaf",
                //size: "small",//大小
                alignment: "left",//对齐方式
                currentPage: contract_expire_manage.currentPage, //当前页数
                totalPages: contract_expire_manage.totalPage, //总页数
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
                    contract_expire_manage.currentPage = page;
                    contract_expire_manage.getEmpList();

                }
            };

            var ul = '<ul class="pagenation" style="float:right;"></ul>';
            $page_container.show();
            $page_container.html(ul);
            $page_container.find('ul').bootstrapPaginator(options);
        }

        //是否 已经全部选择
        optChoose.isChooseAll(
            contract_expire_manage.containerName,
            function () {
                contract_expire_manage.checkIsChoose();//检查 是否选中
            }
        );

    },

    //选中当前行
    chooseItem: function (self) {

        optChoose.chooseItem(
            self,
            contract_expire_manage.containerName,
            function () {
                contract_expire_manage.checkIsChoose();//检查 是否选中
            }
        );

    },
    //选择全部
    chooseAll: function () {

        optChoose.chooseAll(
            contract_expire_manage.containerName,
            function () {
                contract_expire_manage.checkIsChoose();//检查 是否选中
            }
        );

    },
    //检查 是否选中
    checkIsChoose: function () {
        var $table = $(contract_expire_manage.containerName).find(".table_container table");
        var $item_active = $table.find("tbody .item.active");
        var $btn_renew = $(contract_expire_manage.containerName).find(".foot .btn_renew");

        if ($item_active.length > 0) {
            $btn_renew.addClass("btn-success").removeClass("btn-default");
        }
        else {
            $btn_renew.addClass("btn-default").removeClass("btn-success");
        }
    },

    //单个用户续约
    empRenewOnly: function (self) {
        contract_expire_manage.RenewArray = [];

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");
        var end_time = $item.find(".emp_contract_end_time").html();

        var obj = {
            "id": id,
            "version": version,
            "end_time": end_time
        };

        contract_expire_manage.RenewArray.push(obj);

        contract_expire_manage.renewModalShow();//续约弹框 显示
    },
    //多个用户续约
    empRenewMore: function () {
        contract_expire_manage.RenewArray = [];//初始化

        var $table = $(contract_expire_manage.containerName).find(".table_container table");
        var $item_active = $table.find("tbody .item.active");

        if ($item_active.length == 0) {
            toastr.warning("您没有选择用户");
            return
        }

        var flag = true;//判断选中的 员工是否都符合条件
        var first_date = $item_active.eq(0).find(".emp_contract_end_time").html();//选中的第一个员工的 合同到期时间

        for (var i = 0; i < $item_active.length; i++) {

            var id = $item_active.eq(i).attr("data-id");
            var version = $item_active.eq(i).attr("data-version");
            var date = $item_active.eq(i).find(".emp_contract_end_time").html();

            if (date != first_date) {   //如果有合同 结束时间不相同，则跳出 报错
                flag = false;
                break;
            }

            var obj = {
                "id": id,
                "version": version,
                "end_time": date
            };

            contract_expire_manage.RenewArray.push(obj);

        }

        if (!flag) {
            toastr.warning("有员工合同结束时间不一致！请重新选择");
            return;
        }

        contract_expire_manage.renewModalShow();//续约弹框 显示
    },
    //续约弹框 显示
    renewModalShow: function () {
        $contract_expire_renew_modal.modal("show");
    },
    //续约 - 确认
    renewSure: function () {
        var $row = $contract_expire_renew_modal.find(".modal-body .row");//

        var beginTime = $.trim($row.find(".begin_time input").val());
        var endTime = $.trim($row.find(".end_time input").val());

        if (!beginTime || !endTime) {
            toastr.warning("请选择时间");
            return
        }

        beginTime = new Date(beginTime).getTime();
        endTime = new Date(endTime).getTime();

        if (beginTime >= endTime) {
            toastr.warning("开始时间要小于结束时间");
            return
        }

        //$contract_expire_renew_modal.find(".btn_renew").removeAttr("onclick");
        //setTimeout(function () {
        //	$contract_expire_renew_modal.find(".btn_renew")
        //		.attr("onclick", "contract_expire_manage.RenewSure()");
        //}, timeOut);

        //移除 数组中的end_time
        for (var i = 0; i < contract_expire_manage.RenewArray.length; i++) {
            var item = contract_expire_manage.RenewArray[i];

            delete item.end_time

        }

        var obj = {};//
        obj.idVersions = contract_expire_manage.RenewArray;
        obj.contract_start_time = beginTime;
        obj.contract_end_time = endTime;

        loadingInit();

        branPostRequest(
            urlGroup.employee.roster.contract_extension,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {
                    toastr.success("续约成功！");
                    $contract_expire_renew_modal.modal("hide");

                    contract_expire_manage.getEmpList();//
                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    }

};

$(function () {
    contract_expire_manage.init();
});
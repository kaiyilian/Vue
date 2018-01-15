/**
 * Created by Administrator on 2016/6/21.
 *
 */

var index = {
    containerName: "",


    init: function () {
        index.containerName = ".index_container";

        getUserInfo();//获取用户信息

        index.empContractExpireList();//获取合同到期列表
        index.empProbationExpireList();//获取 试用期到期 列表
        index.empEntryList();//获取 同意入职列表
        index.scheduleList();//获取 排班列表
    },

    //获取合同到期列表
    empContractExpireList: function () {
        var $contract_expire_block = $(index.containerName).find(".block_1");

        var obj = new Object();
        obj.page_size = "10";
        obj.page = "1";

        branPostRequest(
            urlGroup.home.contract_expire.list_by_home,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {

                    var count = data.result.totalCount;//合同到期 员工数量
                    var list = "";
                    var models = data.result.models;
                    if (!models || models.length == 0) {
                        list = "<div class='none'>暂无合同到期的员工</div>";
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
                                "<div class='contract_expire_item col-xs-12' data-version='" + version + "' " +
                                "data-id='" + id + "'>" +
                                "<div class='employee_name col-xs-2'>" + name + "</div>" +
                                "<div class='col-xs-5'>" +
                                "<span class='txt'>合同开始时间：</span>" +
                                "<span class='employee_contract_begin_time'>" + start_time + "</span>" +
                                "</div>" +
                                "<div class='col-xs-5'>" +
                                "<span class='txt'>合同到期时间：</span>" +
                                "<span class='employee_contract_end_time'>" + end_time + "</span>" +
                                "</div>" +
                                "</div>";
                        }
                    }

                    $contract_expire_block.find(".count").html(count);//合同到期的 员工数量
                    $contract_expire_block.find(".contract_expire_list").html(list);

                    //if (count == 0) {	//如果没有 合同到期的 员工
                    //	var contract_expire_none = "<div class='none'>暂无合同到期的员工</div>";
                    //	$contract_expire_block.find(".contract_expire_list").html(contract_expire_none);
                    //}
                    //else {
                    //
                    //}

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
    //合同到期提醒 页面
    getEmpContractExpirePage: function () {
        var tabId = "contract_expire";//tab中的id
        var pageName = "合同到期";

        getInsidePageDiv(urlGroup.home.contract_expire.index, tabId, pageName);
    },

    //获取 试用期到期 列表
    empProbationExpireList: function () {
        var $probation_expire_block = $(index.containerName).find(".block_2");

        var obj = {};
        obj.page_size = "10";
        obj.page = "1";

        branPostRequest(
            urlGroup.home.probation_expire.list_by_home,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {

                    var count = data.result.totalCount;//合同到期 员工数量
                    var list = "";
                    var models = data.result.models;
                    if (!models || models.length == 0) {
                        list = "<div class='none'>暂无试用期到期的员工</div>";
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
                                "<div class='probation_expire_item col-xs-12' data-version='" + version + "' " +
                                "data-id='" + id + "'>" +
                                "<div class='employee_name col-xs-2'>" + name + "</div>" +
                                "<div class='col-xs-5'>" +
                                "<span class='txt'>试用期开始：</span>" +
                                "<span class='employee_probation_begin_time'>" + start_time + "</span>" +
                                "</div>" +
                                "<div class='col-xs-5'>" +
                                "<span class='txt'>试用期到期：</span>" +
                                "<span class='employee_probation_end_time'>" + end_time + "</span>" +
                                "</div>" +
                                "</div>";
                        }
                    }

                    $probation_expire_block.find(".count").html(count);//试用期到期的 员工数量
                    $probation_expire_block.find(".probation_expire_list").html(list);

                    //if (count == 0) {	//如果没有 试用期到期的 员工
                    //	var contract_expire_none = "<div class='none'>暂无试用期到期的员工</div>";
                    //	$probation_expire_block.find(".probation_expire_list").html(contract_expire_none);
                    //}
                    //else {
                    //
                    //}

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
    //试用期到期提醒 页面
    getEmpProbationExpirePage: function () {

        var tabId = "probation_expire";//tab中的id
        var pageName = "试用期到期";

        getInsidePageDiv(urlGroup.home.probation_expire.index, tabId, pageName);

    },

    //获取 同意入职列表
    empEntryList: function () {
        var $entry_expire_block = $(index.containerName).find(".block_3");

        var obj = {};
        obj.page = "1";
        obj.page_size = "10";

        branPostRequest(
            urlGroup.home.entry_expire.list_by_home,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {
                    var totalCount = data.result.totalCount;//总人数

                    var employees = data.result.models;
                    var list = "";
                    if (!employees || employees.length == 0) {
                        list = "<div class='none'>暂无试用期到期的员工</div>";
                    }
                    else {
                        for (var i = 0; i < employees.length; i++) {
                            var item = employees[i];

                            var id = item.id;//员工id
                            var version = item.txVersion;//员工版本
                            var name = item.fullName;//员工姓名
                            var phone = item.phoneNo;//手机号码
                            var check_in_time = item.checkinTime;//入职时间
                            check_in_time = timeInit(check_in_time);

                            list +=
                                "<div class='item col-xs-12' data-version='" + version + "' " +
                                "data-id='" + id + "'>" +
                                "<div class='name col-xs-2'>" + name + "</div>" +
                                "<div class='col-xs-5'>" +
                                "<span class='phone'>" + phone + "</span>" +
                                "</div>" +
                                "<div class='col-xs-5'>" +
                                "<span class='check_in_time'>" + check_in_time + "</span>" +
                                "</div>" +
                                "</div>";

                        }
                    }

                    $entry_expire_block.find(".count").html(totalCount);//同意入职的 员工数量

                    $entry_expire_block.find(".content").html(list);

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
    //同意入职 页面
    getEmpEntryPage: function () {

        var tabId = "entry_expire";//tab中的id
        var pageName = "同意入职";

        getInsidePageDiv(urlGroup.home.entry_expire.index, tabId, pageName);

    },

    //获取 排班 列表
    scheduleList: function () {
        var $schedule_block = $(index.containerName).find(".block_4");
        var $schedule_list = $schedule_block.find(".schedule_list");
        $schedule_list.empty();

        branGetRequest(
            urlGroup.home.schedule.list_by_home,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code == 1000) {

                    if (data.result && data.result.title && data.result.models) {

                        var date = data.result.title;
                        if (date.length > 0) {

                            var list = "";
                            for (var i = 0; i < date.length; i++) {
                                list += "<div class='f_left'>" + date[i] + "</div>";
                            }

                            $schedule_block.find(".date").html(list);

                        }

                        var models = data.result.models;
                        if (models.length > 0) {

                            for (var j = 0; j < models.length; j++) {
                                var item = models[j];

                                //班组 item
                                var $workShift_item = $("<div>");
                                $workShift_item.addClass("item");
                                $schedule_list.append($workShift_item);


                                var name = item.name ? item.name : "";//班组名称
                                var $name = $("<div>");
                                $name.addClass("workShift_name");
                                $name.addClass("f_left");
                                $name.text(name);
                                $name.appendTo($workShift_item);

                                if (item.detail && item.detail.length > 0) {

                                    for (var k = 0; k < item.detail.length; k++) {
                                        var schedule_item = item.detail[k];

                                        var color = schedule_item.color ? schedule_item.color : "";
                                        var shortName = schedule_item.shortName ? schedule_item.shortName : "";

                                        var $schedule_item = $("<div>");
                                        $schedule_item.addClass("f_left");
                                        $schedule_item.addClass("schedule_item");
                                        $schedule_item.addClass("center");
                                        $schedule_item.appendTo($workShift_item);

                                        var $div = $("<div>");
                                        $div.css("background-color", color);
                                        $div.text(shortName);
                                        $div.appendTo($schedule_item);

                                    }

                                }


                            }

                            $schedule_block.find(".count").html(models.length);

                        }

                        if (date.length > 0 && models.length > 0) {

                            //设置 头部 样式
                            var width = $schedule_block.find(".row").width();
                            var img_width = $schedule_block.find(".row").find(".img").width();
                            //var date_width = width - img_width;
                            //$schedule_block.find(".date").css("width", date_width);

                            var item_width = (width - img_width) / 3 - 1;
                            $schedule_block.find(".date > div").css("width", item_width);
                            $schedule_block.find(".item .schedule_item").css("width", item_width);

                            //console.log(width);
                            //console.log(item_width);

                        }
                        else {
                            var none = "<div class='none'>暂无排班</div>";
                            $schedule_block.find(".content").html(none);
                        }

                    }

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
    //排班管理 页面
    getScheduleRulePage: function () {

        getInsidePageDiv(urlGroup.attendance.schedule_view.index, 'schedule_view', '排班视图');

    }


};

$(function () {
    index.init();
});

/**
 * Created by Administrator on 2017/10/16.
 * 出勤配置
 */

var $attendance_setting_container = $(".attendance_setting_container");//考勤设置container
var $holiday_set = $attendance_setting_container.find("#holiday_set");//假期设置
var $overTime_set = $attendance_setting_container.find("#overTime_set");//加班设置

var attendance_setting = {

    approvalTypeMap: null,//审批类型 map

    init: function () {
        $("[data-toggle='tooltip']").tooltip();

        $('a[href="#attendance_cycle"]').tab('show'); //默认显示 合同模板

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

            //console.log($(this).html());

            var href = $(this).attr("data-href");
            if (href === "attendance_cycle") {
                attendance_cycle.init();//考勤周期 初始化
            }
            if (href === "holiday_set") {
                holiday_set.init();//假期设置 初始化
            }
            if (href === "overTime_set") {
                overTime_set.init();//加班设置 初始化
            }
            if (href === "attendance_clock") {
                attendance_clock.init();//考勤设置 初始化
            }

        });

        attendance_setting.initApprovalTypeMap();//初始化 审批明细类型map

        attendance_cycle.init();//考勤周期 初始化
    },

    //初始化 审批明细类型map
    initApprovalTypeMap: function () {

        attendance_setting.approvalTypeMap = new Map();
        attendance_setting.approvalTypeMap.put("", "无");
        attendance_setting.approvalTypeMap.put(0, "调休");
        attendance_setting.approvalTypeMap.put(1, "事假");
        attendance_setting.approvalTypeMap.put(2, "年假");
        attendance_setting.approvalTypeMap.put(3, "病假");
        attendance_setting.approvalTypeMap.put(4, "产检假");
        attendance_setting.approvalTypeMap.put(5, "工伤假");
        attendance_setting.approvalTypeMap.put(6, "婚假");
        attendance_setting.approvalTypeMap.put(7, "产假");
        attendance_setting.approvalTypeMap.put(8, "哺乳假");
        attendance_setting.approvalTypeMap.put(9, "丧假");
        attendance_setting.approvalTypeMap.put(10, "工作日加班");
        attendance_setting.approvalTypeMap.put(11, "休息日加班");
        attendance_setting.approvalTypeMap.put(12, "节假日加班");

    }

};

//假期设置
var holiday_set = {

    init: function () {
        holiday_set.initHolidayList();//初始化 假期列表
    },

    //初始化 假期列表
    initHolidayList: function () {

        var $holiday_type_list = $holiday_set.find(".holiday_type_list");
        $holiday_type_list.empty();

        branGetRequest(
            urlGroup.attendance.setting.holiday.list_all,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.length > 0) {

                        $.each(data.result, function (index, $item) {

                            // var id = $item.id ? $item.id : "";//
                            var approvalTypeDetail = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                                ($item.approvalTypeDetail === 0 ? 0 : "");//审批明细
                            var name = attendance_setting.approvalTypeMap.get(approvalTypeDetail);

                            var $div = $("<div>");
                            $div.appendTo($holiday_type_list);
                            $div.addClass("btn");
                            $div.addClass("btn-sm");
                            $div.addClass("btn-default");
                            $div.attr("data-type", approvalTypeDetail);
                            $div.text(name);
                            $div.unbind("click").bind("click", function () {

                                var $this = $(this);

                                //事假 为必选，不能取消
                                var type = parseInt($this.attr("data-type"));
                                if (type === 1) {
                                    toastr.warning("事假类型不能取消！");
                                }
                                else {

                                    if ($this.hasClass("btn-default")) {
                                        $this.removeClass("btn-default");
                                        $this.addClass("btn-success");
                                    }
                                    else {
                                        $this.removeClass("btn-success");
                                        $this.addClass("btn-default");
                                    }

                                }

                                holiday_set.checkIsChooseAll();//检查  是否被 全选

                            });

                        });

                        holiday_set.holidayList();//假期列表

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

    //获取列表
    holidayList: function () {

        var $holiday_type_list = $holiday_set.find(".holiday_type_list");

        branGetRequest(
            urlGroup.attendance.setting.holiday.list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var types = [];//已经保存的 type数组
                        $.each(data.result, function (index, $item) {

                            var approvalTypeDetail = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                                ($item.approvalTypeDetail === 0 ? 0 : "");//审批明细
                            types.push(approvalTypeDetail);

                        });

                        //检查 是否有 事假，如果没有事假，则加上
                        if (types.indexOf(1) < 0) {
                            types.push(1);
                        }

                        //遍历所有btn，检查是否被选择
                        $holiday_type_list.find(".btn").each(function () {
                            var $this = $(this);

                            var type = parseInt($this.attr("data-type"));

                            if (types.indexOf(type) > -1) {
                                $this.addClass("btn-success").removeClass("btn-default");
                            }

                        });

                        holiday_set.checkIsChooseAll();//检查  是否被 全选

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

    //全选
    chooseAll: function () {
        var $btn_all = $holiday_set.find(".btn_all");//全选  按钮
        var $btn = $holiday_set.find(".holiday_type_list .btn");// item

        if ($btn_all.hasClass("btn-success")) {
            $btn_all.addClass("btn-default").removeClass("btn-success");

            $holiday_set.find(".holiday_type_list").find(".btn[data-type!='1']")
                .addClass("btn-default").removeClass("btn-success");

        }
        else {
            $btn_all.addClass("btn-success").removeClass("btn-default");
            $btn.addClass("btn-success").removeClass("btn-default");
        }

    },
    //检查 是否被 全选
    checkIsChooseAll: function () {
        var $btn_all = $holiday_set.find(".btn_all");//全选  按钮
        var $btn = $holiday_set.find(".holiday_type_list .btn");// item
        var $btn_active = $holiday_set.find(".holiday_type_list .btn.btn-success");// 已选中

        if ($btn.length === $btn_active.length) {
            $btn_all.addClass("btn-success").removeClass("btn-default");
        }
        else {
            $btn_all.addClass("btn-default").removeClass("btn-success");
        }

    },


    //假期保存
    holidaySave: function () {

        if (!holiday_set.checkParam()) {
            return
        }

        var ids = [];
        var $btn_active = $holiday_set.find(".holiday_type_list .btn.btn-success");// 已选中
        $btn_active.each(function () {

            var $this = $(this);
            // var id = $this.attr("data-id");
            var approvalTypeDetail = $this.attr("data-type");

            var obj = {
                // id: id,
                approvalTypeDetail: approvalTypeDetail
            };

            ids.push(obj);

        });

        var obj = {
            ids: ids
        };

        loadingInit();

        branPostRequest(
            urlGroup.attendance.setting.holiday.set,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("保存成功！");

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
    //检查参数
    checkParam: function () {

        var flag = false;
        var txt = "";

        var $btn_active = $holiday_set.find(".holiday_type_list .btn.btn-success");// 已选中

        if ($btn_active.length <= 0) {
            txt = "请选择假期类型！";
        }
        else if ($holiday_set.find(".holiday_type_list .btn[data-type='1']").hasClass("btn-default")) {
            txt = "事假是必选项，请选择！";
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    }


};

//加班设置
var overTime_set = {

    init: function () {
        overTime_set.initOverTimeList();//初始化 加班列表
    },

    //初始化 加班列表
    initOverTimeList: function () {

        var $overTime_type_list = $overTime_set.find(".overTime_type_list");
        $overTime_type_list.empty();

        branGetRequest(
            urlGroup.attendance.setting.overTime.list_all,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.length > 0) {

                        $.each(data.result, function (index, $item) {

                            // var id = $item.id ? $item.id : "";//
                            var approvalTypeDetail = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                                ($item.approvalTypeDetail === 0 ? 0 : "");//审批明细
                            var name = attendance_setting.approvalTypeMap.get(approvalTypeDetail);

                            var $div = $("<div>");
                            $div.appendTo($overTime_type_list);
                            $div.addClass("btn");
                            $div.addClass("btn-sm");
                            $div.addClass("btn-default");
                            // $div.attr("data-id", id);
                            $div.attr("data-type", approvalTypeDetail);
                            $div.text(name);
                            $div.unbind("click").bind("click", function () {

                                var $this = $(this);

                                //工作日加班 为必选，不能取消
                                var type = parseInt($this.attr("data-type"));
                                if (type === 10) {
                                    toastr.warning("工作日加班类型不能取消！");
                                }
                                else {

                                    if ($this.hasClass("btn-default")) {
                                        $this.removeClass("btn-default");
                                        $this.addClass("btn-success");
                                    }
                                    else {
                                        $this.removeClass("btn-success");
                                        $this.addClass("btn-default");
                                    }

                                }

                                overTime_set.checkIsChooseAll();//检查  是否被 全选

                            });

                        });

                        overTime_set.OverTimeList();//获取列表

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

    //获取列表
    OverTimeList: function () {

        var $overTime_type_list = $overTime_set.find(".overTime_type_list");

        branGetRequest(
            urlGroup.attendance.setting.overTime.list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var types = [];//已经保存的 ids
                        $.each(data.result, function (index, $item) {

                            var approvalTypeDetail = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                                ($item.approvalTypeDetail === 0 ? 0 : "");//审批明细
                            types.push(approvalTypeDetail);

                        });

                        //检查 是否有 工作日加班，如果没有，则加上
                        if (types.indexOf(10) < 0) {
                            types.push(10);
                        }

                        //遍历所有btn，检查是否被选择
                        $overTime_type_list.find(".btn").each(function () {
                            var $this = $(this);

                            var type = parseInt($this.attr("data-type"));

                            if (types.indexOf(type) > -1) {
                                $this.addClass("btn-success").removeClass("btn-default");
                            }

                        });
                        overTime_set.checkIsChooseAll();//检查  是否被 全选

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

    //全选
    chooseAll: function () {
        var $btn_all = $overTime_set.find(".btn_all");//全选  按钮
        var $btn = $overTime_set.find(".overTime_type_list .btn");// item

        if ($btn_all.hasClass("btn-success")) {
            $btn_all.addClass("btn-default").removeClass("btn-success");
            // $btn.addClass("btn-default").removeClass("btn-success");

            $overTime_set.find(".overTime_type_list").find(".btn[data-type!='10']")
                .addClass("btn-default").removeClass("btn-success");

        }
        else {
            $btn_all.addClass("btn-success").removeClass("btn-default");
            $btn.addClass("btn-success").removeClass("btn-default");
        }

    },
    //检查 是否被 全选
    checkIsChooseAll: function () {
        var $btn_all = $overTime_set.find(".btn_all");//全选  按钮
        var $btn = $overTime_set.find(".overTime_type_list .btn");// item
        var $btn_active = $overTime_set.find(".overTime_type_list .btn.btn-success");// 已选中

        if ($btn.length === $btn_active.length) {
            $btn_all.addClass("btn-success").removeClass("btn-default");
        }
        else {
            $btn_all.addClass("btn-default").removeClass("btn-success");
        }

    },


    //加班保存
    OverTimeSave: function () {

        if (!overTime_set.checkParam()) {
            return
        }

        var ids = [];
        var $btn_active = $overTime_set.find(".overTime_type_list .btn.btn-success");// 已选中
        $btn_active.each(function () {

            var $this = $(this);
            // var id = $this.attr("data-id");
            var approvalTypeDetail = $this.attr("data-type");

            var obj = {
                // id: id,
                approvalTypeDetail: approvalTypeDetail
            };

            ids.push(obj);

        });

        var obj = {
            ids: ids
        };

        loadingInit();

        branPostRequest(
            urlGroup.attendance.setting.overTime.set,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("保存成功！");

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
    //检查参数
    checkParam: function () {

        var flag = false;
        var txt = "";

        var $btn_active = $overTime_set.find(".overTime_type_list .btn.btn-success");// 已选中

        if ($btn_active.length <= 0) {
            txt = "请选择加班类型！";
        }
        else if ($overTime_set.find(".overTime_type_list .btn[data-type='10']").hasClass("btn-default")) {
            txt = "工作日加班是必选项，请选择！";
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    }

};

$(function () {
    attendance_setting.init();
});
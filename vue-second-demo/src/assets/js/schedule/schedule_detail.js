/**
 * Created by Administrator on 2017/9/18.
 * 班次详情
 */

var $schedule_detail_container = $(".schedule_detail_container");
var $row = $schedule_detail_container.find(".content > .row");//行 元素

var schedule_detail = {

    approvalTypeMap: null,//审批类型 map

    init: function () {
        $("[data-toggle='tooltip']").tooltip();

        $row.find(".schedule_name input").val("");    //班次名称为空
        $row.find(".schedule_shortName input").val("");    //班次简称为空

        schedule_detail.approvalTypeMap = approval_type.initApprovalTypeMap();//初始化 审批明细类型map

        schedule_detail.initColor();//初始化 颜色
        schedule_detail.initScheduleTime();//初始化 考勤时间
        schedule_detail.initValidTime();//初始化 有效打卡
        schedule_detail.initPunchCard();//初始化 人性打卡
        schedule_detail.initRestTime();//初始化 休息时间
        schedule_detail.initAbsenteeism();//初始化 旷工设置
        schedule_detail.initOverTime();//初始化 加班设置
        schedule_detail.initWorkTime();//初始化 上班工时
        schedule_detail.initOverTimeType();//初始化 加班工时 类型

        //如果是 编辑
        if (schedule_detail_param.id) {

            var obj = {
                id: schedule_detail_param.id
            };
            var url = urlGroup.attendance.schedule_detail.detail+ "?" + jsonParseParam(obj);

            branGetRequest(
                url,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        if (data.result) {

                            //班次详情 赋值参数
                            schedule_detail_param.scheduleDetailParam(data.result);

                            $row.find(".schedule_name input").val(schedule_detail_param.name);
                            $row.find(".schedule_shortName input").val(schedule_detail_param.shortName);

                            //颜色
                            if (schedule_detail_param.color) {
                                $row.find(".schedule_color .item").each(function () {

                                    var $this = $(this);
                                    var color = $this.attr("data-color");

                                    if (color === schedule_detail_param.color) {
                                        $this.click();
                                    }

                                });
                            }

                            //考勤时间
                            var $schedule_time = $row.find(".schedule_time");
                            if (schedule_detail_param.beginTime) {
                                var begin_time = schedule_detail_param.beginTime.split(":");
                                $schedule_time.find(".begin_time").find(".hour").val(begin_time[0]);
                                $schedule_time.find(".begin_time").find(".minute").val(begin_time[1]);
                            }
                            if (schedule_detail_param.endTime) {
                                var end_time = schedule_detail_param.endTime.split(":");
                                $schedule_time.find(".end_time").find(".hour").val(end_time[0]);
                                $schedule_time.find(".end_time").find(".minute").val(end_time[1]);
                            }
                            if (schedule_detail_param.endTimeIsNextDay) {

                                $schedule_time.find(".end_time_next_day").find(".choose_item").addClass("active")
                                    .find("img").attr("src", "image/icon_checkbox_check.png");

                            }
                            if (schedule_detail_param.middleTime) {
                                var middle_time = schedule_detail_param.middleTime.split(":");
                                $schedule_time.find(".middle_time").find(".hour").val(middle_time[0]);
                                $schedule_time.find(".middle_time").find(".minute").val(middle_time[1]);
                            }
                            if (schedule_detail_param.middleTimeIsNextDay) {

                                $schedule_time.find(".middle_time_next_day").find(".choose_item").addClass("active")
                                    .find("img").attr("src", "image/icon_checkbox_check.png");

                            }

                            //有效打卡
                            var $schedule_valid_time = $row.find(".schedule_valid_time");
                            if (schedule_detail_param.validBeginTime) {
                                $schedule_valid_time.find(".begin_time input").val(schedule_detail_param.validBeginTime);
                            }
                            if (schedule_detail_param.validEndTime) {
                                $schedule_valid_time.find(".end_time input").val(schedule_detail_param.validEndTime);
                            }

                            //人性打卡
                            var $punch_card = $row.find(".punch_card");
                            var $is_open = $punch_card.find(".togglebutton").find("input");//人性打卡 开关
                            if (schedule_detail_param.punchCardIsOpen) {

                                $is_open.prop("checked", true);
                                $punch_card.find("input").removeAttr("disabled");

                                if (schedule_detail_param.punchCardLate) {
                                    $punch_card.find(".late_time input").val(schedule_detail_param.punchCardLate);
                                }

                                if (schedule_detail_param.punchCardLeaveEarly) {
                                    $punch_card.find(".leave_early_time input").val(schedule_detail_param.punchCardLeaveEarly);
                                }

                            }

                            //休息时间
                            var $rest_time = $row.find(".rest_time");
                            if (schedule_detail_param.restTime && schedule_detail_param.restTime.length > 0) {

                                for (var i = 0; i < schedule_detail_param.restTime.length; i++) {
                                    var $item = schedule_detail_param.restTime[i];
                                    var $cur_row = $rest_time.find(".row").eq(i);//行

                                    var id = $item.id ? $item.id : "";//
                                    var startTime = $item.startTime ? $item.startTime : "";//
                                    var endTime = $item.endTime ? $item.endTime : "";//
                                    var startIsNextDay = $item.startIsNextDay ? $item.startIsNextDay : 0;//
                                    var endIsNextDay = $item.endIsNextDay ? $item.endIsNextDay : 0;//
                                    var isUse = $item.isUse ? $item.isUse : 0;//
                                    var isNormalWorkTime = $item.isNormalWorkTime ? $item.isNormalWorkTime : 0;//

                                    $cur_row.attr("data-id", id);
                                    if (isUse) {

                                        $cur_row.find(".togglebutton").find("input").prop("checked", true);
                                        $cur_row.find("input").removeAttr("disabled");

                                        if (startTime) {
                                            startTime = startTime.split(":");
                                            $cur_row.find(".begin_time").find(".hour").val(startTime[0]);
                                            $cur_row.find(".begin_time").find(".minute").val(startTime[1]);
                                        }
                                        if (startIsNextDay) {
                                            $cur_row.find(".begin_time_next_day").find(".choose_item").addClass("active")
                                                .find("img").attr("src", "image/icon_checkbox_check.png");
                                        }
                                        if (endTime) {
                                            endTime = endTime.split(":");
                                            $cur_row.find(".end_time").find(".hour").val(endTime[0]);
                                            $cur_row.find(".end_time").find(".minute").val(endTime[1]);
                                        }
                                        if (endIsNextDay) {
                                            $cur_row.find(".end_time_next_day").find(".choose_item").addClass("active")
                                                .find("img").attr("src", "image/icon_checkbox_check.png");
                                        }
                                        if (isNormalWorkTime) {
                                            $cur_row.find(".is_normal_work_time").find(".choose_item").addClass("active")
                                                .find("img").attr("src", "image/icon_checkbox_check.png");
                                        }

                                    }

                                }

                            }

                            //旷工设置
                            var $a_row = $row.find(".absenteeism > .row");
                            if (schedule_detail_param.absenteeism && schedule_detail_param.absenteeism.length > 0) {

                                for (var j = 0; j < schedule_detail_param.absenteeism.length; j++) {
                                    var $item = schedule_detail_param.absenteeism[j];

                                    var id = $item.id ? $item.id : "";//
                                    var timeMin = $item.timeMin ? $item.timeMin : "";//
                                    var lackTimeDay = $item.lackTimeDay ? $item.lackTimeDay : "";//
                                    var isUse = $item.isUse ? $item.isUse : 0;//
                                    var absentType = $item.absentType ? $item.absentType : 0;//旷工类型 0:迟到 1:早退 2:上班缺卡 3:下班缺卡 4:一天缺卡

                                    //迟到
                                    if (absentType === 0) {
                                        var $cur_row = $a_row.eq(0);
                                        var $late = $cur_row.find(".late");

                                        $late.attr("data-id", id);
                                        if (isUse) {

                                            //启用 迟到旷工
                                            $cur_row.find(".togglebutton input").prop("checked", true);
                                            $cur_row.find("input").removeAttr("disabled");
                                            $cur_row.find("select").removeAttr("disabled");

                                            $late.find("input").val(timeMin);
                                            $late.find("select").val(lackTimeDay);
                                        }

                                    }
                                    //早退
                                    else if (absentType === 1) {
                                        var $cur_row = $a_row.eq(1);
                                        var $leave_early = $cur_row.find(".leave_early");

                                        $leave_early.attr("data-id", id);
                                        if (isUse) {

                                            //启用 早退旷工
                                            $cur_row.find(".togglebutton input").prop("checked", true);
                                            $cur_row.find("input").removeAttr("disabled");
                                            $cur_row.find("select").removeAttr("disabled");

                                            $leave_early.find("input").val(timeMin);
                                            $leave_early.find("select").val(lackTimeDay);

                                        }

                                    }
                                    //缺卡
                                    else {

                                        var $cur_row = $a_row.eq(2);
                                        var $miss_card = $cur_row.find(".miss_card");

                                        //上班缺卡
                                        if (absentType === 2) {
                                            var $miss_card_on_work = $miss_card.find(".miss_card_on_work");

                                            $miss_card_on_work.attr("data-id", id);
                                            //上班缺卡 使用
                                            if (isUse) {
                                                setVal($miss_card_on_work);//缺卡赋值
                                            }

                                        }
                                        //下班缺卡
                                        else if (absentType === 3) {
                                            var $miss_card_off_work = $miss_card.find(".miss_card_off_work");

                                            $miss_card_off_work.attr("data-id", id);
                                            //下班缺卡 使用
                                            if (isUse) {
                                                setVal($miss_card_off_work);//缺卡赋值
                                            }

                                        }
                                        //一天缺卡
                                        else if (absentType === 4) {
                                            var $miss_card_all_work = $miss_card.find(".miss_card_all_work");

                                            $miss_card_all_work.attr("data-id", id);
                                            //上班缺卡 使用
                                            if (isUse) {
                                                setVal($miss_card_all_work);//一天缺卡
                                            }

                                        }

                                        //缺卡赋值
                                        function setVal($s) {

                                            //启用 缺卡旷工
                                            $cur_row.find(".togglebutton input").prop("checked", true);
                                            $cur_row.find("select").removeAttr("disabled");

                                            $s.find(".choose_item").addClass("active")
                                                .find("img").attr("src", "image/icon_checkbox_check.png");

                                            $s.find("select").val(lackTimeDay);

                                        }

                                    }

                                }

                            }

                            //加班设置
                            var $overTime = $row.find(".overTime_set");
                            var $is_open = $overTime.find(".togglebutton").find("input");//休息时间 开关
                            if (schedule_detail_param.overTime) {

                                var isOpen = schedule_detail_param.overTime.isOpen ? schedule_detail_param.overTime.isOpen : 0;//
                                var type = schedule_detail_param.overTime.type ? schedule_detail_param.overTime.type : 0;//0 是不计入加班 1 是计入加班
                                var notesTime = schedule_detail_param.overTime.notesTime ? schedule_detail_param.overTime.notesTime : 0;//
                                var intervalTime = schedule_detail_param.overTime.intervalTime ? schedule_detail_param.overTime.intervalTime : 0;//

                                if (isOpen) {

                                    $is_open.prop("checked", true);
                                    $overTime.find(".row").find("input").removeAttr("disabled");

                                    $overTime.find(".default_time").val(notesTime);
                                    $overTime.find(".default").html(notesTime);
                                    $overTime.find(".interval_time").val(intervalTime);

                                    //如果 默认时间，计入加班时间
                                    if (type) {
                                        $overTime.find(".choose_item").addClass("active")
                                            .find("img").attr("src", "image/icon_checkbox_check.png");
                                    }

                                }

                            }

                            //上班工时
                            var $work_time = $row.find(".work_time");
                            if (schedule_detail_param.work_time) {

                                var timeType = schedule_detail_param.work_time.type
                                    ? schedule_detail_param.work_time.type : 0;// 0 正常工时 1 加班工时 2 其他
                                var time = schedule_detail_param.work_time.time
                                    ? schedule_detail_param.work_time.time : 0;//
                                var exceportTime = schedule_detail_param.work_time.exceportTime
                                    ? schedule_detail_param.work_time.exceportTime : 1;//1： 扣除加班时间2： 扣除正常工时

                                //选中的 行
                                var $cur_row = $work_time.find(".row").eq(timeType);

                                $cur_row.addClass("active").find(".choose_row img").attr("src", "image/icon_radio_check.png");
                                $cur_row.siblings(".row").removeClass("active")
                                    .find(".choose_row img").attr("src", "image/icon_radio_unCheck.png");

                                //如果是 其他
                                if (timeType === 2) {
                                    $cur_row.find(".overTime input").removeAttr("disabled").val(time);

                                    var $cur_item = $cur_row.find(".overTime_deduct .item").eq(exceportTime - 1);

                                    $cur_item.addClass("active").find("img").attr("src", "image/icon_radio_check.png");
                                    $cur_item.siblings(".item").removeClass("active")
                                        .find("img").attr("src", "image/icon_radio_unCheck.png");

                                    // //扣除加班时间
                                    // if (exceportTime === 1) {
                                    //
                                    //     $cur_row.find().eq(0).addClass("active")
                                    //
                                    // }

                                }


                            }

                            //加班工时
                            if (schedule_detail_param.approvalTypeDetail) {
                                $row.find(".overTime_type_container .overTime_type")
                                    .val(schedule_detail_param.approvalTypeDetail);
                            }

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


        }

    },

    //检查 输入时间 （小时）
    checkHour: function (self) {
        var txt = "";

        var $self = $(self);
        var max = $self.attr("max");//最大值
        max = max ? parseFloat(max) : 23;
        var min = $self.attr("min");//最小值
        min = min ? parseFloat(min) : 0;
        var val = parseFloat($self.val());//输入的值

        if (val.length > 2) {
            txt = "最多输入2位数字！";
            val = max;
        }
        else if (val > max) {
            txt = "请输入正确的小时数，当前最大值为" + max + "小时！";
            val = max;
        }
        else if (val < min) {
            txt = "请输入正确的小时数，当前最小值为" + min + "小时！";
            // val = min;
            val = min ? min : "00";
        }
        else if (val < 10) {
            val = "0" + val;
        }
        // else if (val === 0) {
        //     val = "00";
        // }

        if (txt) {
            toastr.warning(txt);
        }

        $self.val(val);

    },
    //检查 输入时间 （分钟）
    checkMinute: function (self) {
        var txt = "";

        var $self = $(self);
        var max = $self.attr("max");//最大值
        max = max ? parseFloat(max) : 59;
        var min = $self.attr("min");//最小值
        min = min ? parseFloat(min) : 0;
        var val = parseFloat($self.val());//输入的值

        if (val > max) {
            txt = "请输入正确的分钟数，当前最大值为" + max + "分钟！";
            val = max;
        }
        else if (val < min) {
            txt = "请输入正确的分钟数，当前最小值为" + min + "分钟！";
            val = min;
            // val = min ? min : "00";
        }
        else if (val < 10) {
            val = "0" + val;
        }

        if (txt) {
            toastr.warning(txt);
        }

        $self.val(val);

    },
    //检查 输入时间（hour） 0~23  --- 只有一个小数
    checkHour_1: function (self) {
        var txt = "";

        var $self = $(self);
        var max = $self.attr("max");//最大值
        max = max ? parseFloat(max) : 23;
        var min = $self.attr("min");//最小值
        min = min ? parseFloat(min) : 0;
        var val = parseFloat($self.val());//输入的值
        var arr = $self.val().split(".");

        if (val > max) {
            txt = "请输入正确的小时数，当前最大值为" + max + "小时！";
            val = max;
        }
        else if (val < min) {
            txt = "请输入正确的小时数，当前最小值为" + min + "小时！";
            val = min;
        }
        else if (arr.length > 1 && arr[1].toString().length > 2) {
            val = arr[0] + "." + arr[1].substr(0, 1);
        }

        if (txt) {
            toastr.warning(txt);
        }

        $self.val(val);
    },

    //初始化 颜色
    initColor: function () {
        var $schedule_color = $row.find(".schedule_color");
        $schedule_color.empty();

        branGetRequest(
            urlGroup.attendance.schedule_detail.colors_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var arr = data.result.colors;

                        if (!arr || arr.length === 0) {
                        }
                        else {
                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var order = item.order ? item.order : "";//
                                var color = item.color ? item.color : "";//
                                // var className = "clr_" + color.split("#")[1];

                                var $item = $("<div>");
                                $item.addClass("item");
                                $item.attr("data-color", color);
                                $item.attr("data-order", order);
                                $item.css("background-color", color);
                                $item.unbind("click").bind("click", function () {
                                    schedule_detail.chooseColor(this);
                                });
                                $item.appendTo($schedule_color);

                            }
                        }

                    }
                    else {
                        toastr.warning(data.msg);
                    }

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
    //选择 颜色
    chooseColor: function (self) {
        var $self = $(self);

        if (!$self.hasClass("active")) {

            var $i = $("<i>");
            $i.addClass("glyphicon");
            $i.addClass("glyphicon-ok");
            $i.appendTo($self);

            $self.addClass("active").siblings(".item").removeClass("active").find("i").remove();

            schedule_detail_param.color = $self.attr("data-color");
        }

    },

    //初始化 考勤时间
    initScheduleTime: function () {
        var $schedule_time = $row.find(".schedule_time");

        $schedule_time.find("input").val("");
        $schedule_time.find(".next_day").find(".choose_item").removeClass("active")
            .find("img").attr("src", "image/icon_checkbox_unCheck.png");

        //选择次日
        $schedule_time.find(".choose_item").unbind("click").bind("click", function () {

            var $this = $(this);
            if (!$this.hasClass("active")) {
                $this.addClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_check.png");
            }
            else {
                $this.removeClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_unCheck.png");
            }

        });

    },

    //初始化 有效打卡
    initValidTime: function () {

        var $schedule_valid_time = $row.find(".schedule_valid_time");
        $schedule_valid_time.find(".begin_time input").val("2");
        $schedule_valid_time.find(".end_time input").val("5");

    },

    //初始化 人性打卡
    initPunchCard: function () {

        var $punch_card = $row.find(".punch_card");
        var $is_open = $punch_card.find(".togglebutton").find("input");//人性打卡 开关
        var $npt = $punch_card.find(".item").find("input");//迟到、早退 input

        $is_open.attr("checked", false);//默认关闭
        $npt.val("").attr("disabled", "disabled");//默认 值为空，不可输入

        //开启、关闭 功能
        $is_open.unbind("click").bind("click", function () {

            var $this = $(this);
            var is_open = $this.is(":checked");
            //如果开启了
            if (is_open) {
                $npt.removeAttr("disabled");
            }
            else {
                $npt.attr("disabled", "disabled");
                $npt.val("");
            }

        });

    },

    //初始化 休息时间
    initRestTime: function () {

        var $rest_time = $row.find(".rest_time");
        var $is_open = $rest_time.find(".row").find(".togglebutton").find("input");//休息时间 开关
        var $npt = $rest_time.find(".row").find(".item").find("input");//开始、结束 input
        var $choose_item = $rest_time.find(".row").find(".choose_item");//选择框

        $is_open.attr("checked", false);//默认关闭
        $npt.val("").attr("disabled", "disabled");//默认 值为空，不可输入
        $choose_item.removeClass("active").find("img").attr("src", "image/icon_checkbox_unCheck.png");//默认关闭 选择

        //开启、关闭 功能
        $is_open.unbind("click").bind("click", function () {

            var $this = $(this);
            var is_open = $this.is(":checked");

            var $cur_row = $this.closest(".row");//当前行

            //如果开启了
            if (is_open) {
                $cur_row.find(".item").find("input").removeAttr("disabled");
            }
            else {
                $cur_row.find(".item").find("input").attr("disabled", "disabled");
                $cur_row.find(".item").find("input").val("");
                $cur_row.find(".choose_item").removeClass("active")
                    .find("img").attr("src", "image/icon_checkbox_unCheck.png");
            }

        });

        //choose_item click
        $choose_item.unbind("click").bind("click", function () {

            var $this = $(this);
            var is_open = $this.closest(".row").find(".togglebutton").find("input").is(":checked");

            if (!is_open) {
                toastr.warning("当前状态是关闭，不能更改！");
            }
            else if ($this.hasClass("active")) {
                $this.removeClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_unCheck.png");
            }
            else {
                $this.addClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_check.png");
            }

        });

    },

    //初始化 旷工设置
    initAbsenteeism: function () {

        schedule_detail.initAbsenteeismSelect();//初始化  旷工天数

        var $a_row = $row.find(".absenteeism > .row");
        var $is_open = $a_row.find(".togglebutton").find("input");//旷工设置 开关
        var $npt = $a_row.find(".item").find("input");//迟到、早退 input
        var $choose_item = $a_row.find(".miss_card").find(".choose_item");//缺卡旷工 choose_item
        var $select = $a_row.find("select");//旷工天数 select

        $is_open.attr("checked", false);//默认关闭
        $npt.val("").attr("disabled", "disabled");//默认 值为空，不可输入
        $choose_item.removeClass("active").find("img").attr("src", "image/icon_checkbox_unCheck.png");//默认关闭 选择
        $select.val("0.5").attr("disabled", "disabled");//默认 值为空，不可选择

        //开启、关闭 功能
        $is_open.unbind("click").bind("click", function () {

            var $this = $(this);
            var is_open = $this.is(":checked");

            var $cur_row = $this.closest(".row");//当前行

            //如果开启了
            if (is_open) {
                $cur_row.find("select").removeAttr("disabled");
                if ($cur_row.find("input").length > 0)
                    $cur_row.find("input").removeAttr("disabled");
            }
            else {
                $cur_row.find("select").attr("disabled", "disabled").val("0.5");
                if ($cur_row.find("input").length > 0) {
                    $cur_row.find(".item").find("input").attr("disabled", "disabled").val("");
                }
                if ($cur_row.find(".choose_item").length > 0) {
                    $cur_row.find(".choose_item").removeClass("active")
                        .find("img").attr("src", "image/icon_checkbox_unCheck.png");
                }
            }
        });

        //choose_item click
        $choose_item.unbind("click").bind("click", function () {

            var $this = $(this);
            var $cur_row = $a_row.find(".miss_card").closest(".row");//当前行
            var is_open = $cur_row.find(".togglebutton").find("input").is(":checked");

            if (!is_open) {
                toastr.warning("当前状态是关闭，不能更改！");
            }
            else if ($this.hasClass("active")) {
                $this.removeClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_unCheck.png");
            }
            else {
                $this.addClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_check.png");
            }

        });


    },
    //初始化 旷工天数
    initAbsenteeismSelect: function () {

        var $absenteeism = $row.find(".absenteeism");
        var $select = $absenteeism.find(".row").find("select");//旷工天数 select

        var option = "";
        for (var i = 1; i < 7; i++) {
            option += "<option>" + (i * 0.5) + "</option>";
        }

        $select.html(option);

    },

    //初始化 加班设置
    initOverTime: function () {

        var $overTime = $row.find(".overTime_set");
        // var $a_row=$row.find(".overTime_set > .row");
        var $is_open = $overTime.find(".togglebutton").find("input");//休息时间 开关
        var $npt = $overTime.find(".row").find("input");//开始、结束 input
        var $choose_item = $overTime.find(".row").find(".choose_item");//选择框

        $is_open.attr("checked", false);//默认关闭
        $npt.val("").attr("disabled", "disabled");//默认 值为空，不可输入
        $choose_item.removeClass("active").find("img").attr("src", "image/icon_checkbox_unCheck.png");//默认关闭 选择
        $choose_item.siblings(".default").empty();//默认时间 置空

        //开启、关闭 功能
        $is_open.unbind("click").bind("click", function () {

            var $this = $(this);
            var is_open = $this.is(":checked");

            //如果开启了
            if (is_open) {
                $npt.removeAttr("disabled");
            }
            else {
                $npt.attr("disabled", "disabled").val("");
                $choose_item.removeClass("active")
                    .find("img").attr("src", "image/icon_checkbox_unCheck.png");
                $choose_item.siblings(".default").empty();
            }

        });

        //choose_item click
        $choose_item.unbind("click").bind("click", function () {

            var $this = $(this);
            var is_open = $is_open.is(":checked");

            if (!is_open) {
                toastr.warning("当前状态是关闭，不能更改！");
            }
            else if ($this.hasClass("active")) {
                $this.removeClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_unCheck.png");
            }
            else {
                $this.addClass("active");
                $this.find("img").attr("src", "image/icon_checkbox_check.png");
            }

        });

    },
    //默认时间 自动赋值
    overTimeDefaultTime: function (self) {

        schedule_detail.checkMinute(self);

        var $overTime = $row.find(".overTime_set");
        var val = $overTime.find(".default_time").val();

        $overTime.find(".default").html(val);

    },

    //初始化 上班工时
    initWorkTime: function () {

        var $work_time = $row.find(".work_time");
        var $choose_row = $work_time.find(".row").find(".choose_row");//加班工时 行 choose_row
        var $choose_item = $work_time.find(".row").find(".item").find(".choose_item");//选择框 加班工时、正常工时

        //行选择
        $choose_row.closest(".row").removeClass("active");
        $choose_row.find("img").attr("src", "image/icon_radio_unCheck.png");//默认

        //扣除工时 选择
        $choose_item.closest(".item").removeClass("active");
        $choose_item.find("img").attr("src", "image/icon_radio_unCheck.png");//默认

        $work_time.find("input").attr("disabled", "disabled");//

        //默认选择 全部为正常工时
        $work_time.find(".row").first().addClass("active").find(".choose_row img")
            .attr("src", "image/icon_radio_check.png");

        //choose_row click
        $choose_row.unbind("click").bind("click", function () {

            var $this = $(this);
            var $cur_row = $this.closest(".row");

            //如果没有 被选中
            if (!$cur_row.hasClass("active")) {

                $cur_row.addClass("active").find(".choose_row")
                    .find("img").attr("src", "image/icon_radio_check.png");
                $cur_row.siblings().removeClass("active").find(".choose_row")
                    .find("img").attr("src", "image/icon_radio_unCheck.png");

                //是否是 部分计入加班工时,如果是
                if ($cur_row.find(".overTime_deduct").length > 0) {
                    $cur_row.find("input").removeAttr("disabled");
                    $cur_row.find(".overTime_deduct").find(".item").first().addClass("active")
                        .find("img").attr("src", "image/icon_radio_check.png");
                }
                else {
                    $work_time.find("input").attr("disabled", "disabled");
                    $choose_item.removeClass("active");
                    $choose_item.find("img").attr("src", "image/icon_radio_unCheck.png");
                }

            }

        });

        //choose_item click
        $choose_item.unbind("click").bind("click", function () {

            var $this = $(this);
            if (!$this.closest(".row").hasClass("active")) {
                toastr.warning("当前状态不是部分计入加班，不能选择！");
            }
            else if (!$this.closest(".item").hasClass("active")) {       //未选择
                $this.closest(".item").addClass("active")
                    .find("img").attr("src", "image/icon_radio_check.png");
                $this.closest(".item").siblings(".item").removeClass("active").find("img")
                    .attr("src", "image/icon_radio_unCheck.png");
            }

        });

    },

    //初始化 加班工时
    initOverTimeType: function () {

        branGetRequest(
            urlGroup.attendance.setting.overTime.list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var $overTime_type_list = $row.find(".overTime_type");
                        $overTime_type_list.empty();

                        $.each(data.result, function (index, $item) {

                            // var id = $item.id ? $item.id : "";//
                            var approvalTypeDetail = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                                ($item.approvalTypeDetail === 0 ? 0 : "");//审批明细
                            var name = schedule_detail.approvalTypeMap.get(approvalTypeDetail);

                            var $option = $("<option>");
                            $option.attr("value", approvalTypeDetail);
                            $option.text(name);
                            $option.appendTo($overTime_type_list);

                        });

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

    //保存
    scheduleSave: function () {

        schedule_detail_param.paramSet();//保存前 赋值

        //检查 参数
        if (!schedule_detail.checkParamBySave()) {
            return
        }

        var obj = {
            id: schedule_detail_param.id,
            shiftTypeName: schedule_detail_param.name,
            shortName: schedule_detail_param.shortName,
            color: schedule_detail_param.color,
            workStartTime: schedule_detail_param.beginTime,
            workEndTime: schedule_detail_param.endTime,
            workTypeIsNextDay: schedule_detail_param.endTimeIsNextDay,
            workMiddle: schedule_detail_param.middleTime,
            workMiddleIsNextDay: schedule_detail_param.middleTimeIsNextDay,
            workStratVaild: schedule_detail_param.validBeginTime,
            workEndVaild: schedule_detail_param.validEndTime,
            activePunchcardIsUse: schedule_detail_param.punchCardIsOpen,
            activePunchcardLate: schedule_detail_param.punchCardLate,
            activePunchcardEarly: schedule_detail_param.punchCardLeaveEarly,
            overtimeSetting: schedule_detail_param.overTime,
            restTime: schedule_detail_param.restTime,
            lackDef: schedule_detail_param.absenteeism,
            workTime: schedule_detail_param.work_time,
            approvalTypeDetail: schedule_detail_param.approvalTypeDetail
        };
        // console.log(obj);

        branPostRequest(
            urlGroup.attendance.schedule_detail.save,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {
                    toastr.success("保存成功！");

                    getInsidePageDiv(urlGroup.attendance.schedule.index, 'schedule_manage', '班次管理');
                    schedule_manage.scheduleList();

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
    //检查 参数
    checkParamBySave: function () {
        var flag = false;
        var txt;

        //旷工设置
        var $a_row = $row.find(".absenteeism > .row");
        var $is_open = $a_row.eq(2).find(".togglebutton input").is(":checked");
        if ($is_open && $a_row.eq(2).find(".choose_item.active").length === 0) {
            txt = "开启缺卡旷工时，请选择缺卡类型！";
        }

        //上班工时
        if (schedule_detail_param.work_time && schedule_detail_param.work_time.type === 2 &&
            !schedule_detail_param.work_time.exceportTime) {
            txt = "上班工时部分计入加班，请选择优先扣除工时类型！";
        }


        if (txt) {
            toastr.warning(txt);
        }
        else {
            flag = true;
        }

        return flag;

    }

};
//班次 参数
var schedule_detail_param = {

    id: null,                               //班次id
    name: null,                             //班次名称
    shortName: null,                        //班次简称
    color: null,                            //班次颜色
    beginTime: null,                        //班次 开始时间
    endTime: null,                          //班次 结束时间
    endTimeIsNextDay: null,                 //班次 结束时间 是否次日
    middleTime: null,                       //班次 打卡中间点
    middleTimeIsNextDay: null,              //班次 打卡中间点 是否次日
    validBeginTime: null,                   //开始有效时间  上班前几个小时
    validEndTime: null,                     //结束有效时间
    punchCardIsOpen: null,                  //人性打卡 是否开启
    punchCardLate: null,                     //人性打卡 迟到时间
    punchCardLeaveEarly: null,               //人性打卡 早退时间
    restTime: [{                                //休息时间
        id: null,                       //休息时间的id ,
        startTime: null,                        // 开始时间 ,
        endTime: null,                      // 结束时间 ,
        startIsNextDay: null,                       //开始时间是否次日 0不是次日 1表示次日 ,
        endIsNextDay: null,                     // 结束时间是否次日 0不是次日 1表示次日 ,
        isUse: null,                        // 是否启用 0 关闭 1启用 ,
        isNormalWorkTime: null                     // 是否计入正常工时 0表示 否 1 是 是
    }],
    absenteeism: [{
        id: null,                               // 旷工的定义的id,
        timeMin: null,                              //对应的分钟
        timeDay: null,                           //对应的旷工天数
        isUse: null,                             //是否开启
        type: null                               //旷工类型  0:迟到 1:早退 2:上班缺卡 3:下班缺卡 4:一天缺卡
    }],
    overTime: {
        isOpen: null,                            //是否开启
        type: null,                              //加班的类型，0 是计入加班 1 是不计入加班
        notesTime: null,                         //开始计算时间点 单位：分钟
        intervalTime: null                        //间隔时间 单位：分钟
    },
    work_time: {
        type: null,                              //0 正常工时 1 加班工时 2 其他 ,
        time: null,                              //其他时间计入的时间
        exceportTime: null                       // 1： 扣除加班时间2： 扣除正常工时
    },
    approvalTypeDetail: null,                //加班工时 类型（审批类型明细）

    //获取班次 详情
    scheduleDetailParam: function (result) {

        schedule_detail_param.name = result.shiftTypeName ? result.shiftTypeName : "";//
        schedule_detail_param.shortName = result.shortName ? result.shortName : "";//
        schedule_detail_param.color = result.color ? result.color : "";//

        schedule_detail_param.beginTime = result.workStartTime ? result.workStartTime : "";//
        schedule_detail_param.endTime = result.workEndTime ? result.workEndTime : "";//
        schedule_detail_param.endTimeIsNextDay = result.workTypeIsNextDay ? result.workTypeIsNextDay : 0;//

        schedule_detail_param.middleTime = result.workMiddle ? result.workMiddle : "";//
        schedule_detail_param.middleTimeIsNextDay = result.workMiddleIsNextDay ? result.workMiddleIsNextDay : 0;//

        schedule_detail_param.validBeginTime = result.workStratVaild ? result.workStratVaild : "";//
        schedule_detail_param.validEndTime = result.workEndVaild ? result.workEndVaild : "";//

        schedule_detail_param.punchCardIsOpen = result.activePunchcardIsUse ? result.activePunchcardIsUse : 0;//
        schedule_detail_param.punchCardLate = result.activePunchcardLate ? result.activePunchcardLate : 0;//
        schedule_detail_param.punchCardLeaveEarly = result.activePunchcardEarly ? result.activePunchcardEarly : 0;//

        schedule_detail_param.restTime = result.restTime ? result.restTime : [];//休息时间

        schedule_detail_param.absenteeism = result.lackDef ? result.lackDef : [];//旷工

        schedule_detail_param.overTime = result.overtimeSetting ? result.overtimeSetting : null;//加班

        schedule_detail_param.work_time = result.workTime ? result.workTime : null;//工时计算

        schedule_detail_param.approvalTypeDetail = result.approvalTypeDetail ? result.approvalTypeDetail : "10";////加班工时 类型（审批类型明细）

    },

    //保存前 赋值
    paramSet: function () {

        schedule_detail_param.name = $row.find(".schedule_name input").val();
        schedule_detail_param.shortName = $row.find(".schedule_shortName input").val();
        schedule_detail_param.color = $row.find(".schedule_color .item.active").attr("data-color");

        //考勤时间
        var $schedule_time = $row.find(".schedule_time");
        schedule_detail_param.beginTime = $schedule_time.find(".begin_time").find(".hour").val() + ":" +
            $schedule_time.find(".begin_time").find(".minute").val();
        schedule_detail_param.endTime = $schedule_time.find(".end_time").find(".hour").val() + ":" +
            $schedule_time.find(".end_time").find(".minute").val();
        schedule_detail_param.endTimeIsNextDay = $schedule_time.find(".end_time_next_day").find(".choose_item")
            .hasClass("active") ? 1 : 0;
        schedule_detail_param.middleTime = $schedule_time.find(".middle_time").find(".hour").val() + ":" +
            $schedule_time.find(".middle_time").find(".minute").val();
        schedule_detail_param.middleTimeIsNextDay = $schedule_time.find(".middle_time_next_day").find(".choose_item")
            .hasClass("active") ? 1 : 0;

        //有效打卡
        var $schedule_valid_time = $row.find(".schedule_valid_time");
        schedule_detail_param.validBeginTime = $schedule_valid_time.find(".begin_time input").val();
        schedule_detail_param.validEndTime = $schedule_valid_time.find(".end_time input").val();

        //人性打卡
        var $punch_card = $row.find(".punch_card");
        var $is_open = $punch_card.find(".togglebutton").find("input").is(":checked");//人性打卡 开关
        if ($is_open) {
            schedule_detail_param.punchCardIsOpen = 1;
            schedule_detail_param.punchCardLate = $punch_card.find(".late_time input").val();
            schedule_detail_param.punchCardLeaveEarly = $punch_card.find(".leave_early_time input").val();
        }
        else {
            schedule_detail_param.punchCardIsOpen = 0;
            schedule_detail_param.punchCardLate = null;
            schedule_detail_param.punchCardLeaveEarly = null;
        }

        //休息时间
        schedule_detail_param.restTime = [];
        var $rest_time = $row.find(".rest_time");
        for (var i = 0; i < $rest_time.find(".row").length; i++) {
            var $cur_row = $rest_time.find(".row").eq(i);

            var id = $cur_row.attr("data-id") ? $cur_row.attr("data-id") : "";//
            var isUse = $cur_row.find(".togglebutton").find("input").is(":checked") ? 1 : 0;//
            var startTime = $cur_row.find(".begin_time").find(".hour").val() + ":" +
                $cur_row.find(".begin_time").find(".minute").val();
            var startIsNextDay = $cur_row.find(".begin_time_next_day").find(".choose_item")
                .hasClass("active") ? 1 : 0;//
            var endTime = $cur_row.find(".end_time").find(".hour").val() + ":" +
                $cur_row.find(".end_time").find(".minute").val();
            var endIsNextDay = $cur_row.find(".end_time_next_day").find(".choose_item")
                .hasClass("active") ? 1 : 0;//
            var isNormalWorkTime = $cur_row.find(".is_normal_work_time").find(".choose_item")
                .hasClass("active") ? 1 : 0;//

            var obj = {};
            if (isUse) {
                obj = {
                    id: id,
                    isUse: isUse,
                    startTime: startTime,
                    startIsNextDay: startIsNextDay,
                    endTime: endTime,
                    endIsNextDay: endIsNextDay,
                    isNormalWorkTime: isNormalWorkTime
                }
            }
            else {
                obj = {
                    id: id,
                    isUse: isUse,
                    startTime: null,
                    startIsNextDay: null,
                    endTime: null,
                    endIsNextDay: null,
                    isNormalWorkTime: null
                }
            }

            schedule_detail_param.restTime.push(obj);

        }

        //旷工设置
        schedule_detail_param.absenteeism = [];
        var $a_row = $row.find(".absenteeism > .row");
        for (var j = 0; j < $a_row.length; j++) {
            var $cur_row = $a_row.eq(j);

            //迟到
            if (j === 0) {
                var $late = $cur_row.find(".late");

                objSet($cur_row, $late);//设置 迟到、早退 旷工

            }
            //早退
            else if (j === 1) {
                var $leave_early = $cur_row.find(".leave_early");

                objSet($cur_row, $leave_early);//设置 迟到、早退 旷工

            }
            //缺卡
            else {

                var $miss_card = $cur_row.find(".miss_card");

                $miss_card.find(".row").each(function () {

                    var obj = {};
                    var $this = $(this);

                    var id = $this.attr("data-id") ? $this.attr("data-id") : "";
                    var type = $this.attr("data-type") ? $this.attr("data-type") : "";
                    var isUse = $this.find(".choose_item").hasClass("active") ? 1 : 0;

                    if (isUse) {
                        obj = {
                            id: id,
                            isUse: isUse,
                            absentType: type,
                            timeMin: null,
                            lackTimeDay: $this.find("select").val()
                        };
                    }
                    else {
                        obj = {
                            id: id,
                            isUse: isUse,
                            absentType: type,
                            timeMin: null,
                            lackTimeDay: null
                        };
                    }

                    schedule_detail_param.absenteeism.push(obj);

                });


            }

            //设置 迟到、早退 旷工
            function objSet($cur_row, $self) {

                var obj = {};
                var id = $self.attr("data-id") ? $self.attr("data-id") : "";
                var type = $self.attr("data-type") ? $self.attr("data-type") : "";
                var isUse = $cur_row.find(".togglebutton input").is(":checked") ? 1 : 0;

                if (isUse) {
                    obj = {
                        id: id,
                        isUse: isUse,
                        absentType: type,
                        timeMin: $self.find("input").val(),
                        lackTimeDay: $self.find("select").val()
                    };
                }
                else {
                    obj = {
                        id: id,
                        isUse: isUse,
                        absentType: type,
                        timeMin: null,
                        lackTimeDay: null
                    };
                }

                schedule_detail_param.absenteeism.push(obj);
            }

        }

        //加班设置
        schedule_detail_param.overTime = {};
        var $overTime = $row.find(".overTime_set");
        var $is_open = $overTime.find(".togglebutton").find("input").is(":checked");//加班设置 开关
        if ($is_open) {

            var notesTime = $overTime.find(".default_time").val();
            var intervalTime = $overTime.find(".interval_time").val();
            var type = $overTime.find(".choose_item").hasClass("active") ? 1 : 0;

            schedule_detail_param.overTime = {
                isOpen: 1,
                type: type,
                notesTime: notesTime,
                intervalTime: intervalTime
            }

        }
        else {
            schedule_detail_param.overTime = {
                isOpen: 0,
                type: 0,
                notesTime: null,
                intervalTime: null
            }
        }

        //上班工时
        schedule_detail_param.work_time = {};
        var $work_time = $row.find(".work_time");
        var type = parseInt($work_time.find(".row.active").attr("data-type"));
        //如果是部分 记加班
        if (type === 2) {

            var time = $work_time.find(".row.active").find("input").val();
            var exceportTime = $work_time.find(".row.active").find(".overTime_deduct")
                .find(".item.active").attr("data-type");
            exceportTime = exceportTime ? parseInt(exceportTime) : null;

            schedule_detail_param.work_time = {
                type: type,
                time: time,
                exceportTime: exceportTime
            }

        }
        else {
            schedule_detail_param.work_time = {
                type: type,
                time: null,
                exceportTime: null
            }
        }

        //加班工时
        schedule_detail_param.approvalTypeDetail = $row.find(".overTime_type_container .overTime_type").val();

    }

};

$(function () {

    if (sessionStorage.getItem("schedule_id")) {
        schedule_detail_param.id = sessionStorage.getItem("schedule_id");
    }

    schedule_detail.init();
});

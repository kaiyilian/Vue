/**
 * Created by Administrator on 2017/9/23.
 * 出勤明细
 */

var $attendance_detail_container = $(".attendance_detail_container");//
var $tb_attendance_detail = $attendance_detail_container.find("#tb_attendance_detail");//考勤明细 表格
var $attendance_detail_modal = $(".attendance_detail_modal");//弹框 modal

var attendance_detail = {

    row: null,//当前操作的 row
    approvalTypeMap: null,//审批类型 map

    init: function () {
        $("[data-toggle='tooltip']").tooltip();

        //初始化 审批明细类型map
        attendance_detail.approvalTypeMap = approval_type.initApprovalTypeMap();

        attendance_detail.initAttendState();//初始化 打卡状态
        attendance_detail.initTime();//初始化 时间
        attendance_detail.initSetting();// 出勤周期
        attendance_detail.initUserList();// 用户列表
        attendance_detail.initUserStatus();// 员工 状态改变

        // attendance_detail.btnSearchClick();//查询按钮 点击事件

        // $attendance_detail_modal.modal("show");

        //修改出勤 弹框显示
        $attendance_detail_modal.on("shown.bs.modal", function () {

            console.log("获取出勤：" + new Date().getTime());

            var $row = $attendance_detail_modal.find(".modal-body > .row");
            //请假记录
            var $attend_leave_list = $row.find(".attend_leave_list");
            $attend_leave_list.empty();
            //加班记录
            var $attend_overTime_list = $row.find(".attend_overTime_list");
            $attend_overTime_list.empty();

            attendance_detail.initBaseInfo();//初始化 基本信息
            attendance_detail.initAttendRecord();//初始化 出勤记录

            if (attendance_detail.row) {

                var obj = {
                    workAttendId: attendance_detail.row.id
                };
                var url = urlGroup.attendance.attendance_detail.attendance_record+ "?" + jsonParseParam(obj);

                branGetRequest(
                    url,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            if (data.result) {

                                var $item = data.result;
                                var attendDay = $item.attendDay ? $item.attendDay : "";//
                                var user_name = $item.realName ? $item.realName : "";//
                                var work_shift = $item.workShiftName ? $item.workShiftName : "";//
                                var department = $item.departmentName ? $item.departmentName : "";//
                                var schedule = $item.workShiftTypeName ? $item.workShiftTypeName : "";//
                                var workShiftTypeInTime = $item.workShiftTypeInTime ? $item.workShiftTypeInTime : "";//
                                var workShiftTypeOutTime = $item.workShiftTypeOutTime ? $item.workShiftTypeOutTime : "";//
                                var workShiftTypeOutTimeIsNextDay = $item.workOutIsMorrow ? $item.workOutIsMorrow : "";//
                                var work_time = workShiftTypeInTime + " - " + workShiftTypeOutTime +
                                    (workShiftTypeOutTimeIsNextDay ? "(次)" : "");
                                // var workShiftTypeId = $item.workShiftTypeId ? $item.workShiftTypeId : "";//

                                //基本信息
                                $row.find(".attendance_date").html(attendDay);
                                $row.find(".user_name").html(user_name);
                                $row.find(".work_shift").html(work_shift);
                                $row.find(".department").html(department);
                                $row.find(".schedule").html(schedule);
                                $row.find(".work_time").html(work_time);
                                // $row.find(".schedule_list select").val(workShiftTypeId);

                                //出勤记录
                                var attendStartTime = $item.attendStartTime ? $item.attendStartTime : "";
                                var attendStartIsMorrow = $item.attendStartIsMorrow ? $item.attendStartIsMorrow : 0;
                                var attendStartState = $item.attendStartState ? $item.attendStartState : "";
                                var attendEndTime = $item.attendEndTime ? $item.attendEndTime : "";
                                var attendEndIsMorrow = $item.attendEndIsMorrow ? $item.attendEndIsMorrow : 0;
                                var attendEndState = $item.attendEndState ? $item.attendEndState : "";
                                var attend_start = (attendStartTime ? attendStartTime : "无记录") +
                                    (attendStartIsMorrow ? "(次)" : "") + ("(" + attendStartState + ")");
                                var attend_end = (attendEndTime ? attendEndTime : "无记录") +
                                    (attendEndIsMorrow ? "(次)" : "") + ("(" + attendEndState + ")");

                                var $attendance_record = $row.find(".attendance_record");
                                $attendance_record.find(".begin .card_info").html(attend_start);
                                $attendance_record.find(".end .card_info").html(attend_end);

                                //请假记录
                                var leave_arr = $item.workAttendanceLeaveResultList ? $item.workAttendanceLeaveResultList : [];
                                if (leave_arr && leave_arr.length > 0) {

                                    $attend_leave_list.empty();//清空请假记录

                                    for (var i = 0; i < leave_arr.length; i++) {

                                        var $leave_item = leave_arr[i];

                                        var id = $leave_item.id ? $leave_item.id : "";//
                                        var leaveType = $leave_item.leaveType ? $leave_item.leaveType : "";//
                                        var begin_time = $leave_item.leaveTimeStart ? $leave_item.leaveTimeStart : "";//
                                        var begin_time_is_next_day = $leave_item.leaveStartTimeMorrow
                                            ? $leave_item.leaveStartTimeMorrow : 0;//
                                        var end_time = $leave_item.leaveTimeEnd ? $leave_item.leaveTimeEnd : "";//
                                        var end_time_is_next_day = $leave_item.leaveTimeEndMorrow
                                            ? $leave_item.leaveTimeEndMorrow : 0;//

                                        var is_approval = $leave_item.isApprovalData ? $leave_item.isApprovalData : 0;//判断是否是 审批
                                        var is_effective = $leave_item.isInvalid ? $leave_item.isInvalid : 0;//是否有效 0 有效 1 无效
                                        var leaveMins = $leave_item.leaveMins ? $leave_item.leaveMins : 0;//请假时长

                                        var approvalId = $leave_item.approvalId ? $leave_item.approvalId : "";//审批id
                                        var approvalNo = $leave_item.approvalNo ? $leave_item.approvalNo : "";//审批编号
                                        var workInTimeValue = $leave_item.workInTimeValue ? $leave_item.workInTimeValue : "";//班次上班时间
                                        var workOutTimeValue = $leave_item.workOutTimeValue ? $leave_item.workOutTimeValue : "";//班次下班时间

                                        //如果是 审批记录
                                        if (is_approval) {

                                            var $approval_leave_item = $("<div>");
                                            $approval_leave_item.appendTo($attend_leave_list);
                                            $approval_leave_item.addClass("approval_leave_item");
                                            //如果是 无效的 0 有效 1 无效
                                            if (is_effective) {
                                                $approval_leave_item.addClass("invalid");
                                            }

                                            $approval_leave_item.attr("data-id", id);
                                            $approval_leave_item.attr("data-type", leaveType);
                                            $approval_leave_item.attr("data-approvalId", approvalId);
                                            $approval_leave_item.attr("data-workInDate", workInTimeValue);
                                            $approval_leave_item.attr("data-workOutDate", workOutTimeValue);
                                            $approval_leave_item.attr("data-isInvalid", is_effective);

                                            //如果是审批，则要赋值 开始时间、开始时间是否次日、
                                            $approval_leave_item.attr("data-beginTime", begin_time);
                                            $approval_leave_item.attr("data-beginMorrow", begin_time_is_next_day);
                                            $approval_leave_item.attr("data-endTime", end_time);
                                            $approval_leave_item.attr("data-endMorrow", end_time_is_next_day);

                                            var html =
                                                "审批记录：请假" + attendance_detail.MinuteToHour(leaveMins) +
                                                "，相关记录编号：" + approvalNo;

                                            $approval_leave_item.html(html);

                                        }
                                        else {

                                            attendance_detail.initAttendLeave();//初始化 请假记录，新增一行

                                            var $attend_leave_item = $attend_leave_list.find(".item").last();//行 item
                                            if (leaveType) {
                                                $attend_leave_item.find(".type select").val(leaveType);
                                            }
                                            if (begin_time) {
                                                begin_time = begin_time.split(":");
                                                $attend_leave_item.find(".begin_time").find(".hour").val(begin_time[0]);
                                                $attend_leave_item.find(".begin_time").find(".minute").val(begin_time[1]);
                                            }
                                            if (begin_time_is_next_day) {
                                                $attend_leave_item.find(".begin_time_next_day").find(".choose_item").addClass("active")
                                                    .find("img").attr("src", "image/icon_checkbox_check.png");
                                            }
                                            if (end_time) {
                                                end_time = end_time.split(":");
                                                $attend_leave_item.find(".end_time").find(".hour").val(end_time[0]);
                                                $attend_leave_item.find(".end_time").find(".minute").val(end_time[1]);
                                            }
                                            if (end_time_is_next_day) {
                                                $attend_leave_item.find(".end_time_next_day").find(".choose_item").addClass("active")
                                                    .find("img").attr("src", "image/icon_checkbox_check.png");
                                            }

                                            $attend_leave_item.attr("data-id", id);
                                            $attend_leave_item.attr("data-type", leaveType);
                                            $attend_leave_item.attr("data-approvalId", approvalId);
                                            $attend_leave_item.attr("data-workInDate", workInTimeValue);
                                            $attend_leave_item.attr("data-workOutDate", workOutTimeValue);
                                            $attend_leave_item.attr("data-isInvalid", is_effective);

                                        }

                                    }

                                }

                                //加班记录
                                var overTime_arr = $item.workAttendanceOvertimeResultList ? $item.workAttendanceOvertimeResultList : [];
                                if (overTime_arr && overTime_arr.length > 0) {

                                    $attend_overTime_list.empty();//清空加班记录
                                    for (var j = 0; j < overTime_arr.length; j++) {

                                        var $overTime_item = overTime_arr[j];

                                        var id = $overTime_item.id ? $overTime_item.id : "";//
                                        // var overtimeType = $overTime_item.overtimeType ? $overTime_item.overtimeType : "";//
                                        var begin_time = $overTime_item.overtimeStart ? $overTime_item.overtimeStart : "";//
                                        var begin_time_is_next_day = $overTime_item.overtimeStartMorrow
                                            ? $overTime_item.overtimeStartMorrow : 0;//
                                        var end_time = $overTime_item.overtimeEnd ? $overTime_item.overtimeEnd : "";//
                                        var end_time_is_next_day = $overTime_item.overtimeEndMorrow
                                            ? $overTime_item.overtimeEndMorrow : 0;//

                                        var is_approval = $overTime_item.isApprovalData ? $overTime_item.isApprovalData : 0;//判断是否是 审批
                                        var is_effective = $overTime_item.isInvalid ? $overTime_item.isInvalid : 0;//是否有效
                                        var overtimeMins = $overTime_item.overtimeMins ? $overTime_item.overtimeMins : 0;//加班时长

                                        var approvalId = $overTime_item.approvalId ? $overTime_item.approvalId : "";//审批id
                                        var approvalNo = $overTime_item.approvalNo ? $overTime_item.approvalNo : "";//审批编号
                                        var workInTimeValue = $overTime_item.workInTimeValue ? $overTime_item.workInTimeValue : "";//班次上班时间
                                        var workOutTimeValue = $overTime_item.workOutTimeValue ? $overTime_item.workOutTimeValue : "";//班次下班时间

                                        //如果是 审批记录
                                        if (is_approval) {

                                            var $approval_overTime_item = $("<div>");
                                            $approval_overTime_item.appendTo($attend_overTime_list);
                                            $approval_overTime_item.addClass("approval_overTime_item");
                                            //如果是 无效的 0 有效 1 无效
                                            if (is_effective) {
                                                $approval_overTime_item.addClass("invalid");
                                            }

                                            $approval_overTime_item.attr("data-id", id);
                                            // $approval_overTime_item.attr("data-type", overtimeType);
                                            $approval_overTime_item.attr("data-approvalId", approvalId);
                                            $approval_overTime_item.attr("data-workInDate", workInTimeValue);
                                            $approval_overTime_item.attr("data-workOutDate", workOutTimeValue);
                                            $approval_overTime_item.attr("data-isInvalid", is_effective);

                                            //如果是审批，则要赋值 开始时间、开始时间是否次日、
                                            $approval_overTime_item.attr("data-beginTime", begin_time);
                                            $approval_overTime_item.attr("data-beginMorrow", begin_time_is_next_day);
                                            $approval_overTime_item.attr("data-endTime", end_time);
                                            $approval_overTime_item.attr("data-endMorrow", end_time_is_next_day);

                                            var html =
                                                "审批记录：加班" + attendance_detail.MinuteToHour(overtimeMins) +
                                                "，相关记录编号：" + approvalNo;

                                            $approval_overTime_item.html(html);


                                        }
                                        else {

                                            attendance_detail.initAttendOverTime();//初始化 加班记录，新增一行

                                            var $attend_overTime_item = $attend_overTime_list.find(".item").last();//行 item
                                            // if (overtimeType) {
                                            //     $attend_overTime_item.find(".type select").val(overtimeType);
                                            // }
                                            if (begin_time) {
                                                begin_time = begin_time.split(":");
                                                $attend_overTime_item.find(".begin_time").find(".hour").val(begin_time[0]);
                                                $attend_overTime_item.find(".begin_time").find(".minute").val(begin_time[1]);
                                            }
                                            if (begin_time_is_next_day) {
                                                $attend_overTime_item.find(".begin_time_next_day").find(".choose_item").addClass("active")
                                                    .find("img").attr("src", "image/icon_checkbox_check.png");
                                            }
                                            if (end_time) {
                                                end_time = end_time.split(":");
                                                $attend_overTime_item.find(".end_time").find(".hour").val(end_time[0]);
                                                $attend_overTime_item.find(".end_time").find(".minute").val(end_time[1]);
                                            }
                                            if (end_time_is_next_day) {
                                                $attend_overTime_item.find(".end_time_next_day").find(".choose_item").addClass("active")
                                                    .find("img").attr("src", "image/icon_checkbox_check.png");
                                            }

                                            $attend_overTime_item.attr("data-id", id);
                                            // $attend_overTime_item.attr("data-type", overtimeType);
                                            $attend_overTime_item.attr("data-approvalId", approvalId);
                                            $attend_overTime_item.attr("data-workInDate", workInTimeValue);
                                            $attend_overTime_item.attr("data-workOutDate", workOutTimeValue);
                                            $attend_overTime_item.attr("data-isInvalid", is_effective);

                                        }

                                    }

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

        });

    },
    //时间换算 将 100m 换算为 1h40m
    MinuteToHour: function (time) {

        if (time) {
            var hour = Math.floor(time / 60);
            var min = time - hour * 60;

            time = hour + "小时" + min + "分钟";
        }

        return time;

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

    //初始化 打卡状态
    initAttendState: function () {
        //((缺卡(0)、休息(1)、正常(2)、无效(3)、请假(4)、清空(5)、早退(6)、
        // 迟到(7)、加班(8)、休息加班(9)、上班请假(10)、下班请假(11))) ,

        attendance_detail_param.attendState = new Map();
        attendance_detail_param.attendState.put("", "");

        attendance_detail_param.attendState.put(0, "缺卡");
        attendance_detail_param.attendState.put(1, "休息");
        attendance_detail_param.attendState.put(2, "正常");
        attendance_detail_param.attendState.put(3, "无效");

        attendance_detail_param.attendState.put(4, "请假");
        attendance_detail_param.attendState.put(5, "清空");
        attendance_detail_param.attendState.put(6, "早退");
        attendance_detail_param.attendState.put(7, "迟到");

        attendance_detail_param.attendState.put(8, "加班");
        attendance_detail_param.attendState.put(9, "休息加班");
        attendance_detail_param.attendState.put(10, "上班请假");
        attendance_detail_param.attendState.put(11, "下班请假");


    },
    //初始化 时间
    initTime: function () {
        var $search_container = $attendance_detail_container.find('.search_container');
        var $month = $search_container.find(".month");

        $month.datetimepicker({
            startView: 3, //
            minView: 3, //选择日期后，不会再跳转去选择时分秒
            format: "yyyy-mm", //选择日期后，文本框显示的日期格式
            language: 'zh-CN', //汉化
            autoclose: true,//选择日期后自动关闭
            bootcssVer: 3
        });

        $month.unbind("changeMonth").on("changeMonth", function (e) {

            //更换月份事件
            var choseDate = e.date;

            var date = new Date(choseDate);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m > 9 ? m : "0" + m;
            var yearMonth = y + "-" + m;

            $month.val(yearMonth).attr("data-time", yearMonth);

        });

        //默认当前年月
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        month = month > 9 ? month : "0" + month;
        var yearMonth = year + "-" + month;

        if (sessionStorage.getItem("year_month")) {
            yearMonth = sessionStorage.getItem("year_month");
        }

        $month.val(yearMonth).attr("data-time", yearMonth);

        $month.datetimepicker('update');

    },
    //清除月份输入内容
    clearMonth: function () {
        var $search_container = $attendance_detail_container.find('.search_container');
        var $month = $search_container.find(".month");

        $month.html("YYYY-MM").attr("data-time", "");
    },
    //初始化 出勤周期
    initSetting: function () {
        var $search_container = $attendance_detail_container.find('.search_container');
        var $attendSet_container = $search_container.find(".attendSet_container select");
        $attendSet_container.empty();

        branGetRequest(
            urlGroup.attendance.summary.cycle_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        var arr = data.result.settingLists;

                        if (arr && arr.length > 0) {

                            $.each(arr, function (index, item) {

                                var id = item.id ? item.id : "";
                                var cycleStart = item.cycleStart ? item.cycleStart : "";
                                var cycleEnd = item.cycleEnd ? item.cycleEnd : "";
                                var isNextMonth = item.isNextMonth ? item.isNextMonth : 0;

                                var name = cycleStart + "日" + "~" +
                                    (isNextMonth ? "次月" : "") +
                                    (cycleEnd === 31 ? "月底" : (cycleEnd + "日"));

                                var $option = $("<option>");
                                $option.val(id);
                                $option.html(name);
                                $option.appendTo($attendSet_container);

                            });

                            //如果要 周期id
                            if (sessionStorage.getItem("settingId")) {
                                $attendSet_container.val(sessionStorage.getItem("settingId"));
                            }

                        }

                    }

                }
                else {
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            },
            {async: false}
        );

    },
    //初始化 用户列表
    initUserList: function () {
        var $search_container = $attendance_detail_container.find('.search_container');
        var $user_list = $search_container.find(".user_list");
        $user_list.empty();

        //如果是从其他页面过来查询的，并且是 离职
        if (sessionStorage.getItem("attendance_detail_search") &&
            sessionStorage.getItem("isOnJob") === "0") {
            $search_container.find(".user_status select").val("0");
        }

        var url;
        var userType = $search_container.find(".user_status select").val();
        //离职
        if (userType === "0") {
            url = urlGroup.attendance.summary.emp_leave_list;
        }
        if (userType === "1") {	//在职
            url = urlGroup.attendance.summary.emp_roster_list;
        }

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    //清空 员工选择框
                    if ($user_list.siblings(".chosen-container").length > 0) {
                        $user_list.chosen("destroy");
                    }

                    var users = data.result ? data.result : [];
                    // console.log(users);
                    // console.log(sessionStorage.getItem("emp_id"));

                    $.each(users, function (index, item) {

                        var id = item.id ? item.id : "";//在职员工 id
                        var name = item.name ? item.name : "";//
                        var workSn = item.workSn ? item.workSn : "";//
                        var workLineName = item.workLineName ? item.workLineName : "";//
                        var empId = item.empId ? item.empId : "";//离职员工 empId

                        var key = userType === "0" ? empId : id;//

                        var $option = $("<option>");
                        $option.attr("value", key);
                        $option.text(name + " - " + workSn + " - " + workLineName);
                        $option.appendTo($user_list);

                    });

                    $user_list.chosen({
                        allow_single_deselect: true,//选择之后 是否可以取消
                        max_selected_options: 1,//最多只能选择1个
                        width: "100%",//select框 宽度
                        no_results_text: "找不到 " //输入的 内容查询不到时的提示信息
                    });


                    //如果有员工类型
                    if (sessionStorage.getItem("emp_id")) {

                        $user_list.find("option[value='" + sessionStorage.getItem("emp_id") +
                            "']").attr("selected", "selected");
                        $user_list.trigger("chosen:updated");   //每次对 select操作后必须要执行 此 方法

                        attendance_detail.attendanceList();//查询
                    }


                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                toastr.error(error)
            },
            {async: false}
        );

    },
    //员工 状态改变
    initUserStatus: function () {

        var $search_container = $attendance_detail_container.find('.search_container');
        var $user_status = $search_container.find(".user_status");

        $user_status.find("select").change(function () {
            attendance_detail.initUserList();
        });

    },
    //初始化 请假类型
    initHolidayList: function () {

        approval_type.initHolidayListChoosed(
            function (arr) {

                attend_modify_param.holiday_type_select = $("<select>");
                attend_modify_param.holiday_type_select.addClass("form-control");

                $.each(arr, function (i, $item) {

                    var approvalTypeDetail = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                        ($item.approvalTypeDetail === 0 ? 0 : "");//审批明细
                    var name = attendance_detail.approvalTypeMap.get(approvalTypeDetail);

                    var $option = $("<option>");
                    $option.attr("value", approvalTypeDetail);
                    $option.text(name);
                    $option.appendTo(attend_modify_param.holiday_type_select);

                });

            },
            function () {

            }
        );

    },
    //初始化 加班类型
    initOverTimeList: function () {

        approval_type.initOverTimeListChoosed(
            function (arr) {

                attend_modify_param.overTime_type_select = $("<select>");
                attend_modify_param.overTime_type_select.addClass("form-control");

                $.each(arr, function (i, $item) {

                    var approvalTypeDetail = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                        ($item.approvalTypeDetail === 0 ? 0 : "");//审批明细
                    var name = attendance_detail.approvalTypeMap.get(approvalTypeDetail);

                    var $option = $("<option>");
                    $option.attr("value", approvalTypeDetail);
                    $option.text(name);
                    $option.appendTo(attend_modify_param.overTime_type_select);

                });

            },
            function () {

            }
        );

    },
    //初始化 班次列表
    initScheduleList: function () {

        branGetRequest(
            urlGroup.attendance.attendance_detail.shift_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    attend_modify_param.schedule_list_select = $("<select>");
                    attend_modify_param.schedule_list_select.addClass("form-control");

                    var $option = $("<option>");
                    $option.attr("value", "");
                    $option.text("不修改");
                    $option.appendTo(attend_modify_param.schedule_list_select);

                    if (data.result) {

                        var arrInfo = data.result.models;
                        if (!arrInfo || arrInfo.length === 0) {
                        }
                        else {

                            for (var i = 0; i < arrInfo.length; i++) {
                                var item = arrInfo[i];

                                var id = item.id ? item.id : "";//
                                var shortName = item.shortName ? item.shortName : "";//
                                var color = item.color ? item.color : "";//
                                var workStartTime = item.workStartTime ? item.workStartTime : "";//
                                var workEndTime = item.workEndTime ? item.workEndTime : "";//
                                var isNextDay = item.isNextDay ? item.isNextDay : 0;//

                                var name = shortName + "  ";
                                if (workStartTime || workEndTime) {
                                    name += workStartTime + " - " + workEndTime;
                                    name += isNextDay ? "（次）" : "";
                                }

                                var $option = $("<option>");
                                $option.attr("value", id);
                                $option.text(name);
                                $option.appendTo(attend_modify_param.schedule_list_select);

                            }

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
    //重置参数
    resetParam: function () {
        var $search_container = $attendance_detail_container.find(".search_container");

        //月份
        var $month = $search_container.find(".month");
        //默认当前年月
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        month = month > 9 ? month : "0" + month;
        var yearMonth = year + "-" + month;
        $month.val(yearMonth).attr("data-time", yearMonth);

        //快速搜索
        var $user_list = $search_container.find(".user_list");
        $user_list.find("option:selected").removeAttr("selected");//清空选中状态
        $user_list.trigger("chosen:updated");   //每次对 select操作后必须要执行 此 方法

    },

    //查询按钮 点击事件
    btnSearchClick: function () {
        attendance_detail.attendanceList();//查询
    },
    //查询
    attendanceList: function () {
        //移除 session
        attendance_detail.sessionRemove();

        attendance_detail_param.paramSet();//赋值查询参数

        if (!attendance_detail_param.year_month) {
            toastr.warning("请选择出勤日期！");
            return
        }
        else if (!attendance_detail_param.emp_id) {
            toastr.warning("请选择员工！");
            return
        }

        loadingInit();

        console.log("获取列表：" + new Date().getTime());

        $tb_attendance_detail.bootstrapTable("destroy");
        //表格的初始化
        $tb_attendance_detail.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            // data: data,                         //直接从本地数据初始化表格
            uniqueId: "id",

            //分页
            pagination: true,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [5, 10, 15],              //可供选择的每页的行数（*）

            //排序
            sortable: true,                     //所有列的排序 是否开启
            sortOrder: "desc",                   //排序方式

            width: "100%",
            height: 400,
            // selectItemName: 'parentItem',       //tbody中 radio or checkbox 的字段名（name='parentItem'）

            paginationPreText: "上一页",               //指定分页条中上一页按钮的图标或文字
            paginationNextText: "下一页",             //指定分页条中下一页按钮的图标或文字

            // detailView: true, //是否显示详情折叠

            rowStyle: function (row, index) {
                return {
                    classes: 'item'
                }
            },
            columns: [

                {
                    field: "clockType",
                    title: "考勤方式",
                    align: "center",
                    class: "clockType",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";

                        if (value === "device") {
                            html = "<div>考勤机</div>";
                        }
                        else if (value) {
                            html = "<div>手机</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "deviceNo",
                    title: "设备号",
                    align: "center",
                    class: "deviceNo",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";

                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "name",
                    title: "姓名",
                    align: "center",
                    class: "name",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";

                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "departmentName",
                    title: "部门",
                    align: "center",
                    class: "departmentName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "workShiftName",
                    title: "班组",
                    align: "center",
                    class: "workShiftName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },

                {
                    field: "attendYearMonth",
                    title: "出勤月份",
                    align: "center",
                    class: "attendYearMonth",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "attendDayOfMonth",
                    title: "日期",
                    align: "center",
                    class: "attendDayOfMonth",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "workShiftTypeName",
                    title: "班次",
                    align: "center",
                    class: "workShiftTypeName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },

                {
                    field: "attendStartTime",
                    title: "上班打卡",
                    align: "center",
                    class: "attendStartTime",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "attendStartState",
                    title: "打卡结果",
                    align: "center",
                    class: "attendStartState",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (row.attendStartStateString) {
                            html = "<div>" + row.attendStartStateString + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "attendAddressStart",
                    title: "打卡地址",
                    align: "center",
                    class: "attendAddressStart",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },

                {
                    field: "attendEndTime",
                    title: "下班打卡",
                    align: "center",
                    class: "attendEndTime",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "attendEndState",
                    title: "打卡结果",
                    align: "center",
                    class: "attendEndState",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (row.attendEndStateString) {
                            html = "<div>" + row.attendEndStateString + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "attendAddressEnd",
                    title: "打卡地址",
                    align: "center",
                    class: "attendAddressEnd",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";

                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }


                        return html;
                    }
                },

                {
                    // width: "400",
                    field: "operate",
                    title: "操作",
                    align: "center",
                    class: "operate",
                    formatter: function (value, row, index) {

                        //判断 当天及当天以后的不能修改
                        var cur_date = row.attendDay;
                        // var cur_date = row.attendYearMonth + "-" + row.attendDay;
                        cur_date = new Date(cur_date).getTime();

                        var now = new Date();
                        var year = now.getFullYear();
                        var month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1);
                        var day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
                        now = year + "/" + month + "/" + day;
                        now = new Date(now).getTime();

                        // console.log(cur_date);
                        // console.log(now);

                        var html = "";
                        html += "<div class='operate'>";

                        //如果 操作的时间是当天及当天以后的
                        if (cur_date >= now) {
                            // toastr.warning("不能修改当天及当天以后的考勤！");
                            html += "<div class='btn btn-default btn-sm btn_modify'>修改出勤</div>";
                        }
                        else {
                            html += "<div class='btn btn-success btn-sm btn_modify'>修改出勤</div>";
                        }

                        html += "</div>";


                        return html;

                    },
                    events: {

                        //编辑
                        "click .btn_modify": function (e, value, row, index) {


                            //如果不能修改
                            if (!$(e.currentTarget).hasClass("btn-success")) {
                                toastr.warning("不能修改当天及当天以后的考勤！");
                                return
                            }

                            attendance_detail.row = row;

                            $attendance_detail_modal.modal("show");

                        }

                    }
                }

            ],

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.attendance.attendance_detail.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize,
                    yearMonth: attendance_detail_param.year_month,
                    settingId: attendance_detail_param.settingId,
                    empId: attendance_detail_param.emp_id,
                    isOnJob: attendance_detail_param.user_status
                };

                return obj;
            },
            onLoadSuccess: function () {  //加载成功时执行

                // toastr.success("成功！");

            },
            onLoadError: function () {  //加载失败时执行
                debugger
                // layer.msg("加载数据失败", {time: 1500, icon: 2});
            },
            responseHandler: function (res) {

                setTimeout(function () {
                    loadingRemove();
                }, 500);

                var tb_data = [];
                var total_rows = 0;//总条数

                if (res.code === RESPONSE_OK_CODE) {

                    if (res.result) {
                        total_rows = res.result.total_rows ? res.result.total_rows : 0;//总条数

                        var arr = res.result.attendances;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var $item = arr[i];

                                var id = $item.id ? $item.id : "";//
                                var clockType = $item.clockType ? $item.clockType : "";//考勤方式  ['gps', 'wifi', 'device'],
                                var deviceNo = $item.deviceNo ? $item.deviceNo : "";//设备号
                                var name = $item.realName ? $item.realName : "";//姓名

                                var departmentName = $item.departmentName ? $item.departmentName : "";//部门
                                var workShiftName = $item.workShiftName ? $item.workShiftName : "";//班组

                                var attendYearMonth = $item.attendYearMonth ? $item.attendYearMonth : "";//出勤月份 打卡时间(年月日)
                                var attendDay = $item.attendDay ? $item.attendDay : "";//日
                                var attendDayOfMonth = $item.attendDayOfMonth ? $item.attendDayOfMonth : "";//日
                                var workShiftTypeName = $item.workShiftTypeName ? $item.workShiftTypeName : "";//班次

                                var attendStartTime = $item.attendStartTime ? $item.attendStartTime : "";//上班打卡  打卡开始时间(时分秒)
                                var attendStartState = $item.attendStartState ? $item.attendStartState : "";//打卡结果
                                var attendStartStateString = $item.attendStartStateString ? $item.attendStartStateString : "";//打卡结果
                                var attendAddressStart = $item.attendAddressStart ? $item.attendAddressStart : "";//打卡地址

                                var attendEndTime = $item.attendEndTime ? $item.attendEndTime : "";//下班打卡 打卡结束时间(时分秒) ,
                                var attendEndState = $item.attendEndState ? $item.attendEndState : "";//打卡结果
                                var attendEndStateString = $item.attendEndStateString ? $item.attendEndStateString : "";//打卡结果
                                var attendAddressEnd = $item.attendAddressEnd ? $item.attendAddressEnd : "";//打卡地址


                                var obj = {

                                    id: id,
                                    name: name,
                                    clockType: clockType,
                                    deviceNo: deviceNo,

                                    departmentName: departmentName,
                                    workShiftName: workShiftName,

                                    attendYearMonth: attendYearMonth,
                                    attendDay: attendDay,
                                    attendDayOfMonth: attendDayOfMonth,
                                    workShiftTypeName: workShiftTypeName,

                                    attendStartTime: attendStartTime,
                                    attendStartState: attendStartState,
                                    attendStartStateString: attendStartStateString,
                                    attendAddressStart: attendAddressStart,

                                    attendEndTime: attendEndTime,
                                    attendEndState: attendEndState,
                                    attendEndStateString: attendEndStateString,
                                    attendAddressEnd: attendAddressEnd

                                };

                                tb_data.push(obj);

                            }

                        }

                    }

                }
                else {
                    toastr.warning(res.msg);
                }

                return {
                    total: total_rows,
                    rows: tb_data
                };

            }

        });

    },

    //初始化 基本信息
    initBaseInfo: function () {
        var $base_info = $attendance_detail_modal.find(".modal-body .base_info");
        $base_info.find(".txtInfo").empty();

        attendance_detail.initScheduleList();// 初始化 班次列表
        $base_info.find(".schedule_list").empty().append(attend_modify_param.schedule_list_select);

    },
    //初始化 出勤记录
    initAttendRecord: function () {
        var $attendance_record = $attendance_detail_modal.find(".attendance_record_container .attendance_record");

        $attendance_record.find(".card_info").empty();
        $attendance_record.find(".attend_status select").val("0");
        $attendance_record.find(".attend_time").hide();
        $attendance_record.find(".next_day").hide();

        $attendance_record.find(".attend_status select").change(function () {

            var $this = $(this);
            var val = $this.val();
            var $attend_time = $this.closest(".attend_status").siblings(".attend_time");
            var $next_day = $this.closest(".attend_status").siblings(".next_day");

            //如果是 打卡
            if (val === "1") {
                $attend_time.show().find("input").val("");
                $next_day.show();
                $next_day.find(".choose_item").removeClass("active")
                    .find("img").attr("src", "image/icon_checkbox_unCheck.png");
            }
            else { //
                $attend_time.hide();
                $next_day.hide();
            }

        });

    },
    //选择次日
    chooseNextDay: function (self) {
        var $self = $(self);

        if ($self.hasClass("active")) {
            $self.removeClass("active").find("img").attr("src", "image/icon_checkbox_unCheck.png");
        }
        else {
            $self.addClass("active").find("img").attr("src", "image/icon_checkbox_check.png");
        }

    },
    //初始化 请假记录
    initAttendLeave: function () {

        attendance_detail.initHolidayList();//初始化 请假类型

        var $row = $attendance_detail_modal.find(".modal-body > .row");

        //请假记录、加班记录 item
        var $item = $(".attend_detail_item").clone();
        $item.removeAttr("hidden");
        $item.attr("class", "item");

        //请假记录
        var $attend_leave_list = $row.find(".attend_leave_list");
        $item.appendTo($attend_leave_list);
        $item.find(".type").html(attend_modify_param.holiday_type_select);//赋值 请假列表

        //默认事假
        $item.find(".type").find("select").val("1");

    },
    //初始化 加班记录
    initAttendOverTime: function () {

        // attendance_detail.initOverTimeList(); //初始化 加班类型

        var $row = $attendance_detail_modal.find(".modal-body > .row");

        //请假记录、加班记录 item
        var $item = $(".attend_detail_item").clone();
        $item.removeAttr("hidden");
        $item.attr("class", "item");

        //加班记录
        var $attend_overTime_list = $row.find(".attend_overTime_list");
        $attend_overTime_list.append($item);
        $item.find(".type").remove();

        // $item.find(".type").empty().append(attend_modify_param.overTime_type_select);//赋值 加班列表

        // //默认工作日加班
        // $item.find(".type").find("select").val("10");

    },

    //删除 item
    removeItem: function (self) {
        $(self).closest(".item").remove();
    },
    //保存 出勤信息
    attendanceInfoUpdate: function () {
        console.log("保存出勤：" + new Date().getTime());

        loadingInit();

        attend_modify_param.paramSet();//赋值 参数

        //检查 参数
        if (!attendance_detail.checkParamByAttendanceInfoSave()) {
            loadingRemove();
            return
        }

        var obj = {
            id: attend_modify_param.id,
            workShiftTypeId: attend_modify_param.schedule_id,
            attendStartTime: attend_modify_param.begin_time,
            attendStartMorrow: attend_modify_param.begin_is_next_day,
            attendStartModifyState: attend_modify_param.begin_status,
            attendEndTime: attend_modify_param.end_time,
            attendEndMorrow: attend_modify_param.end_is_next_day,
            attendEndModifyState: attend_modify_param.end_status,
            leaveCommandList: attend_modify_param.leave_arr,
            overtimeCommandList: attend_modify_param.overTime_arr
        };

        // console.log(obj);

        branPostRequest(
            urlGroup.attendance.attendance_detail.attendance_record_update,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("修改成功！");
                    $attendance_detail_modal.modal("hide");

                    attendance_detail.attendanceList();//查询

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
    //检查 出勤信息 保存
    checkParamByAttendanceInfoSave: function () {
        var flag = false;
        var txt;

        var $row = $attendance_detail_modal.find(".modal-body > .row");
        var $attendance_record = $row.find(".attendance_record");//出勤记录
        var $attend_leave_list = $row.find(".attend_leave_list");//请假记录
        var $attend_overTime_list = $row.find(".attend_overTime_list"); //加班记录

        if (!$attendance_record.find(".begin .attend_time").is(":hidden") &&
            $attendance_record.find(".begin .attend_time").find("input").val() === "") {
            txt = "请输入上班打卡时间！";
        }
        else if (!$attendance_record.find(".end .attend_time").is(":hidden") &&
            $attendance_record.find(".end .attend_time").find("input").val() === "") {
            txt = "请输入下班打卡时间！";
        }
        else if ($attend_leave_list.find("input").val() === "") {
            txt = "请输入请假记录！";
        }
        else if ($attend_overTime_list.find("input").val() === "") {
            txt = "请输入加班记录！";
        }

        if (txt) {
            toastr.warning(txt);
        }
        else {
            flag = true;
        }

        return flag;

    },
    //清空考勤
    clearAttend: function () {

        operateMsgShow(
            "确认清空考勤吗？",
            function () {

                if (!attendance_detail.row || !attendance_detail.row.id) {
                    toastr.warning("无法获取出勤明细id！");
                    return;
                }

                var obj = {
                    id: attendance_detail.row.id
                };

                branPostRequest(
                    urlGroup.attendance.attendance_detail.clear,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            toastr.success("清空考勤成功！");
                            $attendance_detail_modal.modal("hide");

                            attendance_detail.attendanceList();//查询


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
        );

    },

    //导出
    attendanceListExport: function () {

        //没有查询过
        if (!$tb_attendance_detail.html()) {
            toastr.warning("没有数据，无法导出");
            return
        }

        var data = $tb_attendance_detail.bootstrapTable("getData");//所有数据
        if (data.length === 0) {
            toastr.warning("没有数据，无法导出");
            return
        }

        exportModalShow("确认导出出勤明细数据吗？", function () {

            loadingInit();

            // toastr.info("正在计算中，请稍等哦…");

            var obj = {
                yearMonth: attendance_detail_param.year_month,
                settingId: attendance_detail_param.settingId,
                empId: attendance_detail_param.emp_id,
                isOnJob: attendance_detail_param.user_status
            };
            var url = urlGroup.attendance.attendance_detail.excel_export+ "?" + jsonParseParam(obj);

            branGetRequest(
                url,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        if (data.result) {

                            var url = data.result.url ? data.result.url : "";
                            if (!url) {
                                toastr.warning("无法下载，下载链接为空！");
                                return;
                            }

                            toastr.success("导出成功！");

                            var aLink = document.createElement('a');
                            aLink.download = "";
                            aLink.href = url;
                            aLink.click();

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

        });

    },

    //移除session
    sessionRemove: function () {

        sessionStorage.removeItem("attendance_detail_search");//是否是 查询详情
        sessionStorage.removeItem("isOnJob");//是否在职 1 在职 0 离职
        sessionStorage.removeItem("year_month");//月份
        sessionStorage.removeItem("settingId");//出勤周期id
        sessionStorage.removeItem("emp_id");//员工id

    }


};
//出勤明细 参数
var attendance_detail_param = {

    year_month: null,//月份 2017-08
    settingId: null,//出勤周期 id.
    user_status: null,//0 离职 1 在职
    emp_id: null,//员工id
    attendState: null,//打卡状态

    //参数 设置
    paramSet: function () {
        var $search_container = $attendance_detail_container.find(".search_container");

        //出勤日期
        var time = $search_container.find(".month").attr("data-time");
        if (time) {
            time = time.replace(/-/g, "/");
            attendance_detail_param.year_month = new Date(time).getTime();
        }

        //出勤周期 id
        attendance_detail_param.settingId = $search_container.find(".attendSet_container select").val();

        //员工状态
        attendance_detail_param.user_status = $search_container.find(".user_status select").val();

        //用户 id
        attendance_detail_param.emp_id = $search_container.find(".user_list").val()
            ? $search_container.find(".user_list").val()[0] : "";

    }


};
//修改出勤 参数
var attend_modify_param = {

    schedule_list_select: null,//班次列表 select
    holiday_type_select: null,//请假类型 select
    overTime_type_select: null,//加班类型 select

    id: "",//
    schedule_id: null,//班次id（修改后）
    begin_status: null,//0 不修改 1 打卡 2 缺卡
    begin_time: null,//
    begin_is_next_day: null,//
    end_status: null,//0 不修改 1 打卡 2 缺卡
    end_time: null,//
    end_is_next_day: null,//
    leave_arr: null,//请假 记录
    overTime_arr: null,//加班 记录

    paramSet: function () {

        var $row = $attendance_detail_modal.find(".modal-body > .row");
        var $attendance_record = $row.find(".attendance_record");//出勤记录
        // var $attend_leave_list = $row.find(".attend_leave_list");//请假记录
        // var $attend_overTime_list = $row.find(".attend_overTime_list"); //加班记录

        attend_modify_param.id = attendance_detail.row.id;//员工id
        attend_modify_param.schedule_id = $row.find(".schedule_list select").val();//修改的班次id

        attend_modify_param.begin_status = $attendance_record.find(".begin .attend_status select").val();
        //如果是 上班打卡
        if (attend_modify_param.begin_status === "1") {
            attend_modify_param.begin_time = $attendance_record.find(".begin .attend_time .hour").val() + ":" +
                $attendance_record.find(".begin .attend_time .minute").val();
            attend_modify_param.begin_is_next_day = $attendance_record.find(".begin .next_day .choose_item")
                .hasClass("active") ? 1 : 0;
        }
        else {
            attend_modify_param.begin_time = null;
            attend_modify_param.begin_is_next_day = null;
        }

        attend_modify_param.end_status = $attendance_record.find(".end .attend_status select").val();
        //如果是 下班打卡
        if (attend_modify_param.end_status === "1") {
            attend_modify_param.end_time = $attendance_record.find(".end .attend_time .hour").val() + ":" +
                $attendance_record.find(".end .attend_time .minute").val();
            attend_modify_param.end_is_next_day = $attendance_record.find(".end .next_day .choose_item")
                .hasClass("active") ? 1 : 0;
        }
        else {
            attend_modify_param.end_time = null;
            attend_modify_param.end_is_next_day = null;
        }

        attend_modify_param.leave_arr = [];//请假记录 arr
        $row.find(".attend_leave_list > div").each(function () {

            var $this = $(this);

            var id = $this.attr("data-id") ? $this.attr("data-id") : "";//
            var approvalId = $this.attr("data-approvalId") ? $this.attr("data-approvalId") : "";//
            var workInDate = $this.attr("data-workInDate") ? $this.attr("data-workInDate") : "";//
            var workOutDate = $this.attr("data-workOutDate") ? $this.attr("data-workOutDate") : "";//
            var isInvalid = $this.attr("data-isInvalid") ? parseInt($this.attr("data-isInvalid")) : 0;//
            var leaveType;
            var leaveTimeStart;
            var leaveTimeStartMorrow;
            var leaveTimeEnd;
            var leaveTimeEndMorrow;

            //如果是 后台添加的 请假记录
            if ($this.hasClass("item")) {

                leaveType = $this.find(".type select").val();
                leaveType = leaveType ? leaveType : (leaveType === "0" ? 0 :
                    ($this.attr("data-type") ? parseInt($this.attr("data-type")) : 0));
                leaveTimeStart = $this.find(".begin_time .hour").val() + ":" + $this.find(".begin_time .minute").val();
                leaveTimeStartMorrow = $this.find(".begin_time_next_day .choose_item").hasClass("active") ? 1 : 0;
                leaveTimeEnd = $this.find(".end_time .hour").val() + ":" + $this.find(".end_time .minute").val();
                leaveTimeEndMorrow = $this.find(".end_time_next_day .choose_item").hasClass("active") ? 1 : 0;

            }

            //如果是 审批的 请假记录
            if ($this.hasClass("approval_leave_item")) {

                leaveType = $this.attr("data-type") ? parseInt($this.attr("data-type")) : 0;//
                leaveTimeStart = $this.attr("data-beginTime") ? $this.attr("data-beginTime") : "";//
                leaveTimeStartMorrow = $this.attr("data-beginMorrow") ? $this.attr("data-beginMorrow") : "";//
                leaveTimeEnd = $this.attr("data-endTime") ? $this.attr("data-endTime") : "";//
                leaveTimeEndMorrow = $this.attr("data-endMorrow") ? $this.attr("data-endMorrow") : "";//

            }

            var obj = {
                id: id,
                leaveTimeStart: leaveTimeStart,
                leaveTimeStartMorrow: leaveTimeStartMorrow,
                leaveTimeEnd: leaveTimeEnd,
                leaveTimeEndMorrow: leaveTimeEndMorrow,
                approvalId: approvalId,
                workInDate: workInDate,
                workOutDate: workOutDate,
                isInvalid: isInvalid,
                leaveType: leaveType
            };

            attend_modify_param.leave_arr.push(obj);

        });

        attend_modify_param.overTime_arr = [];//加班记录 arr
        $row.find(".attend_overTime_list > div").each(function () {

            var $this = $(this);

            var id = $this.attr("data-id") ? $this.attr("data-id") : "";//
            var approvalId = $this.attr("data-approvalId") ? $this.attr("data-approvalId") : "";//
            var workInDate = $this.attr("data-workInDate") ? $this.attr("data-workInDate") : "";//
            var workOutDate = $this.attr("data-workOutDate") ? $this.attr("data-workOutDate") : "";//
            var isInvalid = $this.attr("data-isInvalid") ? parseInt($this.attr("data-isInvalid")) : 0;//
            // var overtimeType;
            var overtimeStart;
            var overtimeStartMorrow;
            var overtimeEnd;
            var overtimeEndMorrow;

            //如果是 后台添加的 加班记录
            if ($this.hasClass("item")) {

                // overtimeType = $this.find(".type select").val();
                // overtimeType = overtimeType ? overtimeType : (overtimeType === "0" ? 0 :
                //     ($this.attr("data-type") ? parseInt($this.attr("data-type")) : 0));
                overtimeStart = $this.find(".begin_time .hour").val() + ":" + $this.find(".begin_time .minute").val();
                overtimeStartMorrow = $this.find(".begin_time_next_day .choose_item").hasClass("active") ? 1 : 0;
                overtimeEnd = $this.find(".end_time .hour").val() + ":" + $this.find(".end_time .minute").val();
                overtimeEndMorrow = $this.find(".end_time_next_day .choose_item").hasClass("active") ? 1 : 0;

            }

            //如果是 审批的 加班记录
            if ($this.hasClass("approval_overTime_item")) {

                // overtimeType = $this.attr("data-type") ? parseInt($this.attr("data-type")) : 0;//
                overtimeStart = $this.attr("data-beginTime") ? $this.attr("data-beginTime") : "";//
                overtimeStartMorrow = $this.attr("data-beginMorrow") ? $this.attr("data-beginMorrow") : "";//
                overtimeEnd = $this.attr("data-endTime") ? $this.attr("data-endTime") : "";//
                overtimeEndMorrow = $this.attr("data-endMorrow") ? $this.attr("data-endMorrow") : "";//

            }

            var obj = {
                id: id,
                overtimeStart: overtimeStart,
                overtimeStartMorrow: overtimeStartMorrow,
                overtimeEnd: overtimeEnd,
                overtimeEndMorrow: overtimeEndMorrow,
                approvalId: approvalId,
                workInDate: workInDate,
                workOutDate: workOutDate,
                isInvalid: isInvalid,
                // overtimeType: overtimeType
            };

            attend_modify_param.overTime_arr.push(obj);

        });

    }

};

$(function () {
    attendance_detail.init();
});

var debug = {};

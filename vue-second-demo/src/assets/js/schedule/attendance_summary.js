/**
 * Created by Administrator on 2017/9/21.
 * 出勤汇总
 */

var $body = $("body");
var $attendance_summary_container = $(".attendance_summary_container");//
var $tb_attendance_summary = $attendance_summary_container.find("#tb_attendance_summary");//考勤汇总 表格
var $emp_info_modal = $(".emp_info_modal");//请假、迟到、早退、旷工、缺卡

var attendance_summary = {

    init: function () {

        attendance_summary.initTime();//初始化 时间
        attendance_summary.initUserStatus();//初始化 员工状态改变

        attendance_summary.initSetting();//初始化 出勤周期
        attendance_summary.initDepartment();//初始化 部门
        attendance_summary.initWorkShift();//初始化 班组
        attendance_summary.initUserList();// 用户列表

        attendance_summary.btnSearchClick();//查询按钮 点击事件
        // attendance_summary.initTbData([]);//查询按钮 点击事件

    },

    //初始化 时间
    initTime: function () {
        var $search_container = $attendance_summary_container.find('.search_container');
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

            $month.html(yearMonth).attr("data-time", yearMonth);

        });


        //默认当前年月
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var yearMonth = year + "-" + month;
        $month.html(yearMonth).attr("data-time", yearMonth);

    },
    //清除月份输入内容
    clearMonth: function () {
        var $search_container = $attendance_summary_container.find('.search_container');
        var $month = $search_container.find(".month");

        $month.html("YYYY-MM").attr("data-time", "");
    },
    //初始化 出勤周期
    initSetting: function () {
        var $search_container = $attendance_summary_container.find('.search_container');
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
    //初始化 部门
    initDepartment: function () {
        var $search_container = $attendance_summary_container.find(".search_container");
        var $department_container = $search_container.find(".department_container");

        branGetRequest(
            urlGroup.basic.department.roster,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    var list = "<option value=''>全部</option>";//部门列表
                    var result = data.result;
                    if (!result || result.length === 0) {
                    }
                    else {

                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];

                            var dept_id = item.department_id;//
                            var dept_name = item.department_name;//

                            list += "<option value='" + dept_id + "'>" + dept_name + "</option>";
                        }

                    }

                    $department_container.find("select").html(list);

                }
                else {
                    toastr.warning(data.msg);
                }
            },
            function (error) {
                toastr.error("error:" + JSON.stringify(error))
            },
            {async: false}
        );

    },
    //初始化 班组
    initWorkShift: function () {
        var $search_container = $attendance_summary_container.find(".search_container");
        var $work_shift_container = $search_container.find(".work_shift_container");

        branGetRequest(
            urlGroup.basic.workShift.roster,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    var list = "<option value=''>全部</option>";//班组列表
                    var result = data.result;
                    if (!result || result.length === 0) {
                    }
                    else {

                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var workShift_id = item.work_shift_id;//
                            var workShift_name = item.work_shift_name;//

                            list += "<option value='" + workShift_id + "'>" + workShift_name + "</option>";

                        }

                    }

                    $work_shift_container.find("select").html(list);

                }
                else {
                    toastr.warning(data.msg);
                }
            },
            function (error) {
                toastr.error("error:" + JSON.stringify(error))
            },
            {async: false}
        );

    },
    //初始化 用户列表
    initUserList: function () {
        var $search_container = $attendance_summary_container.find('.search_container');
        var $user_list = $search_container.find(".user_list");
        $user_list.empty();

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

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },
    //员工 状态改变
    initUserStatus: function () {

        var $search_container = $attendance_summary_container.find('.search_container');
        var $user_status = $search_container.find(".user_status");

        $user_status.find("select").change(function () {
            attendance_summary.initUserList();
        });

    },
    //重置参数
    resetParam: function () {
        var $search_container = $attendance_summary_container.find(".search_container");

        //月份
        var $month = $search_container.find(".month");
        //默认当前年月
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var yearMonth = year + "-" + month;
        $month.html(yearMonth).attr("data-time", yearMonth);

        // //排班名称
        // var $schedule_name = $search_container.find(".schedule_name");
        // $schedule_name.find("select").val("");

        //部门
        var $department_container = $search_container.find(".department_container");
        $department_container.find("select").val("");

        //班组
        var $work_shift_container = $search_container.find(".work_shift_container");
        $work_shift_container.find("select").val("");

        //发布状态
        var $pub_status = $search_container.find(".pub_status");
        $pub_status.find("select").val("");

        // //员工状态
        // var $user_status = $search_container.find(".user_status");
        // $user_status.find("select").val("0");

        //确认状态
        var $confirm_status = $search_container.find(".confirm_status");
        $confirm_status.find("select").val("");

        //快速搜索
        var $user_list = $search_container.find(".user_list");
        $user_list.find("option:selected").removeAttr("selected");//清空选中状态
        $user_list.trigger("chosen:updated");   //每次对 select操作后必须要执行 此 方法

    },

    //查询按钮 点击事件
    btnSearchClick: function () {
        attendance_summary.initColumns();//获取 列表 header
    },
    //获取 列表 header
    initColumns: function () {

        attendance_summary_param.paramSet();//赋值查询参数

        if (!attendance_summary_param.year_month) {
            toastr.warning("请选择出勤日期！");
            return
        }

        loadingInit();

        branGetRequest(
            urlGroup.attendance.summary.columns_list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var item = data.result;
                        var leaveTypes = item.leaveTypes ? item.leaveTypes : null;
                        var overTimeTypes = item.overtimeTypes ? item.overtimeTypes : null;

                        //手动拼接columns数组
                        var columns = [];
                        columns.push({
                            checkbox: true
                        });
                        columns.push({
                            field: "name",
                            title: "姓名",
                            align: "center",
                            class: "name",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";
                                if (value) {
                                    html = "<div title='" + value + "' class='txt'>" + value + "</div>";
                                }

                                return html;
                            },
                            events: {

                                //考勤明细
                                "click .txt": function (e, value, row, index) {

                                    e.stopImmediatePropagation();
                                    var $e = $(e.currentTarget);

                                    var year_month = "";
                                    if (attendance_summary_param.year_month) {
                                        year_month = timeInit1(attendance_summary_param.year_month);
                                    }

                                    sessionStorage.setItem("attendance_detail_search", "1");//
                                    sessionStorage.setItem("year_month", year_month);
                                    sessionStorage.setItem("settingId", attendance_summary_param.settingId);
                                    sessionStorage.setItem("isOnJob", attendance_summary_param.user_status_id);
                                    sessionStorage.setItem("emp_id", row.id);

                                    getInsidePageDiv(urlGroup.attendance.attendance_detail.index, 'attendance_detail');

                                }

                            }
                        });
                        columns.push({
                            field: "workAttendanceNo",
                            title: "打卡号",
                            align: "center",
                            class: "workAttendanceNo",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "<div>" + value + "</div>";

                                return html;
                            }
                        });
                        columns.push({
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
                                else {
                                    html = "<div>手机</div>";
                                }

                                return html;
                            }
                        });
                        columns.push({
                            field: "departmentName",
                            title: "部门",
                            align: "center",
                            class: "departmentName",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "<div>" + value + "</div>";

                                return html;
                            }
                        });
                        columns.push({
                            field: "workShiftName",
                            title: "班组",
                            align: "center",
                            class: "workShiftName",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "<div>" + value + "</div>";

                                return html;
                            }
                        });
                        columns.push({
                            field: "attendanceDays",
                            title: "应出勤",
                            align: "center",
                            class: "attendanceDays",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "<div>" + value + "</div>";

                                return html;
                            }
                        });
                        columns.push({
                            field: "actualAttendanceDays",
                            title: "实际出勤",
                            align: "center",
                            class: "actualAttendanceDays",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "<div>" + value + "</div>";

                                return html;
                            }
                        });

                        columns.push({
                            field: "restCount",
                            title: "休息天数",
                            align: "center",
                            class: "restCount",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "<div>" + value + "</div>";

                                return html;
                            }
                        });
                        columns.push({
                            field: "attendanceHours",
                            title: "出勤工时",
                            align: "center",
                            class: "attendanceHours",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div>" + attendance_summary.MinuteToHour(value) + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            }
                        });
                        columns.push({
                            field: "normalHours",
                            title: "正常工时",
                            align: "center",
                            class: "normalHours",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div>" + attendance_summary.MinuteToHour(value) + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            }
                        });
                        columns.push({
                            field: "overTimeHours",
                            title: "加班工时",
                            align: "center",
                            class: "overTimeHours",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div>" + attendance_summary.MinuteToHour(value) + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            }
                        });

                        //加班
                        if (overTimeTypes && overTimeTypes.length > 0) {

                            $.each(overTimeTypes, function (i, $item) {

                                var key = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                                    ($item.approvalTypeDetail === 0 ? 0 : "");
                                var value = $item.approvalTypeDetailName ? $item.approvalTypeDetailName : "";//

                                var obj = {
                                    field: key,
                                    title: value,
                                    align: "center",
                                    class: "overTime_" + key,
                                    formatter: function (value, row, index) {
                                        // console.log(value);
                                        var html = "";

                                        if (row["extra"]) {

                                            var val = row["extra"][key] ? row["extra"][key] : 0;

                                            if (val) {
                                                html = "<div>" + attendance_summary.MinuteToHour(val) + "</div>";
                                            }
                                            else {
                                                html = "<div>0</div>";
                                            }

                                        }

                                        return html;
                                    }
                                };
                                columns.push(obj);

                            });

                        }

                        columns.push({
                            field: "leaveTimes",
                            title: "请假次数",
                            align: "center",
                            class: "leaveTimes",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div class='txt'>" + value + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            },
                            events: {

                                //请假弹框
                                "click .txt": function (e, value, row, index) {

                                    e.stopImmediatePropagation();
                                    var $e = $(e.currentTarget);

                                    var obj = {
                                        empId: row.id,
                                        settingId: attendance_summary_param.settingId,
                                        yearMonth: attendance_summary_param.year_month
                                    };
                                    var url = urlGroup.attendance.summary.leave_list + "?" + jsonParseParam(obj);

                                    branGetRequest(
                                        url,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                $emp_info_modal.modal("show");

                                                $emp_info_modal.find(".modal-title").html("请假");
                                                var $modal_body = $emp_info_modal.find(".modal-body");
                                                $modal_body.empty();

                                                var arr = data.result;
                                                if (arr && arr.length > 0) {

                                                    for (var i = 0; i < arr.length; i++) {
                                                        var $item = arr[i];

                                                        var date = $item.workAttendanceDate ? $item.workAttendanceDate : "";//时间
                                                        date = timeInit5(date);
                                                        var min = $item.leaveMins ? $item.leaveMins : 0;//时长
                                                        min = attendance_summary.MinuteToHour(min);

                                                        var $row = $("<div>");
                                                        $row.addClass("row");
                                                        $row.appendTo($modal_body);

                                                        //日期
                                                        var $date = $("<div>");
                                                        $date.addClass("col-xs-6");
                                                        $date.html(date);
                                                        $date.appendTo($row);

                                                        //分钟
                                                        var $min = $("<div>");
                                                        $min.addClass("col-xs-6");
                                                        $min.html("请假" + min);
                                                        $min.appendTo($row);

                                                    }

                                                }
                                                else {
                                                    var msg = "<div class='msg_none'>暂无请假信息</div>";
                                                    $modal_body.html(msg);
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

                            }
                        });
                        columns.push({
                            field: "leaveHours",
                            title: "请假时长",
                            align: "center",
                            class: "leaveHours",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div>" + attendance_summary.MinuteToHour(value) + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            }
                        });

                        //请假
                        if (leaveTypes && leaveTypes.length > 0) {

                            $.each(leaveTypes, function (i, $item) {

                                var key = $item.approvalTypeDetail ? $item.approvalTypeDetail :
                                    ($item.approvalTypeDetail === 0 ? 0 : "");
                                var value = $item.approvalTypeDetailName ? $item.approvalTypeDetailName : "";//

                                var obj = {
                                    field: key,
                                    title: value,
                                    align: "center",
                                    class: "leave_" + key,
                                    formatter: function (value, row, index) {
                                        // console.log(value);
                                        var html = "";

                                        if (row["extra"]) {
                                            var val = row["extra"][key] ? row["extra"][key] : 0;
                                            if (val) {
                                                html = "<div>" + attendance_summary.MinuteToHour(val) + "</div>";
                                            }
                                            else {
                                                html = "<div>0</div>";
                                            }
                                        }

                                        return html;
                                    }
                                };
                                columns.push(obj);

                            });

                        }

                        columns.push({
                            field: "lateCount",
                            title: "迟到次数",
                            align: "center",
                            class: "lateCount",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div class='txt'>" + value + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            },
                            events: {

                                //迟到弹框
                                "click .txt": function (e, value, row, index) {

                                    e.stopImmediatePropagation();
                                    var $e = $(e.currentTarget);

                                    var obj = {
                                        empId: row.id,
                                        settingId: attendance_summary_param.settingId,
                                        yearMonth: attendance_summary_param.year_month
                                    };
                                    var url = urlGroup.attendance.summary.late_list + "?" + jsonParseParam(obj);

                                    branGetRequest(
                                        url,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                $emp_info_modal.modal("show");

                                                $emp_info_modal.find(".modal-title").html("迟到");
                                                var $modal_body = $emp_info_modal.find(".modal-body");
                                                $modal_body.empty();

                                                var arr = data.result;
                                                if (arr && arr.length > 0) {

                                                    for (var i = 0; i < arr.length; i++) {
                                                        var $item = arr[i];

                                                        var date = $item.workAttendanceDate ? $item.workAttendanceDate : "";//日期
                                                        date = timeInit5(date);
                                                        var min = $item.lateMins ? $item.lateMins : 0;//时长
                                                        min = attendance_summary.MinuteToHour(min);

                                                        var $row = $("<div>");
                                                        $row.addClass("row");
                                                        $row.appendTo($modal_body);

                                                        //日期
                                                        var $date = $("<div>");
                                                        $date.addClass("col-xs-6");
                                                        $date.html(date);
                                                        $date.appendTo($row);

                                                        //分钟
                                                        var $min = $("<div>");
                                                        $min.addClass("col-xs-6");
                                                        $min.html("迟到" + min);
                                                        $min.appendTo($row);

                                                    }

                                                }
                                                else {
                                                    var msg = "<div class='msg_none'>暂无迟到信息</div>";
                                                    $modal_body.html(msg);
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

                            }
                        });
                        columns.push({
                            field: "lateHours",
                            title: "迟到时长",
                            align: "center",
                            class: "lateHours",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div>" + attendance_summary.MinuteToHour(value) + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            }
                        });
                        columns.push({
                            field: "unFullCount",
                            title: "早退次数",
                            align: "center",
                            class: "unFullCount",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div class='txt'>" + value + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            },
                            events: {

                                //早退弹框
                                "click .txt": function (e, value, row, index) {

                                    e.stopImmediatePropagation();
                                    var $e = $(e.currentTarget);

                                    var obj = {
                                        empId: row.id,
                                        settingId: attendance_summary_param.settingId,
                                        yearMonth: attendance_summary_param.year_month
                                    };
                                    var url = urlGroup.attendance.summary.unFull_list + "?" + jsonParseParam(obj);

                                    branGetRequest(
                                        url,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                $emp_info_modal.modal("show");

                                                $emp_info_modal.find(".modal-title").html("早退");
                                                var $modal_body = $emp_info_modal.find(".modal-body");
                                                $modal_body.empty();

                                                var arr = data.result;
                                                if (arr && arr.length > 0) {

                                                    for (var i = 0; i < arr.length; i++) {
                                                        var $item = arr[i];

                                                        var date = $item.workAttendanceDate ? $item.workAttendanceDate : "";//日期
                                                        date = timeInit5(date);
                                                        var min = $item.noFullMins ? $item.noFullMins : 0;//时长
                                                        min = attendance_summary.MinuteToHour(min);

                                                        var $row = $("<div>");
                                                        $row.addClass("row");
                                                        $row.appendTo($modal_body);

                                                        //日期
                                                        var $date = $("<div>");
                                                        $date.addClass("col-xs-6");
                                                        $date.html(date);
                                                        $date.appendTo($row);

                                                        //分钟
                                                        var $min = $("<div>");
                                                        $min.addClass("col-xs-6");
                                                        $min.html("早退" + min);
                                                        $min.appendTo($row);

                                                    }

                                                }
                                                else {
                                                    var msg = "<div class='msg_none'>暂无早退信息</div>";
                                                    $modal_body.html(msg);
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

                            }
                        });
                        columns.push({
                            field: "unFullHours",
                            title: "早退时长",
                            align: "center",
                            class: "unFullHours",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div>" + attendance_summary.MinuteToHour(value) + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            }
                        });
                        columns.push({
                            field: "absentTimes",
                            title: "旷工次数",
                            align: "center",
                            class: "absentTimes",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div class='txt'>" + value + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            },
                            events: {

                                //旷工弹框
                                "click .txt": function (e, value, row, index) {

                                    e.stopImmediatePropagation();
                                    var $e = $(e.currentTarget);

                                    var obj = {
                                        empId: row.id,
                                        settingId: attendance_summary_param.settingId,
                                        yearMonth: attendance_summary_param.year_month
                                    };
                                    var url = urlGroup.attendance.summary.absent_list + "?" + jsonParseParam(obj);

                                    branGetRequest(
                                        url,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                $emp_info_modal.modal("show");

                                                $emp_info_modal.find(".modal-title").html("旷工");
                                                var $modal_body = $emp_info_modal.find(".modal-body");
                                                $modal_body.empty();

                                                var arr = data.result;
                                                if (arr && arr.length > 0) {

                                                    for (var i = 0; i < arr.length; i++) {
                                                        var $item = arr[i];

                                                        var date = $item.workAttendanceDate ? $item.workAttendanceDate : "";//日期
                                                        date = timeInit5(date);
                                                        var day = $item.absentDays ? $item.absentDays : 0;//天

                                                        var $row = $("<div>");
                                                        $row.addClass("row");
                                                        $row.appendTo($modal_body);

                                                        //日期
                                                        var $date = $("<div>");
                                                        $date.addClass("col-xs-6");
                                                        $date.html(date);
                                                        $date.appendTo($row);

                                                        //分钟
                                                        var $min = $("<div>");
                                                        $min.addClass("col-xs-6");
                                                        $min.html("旷工" + day + "天");
                                                        $min.appendTo($row);

                                                    }

                                                }
                                                else {
                                                    var msg = "<div class='msg_none'>暂无旷工信息</div>";
                                                    $modal_body.html(msg);
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

                            }
                        });
                        columns.push({
                            field: "absentDays",
                            title: "旷工天数",
                            align: "center",
                            class: "absentDays",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div>" + value + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            }
                        });
                        columns.push({
                            field: "lackCount",
                            title: "缺卡次数",
                            align: "center",
                            class: "lackCount",
                            formatter: function (value, row, index) {
                                // console.log(value);
                                var html = "";

                                if (value) {
                                    html = "<div class='txt'>" + value + "</div>";
                                }
                                else {
                                    html = "<div>0</div>";
                                }

                                return html;
                            },
                            events: {

                                //缺卡弹框
                                "click .txt": function (e, value, row, index) {

                                    e.stopImmediatePropagation();
                                    var $e = $(e.currentTarget);

                                    var obj = {
                                        empId: row.id,
                                        settingId: attendance_summary_param.settingId,
                                        yearMonth: attendance_summary_param.year_month
                                    };
                                    var url = urlGroup.attendance.summary.lack_list + "?" + jsonParseParam(obj);

                                    branGetRequest(
                                        url,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                $emp_info_modal.modal("show");

                                                $emp_info_modal.find(".modal-title").html("缺卡");
                                                var $modal_body = $emp_info_modal.find(".modal-body");
                                                $modal_body.empty();

                                                var arr = data.result;
                                                if (arr && arr.length > 0) {

                                                    for (var i = 0; i < arr.length; i++) {
                                                        var $item = arr[i];

                                                        var date = $item.workAttendanceDate ? $item.workAttendanceDate : "";//日期
                                                        date = timeInit5(date);
                                                        var lackInfo = $item.lackInfo ? $item.lackInfo : "";//缺卡信息

                                                        var $row = $("<div>");
                                                        $row.addClass("row");
                                                        $row.appendTo($modal_body);

                                                        //日期
                                                        var $date = $("<div>");
                                                        $date.addClass("col-xs-6");
                                                        $date.html(date);
                                                        $date.appendTo($row);

                                                        //分钟
                                                        var $min = $("<div>");
                                                        $min.addClass("col-xs-6");
                                                        $min.html(lackInfo);
                                                        $min.appendTo($row);

                                                    }

                                                }
                                                else {
                                                    var msg = "<div class='msg_none'>暂无缺卡信息</div>";
                                                    $modal_body.html(msg);
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

                            }
                        });
                        columns.push({
                            field: "isPublish",
                            title: "考勤发布",
                            align: "center",
                            class: "isPublish",
                            formatter: function (value, row, index) {
                                // console.log(value);

                                var html = "";
                                if (value) {
                                    html = "<div>已发布</div>";
                                }
                                else {
                                    html = "<div>未发布</div>";
                                }

                                return html;
                            }
                        });
                        columns.push({
                            field: "sureState",
                            title: "员工确认",
                            align: "center",
                            class: "sureState",
                            formatter: function (value, row, index) {

                                var html = "";
                                // 0:申诉 1：未确认 2：确认 = ['Appeals', 'unconfirmed', 'confirmed'],

                                if (value === "Appeals") {
                                    html = "<div>申诉</div>";
                                }
                                else if (value === "unconfirmed") {
                                    html = "<div>未确认</div>";
                                }
                                else if (value === "confirmed") {
                                    html = "<div>已确认</div>";
                                }

                                return html;
                            }
                        });

                        attendance_summary.attendanceList(columns);

                    }

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            },
            {async: false}
        );

    },
    //查询
    attendanceList: function (columns) {

        loadingInit();

        $tb_attendance_summary.bootstrapTable("destroy");
        //表格的初始化
        $tb_attendance_summary.bootstrapTable({

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
            columns: columns,

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.attendance.summary.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数
                attendance_summary_param.paramSet();//赋值查询参数

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize,
                    queryDate: attendance_summary_param.year_month,
                    workShiftId: attendance_summary_param.work_shift_id,
                    settingId: attendance_summary_param.settingId,
                    isOnJob: attendance_summary_param.user_status_id,
                    empId: attendance_summary_param.emp_id,
                    departmentId: attendance_summary_param.department_id,
                    isPublish: attendance_summary_param.pub_status_id,
                    sureState: attendance_summary_param.confirm_status_id
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
                        total_rows = res.result.total ? res.result.total : 0;//总条数

                        var arr = res.result.workAttendanceTotalses;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var $item = arr[i];

                                var id = $item.id ? $item.id : "";//
                                var name = $item.name ? $item.name : "";//
                                var workAttendanceNo = $item.workAttendanceNo ? $item.workAttendanceNo : "";//打卡号
                                var clockType = $item.clockType ? $item.clockType : "";//打卡类型 = ['gps', 'wifi', 'device']

                                var departmentName = $item.departmentName ? $item.departmentName : "";//部门名称
                                var workShiftName = $item.workShiftName ? $item.workShiftName : "";//班组名称
                                var attendanceDays = $item.attendanceDays ? $item.attendanceDays : 0;//应出勤天数
                                var actualAttendanceDays = $item.actualAttendanceDays ? $item.actualAttendanceDays : 0;//实际出勤天数
                                var restCount = $item.restCount ? $item.restCount : 0;//休息天数

                                var attendanceHours = $item.attendanceHours ? $item.attendanceHours : 0;//出勤时长
                                var normalHours = $item.normalHours ? $item.normalHours : 0;//正常工时
                                var overTimeHours = $item.overTimeHours ? $item.overTimeHours : 0;//加班时长

                                var leaveTimes = $item.leaveTimes ? $item.leaveTimes : 0;//请假次数
                                var leaveHours = $item.leaveHours ? $item.leaveHours : 0;//请假时长

                                var lateCount = $item.lateCount ? $item.lateCount : 0;//迟到次数
                                var lateHours = $item.lateHours ? $item.lateHours : 0;//迟到时长

                                var unFullCount = $item.unFullCount ? $item.unFullCount : 0;//早退次数
                                var unFullHours = $item.unFullHours ? $item.unFullHours : 0;//早退时长

                                var absentTimes = $item.absentTimes ? $item.absentTimes : 0;//旷工次数
                                var absentDays = $item.absentDays ? $item.absentDays : 0;//旷工天数

                                var lackCount = $item.lackCount ? $item.lackCount : 0;//缺卡次数

                                var isPublish = $item.isPublish ? $item.isPublish : 0;//是否发布
                                var sureState = $item.sureState ? $item.sureState : "";// 0:申诉 1：未确认 2：确认 = ['Appeals', 'unconfirmed', 'confirmed'],
                                var extra = $item.extra ? $item.extra : null;//  动态列的值


                                var obj = {
                                    id: id,
                                    name: name,
                                    workAttendanceNo: workAttendanceNo,
                                    clockType: clockType,

                                    departmentName: departmentName,
                                    workShiftName: workShiftName,
                                    attendanceDays: attendanceDays,
                                    actualAttendanceDays: actualAttendanceDays,
                                    restCount: restCount,

                                    attendanceHours: attendanceHours,
                                    normalHours: normalHours,
                                    overTimeHours: overTimeHours,

                                    leaveTimes: leaveTimes,
                                    leaveHours: leaveHours,
                                    lateCount: lateCount,
                                    lateHours: lateHours,

                                    unFullCount: unFullCount,
                                    unFullHours: unFullHours,
                                    absentTimes: absentTimes,
                                    absentDays: absentDays,

                                    lackCount: lackCount,
                                    isPublish: isPublish,
                                    sureState: sureState,

                                    extra: extra

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
    //时间换算 将 100m 换算为 1h40m
    MinuteToHour: function (time) {

        if (time) {
            var hour = Math.floor(time / 60);
            var min = time - hour * 60;

            time = hour + "h" + min + "m";
        }

        return time;

    },

    //导出
    attendanceListExport: function () {

        var data = $tb_attendance_summary.bootstrapTable("getData");//所有数据
        if (data.length === 0) {
            toastr.warning("没有数据，无法导出");
            return
        }

        exportModalShow("确认导出出勤汇总数据吗？", function () {

            loadingInit();

            var obj = {
                // page: null,
                // page_size: null,
                queryDate: attendance_summary_param.year_month,
                workShiftId: attendance_summary_param.work_shift_id,
                settingId: attendance_summary_param.settingId,
                isOnJob: attendance_summary_param.user_status_id,
                empId: attendance_summary_param.emp_id,
                departmentId: attendance_summary_param.department_id,
                isPublish: attendance_summary_param.pub_status_id,
                sureState: attendance_summary_param.confirm_status_id
            };
            var url = urlGroup.attendance.summary.excel_export + "?" + jsonParseParam(obj);

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
    //发布
    attendanceListPublish: function () {
        var data = $tb_attendance_summary.bootstrapTable('getSelections');

        if (data.length === 0) {
            toastr.warning("请先选择数据！");
            return
        }

        // var count = 0;//已发布的数据 count
        var ids = [];
        $.each(data, function (index, item) {

            // //如果 已发布
            // if (item.isPublish) {
            //     count += 1;
            // }

            ids.push(item.id);

        });
        // if (count > 0) {
        //     toastr.warning("请选择未发布的数据");
        //     return;
        // }

        operateMsgShow("确认发布吗？", function () {

            loadingInit();

            var obj = {
                // page: 0,
                // page_size: 0,
                queryDate: attendance_summary_param.year_month,
                ids: ids,
                settingId: attendance_summary_param.settingId
            };

            branPostRequest(
                urlGroup.attendance.summary.publish,
                obj,
                function (data) {
                    // console.info("获取日志：");
                    // console.log(data);

                    if (data.code === RESPONSE_OK_CODE) {
                        toastr.success("发布成功！");

                        attendance_summary.btnSearchClick();//查询
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
//出勤汇总 查询参数
var attendance_summary_param = {

    year_month: null,//月份 2017-08
    settingId: null,//出勤周期 id
    department_id: null,//部门id
    work_shift_id: null,//班组id
    pub_status_id: null,//发布状态
    user_status_id: null,//员工状态 1 在职
    confirm_status_id: null,//确认状态
    emp_id: null,//员工id

    //参数 设置
    paramSet: function () {
        var $search_container = $attendance_summary_container.find(".search_container");

        //出勤日期
        var time = $search_container.find(".month").attr("data-time");
        if (time) {
            time = time.replace(/-/g, "/");
            attendance_summary_param.year_month = new Date(time).getTime();
        }

        //出勤周期 id
        attendance_summary_param.settingId = $search_container.find(".attendSet_container select").val();

        //部门 id
        attendance_summary_param.department_id = $search_container.find(".department_container select").val();

        //班组 id
        attendance_summary_param.work_shift_id = $search_container.find(".work_shift_container select").val();

        //发布状态 id
        attendance_summary_param.pub_status_id = $search_container.find(".pub_status select").val();

        //员工状态 id
        attendance_summary_param.user_status_id = $search_container.find(".user_status select").val();

        //员工状态 id
        attendance_summary_param.confirm_status_id = $search_container.find(".confirm_status select").val();

        //用户 id
        attendance_summary_param.emp_id = $search_container.find(".user_list").val()
            ? $search_container.find(".user_list").val()[0] : "";

    }

};

$(function () {
    attendance_summary.init();
});

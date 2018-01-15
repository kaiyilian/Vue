/**
 * Created by Administrator on 2017/9/7.
 */

var $schedule_view_container = $(".schedule_view_container");//排班试图 container
var $tb_schedule_view = $schedule_view_container.find("#tb_schedule_view");//表格table
var $schedule_list = $("<ul>").addClass("schedule_list");//班次列表（通用）

var weekArray = ["日", "一", "二", "三", "四", "五", "六"];
var $body = $("body");

//排班试图
var schedule_view = {

    row: null,//当前正在操作的 row

    init: function () {
        schedule_view.initScheduleList();//初始化 班次列表

        schedule_view.initMonth();//初始化 月份
        schedule_view.initDepartment();//初始化 部门
        schedule_view.initWorkShift();//初始化 班组
        schedule_view.initPubStatus();//初始化 发布状态
        schedule_view.initUserList();//初始化 用户列表
        // schedule_view.initScheduleName();//初始化 排班名称

        schedule_view.btnSearchClick();//查询按钮 点击事件

    },

    //月份初始化
    initMonth: function () {

        var $search_container = $schedule_view_container.find('.search_container');
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
        var $search_container = $schedule_view_container.find('.search_container');
        var $month = $search_container.find(".month");

        $month.html("YYYY-MM").attr("data-time", "");
    },
    //初始化 部门
    initDepartment: function () {
        var $search_container = $schedule_view_container.find(".search_container");
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
        var $search_container = $schedule_view_container.find(".search_container");
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
    //初始化 发布状态
    initPubStatus: function () {
        var $search_container = $schedule_view_container.find(".search_container");
        var $pub_status = $search_container.find(".pub_status");

        var option =
            "<option value=''>全部</option>" +
            "<option value='0'>未发布</option>" +
            "<option value='1'>发布</option>";

        $pub_status.find("select").html(option);

    },
    //初始化 用户列表
    initUserList: function () {
        var $search_container = $schedule_view_container.find(".search_container");
        var $user_list = $search_container.find(".user_list");
        $user_list.empty();

        branGetRequest(
            urlGroup.attendance.schedule_view.emp_roster_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    var users = data.result ? data.result : [];

                    $.each(users, function (index, item) {

                        var id = item.id ? item.id : "";//
                        var name = item.name ? item.name : "";//
                        var workSn = item.workSn ? item.workSn : "";//
                        var workLineName = item.workLineName ? item.workLineName : "";//
                        //var cardNo = item.workAttendanceNo ? item.workAttendanceNo : "";//


                        var $option = $("<option>");
                        $option.attr("value", id);
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
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            },
            {async: false}
        );

    },
    //初始化 班次列表
    initScheduleList: function () {
        $schedule_list.empty();

        branGetRequest(
            urlGroup.attendance.schedule_view.shift_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

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

                                var $li = $("<li>");
                                $li.addClass("schedule_item");
                                $li.attr("data-id", id);
                                $li.text(name);
                                $li.css("background-color", color);
                                $li.attr("onclick", "schedule_view.chooseSchedule(event,this)");
                                // $li.unbind("click").bind("click", function (e) {
                                //
                                //     e.stopImmediatePropagation();
                                //     schedule_view.chooseSchedule(this);//选择排班
                                //
                                // });
                                $li.appendTo($schedule_list);

                            }

                            //恢复初始班组排班值
                            var $default = $("<li>");
                            $default.addClass("default");
                            $default.appendTo($schedule_list);
                            $default.text("恢复初始班组排班值");
                            $default.attr("onclick", "schedule_view.chooseScheduleToDefault(event,this)");
                            // $default.unbind("click").bind("click", function (e) {
                            //     e.stopImmediatePropagation();
                            //
                            //     schedule_view.chooseScheduleToDefault(this);
                            //
                            // });

                        }

                    }

                }
                else {
                    branError(data.msg)
                }

            },
            function (error) {
                branError(error)
            },
            {async: false}
        );
    },

    //重置参数
    resetParam: function () {
        var $search_container = $schedule_view_container.find(".search_container");

        //月份
        var $month = $search_container.find(".month");
        //默认当前年月
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var yearMonth = year + "-" + month;
        $month.html(yearMonth).attr("data-time", yearMonth);

        //排班名称
        var $schedule_name = $search_container.find(".schedule_name");
        $schedule_name.find("select").val("");

        //部门
        var $department_container = $search_container.find(".department_container");
        $department_container.find("select").val("");

        //班组
        var $work_shift_container = $search_container.find(".work_shift_container");
        $work_shift_container.find("select").val("");

        //发布状态
        var $pub_status = $search_container.find(".pub_status");
        $pub_status.find("select").val("");

        //快速搜索
        var $user_list = $search_container.find(".user_list");
        $user_list.find("option:selected").removeAttr("selected");//清空选中状态
        $user_list.trigger("chosen:updated");   //每次对 select操作后必须要执行 此 方法

    },
    //查询按钮 点击事件
    btnSearchClick: function () {
        schedule_view.initTbData();//查询
    },
    //初始化 columns
    initColumns: function () {

        //手动拼接columns数组
        var columns = [
            {
                field: "pub_status",
                title: "发布状态",
                align: "center",
                class: "pub_status",
                formatter: function (value, row, index) {
                    // console.log(value);
                    var html = "";
                    if (value) {
                        html = "<div title='已发布'>已发布</div>"
                    }
                    else {
                        html = "<div title='未发布'>未发布</div>";
                    }

                    return html;
                }
            },
            // {
            //     field: "schedule_name",
            //     title: "排班名称",
            //     align: "center",
            //     class: "schedule_name",
            //     formatter: function (value, row, index) {
            //         // console.log(value);
            //         var html = "<div title='" + value + "'>" + value + "</div>";
            //
            //         return html;
            //     }
            // },
            {
                field: "work_shift_name",
                title: "班组",
                align: "center",
                class: "work_shift_name",
                formatter: function (value, row, index) {
                    // console.log(value);
                    var html = "<div title='" + value + "'>" + value + "</div>";

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
                    var html = "<div title='" + value + "'>" + value + "</div>";

                    return html;

                }
            },
            {
                field: "department_name",
                title: "部门",
                align: "center",
                class: "department_name",
                formatter: function (value, row, index) {
                    // console.log(value);
                    var html = "<div title='" + value + "'>" + value + "</div>";

                    return html;
                }
            },
            {
                field: "work_line_name",
                title: "工段",
                align: "center",
                class: "work_line_name",
                formatter: function (value, row, index) {
                    // console.log(value);
                    var html = "<div title='" + value + "'>" + value + "</div>";

                    return html;
                }
            },
            {
                field: "position_name",
                title: "职位",
                align: "center",
                class: "position_name",
                formatter: function (value, row, index) {
                    // console.log(value);
                    var html = "<div title='" + value + "'>" + value + "</div>";

                    return html;
                }
            }
        ];

        var myDate = new Date(schedule_view_param.year_month);
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)

        var dayCount = new Date(year, month, 0).getDate();//当月总天数

        for (var i = 1; i <= dayCount; i++) {

            var day = year + "/" + month + "/" + i;
            day = new Date(day).getDay();//周几
            day = weekArray[day];

            var title = "<div class='date_info'>" +
                "<div class='date'>" + i + "</div>" +
                "<div class='day'>" + day + "</div>" +
                "</div>";

            var temp = {
                field: "day_" + i,
                title: title,
                align: "center",
                formatter: function (value, row, index) {

                    var html = "";
                    var obj = value;

                    if (obj) {

                        var className = "day_item";
                        //是否编辑过
                        if (obj.isEmpModify) {
                            className += " is_modify";
                        }

                        html = "<div class='" + className + "' " +
                            "data-day='" + obj.day + "' " +
                            "style='background-color:" + obj.color + "'" +
                            ">" +
                            obj.shortName +
                            "</div>";

                    }
                    else {
                        html = "<div></div>";
                    }

                    return html;

                },
                events: {

                    //编辑 排班
                    "click .day_item": function (e, value, row, index) {

                        // console.log(e);
                        e.stopImmediatePropagation();
                        schedule_view.row = row;//
                        var $e = $(e.currentTarget);

                        var day = $e.attr("data-day");
                        var data = schedule_view.row["day_" + day];//点击的这一天的数据

                        //判断 修改的排班日期是否 是今天之后的日期
                        var now = new Date().getTime();
                        var modify = new Date(schedule_view_param.year_month + "-" + day).getTime();
                        if (modify <= now) {
                            toastr.warning("不能修改当日及以前的排班");
                            return
                        }

                        $e.append($schedule_list);//显示所有的班组
                        $e.find(".schedule_list").show().find("li i").remove("i");//移除班次列表内 选中状态

                        var $i = $("<i>");
                        $i.addClass("icon_choose");
                        var $img = $("<img>");
                        $img.appendTo($i);
                        $img.attr("src", "image/icon_choose.png");

                        //遍历班次数组，选中当前 已经选中过的班次
                        $schedule_list.find(".schedule_item").each(function () {

                            var $this = $(this);
                            var id = $this.attr("data-id");
                            if (id === data.id) {
                                $this.addClass("active").siblings().removeClass("active");
                                $this.append($i);
                            }

                        });


                    }

                }
            };//手动拼接columns
            columns.push(temp);

        }

        return columns;

    },
    //dataTable 初始化
    initTbData: function () {
        console.log("排班视图列表：" + new Date().getTime());

        loadingInit();

        //参数赋值
        schedule_view_param.paramSet();

        if (!schedule_view_param.year_month) {
            toastr.warning('请选择年月！');
            loadingRemove();
            return
        }

        var columns = schedule_view.initColumns();  //初始化 columns

        $tb_schedule_view.bootstrapTable("destroy");
        //表格的初始化
        $tb_schedule_view.bootstrapTable({

            classes: "table table-striped table-bordered table-hover dataTable",
            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            // data: data,                         //直接从本地数据初始化表格
            uniqueId: "empId",

            //分页
            pagination: true,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            sidePagination: "client",           //分页方式：client 客户端分页，server 服务端分页（*）
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [5, 10, 15],        //可供选择的每页的行数（*）

            //排序
            sortable: true,                     //所有列的排序 是否开启
            sortOrder: "desc",                   //排序方式

            width: "100%",
            height: 600,
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
            url: urlGroup.attendance.schedule_view.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                // console.log(params);

                var obj = {

                    page: params.pageNumber,
                    page_size: params.pageSize,

                    queryDate: schedule_view_param.year_month ? new Date(schedule_view_param.year_month).getTime() : "",
                    department_id: schedule_view_param.department_id,
                    work_shift_id: schedule_view_param.work_shift_id,
                    publishedState: schedule_view_param.pub_status_id,
                    empId: schedule_view_param.emp_id

                };

                loadingInit();

                // console.log(obj);
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

                        // console.log("数组：");
                        // console.log(res.result.result[0].schedule.detail);

                        var arr = res.result.result;
                        for (var i = 0; i < arr.length; i++) {

                            var empInfo = arr[i].empCorpInfo;//员工信息
                            var schedule = arr[i].schedule;//排班信息

                            var day_info = schedule.detail ? schedule.detail : [];//月份中天数 数组
                            var pub_status = schedule.publishedState ? schedule.publishedState : 0;//发布状态

                            var name = empInfo.empName ? empInfo.empName : "";//员工姓名
                            var empId = empInfo.empId ? empInfo.empId : "";//员工id
                            var attendNo = empInfo.attendNo ? empInfo.attendNo : "";//员工 工号
                            var work_shift_id = empInfo.work_shift_id ? empInfo.work_shift_id : "";//班组 id
                            var work_shift_name = empInfo.work_shift_name ? empInfo.work_shift_name : "";//班组 名称
                            var department_id = empInfo.department_id ? empInfo.department_id : "";//部门 id
                            var department_name = empInfo.department_name ? empInfo.department_name : "";//部门 名称
                            var position_id = empInfo.position_id ? empInfo.position_id : "";//职位 id
                            var position_name = empInfo.position_name ? empInfo.position_name : "";//职位 名称
                            var work_line_id = empInfo.work_line_id ? empInfo.work_line_id : "";//工段 id
                            var work_line_name = empInfo.work_line_name ? empInfo.work_line_name : "";//工段 名称

                            var obj = {
                                index: i,//
                                pub_status: pub_status,
                                empId: empId,
                                attendNo: attendNo,
                                name: name,
                                work_shift_id: work_shift_id,
                                work_shift_name: work_shift_name,
                                department_id: department_id,
                                department_name: department_name,
                                position_id: position_id,
                                position_name: position_name,
                                work_line_id: work_line_id,
                                work_line_name: work_line_name
                            };

                            for (var j = 0; j < day_info.length; j++) {
                                var $item = day_info[j];

                                var id = $item.id ? $item.id : "";//
                                var day = $item.day ? $item.day : "";//
                                var week = $item.week ? $item.week : "";//
                                var color = $item.color ? $item.color : "";//
                                var shortName = $item.shortName ? $item.shortName : "";//
                                var attendceStatus = $item.attendceStatus ? $item.attendceStatus : "0";//
                                var isEmpModify = $item.isEmpModify ? $item.isEmpModify : "";//
                                var ruleId = $item.ruleId ? $item.ruleId : "";//排班规则名称 id
                                var rest = $item.rest ? $item.rest : "";//
                                var intWeek = $item.intWeek ? $item.intWeek : "";//

                                obj["day_" + day] = {
                                    id: id,
                                    day: day,
                                    week: week,
                                    color: color,
                                    shortName: shortName,
                                    attendceStatus: attendceStatus,
                                    isEmpModify: isEmpModify,
                                    ruleId: ruleId,
                                    rest: rest,
                                    intWeek: intWeek
                                };

                            }

                            tb_data.push(obj);

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

            },

            // onClickRow: function (row, $element, fieldID) {
            //     console.log(row);
            // }

        });

    },

    //修改 当日 排班
    chooseSchedule: function (event, self) {
        console.log("修改当日排班：" + new Date().getTime());

        event.stopImmediatePropagation();

        loadingInit();

        var $self = $(self);//选中的班组
        var $day_item = $self.closest(".day_item");
        var day = $day_item.attr("data-day");//当前 日（31号中的‘31’）
        var day_item_name = "day_" + day;//row中的 这一天的 filed 名称

        $day_item.find(".schedule_list").remove();//移除班组

        //调用接口，更新用户当月 这一天 的排班
        var obj = {
            empId: schedule_view.row.empId,
            modifyDate: new Date(schedule_view_param.year_month + "-" + day).getTime(),
            workShiftTypeId: $self.attr("data-id"),        //班次id
            workShiftRuleId: schedule_view.row[day_item_name].ruleId,        //排班规则id
            page: $tb_schedule_view.bootstrapTable('getOptions').pageNumber
        };

        branPutRequest(
            urlGroup.attendance.schedule_view.modify_one_day,
            obj,
            function (data) {
                //alert(JSON.stringify(data))
                // console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.result) {

                        toastr.success("修改成功！");

                        // console.log("修改当日排班后数组：");
                        // console.log(data.result.result.result);

                        var arr = data.result.result.result ? data.result.result.result : [];
                        for (var i = 0; i < arr.length; i++) {

                            var empInfo = arr[i].empCorpInfo;//员工信息
                            var schedule = arr[i].schedule;//排班信息

                            var day_info = schedule.detail ? schedule.detail : [];//月份中天数 数组
                            var pub_status = schedule.publishedState ? schedule.publishedState : 0;//发布状态

                            var name = empInfo.empName ? empInfo.empName : "";//员工姓名
                            var empId = empInfo.empId ? empInfo.empId : "";//员工id
                            var attendNo = empInfo.attendNo ? empInfo.attendNo : "";//员工 工号
                            var work_shift_id = empInfo.work_shift_id ? empInfo.work_shift_id : "";//班组 id
                            var work_shift_name = empInfo.work_shift_name ? empInfo.work_shift_name : "";//班组 名称
                            var department_id = empInfo.department_id ? empInfo.department_id : "";//部门 id
                            var department_name = empInfo.department_name ? empInfo.department_name : "";//部门 名称
                            var position_id = empInfo.position_id ? empInfo.position_id : "";//职位 id
                            var position_name = empInfo.position_name ? empInfo.position_name : "";//职位 名称
                            var work_line_id = empInfo.work_line_id ? empInfo.work_line_id : "";//工段 id
                            var work_line_name = empInfo.work_line_name ? empInfo.work_line_name : "";//工段 名称

                            var obj = {
                                index: i,//
                                pub_status: pub_status,
                                empId: empId,
                                attendNo: attendNo,
                                name: name,
                                work_shift_id: work_shift_id,
                                work_shift_name: work_shift_name,
                                department_id: department_id,
                                department_name: department_name,
                                position_id: position_id,
                                position_name: position_name,
                                work_line_id: work_line_id,
                                work_line_name: work_line_name
                            };

                            for (var j = 0; j < day_info.length; j++) {
                                var $item = day_info[j];

                                var id = $item.id ? $item.id : "";//
                                var day = $item.day ? $item.day : "";//
                                var week = $item.week ? $item.week : "";//
                                var color = $item.color ? $item.color : "";//
                                var shortName = $item.shortName ? $item.shortName : "";//
                                var attendceStatus = $item.attendceStatus ? $item.attendceStatus : "0";//
                                var isEmpModify = $item.isEmpModify ? $item.isEmpModify : "";//
                                var ruleId = $item.ruleId ? $item.ruleId : "";//排班规则名称 id
                                var rest = $item.rest ? $item.rest : "";//
                                var intWeek = $item.intWeek ? $item.intWeek : "";//

                                obj["day_" + day] = {
                                    id: id,
                                    day: day,
                                    week: week,
                                    color: color,
                                    shortName: shortName,
                                    attendceStatus: attendceStatus,
                                    isEmpModify: isEmpModify,
                                    ruleId: ruleId,
                                    rest: rest,
                                    intWeek: intWeek
                                };

                            }

                            //多条数据，逐步更新
                            $tb_schedule_view.bootstrapTable("updateRow", {
                                index: i,
                                row: obj
                            });

                        }

                    }
                    else {
                        toastr.warning(data.msg);
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
    //修改当日排班，为默认排班
    chooseScheduleToDefault: function (event, self) {
        console.log("恢复默认排班：" + new Date().getTime());

        event.stopImmediatePropagation();

        operateMsgShow(
            "确认恢复初始排班吗？",
            function () {

                loadingInit();

                var $self = $(self);//选中的班组
                var $day_item = $self.closest(".day_item");
                var day = $day_item.attr("data-day");//当前 日（31号中的‘31’）
                var day_item_name = "day_" + day;//row中的 这一天的 filed 名称
                // var data = schedule_view.row[day_item_name];//点击的这一天的数据

                //调用接口，更新用户当月 这一天 的排班(恢复默认排班)
                var obj = {
                    empId: schedule_view.row.empId,
                    modifyDate: new Date(schedule_view_param.year_month + "-" + day).getTime(),
                    workShiftTypeId: schedule_view.row[day_item_name].id,        //班次id
                    workShiftRuleId: schedule_view.row[day_item_name].ruleId,         //排班规则id
                    page: $tb_schedule_view.bootstrapTable('getOptions').pageNumber
                };

                $day_item.find(".schedule_list").remove();//移除班组

                branDeleteRequest(
                    urlGroup.attendance.schedule_view.revert,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            if (data.result && data.result.result) {

                                toastr.success("恢复成功！");

                                var arr = data.result.result.result ? data.result.result.result : [];
                                for (var i = 0; i < arr.length; i++) {

                                    var empInfo = arr[i].empCorpInfo;//员工信息
                                    var schedule = arr[i].schedule;//排班信息

                                    var day_info = schedule.detail ? schedule.detail : [];//月份中天数 数组
                                    var pub_status = schedule.publishedState ? schedule.publishedState : 0;//发布状态

                                    var name = empInfo.empName ? empInfo.empName : "";//员工姓名
                                    var empId = empInfo.empId ? empInfo.empId : "";//员工id
                                    var attendNo = empInfo.attendNo ? empInfo.attendNo : "";//员工 工号
                                    var work_shift_id = empInfo.work_shift_id ? empInfo.work_shift_id : "";//班组 id
                                    var work_shift_name = empInfo.work_shift_name ? empInfo.work_shift_name : "";//班组 名称
                                    var department_id = empInfo.department_id ? empInfo.department_id : "";//部门 id
                                    var department_name = empInfo.department_name ? empInfo.department_name : "";//部门 名称
                                    var position_id = empInfo.position_id ? empInfo.position_id : "";//职位 id
                                    var position_name = empInfo.position_name ? empInfo.position_name : "";//职位 名称
                                    var work_line_id = empInfo.work_line_id ? empInfo.work_line_id : "";//工段 id
                                    var work_line_name = empInfo.work_line_name ? empInfo.work_line_name : "";//工段 名称

                                    var obj = {
                                        index: i,//
                                        pub_status: pub_status,
                                        empId: empId,
                                        attendNo: attendNo,
                                        name: name,
                                        work_shift_id: work_shift_id,
                                        work_shift_name: work_shift_name,
                                        department_id: department_id,
                                        department_name: department_name,
                                        position_id: position_id,
                                        position_name: position_name,
                                        work_line_id: work_line_id,
                                        work_line_name: work_line_name
                                    };

                                    for (var j = 0; j < day_info.length; j++) {
                                        var $item = day_info[j];

                                        var id = $item.id ? $item.id : "";//
                                        var day = $item.day ? $item.day : "";//
                                        var week = $item.week ? $item.week : "";//
                                        var color = $item.color ? $item.color : "";//
                                        var shortName = $item.shortName ? $item.shortName : "";//
                                        var attendceStatus = $item.attendceStatus ? $item.attendceStatus : "0";//
                                        var isEmpModify = $item.isEmpModify ? $item.isEmpModify : "";//
                                        var ruleId = $item.ruleId ? $item.ruleId : "";//排班规则名称 id
                                        var rest = $item.rest ? $item.rest : "";//
                                        var intWeek = $item.intWeek ? $item.intWeek : "";//

                                        obj["day_" + day] = {
                                            id: id,
                                            day: day,
                                            week: week,
                                            color: color,
                                            shortName: shortName,
                                            attendceStatus: attendceStatus,
                                            isEmpModify: isEmpModify,
                                            ruleId: ruleId,
                                            rest: rest,
                                            intWeek: intWeek
                                        };

                                    }

                                    //多条数据，逐步更新
                                    $tb_schedule_view.bootstrapTable("updateRow", {
                                        index: i,
                                        row: obj
                                    });

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

            },
            "将取消所有修改记录，恢复到最初排班计划"
        );

    },

    //发布
    schedulePub: function () {

        // var data = $tb_schedule_view.bootstrapTable("getData");
        // if (data.length <= 0) {
        //     toastr.warning("暂无可发布的排班！");
        //     return;
        // }
        //
        // var pub_count = 0;//未发布的排班 数量
        // for (var i = 0; i < data.length; i++) {
        //
        //     //如果 未发布
        //     if (!data[i].pub_status) {
        //         pub_count += 1;
        //     }
        //
        // }
        // if (pub_count === 0) {
        //     toastr.warning("所有排班都已发布！");
        //     return;
        // }

        operateMsgShow(
            "确定要发布排班吗？",
            function () {

                loadingInit();

                branGetRequest(
                    urlGroup.attendance.schedule_view.release,
                    function (data) {
                        //console.info("获取日志：");
                        //console.log(data);

                        if (data.code === RESPONSE_OK_CODE) {

                            toastr.success("发布成功！");
                            schedule_view.btnSearchClick();//获取排班

                        }
                        else {
                            branError(data.msg);
                        }

                    },
                    function (error) {
                        branError(error)
                    }
                );

            }
        )

    }

};
//排班试图 查询参数
var schedule_view_param = {
    year_month: "",//月份 2017-08
    department_id: null,//部门id
    work_shift_id: null,//班组id
    pub_status_id: null,//发布状态
    emp_id: null,//员工id

    init: function () {

        schedule_view_param.year_month = null;
        schedule_view_param.department_id = null;
        schedule_view_param.work_shift_id = null;
        schedule_view_param.pub_status_id = null;
        schedule_view_param.emp_id = null;

    },

    //参数赋值
    paramSet: function () {
        var $search_container = $schedule_view_container.find(".search_container");

        schedule_view_param.year_month = $search_container.find(".month").attr("data-time");
        // schedule_view_param.year_month = schedule_view_param.year_month ?
        //     new Date(schedule_view_param.year_month).getTime() : "";

        schedule_view_param.department_id = $search_container.find(".department_container select option:selected").val();
        schedule_view_param.department_id = schedule_view_param.department_id ? schedule_view_param.department_id : "";

        schedule_view_param.work_shift_id = $search_container.find(".work_shift_container select option:selected").val();
        schedule_view_param.work_shift_id = schedule_view_param.work_shift_id ? schedule_view_param.work_shift_id : "";

        schedule_view_param.pub_status_id = $search_container.find(".pub_status select option:selected").val();
        schedule_view_param.pub_status_id = schedule_view_param.pub_status_id ? schedule_view_param.pub_status_id : "";

        schedule_view_param.emp_id = $search_container.find(".user_list").val()
            ? $search_container.find(".user_list").val()[0] : "";

    }

};

$(function () {
    schedule_view.init();
});

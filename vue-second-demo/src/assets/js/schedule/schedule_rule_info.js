/**
 * Created by Administrator on 2017/9/12.
 * 排班规律 详情
 */

var $schedule_rule_info_container = $(".schedule_rule_info_container");//排班规律 信息container
var $work_shift_modal = $(".work_shift_modal");//班组modal
var $tb_work_shift_user = $work_shift_modal.find("#tb_work_shift_user");//班组人员 列表
var $schedule_list = $("<ul>").addClass("schedule_list");//班次列表（通用）

var schedule_rule_info = {

    //初始化
    init: function () {

        schedule_rule_info.initScheduleList();//初始化 班次列表

        schedule_rule_info.initName();//初始化 排班规律 名称
        schedule_rule_info.initTime();//初始化 时间
        schedule_rule_info.initLoop();//初始化 一直循环
        schedule_rule_info.initWorkShift();//初始化 考勤员工（班组列表）
        schedule_rule_info.initScheduleRuleCycle();//初始化 排班周期
        schedule_rule_info.initScheduleRuleLaws();//初始化 排班规律

        //如果是编辑，则先 获取排班规律
        if (schedule_rule_info_param.id) {
            schedule_rule_info.scheduleRuleInfo();
        }

        //班组列表 弹框显示
        $work_shift_modal.on("shown.bs.modal", function () {

            //初始化 班组 - 置空
            var $work_shift_list = $work_shift_modal.find(".work_shift_list");
            var msg = "<div>暂无班组信息</div>";
            $work_shift_list.empty(msg);

            //初始化 班组人数 - 置空
            schedule_rule_info.initTable([]);

            //全选按钮 初始化
            var $choose_container = $work_shift_modal.find(".choose_container");
            $choose_container.removeClass("choose");
            $choose_container.find("img").attr("src", "image/UnChoose.png");

            schedule_rule_info.workShiftList();//初始化 班组列表

        });

    },
    //排班规律 detail
    scheduleRuleInfo: function () {

        var obj = {
            id: schedule_rule_info_param.id
        };
        var url = urlGroup.attendance.schedule_rule_info.detail+ "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        var $item = data.result;

                        schedule_rule_info_param.name = $item.name ? $item.name : "";//
                        schedule_rule_info_param.beginTime = $item.executeTime ? $item.executeTime : "";//
                        schedule_rule_info_param.beginTime = timeInit(schedule_rule_info_param.beginTime);
                        schedule_rule_info_param.endTime = $item.executeEndTime ? $item.executeEndTime : "";//
                        schedule_rule_info_param.endTime = timeInit(schedule_rule_info_param.endTime);
                        schedule_rule_info_param.isLoop = $item.isLoopAround ? $item.isLoopAround : 0;//
                        schedule_rule_info_param.cycle = $item.cycle ? $item.cycle : 1;//
                        schedule_rule_info_param.workShiftList = $item.workShifts ? $item.workShifts : [];//
                        schedule_rule_info_param.workTypeList = $item.workShiftTypes ? $item.workShiftTypes : [];//

                        //排班名称
                        $schedule_rule_info_container.find(".schedule_name").find("input").val(schedule_rule_info_param.name);

                        //排班时间
                        var $schedule_rule_time = $schedule_rule_info_container.find(".schedule_rule_time");
                        if (schedule_rule_info_param.beginTime) {
                            $schedule_rule_time.find(".schedule_rule_beginTime").val(schedule_rule_info_param.beginTime);
                        }
                        if (schedule_rule_info_param.endTime) {
                            $schedule_rule_time.find(".schedule_rule_endTime").val(schedule_rule_info_param.endTime);
                        }
                        //判断是否 循环
                        var $is_loop = $schedule_rule_time.find(".is_loop");
                        if (schedule_rule_info_param.isLoop) {
                            $is_loop.addClass("active");
                            $is_loop.find("img").attr("src", "image/Choosed.png");
                            $schedule_rule_time.find(".schedule_rule_endTime").val("").attr("disabled", "disabled");
                        }

                        //考勤员工
                        schedule_rule_info.initWorkShift();

                        //排班周期
                        var $schedule_rule_cycle = $schedule_rule_info_container.find(".schedule_rule_cycle").find("select");
                        if (schedule_rule_info_param.cycle) {
                            $schedule_rule_cycle.val(schedule_rule_info_param.cycle);
                        }

                        //判断排班规律 列表
                        schedule_rule_info.initScheduleRuleLaws();

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

    //初始化 班次列表
    initScheduleList: function () {
        $schedule_list.empty();

        branGetRequest(
            urlGroup.attendance.schedule_rule_info.shift_list,
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
                                $li.attr("data-short_name", shortName);
                                $li.text(name);
                                $li.css("background-color", color);
                                // $li.unbind("click").bind("click", function (e) {
                                //
                                //     e.stopImmediatePropagation();
                                //     schedule_rule_info.chooseSchedule(this);//选择排班
                                //
                                // });
                                $li.attr("onclick", "schedule_rule_info.chooseSchedule(event,this)");
                                $li.appendTo($schedule_list);

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
    //初始化 排班规律 名称
    initName: function () {

        //排班名称
        $schedule_rule_info_container.find(".schedule_name").find("input").val("");

    },
    //初始化 时间
    initTime: function () {

        var begin = {
            elem: "#schedule_rule_beginTime",
            event: 'click', //触发事件
            format: 'YYYY-MM-DD',
            istime: false,
            istoday: false,
            choose: function (datas) {
                //start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        laydate(begin);

        var end = {
            elem: "#schedule_rule_endTime",
            event: 'click', //触发事件
            format: 'YYYY-MM-DD',
            istime: false,
            istoday: false,
            choose: function (datas) {
                //start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        laydate(end);

    },
    //初始化 一直循环 勾选框
    initLoop: function () {

        var $schedule_rule_time = $schedule_rule_info_container.find(".schedule_rule_time");
        var $is_loop = $schedule_rule_time.find(".is_loop");

        //初始化
        $is_loop.removeClass("active");
        $is_loop.find("img").attr("src", "image/UnChoose.png");

        $is_loop.unbind("click").bind("click", function () {
            var $this = $(this);

            if ($this.hasClass("active")) {
                $this.removeClass("active");
                $this.find("img").attr("src", "image/UnChoose.png");
                $schedule_rule_time.find(".schedule_rule_endTime").removeAttr("disabled");
            }
            else {
                $this.addClass("active");
                $this.find("img").attr("src", "image/Choosed.png");
                $schedule_rule_time.find(".schedule_rule_endTime").val("").attr("disabled", "disabled");
            }

        });

    },
    //初始化 考勤员工（班组列表）
    initWorkShift: function () {
        var $work_shift = $schedule_rule_info_container.find(".work_shift");
        var $work_shift_list = $work_shift.find(".work_shift_list");//班组列表
        $work_shift_list.empty();

        //考勤员工
        if (schedule_rule_info_param.workShiftList && schedule_rule_info_param.workShiftList.length > 0) {

            for (var i = 0; i < schedule_rule_info_param.workShiftList.length; i++) {
                var $item = schedule_rule_info_param.workShiftList[i];

                var id = $item.id ? $item.id : "";//
                var name = $item.name ? $item.name : "";//
                var staffNumber = $item.staffNumber ? $item.staffNumber : 0;//
                var show_name = name + (staffNumber ? ("(" + staffNumber + "人)") : "(0人)");

                //item
                var $work_shift_item = $("<div>");
                $work_shift_item.addClass("item");
                $work_shift_item.attr("data-id", id);
                $work_shift_item.attr("data-name", name);
                $work_shift_item.attr("data-staffNumber", staffNumber);
                $work_shift_item.appendTo($work_shift_list);
                $work_shift_item.text(show_name);

                //删除 icon
                var $icon_del = $("<i>");
                $icon_del.addClass("icon_del");
                $icon_del.addClass("glyphicon");
                $icon_del.addClass("glyphicon-remove");
                $icon_del.unbind("click").bind("click", function () {
                    $(this).closest(".item").remove();
                });
                $icon_del.appendTo($work_shift_item);

            }

        }

    },
    //初始化 排班周期
    initScheduleRuleCycle: function () {
        var $schedule_rule_cycle = $schedule_rule_info_container.find(".schedule_rule_cycle").find("select");
        $schedule_rule_cycle.empty();

        for (var i = 1; i <= 31; i++) {

            var $option = $("<option>");
            $option.appendTo($schedule_rule_cycle);
            $option.text(i);

        }

    },
    //初始化 排班规律
    initScheduleRuleLaws: function () {
        var $schedule_rule_laws = $schedule_rule_info_container.find(".schedule_rule_laws");
        $schedule_rule_laws.empty();

        var length = $schedule_rule_info_container.find(".schedule_rule_cycle").find("select").val();
        for (var i = 1; i <= length; i++) {

            var $item = $("<div>");
            $item.addClass("item");
            $item.appendTo($schedule_rule_laws);
            $item.unbind("click").bind("click", function (e) {

                e.stopImmediatePropagation();
                schedule_rule_info.chooseScheduleShow(this);

            });

        }

        if (schedule_rule_info_param.workTypeList && schedule_rule_info_param.workTypeList.length > 0) {

            $schedule_rule_laws.find(".item").each(function () {

                var $this = $(this);

                var index = $this.index();
                var obj = schedule_rule_info_param.workTypeList[index];
                var id = obj.id ? obj.id : "";
                var color = obj.color ? obj.color : "";
                var shortName = obj.shortName ? obj.shortName : "";

                $this.attr("data-id", id);//赋值班次id
                $this.attr("data-shortName", shortName);//赋值班次 简称
                $this.css("background-color", color);
                $this.html(shortName);

            });

        }

    },

    //隐藏班次列表
    hideScheduleList: function () {

        //选中的 轮班item
        var $schedule_rule_laws = $schedule_rule_info_container.find(".schedule_rule_laws");
        $schedule_rule_laws.find(".item.active").removeClass("active");
        $schedule_rule_laws.find('.schedule_list').remove();

    },
    //班次列表 弹框显示
    chooseScheduleShow: function (self) {

        var $self = $(self);
        var schedule_id = $self.attr("data-id");//当前item中 班次 id

        //如果正在 操作该item
        if ($self.find(".schedule_list").length > 0) {
            return
        }

        //item加上active 同时放入 班次列表
        $self.addClass("active").append($schedule_list);
        //移除该item 以外其他item的班次列表
        $self.siblings(".item").removeClass("active").find(".schedule_list").remove();

        $schedule_list.find("li i").remove("i");//移除班次列表内 选中状态

        //如果 班次已经选择，则显示√
        if (schedule_id) {

            var $i = $("<i>");
            // $i.addClass("glyphicon");
            // $i.addClass("glyphicon-ok");
            $i.addClass("icon_choose");
            var $img = $("<img>");
            $img.appendTo($i);
            $img.attr("src", "image/icon_choose.png");

            $schedule_list.find(".schedule_item").each(function () {

                var id = $(this).attr("data-id");
                if (id === schedule_id) {
                    $(this).append($i);
                }

            });

        }

    },
    //选择班次
    chooseSchedule: function (e, self) {
        e.stopImmediatePropagation();

        //班次 item
        var id = $(self).attr("data-id");
        var color = $(self).css("background-color");
        var shortName = $(self).attr("data-short_name");

        //选中的 轮班item
        var $schedule_rule_laws = $schedule_rule_info_container.find(".schedule_rule_laws");
        var $item = $schedule_rule_laws.find(".item.active");

        $item.attr("data-id", id);//赋值班组id
        $item.attr("data-shortName", shortName);//赋值班组名称
        $item.css("background-color", color);
        $item.html(shortName);

        schedule_rule_info.hideScheduleList();//隐藏 班次列表

    },

    //班组弹框 显示
    workShiftModalShow: function () {

        schedule_rule_info_param.paramSet();//参数赋值

        var txt = "";
        if (!schedule_rule_info_param.beginTime) {
            txt = "请选择开始时间！";
        }
        else if (!schedule_rule_info_param.endTime && !schedule_rule_info_param.isLoop) {
            txt = "请输入结束时间或选择一直循环！";
        }

        if (txt) {
            toastr.warning(txt);
            return;
        }

        $work_shift_modal.modal("show");

    },
    //初始化 班组列表
    workShiftList: function () {

        var beginTime = schedule_rule_info_param.beginTime
            ? new Date(schedule_rule_info_param.beginTime).getTime() : "";

        var endTime = schedule_rule_info_param.endTime
            ? new Date(schedule_rule_info_param.endTime).getTime() : "";

        var obj = {
            workShiftRuleId: schedule_rule_info_param.id ? schedule_rule_info_param.id : "",
            executeTime: beginTime,
            executeEndsTime: endTime,
            isLoopAround: schedule_rule_info_param.isLoop
        };
        var url = urlGroup.attendance.schedule_rule_info.enable_work_shift+ "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    var $work_shift_list = $work_shift_modal.find(".work_shift_list");
                    $work_shift_list.empty();

                    if (data.result && data.result.length > 0) {

                        var arr = data.result;
                        for (var i = 0; i < arr.length; i++) {
                            var $item = arr[i];

                            var id = $item.id ? $item.id : "";//
                            var name = $item.name ? $item.name : "";//
                            var staffNumber = $item.staffNumber ? $item.staffNumber : 0;//
                            // var emps = $item.emps ? $item.emps.toString() : [];//

                            // sessionStorage.setItem("work_shift_user_" + id, emps);//赋值班组 成员列表

                            var $work_shift_item = $("<div>");
                            $work_shift_item.appendTo($work_shift_list);
                            $work_shift_item.addClass("item");
                            $work_shift_item.attr("data-id", id);
                            $work_shift_item.attr("data-name", name);
                            $work_shift_item.attr("data-staffNumber", staffNumber);
                            $work_shift_item.unbind("click").bind("click", function () {
                                var $this = $(this);

                                $this.addClass("active").siblings().removeClass("active");
                                schedule_rule_info.workShiftUserList();//班组人员 列表

                            });

                            //img
                            var $img = $("<img>");
                            $img.attr("src", "image/UnChoose.png");
                            $img.unbind("click").bind("click", function (e) {
                                e.stopImmediatePropagation();

                                var $item = $(this).closest(".item");
                                if ($item.hasClass("choose")) {
                                    $item.removeClass("choose");
                                    $item.find("img").attr("src", "image/UnChoose.png");
                                }
                                else {
                                    $item.addClass("choose");
                                    $item.find("img").attr("src", "image/Choosed.png");
                                }

                                schedule_rule_info.checkIsChooseAll();//检查 是否全选

                            });
                            $img.appendTo($work_shift_item);

                            //span
                            name += "(" + staffNumber + "人)";
                            var $spn = $("<span>");
                            $spn.text(name);
                            $spn.appendTo($work_shift_item);

                        }

                        //如果 考勤员工 班组列表 有数据
                        if (schedule_rule_info_param.workShiftList && schedule_rule_info_param.workShiftList.length > 0) {

                            $work_shift_list.find(".item").each(function () {
                                var $this = $(this);

                                var id = $this.attr("data-id");//班组id
                                for (var j = 0; j < schedule_rule_info_param.workShiftList.length; j++) {
                                    var work_shift_id = schedule_rule_info_param.workShiftList[j].id;//已经保存过的排班id

                                    if (id === work_shift_id) {
                                        $this.addClass("choose");
                                        $this.find("img").attr("src", "image/Choosed.png");
                                    }

                                }

                            });

                            schedule_rule_info.checkIsChooseAll();//检查 是否全选

                        }

                        //如果 有数据
                        if ($work_shift_list.find(".item").length > 0) {

                            $work_shift_list.find(".item").first().addClass("active").siblings().removeClass("active");
                            schedule_rule_info.workShiftUserList();//班组人员 列表

                        }

                    }
                    else {
                        //没有班组信息
                        var msg = "<div class='msg_none'>暂无班组信息</div>";
                        $work_shift_list.html(msg);
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
    //班组人员 列表
    workShiftUserList: function () {

        var $work_shift_list = $work_shift_modal.find(".work_shift_list");
        var id = $work_shift_list.find(".item.active").attr("data-id");

        var obj = {
            workShiftId: id
        };
        var url = urlGroup.attendance.schedule_rule_info.work_shift_user+ "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    var tb_data = [];

                    if (data.result && data.result.length > 0) {

                        tb_data = data.result;

                    }

                    //dataTable 初始化
                    schedule_rule_info.initTable(tb_data);	//列表初始化

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
    //初始化 table
    initTable: function (data) {
        // console.log(typeof data);
        // console.log(data);
        // debugger;

        $tb_work_shift_user.bootstrapTable("destroy");
        //表格的初始化
        $tb_work_shift_user.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            data: data,                         //直接从本地数据初始化表格
            // uniqueId: "id",

            //分页
            pagination: false,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            sidePagination: "client",           //分页方式：client 客户端分页，server 服务端分页（*）
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [5, 10, 15],        //可供选择的每页的行数（*）

            //排序
            sortable: true,                     //所有列的排序 是否开启
            sortOrder: "desc",                   //排序方式

            width: "100%",
            height: 250,
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
                    field: "empName",
                    title: "员工姓名",
                    align: "center",
                    class: "empName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return value;
                    }
                },
                {
                    field: "departmentName",
                    title: "部门",
                    align: "center",
                    class: "departmentName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return value;
                    }
                },
                {
                    field: "positionName",
                    title: "岗位",
                    align: "center",
                    class: "positionName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return value;
                    }
                }
            ]

        });

    },
    //全选 班组
    workShiftChooseAll: function () {

        var $item = $work_shift_modal.find(".work_shift_list").find(".item");
        var $choose_container = $work_shift_modal.find(".choose_container");

        if ($choose_container.hasClass("choose")) {
            $choose_container.removeClass("choose");
            $choose_container.find("img").attr("src", "image/UnChoose.png");
            $item.removeClass("choose");
            $item.find("img").attr("src", "image/UnChoose.png");
        }
        else {
            $choose_container.addClass("choose");
            $choose_container.find("img").attr("src", "image/Choosed.png");
            $item.addClass("choose");
            $item.find("img").attr("src", "image/Choosed.png");
        }

    },
    //检查 是否全选
    checkIsChooseAll: function () {
        var $work_shift_list = $work_shift_modal.find(".work_shift_list");
        var $choose_container = $work_shift_modal.find(".choose_container");

        //如果是 全部选中
        if ($work_shift_list.find(".item").length === $work_shift_list.find(".item.choose").length) {
            $choose_container.addClass("choose");
            $choose_container.find("img").attr("src", "image/Choosed.png");
        }
        else {
            $choose_container.removeClass("choose");
            $choose_container.find("img").attr("src", "image/UnChoose.png");
        }

    },
    //保存 考勤员工
    workShiftListSave: function () {

        schedule_rule_info_param.workShiftList = [];
        var $work_shift_list = $work_shift_modal.find(".work_shift_list");

        $work_shift_list.find(".item.choose").each(function () {

            var $this = $(this);

            var obj = {
                id: $this.attr("data-id"),
                name: $this.attr("data-name"),
                staffNumber: $this.attr("data-staffNumber")
            };

            schedule_rule_info_param.workShiftList.push(obj);

        });

        $work_shift_modal.modal("hide");

        schedule_rule_info.initWorkShift();//初始化 考勤员工

    },

    //排班规律 信息 保存
    scheduleRuleSave: function () {

        schedule_rule_info_param.paramSet();//赋值参数

        if (!schedule_rule_info.checkParamByScheduleRuleSave()) {
            return
        }

        var obj = {
            id: schedule_rule_info_param.id,
            name: schedule_rule_info_param.name,
            startTime: schedule_rule_info_param.beginTime,
            endTime: schedule_rule_info_param.endTime,
            isLoopAround: schedule_rule_info_param.isLoop,
            cycle: schedule_rule_info_param.cycle,
            workShiftTypes: schedule_rule_info_param.workTypeList,
            workShifts: schedule_rule_info_param.workShiftList
        };

        loadingInit();

        branPostRequest(
            urlGroup.attendance.schedule_rule_info.set,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (schedule_rule_info_param.id) {
                        toastr.success("排班规则设置完毕，赶快去发布吧!");
                    }
                    // toastr.success("保存成功！");

                    //跳转到 排班规律页面
                    getInsidePageDiv(urlGroup.attendance.schedule_rule.index, 'schedule_rule_new');

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
    //检查排班参数
    checkParamByScheduleRuleSave: function () {
        var flag = false;
        var txt;

        if (!schedule_rule_info_param.name) {
            txt = "排班名称不能为空！"
        }
        else if (!schedule_rule_info_param.beginTime) {
            txt = "请选择开始时间！";
        }
        else if (!schedule_rule_info_param.endTime && !schedule_rule_info_param.isLoop) {
            txt = "请输入结束时间或选择一直循环！";
        }
        else if (schedule_rule_info_param.workShiftList.length <= 0) {
            txt = "请选择考勤员工！"
        }
        else {
            flag = true;
        }

        //排班规律
        for (var i = 0; i < schedule_rule_info_param.workTypeList.length; i++) {

            var id = schedule_rule_info_param.workTypeList[i].id;

            if (!id) {
                toastr.warning("有轮班规律还未选择，请先选择轮班规律！");
                return false;
            }

        }


        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    }


};

//排班规律 参数
var schedule_rule_info_param = {
    id: null,//排班规律 id
    name: null,//排班规律 名称
    beginTime: null,//排班规律 开始时间
    endTime: null,//排班规律 结束时间
    isLoop: null,//排班规律 是否循环 0 不循环 1 循环
    workShiftList: [],//考勤员工 班组列表
    cycle: 0,//排班周期
    workTypeList: [],//排班规律 列表

    init: function () {

    },

    //参数赋值
    paramSet: function () {

        var $row = $schedule_rule_info_container.find(".row");

        //排班时间
        var $schedule_rule_time = $row.find(".schedule_rule_time");
        schedule_rule_info_param.beginTime = $schedule_rule_time.find(".schedule_rule_beginTime").val();
        // schedule_rule_info_param.beginTime = schedule_rule_info_param.beginTime
        //     ? new Date(schedule_rule_info_param.beginTime).getTime() : "";
        schedule_rule_info_param.endTime = $schedule_rule_time.find(".schedule_rule_endTime").val();
        // schedule_rule_info_param.endTime = schedule_rule_info_param.endTime
        //     ? new Date(schedule_rule_info_param.endTime).getTime() : "";
        schedule_rule_info_param.isLoop = $schedule_rule_time.find(".is_loop").hasClass("active") ? 1 : 0;

        //排班名称
        schedule_rule_info_param.name = $schedule_rule_info_container.find(".schedule_name").find("input").val();

        //考勤员工
        schedule_rule_info_param.workShiftList = [];
        var $work_shift = $row.find(".work_shift");
        var $work_shift_list = $work_shift.find(".work_shift_list");//班组列表
        $work_shift_list.find(".item").each(function () {

            var $this = $(this);

            var obj = {
                id: $this.attr("data-id"),
                name: $this.attr("data-name"),
                staffNumber: $this.attr("data-staffNumber")
            };

            schedule_rule_info_param.workShiftList.push(obj);

        });

        //排班周期
        schedule_rule_info_param.cycle = $row.find(".schedule_rule_cycle").find("select").val();

        //排班规律
        schedule_rule_info_param.workTypeList = [];
        var $schedule_rule_laws = $row.find(".schedule_rule_laws");
        $schedule_rule_laws.find(".item").each(function () {

            var $this = $(this);

            var obj = {
                id: $this.attr("data-id"),
                shortName: $this.attr("data-shortName"),
                color: $this.css("background-color")
            };

            schedule_rule_info_param.workTypeList.push(obj);

        });

    }

};

$(function () {

    var id = sessionStorage.getItem("schedule_rule_id");
    schedule_rule_info_param.id = id ? id : null;//排班规律 id

    schedule_rule_info.init();

});

var debug = {

    current_operate: 0,//当前操作 0 禁止输入内容  1 可以输入内容
    workShiftArray: [],//班组id 列表

    //初始化 排班规律信息（禁止输入内容）
    initScheduleRuleInfo: function () {
        schedule_rule.current_operate = 0;

        $schedule_rule_info_container.find(".schedule_rule_cycle select")
            .attr("disabled", "disabled");

    },
    //初始化 排班规律信息（可以输入内容）
    initScheduleRuleInfoEnable: function () {
        schedule_rule.current_operate = 1;//

        $schedule_rule_info_container.find(".schedule_rule_cycle select").removeAttr("disabled");

    },
    //清空 排班规律详情信息
    clearScheduleRuleInfo: function () {
        $schedule_rule_info_container.find(".schedule_rule_cycle select").val(1);//默认周期 1天
        schedule_rule.initScheduleRuleLaws();//初始化 排班规律

        $schedule_rule_info_container.find(".work_shift_list").find("tbody").empty();
        $schedule_rule_info_container.find(".work_shift_list").hide();//隐藏 班组列表

    },
    //检查状态 是否可编辑
    checkIsOperate: function () {
        var flag = false;
        var txt = "";

        if (schedule_rule.current_operate == 0) {
            txt = "当前状态不可操作，目前仅在'新增'、'编辑'状态下可操作！";
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    },

    //初始化 排班规律 列表
    initScheduleRuleList: function () {

        branGetRequest(
            urlGroup.attendance.schedule_rule.list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code == 1000) {

                    if (data.result) {

                        var list = "";
                        var arr = data.result;
                        if (arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var id = item.id;//
                                var version = item.version ? item.version : 0;//
                                var name = "排班规律";//
                                var isPublished = item.isPublished ? item.isPublished : 0;//是否发布

                                list += "<div class='btn btn-white' " +
                                    "data-id='" + id + "' " +
                                    "data-version='" + version + "' " +
                                    "data-isPublished='" + isPublished + "' " +
                                    "onclick='schedule_rule.scheduleRuleDetail(this)'>" + name + "</div>";

                            }

                        }

                        $schedule_rule_list_container.find(".schedule_rule_list").html(list);

                        $schedule_rule_list_container.find(".schedule_rule_list").find(".btn").each(function () {
                            var isPublished = $(this).attr("data-isPublished");

                            if (isPublished == 1) {
                                $(this).addClass("isPublished");

                                var $div = $("<div>");
                                $div.addClass("icon_publish");
                                //$div.text("已发布");
                                $div.appendTo($(this));

                            }

                        });

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
    //初始化 班组列表
    initWorkShiftList: function () {
        var obj = {
            id: schedule_rule_param.id
        };

        var url = urlGroup.schedule_rule_workShift + "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                console.info("获取日志：");
                console.log(data);

                if (data.code == 1000) {
                    $workShift_modal.find(".work_shift_list").empty();

                    if (data.result) {

                        var list = "";
                        var arr = data.result;
                        if (arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var id = item.id;
                                var name = item.name ? item.name : "";
                                list +=
                                    "<div class='border-bottom work_shift_item' " +
                                    "data-id='" + id + "' " +
                                    "onclick='schedule_rule.chooseWorkShift(this)'>" +
                                    "<div class='col-xs-2 center choose_item'>" +
                                    "<img src='image/UnChoose.png'>" +
                                    "</div>" +
                                    "<div class='col-xs-10 work_shift_name'>" + name + "</div>" +
                                    "</div>"

                            }

                        }

                        $workShift_modal.find(".work_shift_list").html(list);
                        schedule_rule.checkWorkShiftIsChoose();//检查 是否有班组被选中

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
    //检查 是否有班组被选中
    checkWorkShiftIsChoose: function () {

        var $item = $workShift_modal.find(".work_shift_list").find(".work_shift_item");
        var arr = [];//班组 id  数组

        //如果已有班组被选中
        if (schedule_rule.workShiftArray.length > 0 && $item.length > 0) {

            for (var i = 0; i < $item.length; i++) {
                var workShift_id = $item.eq(i).attr("data-id");//
                arr.push(workShift_id);
            }

            for (var j = 0; j < schedule_rule.workShiftArray.length; j++) {
                var id = schedule_rule.workShiftArray[j];

                var index = arr.indexOf(id);
                //如果 id存在
                if (index > -1) {
                    $item.eq(index).addClass("active");
                    $item.eq(index).find("img").attr("src", "image/Choosed.png");
                }

            }

        }

    },


    //新增排班规律 显示框显示
    scheduleAddShow: function () {

        var length = $schedule_rule_list_container.find(".schedule_rule_list .btn").length;
        if (length >= 10) {
            toastr.warning("最多新增10个排班规律！");
            return
        }

        schedule_rule.workShiftArray = [];
        schedule_rule_param.id = "";
        schedule_rule_param.version = "";

        $schedule_rule_list_container.find(".btn_add_modal").show();
        $schedule_rule_list_container.find(".active").removeClass("active");//移除 排班规律的选择
        schedule_rule.initScheduleRuleInfoEnable();//初始化 排班规律信息（可以输入内容）
        schedule_rule.clearScheduleRuleInfo();//清空 排班规律详情信息

    },

    //获取 排班规律 详情
    scheduleRuleDetail: function (self) {
        schedule_rule.workShiftArray = [];
        $schedule_rule_list_container.find(".btn_add_modal").hide();//隐藏 新增显示框
        schedule_rule.clearScheduleRuleInfo();//清空 排班规律详情信息
        schedule_rule.initScheduleRuleInfoEnable();//初始化 排班规律信息（可以输入内容）

        $(self).addClass("active").siblings().removeClass("active");
        var $schedule_rule_laws = $schedule_rule_info_container.find(".schedule_rule_laws");
        schedule_rule_param.id = $(self).attr("data-id");
        schedule_rule_param.version = $(self).attr("data-version");
        //console.log(schedule_rule_param)

        var obj = {
            id: schedule_rule_param.id
        };
        var url = urlGroup.schedule_rule_detail + "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //console.info("获取最新发布的规则：");
                //console.log(data);

                if (data.code == 1000) {

                    if (data.result) {

                        $schedule_rule_laws.empty();//轮班规律 清空

                        var cycle = data.result.cycle ? data.result.cycle : 1;//排班周期
                        var workTypeList = data.result.workTypeList ?
                            data.result.workTypeList : [];//轮班规律
                        var workShiftList = data.result.workShiftList ?
                            data.result.workShiftList : [];//班组设置

                        $schedule_rule_info_container.find(".schedule_rule_cycle select").val(cycle);


                        //轮班规律
                        if (workTypeList.length > 0) {
                            for (var i = 0; i < workTypeList.length; i++) {
                                var item = workTypeList[i];

                                var id = item.id ? item.id : "";
                                var color = item.color ? item.color : "";
                                var shortName = item.shortName ? item.shortName : "";

                                var $div = $("<div>");
                                $div.addClass("item");
                                $div.attr("data-id", id);
                                $div.css("background-color", color);
                                $div.text(shortName);
                                $div.attr("onclick", "schedule_rule.chooseScheduleShow(event,this)");

                                $div.appendTo($schedule_rule_laws);

                            }
                        }

                        //班组设置
                        if (workShiftList.length > 0) {
                            var list = "";
                            for (var j = 0; j < workShiftList.length; j++) {
                                var work_shift_item = workShiftList[j];

                                var work_shift_id = work_shift_item.id ? work_shift_item.id : "";
                                var name = work_shift_item.name ? work_shift_item.name : "";
                                var executeTime = work_shift_item.executeTime ? work_shift_item.executeTime : "";

                                schedule_rule.workShiftArray.push(work_shift_id);

                                list += "<tr class='item' data-id='" + work_shift_id + "'>" +
                                    "<td class='work_shift_name'>" + name + "</td>" +
                                    "<td class='begin_date'>" +
                                    "<input class='form-control layer-date' " +
                                    "id='work_shift_" + work_shift_id + "' " +
                                    "placeholder='YYYY-MM-DD' value='" + executeTime + "'>" +
                                    "</td>" +
                                    "</tr>"

                            }

                            var $work_shift_list = $schedule_rule_info_container.find(".work_shift_list");
                            $work_shift_list.show();
                            $work_shift_list.find("table tbody").html(list);

                        }

                        //初始化 时间
                        schedule_rule.initTime();

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

    //班组列表显示
    workShiftModalShow: function () {
        //检查是否可操作
        if (!schedule_rule.checkIsOperate()) {
            return
        }

        $workShift_modal.modal("show");

    },
    //选择 班组
    chooseWorkShift: function (self) {

        if ($(self).hasClass("active")) {
            $(self).removeClass("active");
            $(self).find("img").attr("src", "image/UnChoose.png");
        }
        else {
            $(self).addClass("active");
            $(self).find("img").attr("src", "image/Choosed.png");
        }

    },
    //选择班组后 保存
    workShiftSave: function () {
        $workShift_modal.modal("hide");
        var $work_shift_list = $schedule_rule_info_container.find(".work_shift_list");
        $work_shift_list.show();
        $work_shift_list.find("table tbody").empty();

        schedule_rule.workShiftArray = [];

        var list = "";
        var $item = $workShift_modal.find(".work_shift_list .work_shift_item");
        for (var i = 0; i < $item.length; i++) {

            if ($item.eq(i).hasClass("active")) {
                var id = $item.eq(i).attr("data-id");
                var name = $item.eq(i).find(".work_shift_name").html();

                schedule_rule.workShiftArray.push(id);

                list += "<tr data-id='" + id + "'>" +
                    "<td class='work_shift_name'>" + name + "</td>" +
                    "<td class='begin_date'>" +
                    "<input class='form-control layer-date' " +
                    "id='work_shift_" + id + "' " +
                    "placeholder='YYYY-MM-DD'>" +
                    "</td>" +
                    "</tr>";

            }

        }

        $work_shift_list.find("table tbody").html(list);

        setTimeout(function () {
            //初始化 时间
            schedule_rule.initTime();
        }, 500);

    },

    //排班规律 保存(新增、编辑)
    scheduleRuleSave: function () {

        if (!schedule_rule.checkIsOperate()) {
            return
        }
        if (!schedule_rule.checkIsNull()) {
            return
        }

        var obj = {
            id: schedule_rule_param.id,
            version: schedule_rule_param.version,
            cycle: $schedule_rule_info_container.find(".schedule_rule_cycle select").val(),
            workTypeList: schedule_rule_param.workTypeList,
            workShiftList: schedule_rule_param.workShiftList
        };

        loadingInit();

        branPostRequest(
            urlGroup.schedule_rule_set,
            obj,
            function (data) {

                if (data.code == 1000) {
                    var msg = data.msg ? data.msg : "设置成功";
                    toastr.success(msg);

                    //schedule_rule.initScheduleRuleList();//初始化 排班规律 列表
                    //
                    //如果是 新增
                    //if (!schedule_rule_param.id) {
                    //	schedule_rule.initParams();//初始化 参数
                    //	//schedule_rule.initScheduleRuleList();//初始化 排班规律 列表
                    //	schedule_rule.initScheduleRuleInfo();//初始化 排班规律信息（禁止输入内容）
                    //	schedule_rule.clearScheduleRuleInfo();//清空 排班规律详情信息
                    //}

                    schedule_rule.initParams();//初始化 参数
                    schedule_rule.initScheduleRuleList();//初始化 排班规律 列表
                    schedule_rule.initScheduleRuleInfo();//初始化 排班规律信息（禁止输入内容）
                    schedule_rule.clearScheduleRuleInfo();//清空 排班规律详情信息

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
    //检查输入 内容是否正确
    checkIsNull: function () {
        var flag = true;
        schedule_rule_param.workShiftList = [];//班组 列表
        schedule_rule_param.workTypeList = [];//班次 列表

        var $schedule_rule_item = $schedule_rule_info_container.find(".schedule_rule_laws").find(".item");
        var $work_shift_item = $schedule_rule_info_container.find(".work_shift_list").find("tbody tr");

        //排班规律
        for (var i = 0; i < $schedule_rule_item.length; i++) {

            var schedule_id = $schedule_rule_item.eq(i).attr("data-id");
            var order = $schedule_rule_item.eq(i).index();

            if (!schedule_id) {
                toastr.warning("有轮班规律还未选择，请先选择轮班规律！");
                return false;
            }

            var obj = {
                id: schedule_id,
                order: order
            };
            schedule_rule_param.workTypeList.push(obj);

        }

        //是否选择过 班组
        if ($schedule_rule_info_container.find(".work_shift_list").is(":hidden")) {
            toastr.warning("请选择班组！");
            return false
        }

        //班组
        for (var j = 0; j < $work_shift_item.length; j++) {

            var work_shift_id = $work_shift_item.eq(j).attr("data-id");
            var begin_date = $work_shift_item.eq(j).find(".begin_date input").val();

            if (begin_date == "") {
                toastr.warning("有班组开始时间还未设置，请先设置班组开始时间！");
                return false;
            }

            //如果 输入了开始时间
            if (begin_date) {

                var obj = {
                    id: work_shift_id,
                    executeTime: begin_date
                };

                schedule_rule_param.workShiftList.push(obj);

            }

        }

        return flag

    }
};
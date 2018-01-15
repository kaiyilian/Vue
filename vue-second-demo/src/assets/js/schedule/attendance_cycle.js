/**
 * Created by Administrator on 2017/10/17.
 * 出勤周期 配置
 */

var $attendance_setting_container = $(".attendance_setting_container");//考勤设置container
var $attendance_cycle = $attendance_setting_container.find("#attendance_cycle");//考勤周期
var $tb_attendance_cycle = $attendance_cycle.find("#tb_attendance_cycle");//出勤周期  table

var $attendance_cycle_modal = $(".attendance_cycle_modal");//考勤周期 modal
var $bind_manager_modal = $(".bind_manager_modal");//绑定管理员 modal

//考勤周期
var attendance_cycle = {

    cur_operate: "",//当前操作 modify、add

    init: function () {

        attendance_cycle.initWorkShiftList();//初始化 班组列表

        attendance_cycle.attendCycleList();//清空 列表

        //考勤配置信息 弹框
        $attendance_cycle_modal.on("show.bs.modal", function () {

            var $row = $attendance_cycle_modal.find(".modal-body > .row");

            var options = "";
            for (var i = 1; i <= 30; i++) {
                options += "<option value='" + i + "'>" + i + "</option>";
            }
            options += "<option value='31'>月底最后一天</option>";

            //初始化 开始时间、结束时间
            $row.find(".attend_start select").html(options);
            $row.find(".attend_end select").html(options);

            //初始化 次日按钮
            $row.find(".is_next_month").removeClass("active")
                .find("img").attr("src", "image/UnChoose.png");

            //判断 新增、编辑
            if (attendance_cycle.cur_operate === "modify") {
                attendance_cycle.attendSetDetail();//获取 该条配置的详细信息
            }
            else if (attendance_cycle.cur_operate === "add") {
                attendance_cycle.initAttendCycleInModal();//初始化 出勤周期（弹框中）
            }

        });

        //绑定管理员 弹框
        $bind_manager_modal.on("show.bs.modal", function () {

            var $row = $bind_manager_modal.find(".modal-body > .row");

            $row.find(".manager_name input").val("");
            $row.find(".manager_phone input").val("");

            //获取管理员信息
            attendance_cycle.managerInfoGet();

        });

    },

    //初始化 班组列表
    initWorkShiftList: function () {
        var $search_container = $attendance_cycle.find(".search_container");
        var $workShift_container = $search_container.find(".workShift_container");

        branGetRequest(
            urlGroup.attendance.setting.workShift_list,
            function (data) {
                //alert(JSON.stringify(data))
                if (data.code === RESPONSE_OK_CODE) {

                    var list = "<option value=''>全部</option>";//班组列表
                    var result = data.result;//
                    if (!result) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var workShift_id = item.work_shift_id;//
                            var workShift_name = item.work_shift_name;//
                            list += "<option value='" + workShift_id + "'>" + workShift_name + "</option>";
                        }
                    }

                    $workShift_container.find("select").html(list);

                }
                else {
                    toastr.warning(data.msg);
                }
            },
            function (error) {
                toastr.error("error:" + JSON.stringify(error));
            }
        );

    },
    //初始化 出勤周期（弹框中）
    initAttendCycleInModal: function () {
        var $row = $attendance_cycle_modal.find(".modal-body > .row");

        //初始化 班组
        $row.find(".workShift_list .workShift_item").each(function () {

            var $this = $(this);
            $this.unbind("click").bind("click", function () {

                $this.hasClass("active")
                    ? $this.removeClass("active")
                    : $this.addClass("active");
            });

        });

        //初始化 次日按钮
        $row.find(".is_next_month").unbind("click").bind("click", function () {

            var $this = $(this);
            if ($this.hasClass("active")) {
                $this.removeClass("active");
                $this.find("img").attr("src", "image/UnChoose.png");
            }
            else {
                $this.addClass("active");
                $this.find("img").attr("src", "image/Choosed.png");
            }

        });

    },

    //查询按钮 点击事件
    btnSearchClick: function () {
        attendance_cycle.currentPage = 1;
        attendance_cycle.attendCycleList();//获取 列表
    },
    //获取 列表
    attendCycleList: function () {

        $tb_attendance_cycle.bootstrapTable("destroy");
        //表格的初始化
        $tb_attendance_cycle.bootstrapTable({

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
                    field: "",
                    title: "序号",
                    align: "center",
                    class: "",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        return "<div>" + (index + 1) + "</div>";
                    }
                },
                {
                    field: "attendance_cycle",
                    title: "出勤周期",
                    align: "center",
                    class: "attendance_cycle",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        html += row.cycleStart + "日" + "~";
                        html += (row.cycleEnd == 31 ? "月底" : (row.cycleEnd + "日")) +
                            (row.isNextMonth ? "(次月)" : "");

                        return html;
                    }
                },
                {
                    field: "workShifts",
                    title: "班组",
                    align: "center",
                    class: "workShifts",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";

                        //班组 列表
                        for (var j = 0; j < value.length; j++) {
                            var item = value[j];

                            var w_id = item.workShiftId ? item.workShiftId : "";//
                            var w_name = item.workShiftName ? item.workShiftName : "";//

                            if (html) {
                                html += "," + "<span data-id='" + w_id + "'>" +
                                    w_name + "</span>";
                            }
                            else {
                                html += "<span data-id='" + w_id + "'>" +
                                    w_name + "</span>";
                            }

                        }

                        return html;
                    }
                },
                {
                    field: "operate",
                    title: "操作",
                    align: "center",
                    class: "operate",
                    formatter: function (value, row, index) {

                        var html = "";
                        html += "<div class='operate'>";

                        //编辑
                        html += "<div class='btn btn-success btn-sm btn_modify'>编辑</div>";

                        //删除
                        html += "<div class='btn btn-success btn-sm btn_del'>删除</div>";

                        html += "</div>";

                        return html;

                    },
                    events: {

                        //编辑
                        "click .btn_modify": function (e, value, row, index) {

                            attendance_cycle.cur_operate = "modify";
                            attendance_cycle_param.id = row.id;//出勤周期 id

                            $attendance_cycle_modal.modal("show");

                        },
                        //删除
                        "click .btn_del": function (e, value, row, index) {

                            attendance_cycle_param.id = row.id;//出勤周期 id

                            delWarning("是否确认删除该条配置？", function () {

                                var obj = {
                                    work_attendance_setting_id: row.id
                                };

                                loadingInit();

                                var url = urlGroup.attendance.setting.cycle.del+ "?" + jsonParseParam(obj);

                                branGetRequest(
                                    url,
                                    function (data) {
                                        //console.info("获取日志：");
                                        //console.log(data);

                                        if (data.code === RESPONSE_OK_CODE) {
                                            toastr.success("刪除成功！");

                                            //删除对应数据
                                            $tb_attendance_cycle.bootstrapTable('remove', {
                                                field: 'id',
                                                values: [row.id]
                                            });

                                        }
                                        else {
                                            toastr.warning(data.msg)
                                        }

                                    },
                                    function (error) {
                                        toastr.error(error)
                                    }
                                );

                            })

                        }

                    }
                }

            ],

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.attendance.setting.cycle.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize,
                    workShiftId: $attendance_cycle.find(".workShift_container").find("select option:selected").val()
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

                        var arr = res.result.workAttendaceSettings;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var $item = arr[i];

                                var id = $item.id ? $item.id : "";//
                                var cycleStart = $item.cycleStart ? $item.cycleStart : "";//
                                var cycleEnd = $item.cycleEnd ? $item.cycleEnd : "";//
                                var isNextMonth = $item.isNextMonth ? $item.isNextMonth : 0;//
                                var workShifts = $item.workShifts ? $item.workShifts : [];//

                                var obj = {
                                    id: id,
                                    cycleStart: cycleStart,
                                    cycleEnd: cycleEnd,
                                    isNextMonth: isNextMonth,

                                    workShifts: workShifts
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

    //获取 该条配置的详细信息
    attendSetDetail: function () {

        var obj = {
            work_attendance_setting_id: attendance_cycle_param.id
        };

        var url = urlGroup.attendance.setting.cycle.detail+ "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var $row = $attendance_cycle_modal.find(".modal-body > .row");
                        var $workShift_list = $row.find(".workShift_list");//班组列表
                        $workShift_list.empty();

                        var $item = data.result;
                        var id = $item.id ? $item.id : "";
                        var cycleStart = $item.cycleStart ? $item.cycleStart : "1";
                        var cycleEnd = $item.cycleEnd ? $item.cycleEnd : "1";
                        var isNextMonth = $item.isNextMonth ? $item.isNextMonth : 0;
                        var workShifts = $item.workShifts ? $item.workShifts : [];

                        for (var i = 0; i < workShifts.length; i++) {
                            var $workShift_item = workShifts[i];

                            var workShift_id = $workShift_item.workShiftId ? $workShift_item.workShiftId : "";
                            var name = $workShift_item.workShiftName ? $workShift_item.workShiftName : "";
                            var isUsed = $workShift_item.isUsed ? $workShift_item.isUsed : 0;

                            var $div = $("<div>");
                            $div.appendTo($workShift_list);
                            $div.addClass("workShift_item");
                            $div.attr("data-id", workShift_id);
                            $div.attr("data-isUsed", isUsed);
                            $div.html(name);
                            if (isUsed == 1) {
                                $div.addClass("active");
                            }

                        }

                        //初始化 开始时间、结束时间
                        $row.find(".attend_start select").val(cycleStart);
                        $row.find(".attend_end select").val(cycleEnd);

                        //初始化 次日按钮
                        if (isNextMonth) {
                            $row.find(".is_next_month").addClass("active")
                                .find("img").attr("src", "image/Choosed.png");
                        }

                        attendance_cycle.initAttendCycleInModal();//初始化 出勤周期（弹框中）
                    }

                }
                else {
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },

    //出勤配置 新增弹框显示
    attendSetAddModalShow: function () {
        attendance_cycle.cur_operate = "add";
        attendance_cycle_param.id = "";//出勤周期 id置空

        attendance_cycle.workShiftEnableList();//获取 可用的班组

    },
    //获取 可用的班组
    workShiftEnableList: function () {

        branGetRequest(
            urlGroup.attendance.setting.cycle.workShift_enable,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.length > 0) {

                        var list = "";
                        for (var i = 0; i < data.result.length; i++) {
                            var $item = data.result[i];

                            var id = $item.id ? $item.id : "";
                            var version = $item.version ? $item.version : "";
                            var name = $item.name ? $item.name : "";

                            list +=
                                "<div class='workShift_item' " +
                                "data-id='" + id + "' " +
                                "data-version='" + version + "' " +
                                ">" + name + "</div>";

                        }

                        var $row = $attendance_cycle_modal.find(".modal-body > .row");
                        $row.find(".workShift_list").empty().html(list);

                        $attendance_cycle_modal.modal("show");//弹框显示

                    }
                    else {
                        toastr.warning("暂无班组可用！");
                    }

                }
                else {
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },

    //出勤配置 保存
    attendSetSave: function () {

        if (!attendance_cycle.checkAttendSetParam()) {
            return
        }

        var obj = {
            id: attendance_cycle_param.id,
            cycleStart: attendance_cycle_param.cycleStart,
            cycleEnd: attendance_cycle_param.cycleEnd,
            isNextMonth: attendance_cycle_param.isNextMonth,
            workShiftId: attendance_cycle_param.workShiftId
        };

        //console.log(obj);

        loadingInit();

        branPostRequest(
            urlGroup.attendance.setting.cycle.save,
            obj,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    $attendance_cycle_modal.modal("hide");
                    toastr.success("保存成功！");

                    var $search_container = $attendance_cycle.find(".search_container");
                    var $workShift_container = $search_container.find(".workShift_container");
                    $workShift_container.find("select").val("");

                    attendance_cycle.btnSearchClick();//查询按钮

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
    //检查 出勤配置 保存参数
    checkAttendSetParam: function () {

        attendance_cycle_param.paramInit();//初始化 参数列表

        var flag = false;
        var txt = "";

        var $row = $attendance_cycle_modal.find(".modal-body > .row");
        attendance_cycle_param.cycleStart = parseInt($.trim($row.find(".attend_start select").val()));
        attendance_cycle_param.cycleEnd = parseInt($.trim($row.find(".attend_end select").val()));
        attendance_cycle_param.isNextMonth = $row.find(".is_next_month").hasClass("active") ? 1 : 0;
        for (var i = 0; i < $row.find(".workShift_list .active").length; i++) {

            var $item = $row.find(".workShift_list .active").eq(i);

            var id = $item.attr("data-id") ? $item.attr("data-id") : "";
            attendance_cycle_param.workShiftId.push(id);

        }

        if (attendance_cycle_param.workShiftId.length <= 0) {
            txt = "请选择班组！";
        }
        else if (!attendance_cycle_param.isNextMonth &&
            attendance_cycle_param.cycleStart >= attendance_cycle_param.cycleEnd) {
            txt = "开始时间不能大于等于结束时间！";
        }
        else {
            flag = true;
        }

        if (txt)
            toastr.warning(txt);

        return flag;

    },

    //绑定管理员 弹框显示
    bindManagerModalShow: function () {
        $bind_manager_modal.modal("show");
    },
    //获取 管理员信息
    managerInfoGet: function () {

        branGetRequest(
            urlGroup.attendance.setting.cycle.manager_info,
            function (data) {
                //console.log("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE && data.result) {

                    var $item = data.result;

                    var id = $item.id ? $item.id : "";
                    var name = $item.name ? $item.name : "";
                    var tel = $item.tel ? $item.tel : "";

                    var $row = $bind_manager_modal.find(".modal-body > .row");

                    $row.find(".manager_name").attr("data-id", id);
                    $row.find(".manager_name input").val(name);
                    $row.find(".manager_phone input").val(tel);


                }
                else {
                    //console.log("获取日志-----error：");
                    //console.log(data.msg);

                    toastr.warning(data.msg);
                }
            },
            function (error) {
                toastr.error(error);
            }
        );

    },
    //綁定管理員
    bindManager: function () {

        if (!attendance_cycle.checkManagerParam()) {
            return
        }

        var $row = $bind_manager_modal.find(".modal-body > .row");
        var id = $row.find(".manager_name").attr("data-id");
        id = id ? id : "";
        var name = $.trim($row.find(".manager_name input").val());
        var phone = $.trim($row.find(".manager_phone input").val());

        var obj = {
            id: id,
            name: name,
            tel: phone
        };

        loadingInit();

        branPostRequest(
            urlGroup.attendance.setting.cycle.manager_bind,
            obj,
            function (data) {
                // console.info("获取日志：");
                // console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    $bind_manager_modal.modal("hide");
                    toastr.success("绑定成功！");

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
    //检查 管理員 保存参数
    checkManagerParam: function () {

        var flag = false;
        var txt = "";
        var phone_reg = /^(13[0-9]|14[5|7]|15[^4]|17[6-8]|18[0-9])[0-9]{8}$/;

        var $row = $bind_manager_modal.find(".modal-body > .row");
        var name = $.trim($row.find(".manager_name input").val());
        var phone = $.trim($row.find(".manager_phone input").val());

        if (!name) {
            txt = "请输入姓名！";
        }
        else if (!phone) {
            txt = "请输入手机号！";
        }
        else if (!phone_reg.test(phone)) {
            txt = "手机号输入错误！";
        }
        else {
            flag = true;
        }

        if (txt)
            toastr.warning(txt);

        return flag

    }

};
//考勤周期 - 参数
var attendance_cycle_param = {

    id: "",
    cycleStart: "",
    cycleEnd: "",
    isNextMonth: 0,//0 false 1 true
    workShiftId: [],	//班组 id列表

    //初始化 参数列表
    paramInit: function () {

        attendance_cycle_param.cycleStart = "";
        attendance_cycle_param.cycleEnd = "";
        attendance_cycle_param.isNextMonth = 0;
        attendance_cycle_param.workShiftId = [];

    }

};

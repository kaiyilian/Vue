/**
 * Created by Administrator on 2017/9/11.
 * 排班规律
 */

var $schedule_rule_container = $(".schedule_rule_container");//排班规律 container
var $tb_schedule_rule = $schedule_rule_container.find("#tb_schedule_rule");//表格table
var $schedule_rule_list_modal = $(".schedule_rule_list_modal");//排班规律 列表 弹框

var schedule_rule = {

    //初始化
    init: function () {

        schedule_rule.scheduleViewList();//获取 列表

    },

    //获取 列表
    initColumns: function () {

        //手动拼接columns数组
        var columns = [];

        columns.push({
            field: "name",
            title: "排班名称",
            align: "center",
            class: "name",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "<div>" + value + "</div>";

                return html;
            }
        });
        columns.push({
            field: "startTime",
            title: "开始时间",
            align: "center",
            class: "startTime",
            formatter: function (value, row, index) {
                // console.log(value);

                var html = "<div>" + value + "</div>";

                return html;
            }
        });
        columns.push({
            field: "endTime",
            title: "结束时间",
            align: "center",
            class: "endTime",
            formatter: function (value, row, index) {

                var html = "<div>" + value + "</div>";

                //如果一直循环
                if (row.isLoopAround) {
                    html = "<div>一直循环</div>";
                }

                return html;
            }
        });
        columns.push({
            field: "cycle",
            title: "排班周期",
            align: "center",
            class: "cycle",
            formatter: function (value, row, index) {

                if (value) {
                    value += "天";
                }
                else {
                    value = "";
                }

                return value;
            }
        });
        columns.push({
            // width: "600",
            field: "workShiftTypes",
            title: "排班规律",
            align: "center",
            class: "workShiftTypes",
            formatter: function (value, row, index) {

                var html = "<div class='workShiftTypes'>";
                if (value && value.length > 0) {

                    var length = value.length > 7 ? 7 : value.length;//判断排版规律 是否大于7天

                    for (var i = 0; i < length; i++) {
                        var $item = value[i];

                        html += "<div class='schedule_item' " +
                            "style='background-color: " + $item.color + "' " +
                            "data-id='" + $item.id + "' " +
                            ">" +
                            $item.shortName +
                            "</div>";

                    }

                    if (value.length > 7) {
                        html += "<div class='more'>更多</div>";
                    }

                }

                html += "</div>";

                return html;
            },
            events: {

                //更多
                "click .more": function (e, value, row, index) {

                    var obj = {
                        ruleId: row.id
                    };

                    loadingInit();

                    branPostRequest(
                        urlGroup.attendance.schedule_rule.list_type,
                        obj,
                        function (data) {
                            //alert(JSON.stringify(data))

                            if (data.code === RESPONSE_OK_CODE) {

                                $schedule_rule_list_modal.modal("show");

                                var arr = data.result ? data.result : [];//排班规律 数组

                                var $modal_body = $schedule_rule_list_modal.find(".modal-body");
                                $modal_body.empty();

                                if (arr.length > 0) {

                                    var row_real_length = Math.floor(arr.length / 7);//满足一行7条 的 行数
                                    if (row_real_length > 0) {

                                        for (var i = 0; i < row_real_length; i++) {

                                            //行
                                            var $row = $("<div>");
                                            $row.addClass("row");
                                            $row.appendTo($modal_body);

                                            //txt
                                            var txt_name = (i * 7 + 1) + "-" + (i * 7 + 7) + "天：";
                                            var $txt = $("<div>");
                                            $txt.addClass("txt");
                                            $txt.appendTo($row);
                                            $txt.text(txt_name);

                                            //work_type_list
                                            var $work_type_list = $("<div>");
                                            $work_type_list.addClass("work_type_list");
                                            $work_type_list.appendTo($row);

                                            for (var j = 0; j < 7; j++) {

                                                var index = i * 7 + j;

                                                var item = arr[index];//当前的那天的 数组item
                                                if (item) {
                                                    var color = arr[index].color ? arr[index].color : "";//
                                                    var shortName = arr[index].shortName ? arr[index].shortName : "";//

                                                    var $item = $("<div>");
                                                    $item.addClass("item");
                                                    $item.appendTo($work_type_list);
                                                    $item.css("background-color", color);
                                                    $item.text(shortName);
                                                }

                                            }

                                        }

                                    }

                                    //最后一行的 item 数量
                                    var row_last_length = arr.length - (row_real_length * 7);
                                    if (row_last_length > 0) {

                                        //行
                                        var $row = $("<div>");
                                        $row.addClass("row");
                                        $row.appendTo($modal_body);

                                        //txt
                                        var txt_name = (row_real_length * 7 + 1) + "-" + arr.length + "天：";
                                        var $txt = $("<div>");
                                        $txt.addClass("txt");
                                        $txt.appendTo($row);
                                        $txt.text(txt_name);

                                        //work_type_list
                                        var $work_type_list = $("<div>");
                                        $work_type_list.addClass("work_type_list");
                                        $work_type_list.appendTo($row);

                                        for (var k = 0; k < row_last_length; k++) {

                                            var index = row_real_length * 7 + k;

                                            var item = arr[index];//当前的那天的 数组item
                                            if (item) {
                                                var color = arr[index].color ? arr[index].color : "";//
                                                var shortName = arr[index].shortName ? arr[index].shortName : "";//

                                                var $item = $("<div>");
                                                $item.addClass("item");
                                                $item.appendTo($work_type_list);
                                                $item.css("background-color", color);
                                                $item.text(shortName);
                                            }

                                        }

                                    }

                                }
                                else {
                                    var msg = "<div class='msg_none'>暂无数据</div>";
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
            // width: "400",
            field: "operate",
            title: "操作",
            align: "center",
            class: "operate",
            formatter: function (value, row, index) {

                var html = "";
                html += "<div class='operate'>";

                if (row.isUse) {
                    //启用状态
                    html += "<div class='togglebutton'>" +
                        "<label>" +
                        "<input type='checkbox' checked/>" +
                        "<span class='toggle'></span>" +
                        "</label>" +
                        "</div>";
                    html += "<div class='txt'>启用中</div>";
                }
                else {
                    //启用状态
                    html += "<div class='togglebutton'>" +
                        "<label>" +
                        "<input type='checkbox' />" +
                        "<span class='toggle'></span>" +
                        "</label>" +
                        "</div>";
                    html += "<div class='txt'>关闭中</div>";
                }

                //编辑 开启中
                if (row.isUse) {
                    html += "<div class='btn btn-success btn-sm btn_modify'>编辑</div>";
                }
                else {
                    html += "<div class='btn btn-default btn-sm btn_modify'>编辑</div>";
                }

                //删除
                if (row.isUse) {
                    html += "<div class='btn btn-default btn-sm btn_del'>删除</div>";
                }
                else {
                    html += "<div class='btn btn-success btn-sm btn_del'>删除</div>";
                }


                html += "</div>";

                return html;

            },
            events: {

                //启用/关闭
                "click .toggle": function (e, value, row, index) {

                    // console.log(e);
                    var $e = $(e.currentTarget);

                    //点击开关之前的状态
                    var status = $e.siblings("input").is(":checked");
                    var txt = status ? "当前排班已关闭！" : "当前排班已开启！";

                    var obj = {
                        ruleId: row.id,
                        isUser: status ? 0 : 1
                    };

                    loadingInit();

                    branPostRequest(
                        urlGroup.attendance.schedule_rule.status_modify,
                        obj,
                        function (data) {
                            //alert(JSON.stringify(data))

                            if (data.code === RESPONSE_OK_CODE) {
                                // toastr.success("状态更改成功！");

                                msgShow(txt);

                                $tb_schedule_rule.bootstrapTable("updateRow", {
                                    index: index,
                                    row: {
                                        isUse: obj.isUser
                                    }
                                });

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
                //编辑
                "click .btn_modify": function (e, value, row, index) {

                    //判断当前规律 是否使用
                    if (!row.isUse) {
                        toastr.warning("排班规律没有使用，无法编辑！");
                        return;
                    }

                    // alert("跳转到详情页！");
                    sessionStorage.setItem("schedule_rule_id", row.id);//排班规则id
                    getInsidePageDiv(urlGroup.attendance.schedule_rule_info.index, 'schedule_rule_info');

                },
                //删除
                "click .btn_del": function (e, value, row, index) {

                    //判断当前规律 是否使用
                    if (row.isUse) {
                        toastr.warning("排班规律正在使用中，无法删除！");
                        return;
                    }

                    delWarning(
                        "确定要删除该排班规律吗？",
                        function () {

                            var obj = {
                                "ruleId": row.id
                            };

                            loadingInit();

                            branPostRequest(
                                urlGroup.attendance.schedule_rule.del,
                                obj,
                                function (data) {
                                    //alert(JSON.stringify(data))

                                    if (data.code === RESPONSE_OK_CODE) {
                                        toastr.success("删除成功！");

                                        // $tb_schedule_rule.bootstrapTable("updateRow", {
                                        //     index: $tb_schedule_rule.row.index,
                                        //     row: {}
                                        // });

                                        //删除对应数据
                                        $tb_schedule_rule.bootstrapTable('remove', {
                                            field: 'id',
                                            values: [row.id]
                                        });


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
                    )


                }

            }
        });

        return columns;

    },
    //获取 排班规律
    scheduleViewList: function () {

        loadingInit();

        var columns = schedule_rule.initColumns();//获取 列表

        $tb_schedule_rule.bootstrapTable("destroy");
        //表格的初始化
        $tb_schedule_rule.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            // data: data,                         //直接从本地数据初始化表格
            uniqueId: "id",

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
            url: urlGroup.attendance.schedule_rule.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                var obj = {
                    // page: params.pageNumber,
                    // page_size: params.pageSize
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

                        total_rows = res.result.length ? res.result.length : 0;//总条数

                        var arr = res.result;
                        for (var i = 0; i < arr.length; i++) {

                            var $item = arr[i];

                            var id = $item.id ? $item.id : "";//
                            var name = $item.name ? $item.name : "";//
                            var startTime = $item.executeTime ? $item.executeTime : "";//
                            startTime = timeInit(startTime);
                            var endTime = $item.executeEndTime ? $item.executeEndTime : "";//
                            endTime = timeInit(endTime);
                            var isLoopAround = $item.isLoopAround ? $item.isLoopAround : 0;//
                            var cycle = $item.cycle ? $item.cycle : 0;//
                            var workShiftTypes = $item.workShiftTypes ? $item.workShiftTypes : [];//
                            var isUse = $item.isUse ? $item.isUse : 0;//排版是否启用 0：不启用 1：启用

                            var obj = {

                                index: i,//

                                id: id,
                                name: name,
                                startTime: startTime,
                                endTime: endTime,
                                isLoopAround: isLoopAround,
                                cycle: cycle,
                                workShiftTypes: workShiftTypes,
                                isUse: isUse

                            };

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

            }

        });

    },

    //进入 排班规律信息 页面
    goScheduleRuleInfoPage: function () {

        sessionStorage.setItem("schedule_rule_id", "");//新增情况下，排班规则id 为空
        getInsidePageDiv(urlGroup.attendance.schedule_rule_info.index, 'schedule_rule_info');

    }

};

$(function () {
    schedule_rule.init();
});



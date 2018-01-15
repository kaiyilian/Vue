/**
 * Created by Administrator on 2017/10/18.
 * 审批管理
 */

var $approval_manage_container = $(".approval_manage_container");//
var $tb_approval_manage = $approval_manage_container.find("#tb_approval_manage");//审批管理 表格
var $approval_info_modal = $(".approval_info_modal");//审批单 弹框

var approval_manage = {

    approval_type_map: null,//审批 类型 map
    approval_detail_type_map: null,//审批明细 类型 map
    approval_status_map: null,//处理状态 map

    //初始化
    init: function () {

        approval_manage.initTime();//初始化 时间
        approval_manage.initApprovalStatus();//初始化 处理状态
        approval_manage.initApprovalType();//初始化 审批分类
        approval_manage.initApprovalDetailType();//初始化 审批明细 类型
        approval_manage.initUserList();//初始化 用户列表

        approval_manage.approvalList();//查询

        // $approval_info_modal.modal("show");

    },

    //初始化 时间
    initTime: function () {
        var $search_container = $approval_manage_container.find(".search_container");

        var begin = {
            elem: "#approval_beginTime",
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
        var end = {
            elem: "#approval_endTime",
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

        laydate(begin);
        laydate(end);

        var now = new Date().toLocaleDateString().replace(/\//g, '-');
        $search_container.find(".endTime").val(now);

        var dd = new Date();
        dd.setDate(dd.getDate() - 15);//获取15天前的日期
        dd = new Date(dd).toLocaleDateString().replace(/\//g, '-');
        $search_container.find(".beginTime").val(dd);

    },
    //审批分类
    initApprovalType: function () {

        var $search_container = $approval_manage_container.find(".search_container");
        var $approval_type = $search_container.find(".approval_type");
        $approval_type.empty();

        var $option = $("<option>");
        $option.attr("value", "");
        $option.text("全部");
        $option.appendTo($approval_type);

        branGetRequest(
            urlGroup.attendance.approval.type_list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    approval_manage.approval_type_map = new Map();

                    var arr = data.result;
                    if (arr && arr.length > 0) {

                        $.each(arr, function (index, item) {

                            var key = item.key;
                            var name = item.value;

                            var $option = $("<option>");
                            $option.attr("value", key);
                            $option.text(name);
                            $option.appendTo($approval_type);

                            approval_manage.approval_type_map.put(key, name);

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
    //处理状态
    initApprovalStatus: function () {

        var status_arr = [
            {
                key: "",
                name: "全部"
            },
            {
                key: 0,
                name: "待处理"
            },
            {
                key: 1,
                name: "未通过"
            },
            {
                key: 2,
                name: "通过"
            },
            {
                key: 3,
                name: "已撤销"
            }
        ];

        var $search_container = $approval_manage_container.find(".search_container");
        var $approval_status = $search_container.find(".approval_status");
        $approval_status.empty();

        approval_manage.approval_status_map = new Map();

        $.each(status_arr, function (index, item) {

            var key = item.key;
            var name = item.name;

            var $option = $("<option>");
            $option.attr("value", key);
            $option.text(name);
            $option.appendTo($approval_status);

            approval_manage.approval_status_map.put(key, name);

        });

    },
    //审批明细 类型
    initApprovalDetailType: function () {

        branGetRequest(
            urlGroup.attendance.approval.detail_type_list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    approval_manage.approval_detail_type_map = new Map();

                    var arr = data.result;
                    if (arr && arr.length > 0) {
                        $.each(arr, function (index, item) {

                            var key = item.key;
                            var name = item.value ? item.value : "";

                            approval_manage.approval_detail_type_map.put(key, name);

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
    //初始化 用户列表
    initUserList: function () {
        var $search_container = $approval_manage_container.find('.search_container');
        var $user_list = $search_container.find(".user_list");
        $user_list.empty();

        loadingInit();

        branGetRequest(
            urlGroup.attendance.approval.emp_roster_list,
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
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },
    //重置参数
    resetParam: function () {

        var $search_container = $approval_manage_container.find('.search_container');

        $search_container.find(".beginTime").val("");
        $search_container.find(".endTime").val("");
        $search_container.find("select").val("");
        $search_container.find(".user_list").find("option:selected").removeAttr("selected");//清空选中状态
        $search_container.find(".user_list").trigger("chosen:updated");   //每次对 select操作后必须要执行 此 方法

    },

    //查询按钮 点击事件
    btnSearchClick: function () {
        approval_manage.approvalList();//查询
    },
    //查询
    approvalList: function () {
        approval_manage_param.paramSet();//参数 设置

        if (approval_manage_param.query_startTime > approval_manage_param.query_endTime) {
            toastr.warning('开始时间不能大于结束时间！');
            return;
        }

        loadingInit();

        $tb_approval_manage.bootstrapTable("destroy");
        //表格的初始化
        $tb_approval_manage.bootstrapTable({

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
                    checkbox: true
                },
                {
                    field: "approvalNo",
                    title: "编号",
                    align: "center",
                    class: "approvalNo",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "' class='txt'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "applyTime",
                    title: "申请日期",
                    align: "center",
                    class: "applyTime",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            value = timeInit(value);
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "approvalTime",
                    title: "审批日期",
                    align: "center",
                    class: "approvalTime",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        if (value) {
                            value = timeInit(value);
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "approvalType",
                    title: "审批分类",
                    align: "center",
                    class: "approvalType",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "<div>" + approval_manage.approval_type_map.get(value) + "</div>";

                        return html;
                    }
                },

                {
                    field: "empName",
                    title: "姓名",
                    align: "center",
                    class: "empName",
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
                    field: "attendNo",
                    title: "工号",
                    align: "center",
                    class: "attendNo",
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
                    field: "work_shift_name",
                    title: "班组",
                    align: "center",
                    class: "work_shift_name",
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
                    field: "department_name",
                    title: "部门",
                    align: "center",
                    class: "department_name",
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
                    field: "approvalState",
                    title: "状态",
                    align: "center",
                    class: "approvalState",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "<div>" + approval_manage.approval_status_map.get(value) + "</div>";

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

                        //查看明细
                        html += "<div class='btn btn-success btn-sm btn_detail'>查看明细</div>";

                        //如果是 待处理 状态
                        if (row.approvalState === 0) {

                            //通过
                            html += "<div class='btn btn-success btn-sm btn_pass'>通过</div>";

                            //不通过
                            html += "<div class='btn btn-success btn-sm btn_fail'>不通过</div>";

                        }

                        html += "</div>";

                        return html;

                    },
                    events: {

                        //查看明细
                        "click .btn_detail": function (e, value, row, index) {

                            $approval_info_modal.modal("show");

                            approval_manage.clearApprovalModal();//清空modal

                            var obj = {
                                approval_id: row.id
                            };
                            var url = urlGroup.attendance.approval.detail + "?" + jsonParseParam(obj);

                            branGetRequest(
                                url,
                                function (data) {
                                    //alert(JSON.stringify(data))

                                    if (data.code === RESPONSE_OK_CODE) {

                                        if (data.result) {

                                            var $approvalInfo = data.result.approvalInfo ? data.result.approvalInfo : null;//
                                            var $empInfo = data.result.empInfo ? data.result.empInfo : null;//

                                            var apply_time = $approvalInfo.applyTime ? $approvalInfo.applyTime : "";//
                                            apply_time = timeInit2(apply_time);
                                            var user_name = $empInfo.empName ? $empInfo.empName : "";//
                                            var department_name = $empInfo.department_name ? $empInfo.department_name : "";//
                                            var work_shift_name = $empInfo.work_shift_name ? $empInfo.work_shift_name : "";//

                                            var apply_type = $approvalInfo.approvalType ? $approvalInfo.approvalType :
                                                ($approvalInfo.approvalType === 0 ? 0 : "");//审批类型 0:请假 1:加班 2:补卡 必填 ,
                                            var apply_type_msg = approval_manage.approval_type_map.get(apply_type);
                                            var begin_time = $approvalInfo.startTime ? $approvalInfo.startTime : "";//
                                            begin_time = timeInit2(begin_time);
                                            var end_time = $approvalInfo.endTime ? $approvalInfo.endTime : "";//
                                            end_time = timeInit2(end_time);
                                            var total_time = $approvalInfo.totalMinutes ? $approvalInfo.totalMinutes : "";//
                                            total_time = approval_manage.MinuteToHour(total_time);
                                            var apply_reason = $approvalInfo.reason ? $approvalInfo.reason : "";//

                                            var approval_time = $approvalInfo.approvalTime ? $approvalInfo.approvalTime : "";//
                                            approval_time = timeInit2(approval_time);
                                            var approval_status = $approvalInfo.approvalState ? $approvalInfo.approvalState :
                                                ($approvalInfo.approvalState === 0 ? 0 : "");//
                                            approval_status = approval_manage.approval_status_map.get(approval_status);

                                            var $row = $approval_info_modal.find(".modal-body > .row");

                                            $row.find(".apply_time").text(apply_time);
                                            $row.find(".user_name").text(user_name);
                                            $row.find(".department_name").text(department_name);
                                            $row.find(".work_shift_name").text(work_shift_name);

                                            $row.find(".apply_type").text(apply_type_msg);
                                            $row.find(".apply_reason").text(apply_reason);

                                            $row.find(".approval_time").text(approval_time);
                                            $row.find(".approval_status").text(approval_status);

                                            //如果是 补卡
                                            if (apply_type === 2) {

                                                $row.find(".fill_card_container").show().siblings().hide();
                                                $row.find(".total_time_container").hide();

                                                var $workShiftType = data.result.workShiftType ? data.result.workShiftType : null;//
                                                var name = $workShiftType.name ? $workShiftType.name : "";//班次名字
                                                var startTime = $workShiftType.startTime ? $workShiftType.startTime : "";//上班时间
                                                var endTime = $workShiftType.endTime ? $workShiftType.endTime : "";//下班时间

                                                var revertTime = $approvalInfo.revertTime ? $approvalInfo.revertTime : "";//补卡时间
                                                revertTime = timeInit(revertTime);
                                                var approvalTypeDetail = $approvalInfo.approvalTypeDetail ? $approvalInfo.approvalTypeDetail :
                                                    ($approvalInfo.approvalTypeDetail === 0 ? 0 : "");//审批 缺卡类型
                                                var approvalTypeDetail_msg = approval_manage.approval_detail_type_map.get(approvalTypeDetail);

                                                var txt = revertTime + " " + name + " " +
                                                    startTime + "-" + endTime + " " + approvalTypeDetail_msg;

                                                $row.find(".fill_card_time").text(txt);

                                            }
                                            else {
                                                $row.find(".fill_card_container").hide().siblings().show();
                                                $row.find(".total_time_container").show();

                                                $row.find(".begin_time").text(begin_time);
                                                $row.find(".end_time").text(end_time);
                                                $row.find(".total_time").text(total_time);

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
                        //通过
                        "click .btn_pass": function (e, value, row, index) {

                            operateMsgShow(
                                "确认通过吗？",
                                function () {

                                    loadingInit();

                                    var obj = {
                                        "batch": [
                                            {
                                                "id": row.id
                                            }
                                        ]
                                    };

                                    branPutRequest(
                                        urlGroup.attendance.approval.pass,
                                        obj,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                toastr.success("审批通过！");

                                                $tb_approval_manage.bootstrapTable("updateRow", {
                                                    index: index,
                                                    row: {
                                                        approvalState: 2
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
                                null
                            );

                        },
                        //不通过
                        "click .btn_fail": function (e, value, row, index) {

                            operateMsgShow(
                                "确认不通过吗？",
                                function () {

                                    loadingInit();

                                    var obj = {
                                        "batch": [
                                            {
                                                "id": row.id
                                            }
                                        ]
                                    };

                                    branPutRequest(
                                        urlGroup.attendance.approval.fail,
                                        obj,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                toastr.success("审批未通过！");

                                                $tb_approval_manage.bootstrapTable("updateRow", {
                                                    index: index,
                                                    row: {
                                                        approvalState: 1
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
                                null
                            );

                        }

                    }
                }

            ],

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.attendance.approval.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize,
                    query_startTime: approval_manage_param.query_startTime,
                    query_endTime: approval_manage_param.query_endTime,
                    approval_type: approval_manage_param.approval_type,
                    approval_state: approval_manage_param.approval_status,
                    empId: approval_manage_param.emp_id
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

                        var arr = res.result.result;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var $item = arr[i];
                                var $approvalInfo = $item.approvalInfo ? $item.approvalInfo : null;//审批信息
                                var $empInfo = $item.empInfo ? $item.empInfo : null;//员工信息

                                var id = "";
                                var approvalNo = "";
                                var applyTime = "";
                                var approvalTime = "";
                                var approvalType = "";
                                var approvalState = "";
                                if ($approvalInfo) {
                                    id = $approvalInfo.id ? $approvalInfo.id : "";//
                                    approvalNo = $approvalInfo.approvalNo ? $approvalInfo.approvalNo : "";//
                                    applyTime = $approvalInfo.applyTime ? $approvalInfo.applyTime : "";//申请时间
                                    approvalTime = $approvalInfo.approvalTime ? $approvalInfo.approvalTime : "";//审批时间
                                    approvalType = $approvalInfo.approvalType ? $approvalInfo.approvalType :
                                        ($approvalInfo.approvalType === 0 ? 0 : "");//审批分类
                                    approvalState = $approvalInfo.approvalState ? $approvalInfo.approvalState :
                                        ($approvalInfo.approvalState === 0 ? 0 : "");//审批状态
                                }

                                var empName = "";
                                var attendNo = "";
                                var work_shift_name = "";
                                var department_name = "";
                                if ($empInfo) {
                                    empName = $empInfo.empName ? $empInfo.empName : "";//姓名
                                    attendNo = $empInfo.attendNo ? $empInfo.attendNo : "";//工号
                                    work_shift_name = $empInfo.work_shift_name ? $empInfo.work_shift_name : "";//班组
                                    department_name = $empInfo.department_name ? $empInfo.department_name : "";//部门
                                }

                                var obj = {

                                    id: id,
                                    approvalNo: approvalNo,
                                    applyTime: applyTime,
                                    approvalTime: approvalTime,
                                    approvalType: approvalType,
                                    approvalState: approvalState,

                                    empName: empName,
                                    attendNo: attendNo,
                                    work_shift_name: work_shift_name,
                                    department_name: department_name

                                };
                                tb_data.push(obj);

                            }

                        }

                    }

                }
                else {
                    toastr.warning(res.msg);
                }

                // tb_data = [
                //     {
                //
                //         id: 12,
                //         approvalNo: 11111,
                //         applyTime: 1508395461722,
                //         approvalTime: 1508395461722,
                //         approvalType: 0,
                //         approvalState: 0,
                //
                //         empName: "张三",
                //         attendNo: "1432432fds",
                //         work_shift_name: "班组1",
                //         department_name: ""
                //
                //     },
                //     {
                //
                //         id: 122,
                //         approvalNo: 111123231,
                //         applyTime: 1508395461722,
                //         approvalTime: 1508395461722,
                //         approvalType: 0,
                //         approvalState: 2,
                //
                //         empName: "张三",
                //         attendNo: "1432432fds",
                //         work_shift_name: "班组1",
                //         department_name: ""
                //
                //     }
                // ];

                return {
                    total: total_rows,
                    rows: tb_data
                };

            }

        });

    },
    //清空 modal
    clearApprovalModal: function () {

        var $row = $approval_info_modal.find(".modal-body > .row");

        $row.find(".apply_time").text("");
        $row.find(".user_name").text("");
        $row.find(".department_name").text("");
        $row.find(".work_shift_name").text("");

        $row.find(".apply_type").text("");
        $row.find(".begin_time").text("");
        $row.find(".end_time").text("");
        $row.find(".total_time").text("");
        $row.find(".apply_reason").text("");

        $row.find(".approval_time").text("");
        $row.find(".approval_status").text("");

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


    //批量操作
    approvalDeal: function (type) {

        var data = $tb_approval_manage.bootstrapTable("getAllSelections");
        if (data.length <= 0) {
            toastr.warning("请选择数据！");
            return;
        }

        var count = 0;//选择数据 不是待处理状态的 数量
        var batch = [];//要改变状态的数据 数组
        $.each(data, function (index, item) {

            //处理状态
            if (item.approvalState !== 0) {
                count += 1;
            }

            var obj = {
                id: item.id
            };
            batch.push(obj);

        });

        if (count > 0) {
            toastr.warning("只能对状态为待处理的数据进行操作！");
            return
        }

        var txt;
        var url;
        if (type === 1) {
            txt = "确认要批量通过吗？";
            url = urlGroup.attendance.approval.pass;
        }
        else {
            txt = "确认要批量不通过吗？";
            url = urlGroup.attendance.approval.fail;
        }

        operateMsgShow(
            txt,
            function () {

                var obj = {
                    batch: batch
                };

                branPutRequest(
                    url,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            toastr.success("操作成功！");
                            approval_manage.approvalList();//查询
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
            null
        );

    }


};

var approval_manage_param = {

    query_startTime: "",//开始 时间
    query_endTime: "",//结束 时间
    approval_type: "",//审批 类型
    approval_status: "",//审批 状态
    emp_id: "",//正式员工id

    //参数 设置
    paramSet: function () {
        var $search_container = $approval_manage_container.find(".search_container");

        //开始 时间
        approval_manage_param.query_startTime = $search_container.find(".beginTime").val();
        approval_manage_param.query_startTime = timeInit3(approval_manage_param.query_startTime);

        //结束 时间
        approval_manage_param.query_endTime = $search_container.find(".endTime").val();
        approval_manage_param.query_endTime = timeInit3(approval_manage_param.query_endTime);

        //审批 类型
        approval_manage_param.approval_type = $search_container.find(".approval_type").val();

        //审批 状态
        approval_manage_param.approval_status = $search_container.find(".approval_status").val();

        //用户 id
        approval_manage_param.emp_id = $search_container.find(".user_list").val()
            ? $search_container.find(".user_list").val()[0] : "";

    }

};

$(function () {
    approval_manage.init();
});


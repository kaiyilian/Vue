/**
 * Created by CuiMengxin on 2016/12/15.
 * 离职员工
 */

var $body = $("body");
var $emp_leave_container = $(".emp_leave_container");//
var $tb_emp_leave = $emp_leave_container.find("#tb_emp_leave");//表格 id

var emp_leave = {

    //初始化
    init: function () {

        emp_leave.initTime();//初始化 时间

        // //赋值 查询的URL
        // sessionStorage.setItem("get_dept_list", urlGroup.basic.department.leave);
        // sessionStorage.setItem("get_workLine_list", urlGroup.basic.workLine.leave);
        // sessionStorage.setItem("get_workShift_list", urlGroup.basic.workShift.leave);
        // sessionStorage.setItem("get_post_list", urlGroup.basic.position.leave);
        //
        // //获取 查询字段 列表
        // getBasicList.getBasicList(
        //     function () {
        //         //alert(1)
        //         var $search_container = $emp_leave_container.find(".search_container");
        //
        //         var deptList = "<option value=''>选择</option>" + sessionStorage.getItem("deptList");
        //         $search_container.find(".dept_container select").html(deptList);
        //
        //         var workLineList = "<option value=''>选择</option>" + sessionStorage.getItem("workLineList");
        //         $search_container.find(".workLine_container select").html(workLineList);
        //
        //         var workShiftList = "<option value=''>选择</option>" + sessionStorage.getItem("workShiftList");
        //         $search_container.find(".workShift_container select").html(workShiftList);
        //
        //         var postList = "<option value=''>选择</option>" + sessionStorage.getItem("postList");
        //         $search_container.find(".post_container select").html(postList);
        //
        //         emp_leave.empList();//查询 满足条件的员工
        //     },
        //     function (msg) {
        //         branError(msg)
        //     }
        // );

        Promise.all([
            getBasicList.departmentList(urlGroup.basic.department.leave),
            getBasicList.workLineList(urlGroup.basic.workLine.leave),
            getBasicList.workShiftList(urlGroup.basic.workShift.leave),
            getBasicList.positionList(urlGroup.basic.position.leave)
        ])
            .then(function (res) {

                // console.log(res);

                var department_list = res[0] ? res[0] : "";
                var workLine_list = res[1] ? res[1] : "";
                var workShift_list = res[2] ? res[2] : "";
                var position_list = res[2] ? res[3] : "";

                var $search_container = $emp_leave_container.find(".search_container");

                //alert(1)
                var deptList = "<option value=''>选择</option>" + department_list;
                $search_container.find(".dept_container select").html(deptList);

                var workLineList = "<option value=''>选择</option>" + workLine_list;
                $search_container.find(".workLine_container select").html(workLineList);

                var workShiftList = "<option value=''>选择</option>" + workShift_list;
                $search_container.find(".workShift_container select").html(workShiftList);

                var postList = "<option value=''>选择</option>" + position_list;
                $search_container.find(".post_container select").html(postList);

                emp_leave.empList();//查询 满足条件的员工

            })
            .catch(function (err) {

                console.log("error in emp_prospective basic list:");
                console.error(err.message);

            });

    },
    //初始化 时间
    initTime: function () {

        //入职时间 开始
        var start = {
            elem: "#emp_leave_beginTime",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "", //设定最小日期为当前日期
            max: '', //最大日期
            istime: false,//是否开启时间选择
            istoday: false, //是否显示今天
            choose: function (datas) {
                //end.min = datas; //开始日选好后，重置结束日的最小日期
                //end.start = datas;//将结束日的初始值设定为开始日
            }
        };

        //入职时间 结束
        var end = {
            elem: "#emp_leave_endTime",
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

        laydate(start);
        laydate(end);
    },

    //查询按钮 点击事件
    btnSearchClick: function () {
        emp_leave.empList();//查询 满足条件的员工
    },
    //初始化 columns
    initColumns: function () {

        //手动拼接columns数组
        var columns = [];

        columns.push({
            checkbox: true
        });
        columns.push({
            field: "emp_work_sn",
            title: "工号",
            align: "center",
            sortable: true,
            class: "emp_work_sn",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });
        columns.push({
            field: "emp_name",
            title: "姓名",
            align: "center",
            sortable: true,
            class: "emp_name",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });

        columns.push({
            field: "position_name",
            title: "职位",
            align: "center",
            sortable: true,
            class: "position_name",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });
        columns.push({
            field: "work_shift_name",
            title: "班组",
            align: "center",
            sortable: true,
            class: "work_shift_name",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });
        columns.push({
            field: "work_line_name",
            title: "工段",
            align: "center",
            sortable: true,
            class: "work_line_name",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });
        columns.push({
            field: "department_name",
            title: "部门",
            align: "center",
            sortable: true,
            class: "department_name",
            formatter: function (value, row, index) {
                // console.log(value);

                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });

        columns.push({
            field: "emp_idCard",
            title: "身份证号",
            align: "center",
            sortable: true,
            class: "emp_idCard",
            formatter: function (value, row, index) {
                // console.log(value);

                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });
        columns.push({
            field: "emp_phone",
            title: "手机号",
            align: "center",
            sortable: true,
            class: "emp_phone",
            formatter: function (value, row, index) {
                // console.log(value);

                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });

        columns.push({
            field: "check_in_time",
            title: "入职时间",
            align: "center",
            sortable: true,
            class: "check_in_time",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    value = timeInit(value);
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });
        columns.push({
            field: "check_out_time",
            title: "离职时间",
            align: "center",
            sortable: true,
            class: "check_out_time",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    value = timeInit(value);
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });

        columns.push({
            field: "attendance_no",
            title: "打卡号",
            align: "center",
            sortable: true,
            class: "attendance_no",
            formatter: function (value, row, index) {
                // console.log(value);
                var html = "";
                if (value) {
                    html = "<div title='" + value + "'>" + value + "</div>";
                }

                return html;
            }
        });

        columns.push({
            field: "operate",
            title: "操作",
            align: "center",
            class: "operate",
            formatter: function (value, row, index) {

                var html = "";
                html += "<div class='operate'>";

                //查看明细
                html += "<div class='btn btn-success btn-sm btn_detail'>查看明细</div>";

                //删除
                html += "<div class='btn btn-success btn-sm btn_del'>删除</div>";

                html += "</div>";

                return html;

            },
            events: {

                //查看明细
                "click .btn_detail": function (e, value, row, index) {

                    var id = row.id;
                    var tabId = "emp_leave_" + id;//tab中的id
                    var pageName = row.emp_name + "的个人资料";

                    sessionStorage.setItem("CurrentEmployeeId", id);//当前员工id
                    sessionStorage.setItem("currentTabID", tabId);//当前 tab id

                    getInsidePageDiv(urlGroup.employee.leave_detail.index, tabId, pageName);

                },
                //删除
                "click .btn_del": function (e, value, row, index) {

                    delWarning("确认删除该员工吗？", function () {

                        loadingInit();

                        var obj = {
                            idVersions: [{
                                id: row.id,
                                version: row.version
                            }]
                        };

                        branPostRequest(
                            urlGroup.employee.leave.del,
                            obj,
                            function (data) {
                                //alert(JSON.stringify(data));
                                if (data.code === RESPONSE_OK_CODE) {

                                    toastr.success("删除成功！");
                                    emp_leave.empList();

                                }
                                else {
                                    branError(data.msg);
                                }

                            },
                            function (error) {
                                branError(error);
                            }
                        );

                    })

                }

            }
        });

        return columns;

    },
    //员工列表
    empList: function () {
        console.log("离职员工列表：" + new Date().getTime());

        loadingInit();

        emp_leave_param.paramSet();//赋值查询参数

        //检查参数
        if (emp_leave_param.leave_start_time && emp_leave_param.leave_end_time &&
            emp_leave_param.leave_start_time > emp_leave_param.leave_end_time) {
            toastr.warning("开始时间不能大于结束时间！");
            loadingRemove();
            return;
        }

        var columns = emp_leave.initColumns();//初始化 columns

        $tb_emp_leave.bootstrapTable("destroy");
        //表格的初始化
        $tb_emp_leave.bootstrapTable({

            classes: "table table-striped table-bordered table-hover dataTable",
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
            sortable: false,                     //所有列的排序 是否开启
            sortOrder: "desc",                   //排序方式

            width: "100%",
            height: 600,
            // selectItemName: 'parentItem',       //tbody中 radio or checkbox 的字段名（name='parentItem'）
            // showHeader: false,

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
            url: urlGroup.employee.leave.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                // console.log(params);

                var obj = {

                    page: params.pageNumber,
                    page_size: params.pageSize,

                    department_id: emp_leave_param.department_id,
                    work_line_id: emp_leave_param.work_line_id,
                    work_shift_id: emp_leave_param.work_shift_id,
                    position_id: emp_leave_param.position_id,
                    leave_start_time: emp_leave_param.leave_start_time,
                    leave_end_time: emp_leave_param.leave_end_time,
                    keyword: emp_leave_param.keyword

                };

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

                        var arr = res.result.employees;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var version = item.version;//
                                var emp_id = item.employee_id ? item.employee_id : "";//员工id
                                var emp_work_sn = item.work_sn ? item.work_sn : "";//员工 工号
                                var emp_name = item.name ? item.name : "";//员工姓名

                                var department_id = item.department_id ? item.department_id : "";//部门id
                                var department_name = item.department_name ? item.department_name : "";//部门名称
                                var position_id = item.position_id ? item.position_id : "";//职位id
                                var position_name = item.position_name ? item.position_name : "";//职位名称
                                var work_shift_id = item.work_shift_id ? item.work_shift_id : "";//班组id
                                var work_shift_name = item.work_shift_name ? item.work_shift_name : "";//班组名称
                                var work_line_id = item.work_line_id ? item.work_line_id : "";//工段id
                                var work_line_name = item.work_line_name ? item.work_line_name : "";//工段名称

                                var emp_idCard = item.idcard_no ? item.idcard_no : "";//身份证
                                var emp_phone = item.phone_no ? item.phone_no : "";//手机号
                                var check_in_time = item.check_in_time ? item.check_in_time : 0;//入职时间
                                var check_out_time = item.leave_time ? item.leave_time : 0;//离职时间

                                var exam_id = item.exam_id ? item.exam_id : "";//体检id
                                var attendance_no = item.attendance_no ? item.attendance_no : "";//打卡号

                                var obj = {

                                    id: emp_id,
                                    version: version,
                                    emp_work_sn: emp_work_sn,
                                    emp_name: emp_name,

                                    department_id: department_id,
                                    department_name: department_name,
                                    position_id: position_id,
                                    position_name: position_name,
                                    work_shift_id: work_shift_id,
                                    work_shift_name: work_shift_name,
                                    work_line_id: work_line_id,
                                    work_line_name: work_line_name,

                                    emp_idCard: emp_idCard,
                                    emp_phone: emp_phone,
                                    check_in_time: check_in_time,
                                    check_out_time: check_out_time,

                                    exam_id: exam_id,
                                    attendance_no: attendance_no

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

    //离职员工 导出
    exportLeaveList: function () {
        var data = $tb_emp_leave.bootstrapTable("getData");//所有数据

        if (data.length === 0) {
            toastr.warning("没有数据，无法导出");
            return
        }

        exportModalShow("确认导出离职员工吗？", function () {

            loadingInit();

            if ($body.find(".export_excel").length > 0) {
                $body.find(".export_excel").remove();
            }

            var form = $("<form>");
            form.addClass("export_excel");
            form.attr("enctype", "multipart/form-data");
            form.attr("action", urlGroup.employee.leave.excel_export);
            form.attr("method", "get");
            form.appendTo($body);
            form.hide();

            form.append($("<input>").attr("name", "position_id").attr("value", emp_leave_param.position_id));
            form.append($("<input>").attr("name", "work_shift_id").attr("value", emp_leave_param.work_shift_id));
            form.append($("<input>").attr("name", "work_line_id").attr("value", emp_leave_param.work_line_id));
            form.append($("<input>").attr("name", "department_id").attr("value", emp_leave_param.department_id));
            form.append($("<input>").attr("name", "check_in_start_time").attr("value", emp_leave_param.leave_start_time));
            form.append($("<input>").attr("name", "check_in_end_time").attr("value", emp_leave_param.leave_end_time));
            form.append($("<input>").attr("name", "keyword").attr("value", emp_leave_param.keyword));

            loadingRemove();
            form.submit();

        });

    },
    //删除 离职员工
    empDel: function () {

        var data = $tb_emp_leave.bootstrapTable("getAllSelections");//所有数据

        if (data.length === 0) {
            toastr.warning("您没有选择用户！");
            return
        }

        delWarning("确认删除选中的员工吗？", function () {

            loadingInit();

            var idVersions = [];
            $.each(data, function (i, $item) {

                var obj = {
                    id: $item.id,
                    version: $item.version
                };
                idVersions.push(obj);

            });

            var obj = {
                idVersions: idVersions
            };

            branPostRequest(
                urlGroup.employee.leave.del,
                obj,
                function (data) {
                    //alert(JSON.stringify(data));
                    if (data.code === RESPONSE_OK_CODE) {

                        toastr.success("删除成功！");
                        emp_leave.empList();

                    }
                    else {
                        branError(data.msg);
                    }

                },
                function (error) {
                    branError(error);
                }
            );

        })
    }

};
//查询参数
var emp_leave_param = {

    department_id: null,//$search_container.find(".dept_container select option:selected").val();
    work_line_id: null,//$search_container.find(".workLine_container select option:selected").val();
    work_shift_id: null,//$search_container.find(".workShift_container select option:selected").val();
    position_id: null,//$search_container.find(".post_container select option:selected").val();

    leave_start_time: null,//startTime;
    leave_end_time: null,//endTime;
    keyword: null,//$search_container.find(".searchCondition").val();

    // order: null,//emp_leave.order;//1正序，2倒序
    // order_param: null,//emp_leave.orderParam;//排序参数

    //赋值查询参数
    paramSet: function () {

        var $search_container = $emp_leave_container.find(".search_container");

        //开始时间
        var startTime = $.trim($search_container.find(".beginTime").val());
        startTime = startTime ? new Date(startTime).getTime() : "";
        //结束时间
        var endTime = $.trim($search_container.find(".endTime").val());
        endTime = endTime ? new Date(endTime).getTime() : "";

        emp_leave_param.department_id = $search_container.find(".dept_container select option:selected").val();
        emp_leave_param.work_line_id = $search_container.find(".workLine_container select option:selected").val();
        emp_leave_param.work_shift_id = $search_container.find(".workShift_container select option:selected").val();
        emp_leave_param.position_id = $search_container.find(".post_container select option:selected").val();
        emp_leave_param.leave_start_time = startTime;
        emp_leave_param.leave_end_time = endTime;
        emp_leave_param.keyword = $search_container.find(".searchCondition").val();

    }


};

$(function () {
    emp_leave.init();
});

